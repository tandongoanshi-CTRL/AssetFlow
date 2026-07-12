# AssetFlow Backend

AssetFlow is an assets lifecycle backend (Node.js + TypeScript + Express + Prisma/PostgreSQL).

It supports:
- Authentication (JWT)
- Role-based access control (RBAC)
- Asset allocations, transfers, bookings, maintenance requests
- Audit cycles
- A daily cron job to mark overdue allocations

---

## Base URL
- API: `http://localhost:<PORT>/api`
- Healthcheck: `GET /health`

---

## Quickstart

### 1) Environment variables
Create a `.env` file in `backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/assetflow
CORS_ORIGIN=*
JWT_SECRET=change-me-in-production
SESSION_TTL_SECONDS=3600
```

> Use the same `DATABASE_URL` for Prisma migrations and for running the server.

### 2) Install + migrate
From `backend/`:

```bash
npm install
npm run prisma:migrate
npm run prisma:generate
```

### 3) Run

```bash
npm run dev
```

Cron workers are started automatically when the server boots.

---

## Authentication (JWT)

- Requests that require auth should include:

```http
Authorization: Bearer <token>
```

- Token is returned from:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
- Current user:
  - `GET /api/auth/me`

---

## Roles (RBAC)

Backend roles:
- `EMPLOYEE`
- `DEPT_HEAD`
- `ASSET_MANAGER`
- `ADMIN`

---

## Cron Workers

A daily cron job (runs at `00:00` each day) does:
- Finds allocations with `status = ACTIVE` and `expectedReturnDate < now()`
- Updates those allocations to `status = OVERDUE`
- Creates notifications for overdue allocations

---

## Database (Prisma)

Prisma schema:
- `backend/prisma/schema.prisma`

Migrations:
- `backend/prisma/migrations/*`
- Follow `backend/prisma/migrations/*/README.md` for migration notes.

