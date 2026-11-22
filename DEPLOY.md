# Deploy guide (manual)

## Backend — Render

1. Create a **Web Service** from this repo.
2. Set root directory to `Event-APP/backend` (or use `render.yaml`).
3. Build: `npm install`
4. Start: `node server.js`
5. Environment variables:
   - `MONGODB_URI` — Atlas (or other) connection string
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — your Vercel origin(s), comma-separated  
     Example: `https://your-app.vercel.app`
6. After deploy, seed an admin (local or Render shell):
   ```bash
   npm run seed:admin
   ```
   Requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME` in env.

## Frontend — Vercel

1. Import the repo in Vercel.
2. Root directory: `Event-APP/frontend/event-app`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable:
   - `VITE_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api`
7. `vercel.json` already rewrites SPA routes to `index.html`.

## Local admin seed

```bash
cd Event-APP/backend
# set ADMIN_* in .env
npm run seed:admin
```

Default local values (change in production): see `.env.example`.
