# Subscription fulfillment automation

This document describes how monthly GEO plans are fulfilled in production after a customer is converted.

## What runs automatically

| Trigger | What happens |
|---------|----------------|
| Admin **Mark converted** | Sets `subscription_status=active`, `current_plan` from intake (default Growth), sets `next_billing_at` (+1 month), creates fulfillment cycle #1, runs kickoff visibility refresh + monthly summary email |
| Cron `GET /api/cron/apply-subscription-periods` daily 13:00 UTC | Applies due cancels / plan changes; enqueues next monthly cycle |
| Cron `GET /api/cron/process-fulfillment-cycles` daily 13:15 UTC | Claims queued cycles, runs subscription audit refresh, emails monthly summary |
| Cron `GET /api/cron/process-audit-jobs` every 15 min | Backup processor for any leftover queued audits |

### By plan

| Plan | Automated | Still needs human ops |
|------|-----------|------------------------|
| **Monitor ($199)** | Snapshot + score + priorities + email → cycle `delivered` | None for the monthly package |
| **Growth (from $499)** | Same snapshot + email → cycle `awaiting_ops` | Page briefs / light guidance; then **Mark ops complete** |
| **Managed (from $1,250)** | Same snapshot + email → cycle `awaiting_ops` | Hands-on implementation + roadmap; then **Mark ops complete** |

## Admin UI

On `/admin/submissions/[id]`:

- **Subscription fulfillment** panel — cycles, status, Start/run kickoff, Mark ops complete, Retry failed
- **Mark converted** in Follow-up actions — starts the subscription + kickoff cycle

## Health check

`GET /api/health/fulfillment` reports:

- `CRON_SECRET`
- Resend email config
- `APP_URL`
- `geo_fulfillment_cycles` table
- awaiting_ops / failed backlog counts

## Database

Run migration:

- `supabase/migrations/008_subscription_fulfillment.sql`

Or re-run `supabase/APPLY_ALL.sql` on a fresh project.

## Manual / outstanding items

See [MANUAL_STEPS.md](./MANUAL_STEPS.md) section **Subscription automation**.

Critical before go-live:

1. Apply migration `008` in Supabase  
2. Set `CRON_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL` in Vercel and redeploy  
3. Confirm Vercel Cron entries for the two new paths (Pro plan may be required)  
4. Collect payment offline (Stripe not wired) before Mark converted  
5. For Growth/Managed: clear ops owner + monthly checklist from the operating guide  
