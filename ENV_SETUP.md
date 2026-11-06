# Environment variables

Copy `.env.example` to `.env.local` for local development. Set the same values in Vercel → Project → Settings → Environment Variables for production.

## Required

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Browser + server auth (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Server-only DB access — **never expose to client** |
| `NEXT_PUBLIC_APP_URL` | `https://geo.vercel.app` | Canonical app URL for metadata, sitemap, robots, and results links |
| `ADMIN_EMAIL_ALLOWLIST` | `shawn@gsally.com,ops@gsally.com` | Comma-separated admin emails (required for login authorization) |

## Recommended

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Protects `/api/cron/*` (audit + follow-up email backup processors) |

## Audit / results automation

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUDIT_AUTO_PUBLISH` | `true` | Auto-publish results to customer after audit |
| `AUDIT_REVIEW_REQUIRED` | `false` | When `true`, jobs finish as `awaiting_review`; admin must publish |
| `RESULTS_TOKEN_EXPIRY_DAYS` | `90` | Optional expiry for customer results tokens |

## Required for customer emails

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Sends confirmation + “assessment ready” emails after `/audit` |
| `RESEND_FROM_EMAIL` | Verified Resend from address, e.g. `Grand Strand Ally <notifications@gsally.com>` |
| `RESEND_REPLY_TO` | Reply-to address (defaults to `shawn@gsally.com`) |
| `NEXT_PUBLIC_APP_URL` | Must match the live site (`https://gsageo.vercel.app`) so email links work |

Without `RESEND_API_KEY`, assessments still run and results pages work, but **no emails are sent**.

## Optional

| Variable | Purpose |
|----------|---------|
| `SENTRY_DSN` | Error monitoring placeholder |
| `POSTHOG_KEY` | Analytics placeholder |
| `REVIEW_BOOKING_URL` / `NEXT_PUBLIC_REVIEW_BOOKING_URL` | Booking CTA destination |
| `ADMIN_NOTIFICATION_EMAIL` | Admin alert recipient for new submissions |

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

See also [SUPABASE_SETUP.md](./SUPABASE_SETUP.md), [RESULTS_FLOW.md](./RESULTS_FLOW.md), and [MANUAL_STEPS.md](./MANUAL_STEPS.md).
