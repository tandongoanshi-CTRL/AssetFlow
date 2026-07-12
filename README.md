# AssetFlow

AssetFlow is a full-stack asset lifecycle management platform built as a monorepo. The project combines a Node.js + TypeScript + Express backend with a React + Vite frontend to cover authentication, role-based access, allocation workflows, transfers, bookings, maintenance handling, audits, and overdue allocation tracking.

## What the project includes

- User authentication with JWT-based login and signup flows
- Role-based access control for employees, department heads, asset managers, and admins
- Asset allocation management, including creation and listing of allocations
- Transfer requests and approval workflows
- Resource booking creation and viewing
- Maintenance request submission and status updates
- Audit cycle closure flows for administrators
- A cron worker that marks overdue allocations and creates notifications

## Tech stack

- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT, bcrypt, node-cron
- Frontend: React, TypeScript, Vite, React Router

## Repository structure

- backend/: Express API, Prisma schema, migrations, services, and route handlers
- frontend/: React/Vite client with authenticated pages for allocations, transfers, bookings, maintenance, audits, and admin workflows
- README.md: project overview and setup instructions

## Prerequisites

- Node.js 18+ (20+ recommended)
- PostgreSQL 14+
- npm

## Quick start

### 1) Create the database

Create a PostgreSQL database named `assetflow` before running the backend.

### 2) Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/assetflow
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me-in-production
SESSION_TTL_SECONDS=3600
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3) Install dependencies and prepare the database

From the `backend/` directory:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

The seed step is optional but helps populate initial data for local testing.

### 4) Start the backend

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000` and expose the API under `/api`.

### 5) Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will run on `http://localhost:5173`.

## Main API endpoints

### Health
- `GET /health`

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Admin
- `PATCH /api/admin/users/:id/role`

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

## Authentication and roles

Authenticated requests should include:

```http
Authorization: Bearer <token>
```

The backend supports these roles:

- `EMPLOYEE`
- `DEPT_HEAD`
- `ASSET_MANAGER`
- `ADMIN`

Examples of protected actions include:

- Creating allocations requires `ASSET_MANAGER` or `ADMIN`
- Updating maintenance status requires `ASSET_MANAGER` or `ADMIN`
- Approving transfers requires `ASSET_MANAGER`, `DEPT_HEAD`, or `ADMIN`
- Updating user roles requires `ADMIN`
- Closing audits requires `ADMIN`

## Database and migrations

The Prisma schema lives in `backend/prisma/schema.prisma` and the migration history is stored in `backend/prisma/migrations/`.

## Cron worker

The backend starts a daily cron job at midnight that looks for active allocations whose expected return date has passed and marks them as overdue, while also creating notification records for those items.

