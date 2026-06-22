# Admin review and publish workflow

## Overview

1. Customer submits `/audit` form
2. Audit runs automatically (`queued` → `processing` → `published` or `awaiting_review`)
3. Admin reviews at `/admin/submissions/[id]`
4. If review gate enabled: click **Publish to customer**
5. Distribute via **Report distribution** panel

## Report distribution (admin)

On `/admin/submissions/[id]`, the **Report distribution** panel provides:

| Action | When available |
|--------|----------------|
| **Generate share link** | Job status is `published` (or `complete` with `published_at`) |
| **Copy link** | After generating a link in this session |
| **Open customer report** | After generating a link |
| **Download PDF** | Published report only |
| **Revoke link** | When an active token exists |

### Share link notes

- Raw tokens are **never stored** — only SHA-256 hashes in `geo_result_access_tokens`
- The thank-you page token from initial submission remains valid until revoked or regenerated
- **Generate share link** revokes previous tokens and issues a new URL
- **Revoke link** invalidates all active tokens for the submission

## Customer actions

On `/results/[token]` when published:

- **Copy share link** — copies the current private URL
- **Download PDF** — downloads branded PDF via `/api/results/[token]/pdf`

## Publish rules

| Job status | Customer page | Share | PDF |
|------------|---------------|-------|-----|
| `queued` / `processing` | Pending | No | No |
| `awaiting_review` | “Being finalized” | No | No |
| `published` | Full report | Yes | Yes |
| `failed` | Error state | No | No |

## APIs

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /api/results/[token]/pdf` | Token | Customer PDF download |
| `GET /api/admin/submissions/[id]/pdf` | Admin | Admin PDF download |
| `GET /api/admin/submissions/[id]/share` | Admin | Share status |
| `POST /api/admin/submissions/[id]/share` | Admin | Regenerate share link |
| `POST /api/admin/submissions/[id]/share/revoke` | Admin | Revoke all tokens |

## PDF generation

- **Library:** `@react-pdf/renderer` (server-side, Node.js runtime)
- **Source:** `loadPublishedReportBySubmissionId()` — published previews only
- **Filename:** `geo-report-{domain}-{date}.pdf`

PDF excludes: admin notes, draft previews, internal metadata, unpublished sections.
