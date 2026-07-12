const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { pool } = require('../db/pool');
const { enqueuePasswordResetBackgroundJob } = require('./jobs');

function shaToken() {
  // token safe for URL/text usage
  return crypto.randomBytes(32).toString('hex');
}

function ttlSeconds(name, fallback) {
  const v = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(v) || v <= 0) return fallback;
  return v;
}

async function signup(email, password) {
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email.toLowerCase(), passwordHash]
  );

  return { userId: result.rows[0].id, email: result.rows[0].email };
}

async function login(email, password) {
  const result = await pool.query(
    `SELECT id, password_hash
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    return { error: 'Invalid credentials', sessionToken: null };
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return { error: 'Invalid credentials', sessionToken: null };
  }

  const sessionToken = shaToken();
  const sessionTtl = ttlSeconds('SESSION_TTL_SECONDS', 3600);
  const expiresAt = new Date(Date.now() + sessionTtl * 1000);

  await pool.query(
    `INSERT INTO sessions (user_id, session_token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, sessionToken, expiresAt]
  );

  return { sessionToken };
}

async function forgotPassword(email) {
  // Always return 200 to avoid user enumeration.
  const userRes = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );

  if (userRes.rowCount === 0) {
    return { ok: true };
  }

  const userId = userRes.rows[0].id;
  const token = shaToken();
  const ttl = ttlSeconds('PASSWORD_RESET_TOKEN_TTL_SECONDS', 900);
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );

  // Email provider placeholder: log token to console
  console.log(`[FORGOT-PASSWORD] reset token for ${email}: ${token} (expires in ${ttl}s)`);

  // Background job: e.g. invalidate previous tokens after a reset flow starts.
  enqueuePasswordResetBackgroundJob({ userId, token });

  return { ok: true };
}

async function resetPassword(token, newPassword) {
  const resetRes = await pool.query(
    `SELECT prt.user_id, prt.expires_at, prt.consumed_at
     FROM password_reset_tokens prt
     WHERE prt.token = $1
     LIMIT 1`,
    [token]
  );

  if (resetRes.rowCount === 0) {
    return { error: 'Invalid reset token' };
  }

  const reset = resetRes.rows[0];
  if (reset.consumed_at) {
    return { error: 'Reset token already used' };
  }

  if (new Date(reset.expires_at) <= new Date()) {
    return { error: 'Reset token expired' };
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // update password
    await client.query(
      `UPDATE users
       SET password_hash = $1, updated_at = now()
       WHERE id = $2`,
      [newHash, reset.user_id]
    );

    // mark token consumed
    await client.query(
      `UPDATE password_reset_tokens
       SET consumed_at = now()
       WHERE token = $1`,
      [token]
    );

    // background-like invalidation job: revoke all existing sessions and remaining tokens
    await client.query(
      `UPDATE sessions
       SET revoked_at = now()
       WHERE user_id = $1
         AND revoked_at IS NULL`,
      [reset.user_id]
    );

    // invalidate other unused tokens
    await client.query(
      `UPDATE password_reset_tokens
       SET consumed_at = now()
       WHERE user_id = $1
         AND token <> $2
         AND consumed_at IS NULL`,
      [reset.user_id, token]
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  // enqueue additional background work (placeholder)
  enqueuePasswordResetBackgroundJob({ userId: reset.user_id, token, action: 'reset-complete' });

  return { ok: true };
}

async function me(userId) {
  const res = await pool.query(
    `SELECT id, email, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return res.rowCount ? { userId: res.rows[0].id, email: res.rows[0].email } : { error: 'User not found' };
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  me
};

