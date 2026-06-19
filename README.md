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
| `/thank-you` | Post-submit confirmation + private results link |
| `/results/[token]` | Private customer audit results (tokenized) |
| `/admin/login` | Supabase admin login |
| `/admin/submissions` | Submission list |
| `/admin/submissions/[id]` | Submission detail, audit results, fix previews, publish/rerun |

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
- `tests/results-flow.test.ts` — tokens, previews, auto-publish
- `tests/AUTH_GUARD_NOTES.md` — admin auth manual checks
- `tests/SMOKE_TEST.md` — full submission flow + rollback notes
