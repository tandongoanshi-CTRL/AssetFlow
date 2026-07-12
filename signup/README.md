# AssetFlow Signup Auth (Node.js + Express + PostgreSQL)

Implements:
- Sign up (email + password)
- Login (creates a server-side session valid for 60 minutes)
- Forgot password (creates a reset token and prints it to console)
- Reset password (updates DB, consumes tokens, revokes sessions)
- Session validation via `GET /auth/me` using `Authorization: Bearer <sessionToken>`

## Prerequisites
- PostgreSQL running
- Node.js 18+

## Setup
1) Create DB and enable pgcrypto (for gen_random_uuid)

```sql
CREATE DATABASE assetflow_auth;
-- Enable for gen_random_uuid (required by initDb)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

2) Install dependencies

```bash
cd signup
npm install
```

3) Configure env

Copy:
- `.env.example` -> `.env`

Edit `DATABASE_URL`.

## Run
```bash
npm run start
```

## Test with curl
### 1) Signup
```bash
curl -s -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@test.com","password":"password123"}'
```

### 2) Login
```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@test.com","password":"password123"}'
```

Save `sessionToken`.

### 3) Validate session (60 minutes)
```bash
curl -s http://localhost:3000/auth/me \
  -H "Authorization: Bearer <sessionToken>"
```

### 4) Forgot password
```bash
curl -s -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"a@test.com"}'
```

Check server console for `reset token`.

### 5) Reset password
```bash
curl -s -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<resetToken>","newPassword":"newpassword123"}'
```

Old sessions are revoked and old reset tokens are consumed.

