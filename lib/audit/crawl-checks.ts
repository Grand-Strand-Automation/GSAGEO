import { dedupeUrls, getOrigin, normalizePath, normalizeUrl, pathFromUrl } from "./url-utils";
import { AUDIT_VERSION } from "./types";

export { AUDIT_VERSION };
export const AUDIT_TIMEOUT_MS = 10_000;

export function normalizeAuditUrl(raw: string): string {
  return normalizeUrl(raw);
}

export async function fetchWithTimeout(
  url: string,
): Promise<{ ok: boolean; status: number; html: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUDIT_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GrandStrandAlly-GEOAudit/2.0 (+https://geo.gsally.com)",
        Accept: "text/html,application/xhtml+xml,application/xml,text/xml,*/*",
      },
      redirect: "follow",
    });
    const html = await resp.text();
    return { ok: resp.ok, status: resp.status, html: html.slice(0, 500_000) };
  } catch {
    return { ok: false, status: 0, html: "" };
  } finally {
    clearTimeout(timer);
  }
}

export function parseRobotsTxt(content: string, baseUrl: string): {
  sitemapUrls: string[];
  present: boolean;
} {
  const origin = getOrigin(baseUrl);
  const sitemapUrls: string[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*sitemap:\s*(.+)\s*$/i);
    if (match?.[1]) {
      try {
        sitemapUrls.push(new URL(match[1].trim(), origin).href.replace(/\/+$/, "") || match[1].trim());
      } catch {
        sitemapUrls.push(match[1].trim());
      }
    }
  }
  return { sitemapUrls, present: content.trim().length > 0 };
}

export function parseSitemapXml(xml: string, baseUrl: string): {
  urls: string[];
  childSitemaps: string[];
} {
  const origin = getOrigin(baseUrl);
  const urls: string[] = [];
  const childSitemaps: string[] = [];

  for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    const loc = match[1]?.trim();
    if (!loc) continue;
    try {
      const parsed = new URL(loc, origin);
      const href = `${parsed.origin}${normalizePath(parsed.pathname)}`;
      if (/sitemap/i.test(parsed.pathname) && /\.xml/i.test(parsed.pathname)) {
        childSitemaps.push(href);
      } else {
        urls.push(href);
      }
    } catch {
      urls.push(loc);
    }
  }

  return { urls: dedupeUrls(urls, baseUrl), childSitemaps: dedupeUrls(childSitemaps, baseUrl) };
}

export async function fetchSitemapUrls(baseUrl: string, seedSitemaps: string[] = []): Promise<{
  urls: string[];
  sitemapOk: boolean;
  sitemapEvidenceUrls: string[];
  urlCount: number;
}> {
  const origin = getOrigin(baseUrl);
  const defaultSitemap = `${origin}/sitemap.xml`;
  const queue = dedupeUrls([...seedSitemaps, defaultSitemap], baseUrl);
  const visited = new Set<string>();
  const allUrls: string[] = [];
  let anySitemapOk = false;
  const evidence: string[] = [];

  while (queue.length > 0 && visited.size < 8) {
    const sitemapUrl = queue.shift()!;
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);

    const resp = await fetchWithTimeout(sitemapUrl);
    if (!resp.ok || !resp.html.trim()) continue;

    anySitemapOk = true;
    evidence.push(sitemapUrl);

    const parsed = parseSitemapXml(resp.html, baseUrl);
    allUrls.push(...parsed.urls);
    for (const child of parsed.childSitemaps) {
      if (!visited.has(child)) queue.push(child);
    }
  }

  return {
    urls: dedupeUrls(allUrls, baseUrl),
    sitemapOk: anySitemapOk,
    sitemapEvidenceUrls: evidence,
    urlCount: dedupeUrls(allUrls, baseUrl).length,
  };
}

export async function fetchRobotsTxt(baseUrl: string): Promise<{
  ok: boolean;
  content: string;
  sitemapUrls: string[];
  url: string;
}> {
  const url = `${getOrigin(baseUrl)}/robots.txt`;
  const resp = await fetchWithTimeout(url);
  const parsed = parseRobotsTxt(resp.html, baseUrl);
  return {
    ok: resp.ok && parsed.present,
    content: resp.html,
    sitemapUrls: parsed.sitemapUrls,
    url,
  };
}

export async function checkHomepageAvailability(baseUrl: string) {
  return fetchWithTimeout(normalizeUrl(baseUrl));
}

/** @deprecated Use fetchRobotsTxt — kept for compatibility */
export async function checkRobotsTxt(baseUrl: string) {
  const r = await fetchRobotsTxt(baseUrl);
  return r.ok;
}

/** @deprecated Use fetchSitemapUrls */
export async function checkSitemapXml(baseUrl: string) {
  const r = await fetchSitemapUrls(baseUrl);
  return r.sitemapOk;
}

export { pathFromUrl };
