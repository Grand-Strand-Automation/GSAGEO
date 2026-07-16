/** Canonical production URL — override with NEXT_PUBLIC_APP_URL in Vercel. */
export const DEFAULT_SITE_URL = "https://geo.gsally.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_SITE_URL;
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
  { path: "/start", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/audit", changeFrequency: "monthly" as const, priority: 0.75 },
  {
    path: "/myrtle-beach-ai-visibility-benchmark",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
] as const;
