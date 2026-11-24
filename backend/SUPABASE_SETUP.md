# Supabase setup (database only)

Auth stays in Express (JWT + Google). Supabase stores users/events.

## 1. Create project

1. Go to https://supabase.com and create a project.
2. Wait until the database is ready.

## 2. Create tables

1. Open **SQL Editor**
2. Paste and run [`supabase/schema.sql`](./supabase/schema.sql)

## 3. Copy API keys

**Settings → API**

| Env var | Where |
|---------|--------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret (backend only) |

Put them in `backend/.env`.

## 4. Seed admin + run

```bash
cd Event-APP/backend
npm install
npm run seed:admin
npm run dev
```

Default local admin (change later): `admin@example.com` / `admin123`
