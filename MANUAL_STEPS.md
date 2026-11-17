# Manual steps (blocked on account access)

These items cannot be completed from code alone. Do them in order after reviewing [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md).

## Supabase (requires dashboard access)

- [ ] Create Supabase project for production
- [ ] Run migrations (all, in order):
  - [ ] `supabase/migrations/001_geo_schema.sql`
  - [ ] `supabase/migrations/002_geo_admin_users.sql`
  - [ ] `supabase/migrations/003_results_flow.sql`
  - [ ] `supabase/migrations/004_geo_internal_fixes.sql`
  - [ ] `supabase/migrations/005_customer_executive_summary.sql`
  - [ ] `supabase/migrations/006_geo_follow_up.sql`
  - [ ] `supabase/migrations/007_subscription_retention.sql`
  - [ ] `supabase/migrations/008_subscription_fulfillment.sql`
- [ ] Confirm `/api/health/db` returns `{ "ok": true, "database": "ready" }`
- [ ] Confirm `/api/health/fulfillment` returns ready (after env + migration 008)
- [ ] Copy project URL, anon key, and **service role key** into Vercel env vars (see [ENV_SETUP.md](./ENV_SETUP.md))
- [ ] Disable public signups: Authentication → Providers → Email → disable **Enable sign ups**
- [ ] Create first admin user(s) manually: Authentication → Users → Add user
- [ ] Set `ADMIN_EMAIL_ALLOWLIST` in Vercel to match admin email(s) exactly
- [ ] Optional: add same email(s) to `geo_admin_users` table for DB-backed allowlist

## Vercel (requires dashboard access)

- [ ] Import GitHub repo `Grand-Strand-Automation/GSAGEO`
- [ ] Set all env vars from `.env.example` / [ENV_SETUP.md](./ENV_SETUP.md)
- [ ] Generate and set `CRON_SECRET` (random string) — required for all `/api/cron/*` routes
- [ ] Set `AUDIT_AUTO_PUBLISH=true` (default) or `AUDIT_REVIEW_REQUIRED=true` for admin review gate
- [ ] Set `APP_URL` to production URL as a private Config/env var (e.g. `https://gsageo.vercel.app`) — do **not** use `NEXT_PUBLIC_APP_URL`
- [ ] Confirm cron jobs appear after deploy (Hobby plan: cron may require Pro — see Vercel docs):
  - [ ] `/api/cron/process-audit-jobs` (every 15 min)
  - [ ] `/api/cron/process-follow-up-emails` (daily 14:00 UTC)
  - [ ] `/api/cron/apply-subscription-periods` (daily 13:00 UTC)
  - [ ] `/api/cron/process-fulfillment-cycles` (daily 13:15 UTC)
- [ ] Add custom domain `geo.gsally.com` (preview: `gsageo.vercel.app`)

## DNS (requires domain registrar / DNS host access)

- [ ] Add CNAME `geo` → `cname.vercel-dns.com` (or values Vercel provides)
- [ ] Wait for SSL certificate provisioning

## Resend (required for customer emails)

- [ ] Create Resend account and API key
- [ ] Verify sending domain for production `from` address
- [ ] Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel
- [ ] Redeploy after setting keys

## Subscription automation

Fully documented in [SUBSCRIPTION_FULFILLMENT.md](./SUBSCRIPTION_FULFILLMENT.md).

- [ ] Run migration `008_subscription_fulfillment.sql` in Supabase
- [ ] Confirm `/api/health/fulfillment` is healthy
- [ ] Collect payment offline (Stripe not wired yet) before **Mark converted**
- [ ] Convert a test customer → confirm fulfillment cycle appears and monthly email sends
- [ ] For Growth/Managed: assign ops owner; use **Mark ops complete** after hands-on work
- [ ] Optional later: wire Stripe into `BILLING_*` / `billing_*` columns so `next_billing_at` syncs from the provider

## Sentry / PostHog (optional)

- [ ] Create projects and add DSN/keys to Vercel
- [ ] Integrate SDKs (not yet wired in code — placeholders only)

## Replit main site (requires Replit access)

- [ ] Update GEO links per [REPLIT_LINK_UPDATES.md](./REPLIT_LINK_UPDATES.md)

## Business decisions

- [ ] Confirm pricing copy on landing page is current
- [ ] Confirm admin notification email recipient (default: private ops inbox via `ADMIN_NOTIFICATION_EMAIL`)
- [ ] Decide whether automated audit emails go to client or admin only

## Customer-facing QA (after env + Supabase are configured)

- [ ] Submit `/audit` → redirects to `/thank-you?t={token}`
- [ ] Thank-you shows current status card and “View audit status” / “View your report” CTA
- [ ] Thank-you auto-updates when report becomes ready (no manual refresh needed)
- [ ] `/results/{token}` shows pending state with auto-polling while audit runs
- [ ] Published report shows Share + Copy link + Download PDF action bar at top
- [ ] PDF download works and excludes internal-only content
- [ ] Share link opens the same customer-safe report in an incognito window
- [ ] Customer results/PDF do **not** expose `geo_internal_fixes` content

## Internal fix workspace QA (employee-only)

- [ ] After audit completes, `/admin/submissions/[id]` shows **Internal Fix Drafts** panel
- [ ] Panel badge reads “Internal only · Hidden from customer report”
- [ ] Fixes can be approved, hidden, rejected, regenerated, and copied
- [ ] Export packet downloads JSON implementation brief
- [ ] Promote creates a `geo_fix_previews` draft (still requires job publish for customer visibility)
- [ ] `/results/{token}` and customer PDF never show internal fix drafts or JSON-LD implementation blocks

## Admin QA checklist (after env + Supabase are configured)

- [ ] `/audit?tier=monitor` renders the full intake form (no stuck “Loading form…” state)
- [ ] `/audit?tier=audit` maps to Monitor and renders correctly
- [ ] `/admin/login` shows email + password form (no public site header)
- [ ] Invalid credentials show a clear error
- [ ] Valid admin login redirects to `/admin/submissions`
- [ ] Logged-out visit to `/admin/submissions` redirects to `/admin/login` (no framework crash)
- [ ] Missing Supabase env vars show an internal setup message instead of a crash
- [ ] Submissions list loads real rows from `geo_submissions` when configured
- [ ] Detail page shows intake + audit job status + results + fix previews + admin notes
- [ ] Publish / rerun actions work when review gate enabled
- [ ] Adding a note saves to `geo_admin_notes`
- [ ] Sign out clears session and returns to login
- [ ] `/robots.txt` and `/sitemap.xml` return 200

See [tests/AUTH_GUARD_NOTES.md](./tests/AUTH_GUARD_NOTES.md) and [tests/SMOKE_TEST.md](./tests/SMOKE_TEST.md).

## Known production setup gaps (as of latest remediation)

- Admin dashboard requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
- Without those vars, admin pages now show setup messages instead of crashing.
- Audit tier pre-selection is rendered server-side; no client Suspense dependency.

## Not automated (by design)

- Email delivery of results link — customer gets link on thank-you page only (Resend TODO)
- Client-facing PDF reports — web results page only
- Payment / checkout — intake form only, no Stripe

See [RESULTS_FLOW.md](./RESULTS_FLOW.md) for the full automation lifecycle.
