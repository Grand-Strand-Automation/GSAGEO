# Auth guard testing notes

## Automated

Run validation tests:

```bash
pnpm test
```

## Manual auth guard checklist

1. Visit `/admin/submissions` while logged out → should redirect to `/admin/login`.
2. Sign in with a non-allowlisted email → API returns 403.
3. Sign in with an allowlisted admin user → `/admin/submissions` loads.
4. Sign out → session cleared, redirected to login.

## Known limitations

- `ADMIN_EMAIL_ALLOWLIST` must be set in Vercel env vars before admin login works in production.
- Supabase Auth must have public signups disabled; admins are created manually in Supabase dashboard.
- Middleware protects `/admin/*` except relies on Supabase session cookies.
