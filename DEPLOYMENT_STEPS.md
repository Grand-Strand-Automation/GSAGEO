# Deployment steps

Deploy in this order.

## 1. Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Create project
2. Apply `001_geo_schema.sql`, `002_geo_admin_users.sql`, `003_results_flow.sql`, and `004_geo_internal_fixes.sql`
3. Create admin user(s)
4. Disable public signups
5. Note URL, anon key, service role key

## 2. Environment variables

Follow [ENV_SETUP.md](./ENV_SETUP.md) — set all **Required** vars in Vercel before first admin test.

## 3. Vercel

Follow [VERCEL_SETUP.md](./VERCEL_SETUP.md):

1. Import repo from GitHub
2. Framework preset: **Next.js** (auto-detected)
3. Root directory: **`.`** (repo root)
4. Build command: `pnpm build` (or `npm run build`)
5. Install command: `pnpm install`
6. Add environment variables
7. Deploy

## 4. DNS

Follow [DNS_SETUP.md](./DNS_SETUP.md):

1. Add `geo.gsally.com` in Vercel → Domains
2. Configure DNS CNAME at your registrar
3. Wait for SSL

## 5. Post-deploy smoke test

```text
[ ] https://gsageo.vercel.app/ loads (public landing)
[ ] https://gsageo.vercel.app/audit?tier=monitor loads form with tier pre-selected
[ ] Test submission → thank-you page with ?t= token → row in geo_submissions + geo_audit_jobs
[ ] Thank-you page shows live status and links to /results/{token}
[ ] /results/{token} shows pending then published results (auto-publish default)
[ ] Customer can Copy share link and Download PDF on published report
[ ] Fix previews visible on customer results page
[ ] https://gsageo.vercel.app/admin/login — admin can sign in
[ ] Submission visible in /admin/submissions with job status
[ ] Detail page shows audit results, fix previews, publish/rerun actions
[ ] Detail page + admin note creation works
[ ] Sign out returns to login
```

See [tests/SMOKE_TEST.md](./tests/SMOKE_TEST.md) for details.

## 6. Replit link updates

Update main site links per [REPLIT_LINK_UPDATES.md](./REPLIT_LINK_UPDATES.md).

## Rollback

In Vercel: Deployments → select previous deployment → Promote to Production.

Database migrations are forward-only; rolling back code does not remove data.
