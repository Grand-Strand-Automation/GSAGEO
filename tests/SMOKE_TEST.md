# Submission flow smoke test

## Prerequisites

- Supabase project created and migration applied
- `.env.local` filled with Supabase keys and `ADMIN_EMAIL_ALLOWLIST`

## Steps

1. Start dev server: `pnpm dev`
2. Open `http://localhost:3000/audit?tier=foundation`
3. Confirm "Interested in" pre-selects Foundation tier
4. Submit form with valid test data
5. Expect redirect to `/thank-you`
6. In Supabase dashboard, verify:
   - `geo_submissions` row created with `status = submitted`
   - `geo_audit_jobs` row created with `status` progressing to `queued` → `processing` → `complete` or `failed`
   - `geo_audit_results` row if audit completed
7. Sign in at `/admin/login` and confirm submission appears in `/admin/submissions`
8. Open detail page and verify intake fields + audit results (if complete)

## Rollback

If a bad deploy breaks submissions:

1. In Vercel, roll back to the previous deployment (Deployments → … → Promote to Production).
2. Database rows are append-only; no migration rollback needed for a frontend-only rollback.
3. If a migration caused issues, restore from Supabase backup or manually revert SQL in dashboard.
