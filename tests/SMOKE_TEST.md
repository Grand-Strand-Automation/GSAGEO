# Submission flow smoke test

## Prerequisites

- Supabase project created and migrations `001` + `002` applied
- `.env.local` filled with Supabase keys and `ADMIN_EMAIL_ALLOWLIST`
- Admin user created in Supabase Auth (signups disabled)

## Public intake flow

1. Start dev server: `pnpm dev`
2. Open `http://localhost:3000/audit?tier=growth`
3. Confirm “Interested in” pre-selects Growth tier
4. Submit form with valid test data
5. Expect redirect to `/thank-you`
6. In Supabase dashboard, verify:
   - `geo_submissions` row created with `status = submitted`
   - `geo_audit_jobs` row created with status progressing to `queued` → `processing` → `complete` or `failed`
   - `geo_audit_results` row if audit completed

## Admin flow

7. Open `http://localhost:3000/admin/login`
8. Sign in with allowlisted admin credentials
9. Confirm redirect to `/admin/submissions`
10. Submission from step 4 appears in the list (newest first)
11. Click **View →** — detail page shows intake fields
12. If audit completed, audit results section is populated
13. Add an internal note → saves to `geo_admin_notes` and displays author + time
14. Use status/plan filters and search — list updates via URL params
15. Sign out → returns to login; `/admin/submissions` redirects to login

## Production smoke test

Repeat steps 2–15 against `https://gsageo.vercel.app` after Vercel env vars are set and redeployed.

## Rollback

If a bad deploy breaks submissions:

1. In Vercel, roll back to the previous deployment (Deployments → … → Promote to Production).
2. Database rows are append-only; no migration rollback needed for a frontend-only rollback.
3. If a migration caused issues, restore from Supabase backup or manually revert SQL in dashboard.
