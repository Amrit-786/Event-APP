# Deploy guide (manual)

## Database — Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`backend/supabase/schema.sql`](backend/supabase/schema.sql).
3. Project **Settings → API**:
   - copy **Project URL** → `SUPABASE_URL`
   - copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only — never put this in the frontend)

## Backend — Render

1. Create a **Web Service** from this repo.
2. Set root directory to `Event-APP/backend` (or use `render.yaml`).
3. Build: `npm install`
4. Start: `node server.js`
5. Environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — your Vercel origin(s), comma-separated  
     Example: `https://your-app.vercel.app`
   - `GOOGLE_CLIENT_ID` (optional until Google login is ready)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_USERNAME` for seeding
6. After deploy, seed an admin (Render shell or locally against prod env):
   ```bash
   npm run seed:admin
   ```

## Frontend — Vercel

1. Import the repo in Vercel.
2. Root directory: `Event-APP/frontend/event-app`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables:
   - `VITE_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID` = same as backend Google client ID
7. `vercel.json` already rewrites SPA routes to `index.html`.

## Local setup

```bash
cd Event-APP/backend
cp .env.example .env
# fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
npm run seed:admin
npm run dev
```
