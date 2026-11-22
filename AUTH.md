# Authentication guide (Google + email/password + forgot password)

popin. supports **both** email/password and Google sign-in. Forgot password works for email/password accounts via **Resend**.

## What users can do

| Method | Register | Login | Reset password |
|--------|----------|-------|----------------|
| Email + password | Yes | Yes | Yes (email link) |
| Google | Yes (first visit creates account) | Yes | No — use Google Account settings |

If someone already registered with email/password and later uses Google with the **same email**, accounts are **linked** (Google ID attached to the existing user). No duplicate user is created.

## API endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/register` | email/password |
| POST | `/api/auth/login` | email/password |
| POST | `/api/auth/google` | body: `{ credential }` (Google ID token) |
| POST | `/api/auth/forgot-password` | body: `{ email }` — always generic success |
| POST | `/api/auth/reset-password` | body: `{ token, password }` — returns JWT |

## Setup you must do outside the code

### 1. Google Cloud Console

1. Create (or open) a Google Cloud project.
2. APIs & Services → Credentials → Create **OAuth client ID** → type **Web application**.
3. Authorized JavaScript origins:
   - `http://localhost:5173`
   - your Vercel URL
4. Copy the **Client ID** into:
   - Backend: `GOOGLE_CLIENT_ID`
   - Frontend: `VITE_GOOGLE_CLIENT_ID` (same value)
5. Restart frontend after changing Vite env vars.

Without this, the Auth page shows that Google is not configured.

### 2. Resend (forgot password emails)

1. Create a [Resend](https://resend.com) account and API key.
2. Set `RESEND_API_KEY` and `EMAIL_FROM` on the backend.
3. For local testing you can use `popin <onboarding@resend.dev>` — delivery may be limited to your own Resend account email until you verify a domain.
4. If `RESEND_API_KEY` is empty, the server logs the reset link to the console instead of emailing (dev fallback).

## Challenges and barriers

| Challenge | Why it matters | Mitigation in this app |
|-----------|----------------|------------------------|
| Google Console setup | Google login will not work until Client ID + origins are set | Clear UI message when `VITE_GOOGLE_CLIENT_ID` is missing |
| Account linking | Same email via Google and password could create two users | Upsert by email; attach `googleId` |
| Google-only users have no password | Password login would fail confusingly | Login returns “Use Google to sign in” |
| Forgot password ≠ Google users | They reset via Google, not popin. | Documented on Forgot Password page |
| Email deliverability | Unverified domain → emails may not arrive | Resend sandbox + console fallback when key missing |
| Reset token security | Stolen/reused links | Token hashed in DB, expires in 15 minutes, single-use |
| Cross-origin deploy | Cookies between Vercel/Render are painful | Same JWT-in-`localStorage` pattern as before |
| Admin seed | Still email/password | `npm run seed:admin` unchanged |

## Local env checklist

**Backend `.env`**

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
RESEND_API_KEY=re_xxx
EMAIL_FROM=popin <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`**

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Frontend routes

- `/auth` — login/register + Google button + “Forgot password?”
- `/forgot-password` — request reset email
- `/reset-password?token=...` — set new password and sign in
