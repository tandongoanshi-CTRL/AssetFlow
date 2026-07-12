# AssetFlow Frontend

React (Vite) + TypeScript frontend for AssetFlow.

## Environment
Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Run
```bash
cd frontend
npm install
npm run dev
```

## Notes
- The app expects backend endpoints under `/api`.
- Auth uses JWT (sent as `Authorization: Bearer <token>`). The token is stored in memory + `localStorage`.
- Set `VITE_API_BASE_URL` to match where the backend is running (e.g. `http://localhost:3000/api`).


