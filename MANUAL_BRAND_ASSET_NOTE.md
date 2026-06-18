# Brand assets — manual notes

## Logo (implemented)

The GEO app uses the same icon as gsally.com:

- **Local path:** `public/brand/logo-icon.png`
- **Source:** downloaded from `https://gsally.com/brand/logo-icon.png`
- **Component:** `components/BrandLogo.tsx` (header + footer lockup)

The lockup shows the icon plus “Grand Strand Ally” with a “GEO / AI Visibility” descriptor.

## Optional future assets (not required for launch)

| Asset | Status | Notes |
|-------|--------|-------|
| Full horizontal logo lockup (SVG/PNG) | Not in repo | If gsally.com has a wordmark file, add to `public/brand/` and update `BrandLogo.tsx` |
| Favicon set (ico/apple-touch) | Partial | `public/favicon.svg` exists; consider matching main site favicon bundle |
| OG/social share image | Missing | Add `public/og/geo-default.png` for social previews |

## Keeping assets in sync

If the main site logo changes on gsally.com, re-download or replace `public/brand/logo-icon.png` and redeploy.

No CDN hotlinking is used in production — the icon is bundled in the repo for reliable Vercel builds.
