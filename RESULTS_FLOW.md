# Results flow — submission → audit → customer page

## Lifecycle

1. Customer submits `/audit` form
2. `POST /api/submissions` saves `geo_submissions`, creates `geo_audit_jobs` (status `queued`), creates `geo_result_access_tokens` (SHA-256 hash only)
3. Response includes one-time `resultsToken` (raw token, never stored)
4. Customer redirected to `/thank-you?t={token}` with private results link
5. `after()` triggers `processAuditJob` (also backed up by Vercel Cron on `/api/cron/process-audit-jobs`)
6. Job runs discovery audit v2, saves `geo_audit_results`, `geo_fix_previews`
7. Job status → `published` (auto) or `awaiting_review` (if review gate enabled)
8. Customer opens `/results/{token}` — read-only, token-scoped

## Job status model

| Status | Meaning |
|--------|---------|
| `queued` | Waiting for worker |
| `processing` | Audit running |
| `awaiting_review` | Results generated; admin must publish |
| `published` | Customer-visible |
| `complete` | Processed but not published (if auto-publish off) |
| `failed` | Error logged in `failure_reason` |

## Results URL generation

- Token: 32-byte `base64url` random string
- Stored: SHA-256 hash in `geo_result_access_tokens.token_hash`
- URL: `{APP_URL}/results/{token}`
- Expiry: optional via `RESULTS_TOKEN_EXPIRY_DAYS` (default 90)

## Publish / review behavior

**Default (production): auto-publish**

- `AUDIT_AUTO_PUBLISH` unset or `true`
- `AUDIT_REVIEW_REQUIRED` unset or `false`
- Jobs finish as `published`; fix previews status `published`

**Optional review gate**

- Set `AUDIT_REVIEW_REQUIRED=true`
- Jobs finish as `awaiting_review`; previews saved as `draft`
- Admin clicks **Publish to customer** in submission detail
- Calls `POST /api/admin/jobs/{id}/publish`

## Background processing

- Primary: Next.js `after()` on form submission (Vercel serverless)
- Backup: Vercel Cron → `GET /api/cron/process-audit-jobs` with `Authorization: Bearer {CRON_SECRET}`
- Job claiming: atomic update `queued` → `processing` prevents duplicate runs

## Manual setup

1. Apply migration `003_results_flow.sql` in Supabase
2. Set env vars (see `.env.example`)
3. Configure Vercel Cron + `CRON_SECRET` for stuck jobs
4. Redeploy

## Local test

```bash
pnpm dev
# Submit form at /audit
# Copy token from thank-you URL
# Open /results/{token}
# Check /admin/submissions for job + previews
```

## Known limitations

- No headless browser (sample HTML only)
- Customer token shown once on thank-you — admin cannot recover raw token (regenerate flow not yet built)
- Email delivery of results link not wired (Resend placeholder)
