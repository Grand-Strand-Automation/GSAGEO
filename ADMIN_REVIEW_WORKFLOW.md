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

## Internal fix generation (employee-only)

After audit completes, GSAGEO auto-generates **internal implementation drafts** stored in `geo_internal_fixes`. These are visible only in `/admin/submissions/[id]` under **Internal Fix Drafts**.

| Property | Value |
|----------|-------|
| Customer visibility | **Never** by default (`internal_only=true`, `customer_visible=false`) |
| Auto-generation | Runs in `processAuditJob` after findings are saved |
| Customer report | Uses `geo_fix_previews` only — separate table, separate publish flow |

### Employee actions

On the internal fix workspace:

- **Approve** — mark ready for internal implementation
- **Edit** — PATCH via API (status → `edited_internal`)
- **Hide / Reject / Archive** — remove from active workflow
- **Regenerate** — re-run generator for one fix or all fixes
- **Copy** — clipboard implementation packet for one fix
- **Export packet** — JSON download of all fixes for the submission
- **Promote to customer draft** — creates a sanitized `geo_fix_previews` row as `draft` (requires explicit admin action + job publish)

### Internal fix APIs (admin auth required)

| Route | Purpose |
|-------|------|
| `GET /api/admin/submissions/[id]/internal-fixes` | List fixes for latest job |
| `POST /api/admin/submissions/[id]/internal-fixes/generate` | Generate / regenerate all |
| `GET /api/admin/submissions/[id]/internal-fixes/export` | Download implementation JSON packet |
| `PATCH /api/admin/internal-fixes/[fixId]` | Update status, notes, content |
| `POST /api/admin/internal-fixes/[fixId]/regenerate` | Regenerate one fix |
| `POST /api/admin/internal-fixes/[fixId]/promote` | Create customer-safe preview draft |

### Finding → fix mapping

High/medium impact findings map to fix types (FAQ → `faq_fix`, service pages → `service_page_fix`, schema → `schema_fix`, etc.). Low-confidence “not confirmed” findings produce **cautious** drafts with validation notes—not overconfident rewrites.

See `lib/internal-fixes/mapping.ts` and `lib/internal-fixes/generator.ts`.

PDF excludes: admin notes, draft previews, internal metadata, unpublished sections.
