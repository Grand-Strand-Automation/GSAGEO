# Auth guard testing notes

## Automated

Run validation tests:

```bash
pnpm test
```

Includes `tests/auth-admin.test.ts` for allowlist parsing and `tests/submission-validation.test.ts` for intake validation.

## Manual auth guard checklist

1. Visit `/admin/submissions` while logged out → redirect to `/admin/login?next=/admin/submissions`.
2. Submit login with wrong password → error: “Invalid email or password”.
3. Submit login with valid Supabase user but email **not** in `ADMIN_EMAIL_ALLOWLIST` → error: “not authorized”.
4. Sign in with allowlisted admin user → `/admin/submissions` loads with real data (or empty state).
5. Open `/admin/submissions/[id]` for a valid UUID → detail page loads.
6. Open `/admin/submissions/not-a-uuid` or unknown id → 404 not found.
7. Add admin note on detail page → note appears with author email + timestamp.
8. Sign out → session cleared, `/admin/login` shown.
9. Visit `/admin/login` while already signed in as admin → redirect to `/admin/submissions`.

## Production prerequisites

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` set in Vercel
- `ADMIN_EMAIL_ALLOWLIST` matches admin user email(s)
- Supabase Auth: public signups **disabled**
- Admin user created manually in Supabase dashboard
- Migrations `001` and `002` applied

## Architecture notes

- **Middleware** (`middleware.ts`): session check on `/admin/*`; unauthenticated users → login; authenticated users on login page → dashboard.
- **Server pages** (`requireAdminUser`): full authorization via env allowlist + optional `geo_admin_users` table.
- **Login**: Server Action (`signInAdmin`) sets Supabase session cookies reliably; `/api/admin/auth` also available with fixed cookie handling.
- **Admin data reads**: service role server-side only — not via public anon client.
- **Logout**: Server Action `signOutAdmin` clears session.

## Known limitations

- Middleware cannot query `geo_admin_users`; env allowlist is the primary authorization path. DB table is a server-side fallback at login/page render.
- Without Supabase env vars, middleware skips auth checks and admin pages show a configuration error.
