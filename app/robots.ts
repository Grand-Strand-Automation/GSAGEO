import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

const DISALLOW = ["/admin/", "/admin", "/api/", "/results/", "/thank-you"];

/** Explicit allow rules for major AI / search crawlers (in addition to *). */
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "ClaudeBot",
  "anthropic-ai",
] as const;

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
