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
NEXT_PUBLIC_APP_URL=https://geo.gsally.com
ADMIN_EMAIL_ALLOWLIST=shawn@gsally.com
CRON_SECRET=<generate-random-string>
```

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

Settings → Domains → Add `geo.gsally.com`

See [DNS_SETUP.md](./DNS_SETUP.md).

## 7. Post-deploy smoke test

```bash
curl -I https://geo.gsally.com/
curl -I https://geo.gsally.com/audit
```

Manual checklist: [tests/SMOKE_TEST.md](./tests/SMOKE_TEST.md)

## 8. Preview deployments

Preview URLs use the same env vars if you enable them for Preview environment. Set `NEXT_PUBLIC_APP_URL` to the preview URL for accurate canonicals during QA, or keep production URL.
