# Deployment steps

Deploy in this order.

## 1. Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Create project
2. Apply `supabase/migrations/001_geo_schema.sql`
3. Create admin user(s)
4. Disable public signups
5. Note URL, anon key, service role key

## 2. Vercel

Follow [VERCEL_SETUP.md](./VERCEL_SETUP.md):

1. Import repo from GitHub
2. Framework preset: **Next.js** (auto-detected)
3. Root directory: **`.`** (repo root)
4. Build command: `pnpm build` (or `npm run build`)
5. Install command: `pnpm install`
6. Add environment variables from `.env.example`
7. Deploy

## 3. DNS

Follow [DNS_SETUP.md](./DNS_SETUP.md):

1. Add `geo.gsally.com` in Vercel → Domains
2. Configure DNS CNAME at your registrar
3. Wait for SSL

## 4. Post-deploy smoke test

```text
[ ] https://geo.gsally.com/ loads
[ ] https://geo.gsally.com/audit?tier=monitor loads form with tier pre-selected
[ ] Test submission → thank-you page → row in Supabase
[ ] https://geo.gsally.com/admin/login — admin can sign in
[ ] Submission visible in /admin/submissions
```

See [tests/SMOKE_TEST.md](./tests/SMOKE_TEST.md) for details.

## 5. Replit link updates

Update main site links per [REPLIT_LINK_UPDATES.md](./REPLIT_LINK_UPDATES.md).

## Rollback

In Vercel: Deployments → select previous deployment → Promote to Production.

Database migrations are forward-only; rolling back code does not remove data.
