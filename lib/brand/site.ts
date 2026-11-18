/**
 * Public brand fields safe to import from Client Components.
 * Private ops contact lives in `lib/brand/ops-contact.ts` (server-only).
 */
export const siteConfig = {
  name: "Grand Strand Ally",
  tagline: "AI Visibility",
  descriptor: "Generative Engine Optimization",
  serviceArea: "Grand Strand · Myrtle Beach, SC",
  mainSiteUrl: "https://gsally.com",
  geoCanonicalUrl: "https://geo.gsally.com",
  logoIconSrc: "/brand/logo-icon.png",
  /** Public contact — update when a dedicated inbox / LinkedIn URL is ready. */
  contactEmail: "hello@gsally.com",
  contactPhone: null as string | null,
  linkedinUrl: null as string | null,
} as const;
