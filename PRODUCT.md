# Event-APP — Product & Flow Guide

This document explains **how the product works**, **who can do what**, and **what you need** to run or ship it.

---

## 1. What the product is

**popin.** is a web app where:

| Role | Can do |
|------|--------|
| **Guest** | Browse and search events; view event details |
| **User** | Register / login; register for events; cancel registration; view their profile |
| **Admin** | Everything a user can do, plus create, edit, and delete events |

Stack:

- **Frontend:** React (Vite) + Chakra UI + React Router + Axios  
- **Backend:** Node.js + Express + JWT + Supabase (Postgres)  
- **Deploy targets:** Frontend → Vercel · Backend → Render · DB → Supabase

---

## 2. High-level architecture

```
┌─────────────────────┐         HTTPS / JSON          ┌─────────────────────┐
│  Frontend (Vercel)  │ ─────────────────────────────▶│  Backend (Render)   │
│  Vite + React       │◀───────────────────────────── │  Express + JWT      │
│  Chakra UI          │      Bearer token on API      │                     │
└─────────────────────┘                               └──────────┬──────────┘
                                                                  │
                                                                  ▼
                                                         ┌─────────────────┐
                                                         │    Supabase     │
                                                         │  Users, Events │
                                                         └─────────────────┘
```

**Local defaults**

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000/api` |

---

## 3. User flows

### 3.1 Register / login (JWT)

```
User opens /auth
    → email/password  OR  Continue with Google
    → POST /api/auth/register | /login | /google
    → Backend returns { token, user: { id, name, email, role } }
    → Frontend stores token + user in localStorage
    → Axios sends Authorization: Bearer <token> on later requests
    → Admin → /create-event · User → /events
```

- Forgot password: `/forgot-password` → email link → `/reset-password?token=...`
- Token expires in **1 hour**.
- On **401**, frontend clears storage and sends the user to `/auth`.
- Full Google + Resend setup and barriers: see [AUTH.md](./AUTH.md).

### 3.2 Browse, search, filter (public)

```
/events
    → no filters: GET /api/events
    → with name / category / dates: GET /api/events/search?...
    → cards link to /events/:id
    → GET /api/events/:id for details
```

Filters supported: **name**, **category**, **startDate**, **endDate** (plus “Upcoming” = startDate = today).

### 3.3 User: register for an event / cancel

```
Logged-in user on /events/:id
    → Register → POST /api/events/:id/register
    → Cancel   → DELETE /api/events/:id/register

Profile (/profile)
    → loads all events, keeps ones where user is in participants
    → can cancel from profile as well
```

Rules:

- Must be logged in  
- Cannot register twice  
- Cannot register if `participants.length >= maxParticipants`

### 3.4 Admin: create / edit / delete events

```
Admin seeds once: npm run seed:admin  (ADMIN_EMAIL / PASSWORD / USERNAME)

Admin logs in (role === "admin")
    → nav shows "Create Event"
    → POST /api/events          (create)
    → PUT  /api/events/:id      (edit via /events/:id/edit)
    → DELETE /api/events/:id    (from details page)
```

Non-admins hitting create/edit/delete get **403**. The UI also hides those actions.

---

## 4. Roles & authorization (summary)

| Action | Guest | User | Admin |
|--------|-------|------|-------|
| List / search / view events | Yes | Yes | Yes |
| Register / cancel | No | Yes | Yes |
| Create / edit / delete event | No | No | Yes |
| Seeded admin account | — | — | Via `seed:admin` |

Backend middleware:

- `protect` — valid JWT required  
- `adminOnly` — `req.user.role === 'admin'`

---

## 5. Main screens

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/events` | Browse + search/filter |
| `/events/:id` | Details; register/cancel; admin edit/delete |
| `/events/:id/edit` | Admin edit form |
| `/create-event` | Admin create form |
| `/profile` | User info + registered events |
| `/auth` | Login / register |

---

## 6. API map

### Auth — `/api/auth`

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/register` | Public | Body: `name`, `email`, `password` → stored as `username` |
| POST | `/login` | Public | Body: `email`, `password` |

### Events — `/api/events`

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/` | Public | All events |
| GET | `/search` | Public | Query: `name`, `category`, `startDate`, `endDate`, `page`, `limit` |
| GET | `/:id` | Public | Single event |
| POST | `/` | Admin | Create |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |
| POST | `/:id/register` | User | Join event |
| DELETE | `/:id/register` | User | Cancel join |

---

## 7. Data model (what the product stores)

**User**

- `username`, `email`, `password` (hashed), `role` (`user` \| `admin`)

**Event**

- `name`, `description`, `date`, `time`, `location`  
- `organizer` → User  
- `participants` → [User]  
- `maxParticipants`, `category`  
- `status` → `upcoming` \| `ongoing` \| `completed`

---

## 8. What you need for the product

### 8.1 To run locally

| Need | Why |
|------|-----|
| Node.js 18+ | Run frontend + backend |
| Supabase project | Persist users & events (`SUPABASE_URL` + service role key) |
| Backend `.env` | See `backend/.env.example` |
| Seed admin | `cd backend && npm run seed:admin` |
| Two terminals | `npm run dev` in `backend` and in `frontend/event-app` |

**Minimum backend env**

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
PORT=5000
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_USERNAME=admin
```

**Frontend env (optional locally)**

```
VITE_API_URL=http://localhost:5000/api
```

### 8.2 To ship (production)

| Need | Purpose |
|------|---------|
| Supabase project (schema applied) | Production database |
| Render (or similar) Web Service | Host Express API |
| Vercel project | Host Vite SPA |
| Strong `JWT_SECRET` | Secure tokens |
| `FRONTEND_URL` = your Vercel URL(s) | CORS allowlist |
| `VITE_API_URL` = your Render `/api` URL | Frontend talks to API |
| Run `seed:admin` once in prod | First admin account |
| HTTPS on both apps | Default on Vercel/Render |

Step-by-step deploy notes: see [DEPLOY.md](./DEPLOY.md).

### 8.3 Product checklist (features already in app)

- [x] JWT login / register (+ Google sign-in + forgot/reset password)  

- [x] Role-based admin vs user  
- [x] Admin create / edit / delete events  
- [x] User register & cancel for events  
- [x] Browse + search/filter (name, category, dates)  
- [x] Profile with registered events  
- [x] Responsive Chakra UI shell  
- [x] Deploy-ready config (Vercel + Render)  

### 8.4 Not in scope (future product needs)

These are **not** built yet if you want a fuller SaaS later:

- Password reset / email verification  
- Email / push notifications  
- Payments / ticketing  
- Image uploads for events  
- Automated tests / CI  
- Live “click deploy” from this repo (configs only)

---

## 9. Quick start (local)

```bash
# 1) Backend
cd Event-APP/backend
cp .env.example .env   # or edit existing .env
npm install
npm run seed:admin
npm run dev

# 2) Frontend (new terminal)
cd Event-APP/frontend/event-app
npm install
npm run dev
```

1. Open `http://localhost:5173`  
2. Login as admin (values from `.env` `ADMIN_*`) to create events  
3. Register a normal user to browse and join events  

---

## 10. Mental model (one sentence)

**Admins publish events into Supabase Postgres; anyone can discover them; logged-in users join or leave; the frontend never trusts itself for permissions — the API enforces JWT + admin role.**
