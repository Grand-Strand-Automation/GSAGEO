# Vercel setup

## 1. Import project

1. [vercel.com/new](https://vercel.com/new)
2. Import `Grand-Strand-Automation/GSAGEO` from GitHub
3. Framework: **Next.js** (auto-detected)
4. Root directory: `.` (leave default)

## 2. Build settings

| Setting | Value |
|---------|-------|
| Build Command | `pnpm build` |
| Install Command | `pnpm install` |
| Output Directory | `.next` (default) |
| Node.js Version | 20.x or 22.x |

## 3. Environment variables

Add in Project → Settings → Environment Variables (Production + Preview):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
APP_URL=https://gsageo.vercel.app
ADMIN_EMAIL_ALLOWLIST=shawn@gsally.com
CRON_SECRET=<generate-random-string>
```

Set `APP_URL` as a **Config** / regular env var (not a Sensitive secret with a `NEXT_PUBLIC_` name). The public framework prefix is not needed — this value is only read on the server.

Optional:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=Grand Strand Ally <notifications@gsally.com>
SENTRY_DSN=
POSTHOG_KEY=
```

## 4. Production branch

Settings → Git → Production Branch: `main` (or your default branch)

## 5. Cron job

`vercel.json` defines a cron hitting `/api/cron/process-audit-jobs` every 15 minutes.

- Requires `CRON_SECRET` env var
- Vercel sends `Authorization: Bearer <CRON_SECRET>` on cron invocations (configure in Vercel Cron settings if needed)
- **Note:** Cron on Hobby plan may be limited; verify in Vercel dashboard

## 6. Custom domain

Settings → Domains → Add `geo.gsally.com` (production) and ensure **`geo.vercel.app`** is assigned to **this Next.js project** — not a legacy Create React App deployment.

If `geo.vercel.app` shows title **React App** or CRA meta descriptions, the domain is pointed at the wrong Vercel project. Remove it from the old project and attach it to the GSAGEO Next.js deployment (`pnpm build`).

Set `APP_URL=https://gsageo.vercel.app` in Production env vars so sitemap, robots, canonicals, email links, and share links match.

See [DNS_SETUP.md](./DNS_SETUP.md).

## 7. Post-deploy smoke test

```bash
curl -I https://geo.vercel.app/
curl -I https://geo.vercel.app/sitemap.xml
curl https://geo.vercel.app/robots.txt
curl -s https://geo.vercel.app/ | grep -E '<title>|create-react-app'
```

Expected: sitemap returns `application/xml`, robots includes `Sitemap: https://geo.vercel.app/sitemap.xml`, homepage title contains **AI Visibility** — not **React App**.

Manual checklist: [tests/SMOKE_TEST.md](./tests/SMOKE_TEST.md)

## 8. Preview deployments

Preview URLs use the same env vars if you enable them for Preview environment. Set `APP_URL` to the preview URL for accurate canonicals during QA, or keep the production URL.
