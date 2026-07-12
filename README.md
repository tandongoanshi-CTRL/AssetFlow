# AssetFlow

ODOO HACKATHON 2026

AssetFlow is an assets lifecycle project (Node.js + TypeScript + Express + Prisma/PostgreSQL). It supports:
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

## Quickstart (Full Stack)

AssetFlow is split into:
- Backend: `backend/` (Express + Prisma)
- Frontend: `frontend/` (React + Vite)

---

## Backend

### 1) Set environment variables
Create a `.env` file in `backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/assetflow
CORS_ORIGIN=*
JWT_SECRET=change-me-in-production
SESSION_TTL_SECONDS=3600
```

### 2) Install + migrate
From the `backend/` directory:

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

## Frontend

Follow `frontend/README.md` for how to set `frontend/.env` and run the dev server.



## Authentication
- Endpoints that require authentication expect:
  - `Authorization: Bearer <token>`
- Token is returned from:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
- `GET /api/auth/me` returns the authenticated user.

---

## Roles (RBAC)
User roles supported by the backend:
- `EMPLOYEE`
- `DEPT_HEAD`
- `ASSET_MANAGER`
- `ADMIN`

Examples of role enforcement:
- `POST /api/allocations` requires `ASSET_MANAGER` or `ADMIN`
- `PATCH /api/maintenance/:id/status` requires `ASSET_MANAGER` or `ADMIN`
- `PATCH /api/transfers/:id/approve` requires `ASSET_MANAGER`, `DEPT_HEAD`, or `ADMIN`
- `POST /api/admin/users/:id/role` requires `ADMIN`
- `POST /api/audits/close` requires `ADMIN`

---

## API Endpoints

### Health
- `GET /health`

### Auth
- `POST /api/auth/signup`
  - body: `{ name, email, password }`
- `POST /api/auth/login`
  - body: `{ email, password }`
- `GET /api/auth/me`

### Admin
- `PATCH /api/admin/users/:id/role`
  - body: `{ role }`
  - allowed roles in the handler: `DEPT_HEAD`, `ASSET_MANAGER`

### Allocations
- `POST /api/allocations`
- `GET /api/allocations`

### Transfers
- `POST /api/transfers`
- `PATCH /api/transfers/:id/approve`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings`

### Maintenance
- `POST /api/maintenance`
- `PATCH /api/maintenance/:id/status`

### Audits
- `POST /api/audits/close`

---

## Cron Workers
A daily cron job (runs at `00:00` each day) does:
- Finds allocations with `status = ACTIVE` and `expectedReturnDate < now()`
- Updates those allocations to `status = OVERDUE`
- Creates notifications for the overdue allocations

---

## Database (Prisma)
PostgreSQL schema is defined in `backend/prisma/schema.prisma`.

Notes:
- The repository currently includes an initial migration under `backend/prisma/migrations/`.
- Follow `backend/prisma/migrations/*/README.md` for migration notes.

