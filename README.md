# GSAGEO — GEO / AI Visibility App

Standalone Next.js app for [geo.gsally.com](https://geo.gsally.com): GEO landing page, audit intake form, automated site audit, fix previews, private customer results, and admin dashboard.

The main gsally.com site remains on Replit. This repo is **only** the GEO offering.

## Stack

- **Hosting:** Vercel
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Database / Auth:** Supabase (Postgres + Auth)
- **Optional:** Resend (email), Sentry, PostHog (placeholders)

## Quick start (local)

```bash
cp .env.example .env.local
# Fill in Supabase keys — see SUPABASE_SETUP.md

pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | GEO landing page |
| `/audit` | Intake form (`?tier=monitor\|growth\|managed\|custom`) |
| `/thank-you` | Post-submit confirmation, live status polling, link to `/results/[token]` |
| `/results/[token]` | Private customer report — pending/processing/review/ready states; share + PDF when published |
| `GET /api/results/[token]/status` | JSON status for thank-you and results polling |
| `GET /api/results/[token]/pdf` | Customer PDF export (published content only) |
| `/admin/login` | Supabase admin login |
| `/admin/submissions` | Submission list |
| `/admin/submissions/[id]` | Submission detail, audit results, fix previews, publish/rerun |

## Customer report flow

After submitting `/audit`, the customer is redirected to `/thank-you?t={token}`. That page confirms receipt, shows **live audit status** (polls every 8s), and links to `/results/{token}`.

The results page shows a calm pending/processing/review state until the job is published, then the full premium report with **Share** and **Download PDF** in the action bar. All customer output comes from `getCustomerReportByToken()` / `loadPublishedReportBySubmissionId()` — no draft or internal data.

See [RESULTS_FLOW.md](./RESULTS_FLOW.md) for publish rules and token security.

## Scripts

```bash
pnpm dev        # local dev server
pnpm build      # production build
pnpm test       # validation unit tests
pnpm typecheck  # TypeScript check
```

## Documentation

| File | Purpose |
|------|---------|
| [ADMIN_REVIEW_WORKFLOW.md](./ADMIN_REVIEW_WORKFLOW.md) | Publish, share, and PDF export |
| [DESIGN_NOTES_RESULTS_PAGE.md](./DESIGN_NOTES_RESULTS_PAGE.md) | Premium results page UI structure |
| [RESULTS_FLOW.md](./RESULTS_FLOW.md) | Submission → audit → results lifecycle |
| [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) | End-to-end deploy order |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Database, migrations, admin users |
| [VERCEL_SETUP.md](./VERCEL_SETUP.md) | Vercel project import and env vars |
| [DNS_SETUP.md](./DNS_SETUP.md) | geo.gsally.com DNS |
| [MANUAL_STEPS.md](./MANUAL_STEPS.md) | Blocked / manual-only items |
| [REPLIT_LINK_UPDATES.md](./REPLIT_LINK_UPDATES.md) | Replit-side link changes |

## Legacy code

The `artifacts/` folder contains the original Replit monorepo (Vite + Express). It is **not** deployed by this app. Content was ported into the Next.js app at the repo root.

## QA

- `tests/submission-validation.test.ts` — form validation
- `tests/audit-discovery.test.ts` — gsally.com regression (no false negatives)
- `tests/customer-report-flow.test.ts` — customer status copy and visibility rules
- `tests/AUTH_GUARD_NOTES.md` — admin auth manual checks
- `tests/SMOKE_TEST.md` — full submission flow + rollback notes
