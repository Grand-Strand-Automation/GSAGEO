# Submission flow smoke test

## Prerequisites

- Supabase project created and migrations `001`, `002`, and `003` applied
- `.env.local` filled with Supabase keys, `ADMIN_EMAIL_ALLOWLIST`, and `NEXT_PUBLIC_APP_URL`
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

## Public intake + results flow

1. Start dev server: `pnpm dev`
2. Open `http://localhost:3000/audit?tier=monitor`
3. Confirm “Interested in” pre-selects AI Visibility Monitor
4. Submit form with valid test data (use a real crawlable URL for best audit output)
5. Expect redirect to `/thank-you?t={token}`
6. Thank-you page shows “View your results” link to `/results/{token}`
7. Open results page — expect **pending/processing** briefly, then **published** premium report (auto-publish default)
8. Confirm results page shows: hero + score badge, stat cards, charts, scorecard, priorities, findings, page analysis, fix previews, roadmap, CTA
9. In Supabase dashboard, verify:
   - `geo_submissions` row with `status = submitted`
   - `geo_audit_jobs` row: `queued` → `processing` → `published` (or `awaiting_review` if review gate on)
   - `geo_audit_results` row with findings JSON
   - `geo_fix_previews` rows (5+ preview types)
   - `geo_result_access_tokens` row with `token_hash` (not raw token)

## Admin flow

10. Open `http://localhost:3000/admin/login`
11. Sign in with allowlisted admin credentials
12. Submission from step 4 appears in the list with job status badge
13. Click **View →** — detail page shows intake, job status, audit results, fix previews
14. If `AUDIT_REVIEW_REQUIRED=true`, test **Publish to customer** button
15. Test **Rerun audit** if needed
16. Add an internal note → saves to `geo_admin_notes`
17. Sign out → returns to login

## Token security

- [ ] Invalid token `/results/bad-token` shows safe error (not other customers’ data)
- [ ] Results page is read-only (no admin data exposed)

## Production smoke test

Repeat against `https://gsageo.vercel.app` after migration `003` and env vars are set.

## Rollback

If a bad deploy breaks submissions:

1. In Vercel, roll back to the previous deployment.
2. Database rows are append-only; no migration rollback needed for frontend-only rollback.
3. If migration `003` caused issues, manually revert SQL in Supabase dashboard.

See [RESULTS_FLOW.md](../RESULTS_FLOW.md) for lifecycle details.
