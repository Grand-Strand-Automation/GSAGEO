# Environment variables

Copy `.env.example` to `.env.local` for local development. Set the same values in Vercel → Project → Settings → Environment Variables for production.

## Required

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Browser + server auth (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Server-only DB access — **never expose to client** |
| `NEXT_PUBLIC_APP_URL` | `https://gsageo.vercel.app` | Canonical app URL for metadata/links |
| `ADMIN_EMAIL_ALLOWLIST` | `shawn@gsally.com,ops@gsally.com` | Comma-separated admin emails (required for login authorization) |

## Recommended

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Protects `/api/cron/process-audit-jobs` |

## Optional

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Transactional email (not wired for v1) |
| `RESEND_FROM_EMAIL` | From address for Resend |
| `SENTRY_DSN` | Error monitoring placeholder |
| `POSTHOG_KEY` | Analytics placeholder |

## Local setup

```bash
cp .env.example .env.local
# Fill in Supabase keys from Project Settings → API
pnpm dev
```

Open `http://localhost:3000/admin/login` after creating an admin user in Supabase.

## Production (Vercel)

1. Add all **Required** variables for Production (and Preview if you test PRs).
2. Redeploy after changing env vars — Next.js bakes `NEXT_PUBLIC_*` at build time.
3. Confirm `ADMIN_EMAIL_ALLOWLIST` matches the email of each Supabase admin user exactly (case-insensitive).

## Security notes

- Do **not** commit `.env.local` or paste service role keys in client code.
- Admin dashboard reads submission data with the service role **after** verifying a Supabase Auth session and admin authorization.
- Public signup must stay disabled in Supabase; admins are created manually in the dashboard.

See also [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) and [MANUAL_STEPS.md](./MANUAL_STEPS.md).
