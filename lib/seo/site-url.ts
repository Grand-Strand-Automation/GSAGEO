/** Canonical production URL — override with APP_URL in Vercel (private Config/env). */
export const DEFAULT_SITE_URL = "https://geo.gsally.com";

/**
 * Prefer private `APP_URL` (safe for Vercel Config / non-public secrets).
 * Falls back to legacy `NEXT_PUBLIC_APP_URL` if already set.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Public routes included in sitemap.xml */
export const PUBLIC_INDEX_ROUTES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/audit", changeFrequency: "monthly" as const, priority: 0.9 },
  {
    path: "/myrtle-beach-ai-visibility-benchmark",
    changeFrequency: "monthly" as const,
    priority: 0.85,
  },
] as const;
