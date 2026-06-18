# Replit link updates (gsally.com main site)

Update the **Replit-hosted** main site so GEO traffic goes to `geo.gsally.com`.

## URLs to use

| Purpose | URL |
|---------|-----|
| GEO landing / service page | `https://geo.gsally.com/` |
| Audit tier CTA | `https://geo.gsally.com/audit?tier=audit` |
| Foundation tier CTA | `https://geo.gsally.com/audit?tier=foundation` |
| Growth tier CTA | `https://geo.gsally.com/audit?tier=growth` |
| Generic audit request | `https://geo.gsally.com/audit` |

## Files likely to update (Replit codebase)

Search the Replit project for these paths and replace with geo.gsally.com URLs:

| Old path (approx.) | New URL |
|--------------------|---------|
| `/generative-engine-optimization` | `https://geo.gsally.com/` |
| `/geo-audit` | `https://geo.gsally.com/audit` |
| `/geo-audit?tier=audit` | `https://geo.gsally.com/audit?tier=audit` |
| `/geo-audit?tier=foundation` | `https://geo.gsally.com/audit?tier=foundation` |
| `/geo-audit?tier=growth` | `https://geo.gsally.com/audit?tier=growth` |

## Components to check

- `SiteHeader` / main navigation — "GEO / AI Visibility" link
- `SiteFooter` — services links
- `GenerativeEngineOptimization.tsx` — all pricing CTAs (or redirect page to geo.gsally.com)
- Services index / pricing pages — GEO card links
- Any `llms.txt` or sitemap entries for GEO pages

## Recommended approach

**Option A (cleanest):** Replace `/generative-engine-optimization` route with a 301 redirect to `https://geo.gsally.com/`

**Option B:** Keep a short stub page on gsally.com that links out to geo.gsally.com for SEO continuity

## Do not migrate to Replit

- `/admin/*` routes — admin lives only on geo.gsally.com
- GEO intake API — handled by Vercel `/api/submissions`
- GEO admin dashboard — `https://geo.gsally.com/admin/login`

## After updating

- [ ] Click every GEO CTA on gsally.com and confirm it lands on geo.gsally.com
- [ ] Update Google Search Console if GEO URLs change materially
- [ ] Update any email templates or PDFs with old `/geo-audit` links
