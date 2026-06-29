---
name: GEO Gold Color System
description: GEO/AI Visibility CTA visual identity — gold #C09030 distinguishes GEO CTAs from standard blue IT CTAs site-wide
---

# GEO Gold Color System

The site uses a deliberate two-CTA-color system:
- **IT services CTAs**: steel blue `#1F5E95` (hover `#1a5080`) — standard primary actions
- **GEO/AI Visibility CTAs**: amber-gold `#C09030` (hover `#A87820`) — distinct, premium path

**Why:** GEO CTAs were indistinguishable from IT CTAs (both used `#1F5E95`). Logo gold (~`#C09030`) was extracted and applied as a dedicated GEO visual identity so visitors can recognize "this is the GEO path."

## Color Values
- Fill bg: `#C09030`
- Hover bg: `#A87820`
- Dark text on gold button: `#0E2F54`
- Light gold text (on dark bg): `#E8C870`
- Light gold hover (on dark bg): `#F0D890`
- Gold text link (on light/white bg): `#6B4E0A` hover `#4E3208`

## Reusable Class
`.btn-geo` defined in `index.css` @layer components:
- `display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; border-radius: 0.5rem; transition: background-color 0.15s; white-space: nowrap; background-color: #C09030; color: #0E2F54;`
- Pair with sizing utilities: `h-12 px-7 text-[15px]` (standard), `h-11 px-6 text-[14px]` (compact)

## Tailwind Tokens (in @theme inline)
- `--color-geo-gold: #C09030`
- `--color-geo-gold-hover: #A87820`

## Ghost/Nav Treatment (on dark header/dropdown backgrounds)
`bg-[#C09030]/15 hover:bg-[#C09030]/25 border border-[#C09030]/40 hover:border-[#C09030]/70 text-[#E8C870] hover:text-[#F0D890]`

## CTABand Support
CTABand accepts `geo: true` on button objects — renders `.btn-geo` instead of blue primary.

## Files Updated
- `src/index.css` — color tokens + .btn-geo class
- `src/components/GeoCTABlock.tsx` — single source of truth, uses btn-geo
- `src/components/GeoAnnouncementBar.tsx` — gold CTA on blue bar
- `src/components/SiteHeader.tsx` — nav gold ghost button + dropdown GEO link gold + mobile equivalents
- `src/components/SiteFooter.tsx` — gold CTA + gold "GEO / AI Visibility" nav link
- `src/components/CTABand.tsx` — geo prop support
- `src/pages/Home.tsx` — all 3 GEO CTAs + section label gold
- `src/pages/Services.tsx` — all 3 GEO CTAs + featured card treatment + CTABand
- `src/pages/GenerativeEngineOptimization.tsx` — hero badge + all CTAs + tier buttons
