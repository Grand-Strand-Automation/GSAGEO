export const AUDIT_VERSION = "1.0";
export const AUDIT_TIMEOUT_MS = 10_000;

export function normalizeUrl(raw: string): string {
  const u = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
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
        "User-Agent": "GrandStrandAlly-GEOAudit/1.0 (+https://geo.gsally.com)",
        Accept: "text/html,application/xhtml+xml,*/*",
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

export async function checkUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6_000);
  try {
    const resp = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "GrandStrandAlly-GEOAudit/1.0" },
      redirect: "follow",
    });
    return resp.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Homepage availability check */
export async function checkHomepageAvailability(baseUrl: string) {
  return fetchWithTimeout(baseUrl);
}

/** robots.txt presence check */
export async function checkRobotsTxt(baseUrl: string) {
  return checkUrl(`${baseUrl}/robots.txt`);
}

/** sitemap.xml presence check */
export async function checkSitemapXml(baseUrl: string) {
  return checkUrl(`${baseUrl}/sitemap.xml`);
}
