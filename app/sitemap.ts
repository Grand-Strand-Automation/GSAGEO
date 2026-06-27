import type { MetadataRoute } from "next";
import { getSiteUrl, PUBLIC_INDEX_ROUTES } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_INDEX_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
