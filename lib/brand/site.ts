/**
 * Public brand fields safe to import from Client Components.
 * Private ops contact lives in `lib/brand/ops-contact.ts` (server-only).
 */
export const siteConfig = {
  name: "Grand Strand Ally",
  tagline: "AI Visibility · GEO",
  descriptor: "Generative Engine Optimization",
  serviceArea: "Grand Strand · Myrtle Beach, SC",
  mainSiteUrl: "https://gsally.com",
  geoCanonicalUrl: "https://geo.gsally.com",
  logoIconSrc: "/brand/logo-icon.png",
} as const;
