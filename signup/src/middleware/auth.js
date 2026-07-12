const { pool } = require('../db/pool');

function getBearerToken(headerValue) {
  if (!headerValue) return null;
  const [scheme, token] = headerValue.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ error: 'Missing Authorization: Bearer <token>' });

    const result = await pool.query(
      `SELECT s.user_id, s.expires_at, s.revoked_at
       FROM sessions s
       WHERE s.session_token = $1
       LIMIT 1`,
      [token]
    );

    if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid session' });

    const session = result.rows[0];
    if (session.revoked_at) return res.status(401).json({ error: 'Session revoked' });

    const now = new Date();
    if (new Date(session.expires_at) <= now) return res.status(401).json({ error: 'Session expired' });

    req.auth = { userId: session.user_id };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { requireAuth };

