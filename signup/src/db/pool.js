const { Pool } = require('pg');

// Prefer DATABASE_URL if provided.
// If not provided, fall back to discrete PG env vars and default Postgres port to 5434.
const hasDatabaseUrl = typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0;

const poolConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL
    }
  : {
      host: process.env.PGHOST,
      port: Number(process.env.POSTGRES_PORT ?? process.env.PGPORT ?? 5434),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    };

const pool = new Pool(poolConfig);

module.exports = { pool };


