# Submission flow smoke test

## Prerequisites

- Supabase project created and migrations `001` + `002` applied
- `.env.local` filled with Supabase keys and `ADMIN_EMAIL_ALLOWLIST`
- Admin user created in Supabase Auth (signups disabled)

## Production blocker checklist

1. [ ] `/audit?tier=monitor` renders the full intake form (not stuck on “Loading form…”)
2. [ ] `/audit?tier=audit` pre-selects Monitor plan (legacy alias)
3. [ ] `/audit?tier=growth`, `managed`, and `custom` still render the form
4. [ ] `/admin/submissions` does **not** show a framework crash page when logged out (redirects to login)
5. [ ] `/admin/submissions` shows a setup message (not a crash) if Supabase env vars are missing
6. [ ] `/robots.txt` returns 200 with sitemap reference
7. [ ] `/sitemap.xml` returns 200 valid XML (public routes only)
8. [ ] `/` homepage still renders
9. [ ] `/thank-you` still renders

## Public intake flow

1. Start dev server: `pnpm dev`
2. Open `http://localhost:3000/audit?tier=monitor`
3. Confirm “Interested in” pre-selects AI Visibility Monitor
4. Open `http://localhost:3000/audit?tier=audit` and confirm the same Monitor selection
5. Submit form with valid test data
6. Expect redirect to `/thank-you`
7. In Supabase dashboard, verify:
   - `geo_submissions` row created with `status = submitted`
   - `geo_audit_jobs` row created with status progressing to `queued` → `processing` → `complete` or `failed`
   - `geo_audit_results` row if audit completed

## Admin flow

8. Open `http://localhost:3000/admin/login`
9. Sign in with allowlisted admin credentials
10. Confirm redirect to `/admin/submissions`
11. Submission from step 5 appears in the list (newest first)
12. Click **View →** — detail page shows intake fields
13. If audit completed, audit results section is populated
14. Add an internal note → saves to `geo_admin_notes` and displays author + time
15. Sign out → returns to login; `/admin/submissions` redirects to login

## Production smoke test

Repeat blocker checklist and admin flow against `https://gsageo.vercel.app` after Vercel env vars are set and redeployed.

## Rollback

If a bad deploy breaks submissions:

1. In Vercel, roll back to the previous deployment (Deployments → … → Promote to Production).
2. Database rows are append-only; no migration rollback needed for a frontend-only rollback.
3. If a migration caused issues, restore from Supabase backup or manually revert SQL in dashboard.
