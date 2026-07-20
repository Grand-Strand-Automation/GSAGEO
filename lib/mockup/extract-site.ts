import { extractHtmlData } from "@/lib/audit/content-extraction";
import { fetchWithTimeout, normalizeAuditUrl } from "@/lib/audit/crawl-checks";
import { getOrigin } from "@/lib/audit/url-utils";

export type FetchQuality = "strong" | "limited" | "failed";

export type ExtractedService = {
  title: string;
  desc: string;
};

export type SiteSignals = {
  fetched: boolean;
  fetchQuality: FetchQuality;
  /** Set when the page is a bot/Cloudflare challenge instead of real content */
  blockedReason: string | null;
  title: string;
  h1: string;
  heroParagraph: string;
  metaDesc: string;
  ogTitle: string;
  phone: string | null;
  email: string | null;
  locationHint: string | null;
  navItems: string[];
  services: ExtractedService[];
  /** @deprecated prefer services[].title — kept for backward compatibility */
  serviceHints: string[];
  ctaHints: string[];
  logoUrl: string | null;
  themeColor: string | null;
  brandCandidates: string[];
};

/** Detect Cloudflare / bot-challenge interstitial HTML */
export function isChallengePage(html: string): boolean {
  const sample = html.slice(0, 50_000).toLowerCase();
  return (
    /performing security verification/i.test(sample) ||
    /checking your browser before accessing/i.test(sample) ||
    /just a moment\.\.\./i.test(sample) ||
    /cf-browser-verification/i.test(sample) ||
    /cf-challenge/i.test(sample) ||
    /challenge-platform/i.test(sample) ||
    /cdn-cgi\/challenge/i.test(sample) ||
    (/attention required/i.test(sample) && /cloudflare/i.test(sample)) ||
    (/enable javascript and cookies/i.test(sample) && /cloudflare/i.test(sample))
  );
}

const BLOCKED_REASON =
  "Site blocked automated access (security / bot protection). Concept will use your business details instead.";

export function hasUsableSiteContent(signals: SiteSignals): boolean {
  if (signals.blockedReason) return false;
  if (!signals.fetched) return false;
  return Boolean(
    (signals.h1 && signals.h1.length >= 8) ||
      signals.services.length > 0 ||
      (signals.metaDesc && signals.metaDesc.length > 40) ||
      (signals.heroParagraph && signals.heroParagraph.length > 40),
  );
}

export function withBlockedReason(
  signals: SiteSignals,
  reason: string = BLOCKED_REASON,
): SiteSignals {
  return {
    ...emptySiteSignals(),
    blockedReason: reason,
    phone: signals.phone,
    email: signals.email,
    locationHint: signals.locationHint,
    brandCandidates: signals.brandCandidates,
  };
}

function stripTags(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function absoluteUrl(href: string, baseUrl: string): string | null {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return null;
  }
}

function extractPhone(html: string): string | null {
  const match = html.match(
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  );
  return match?.[0]?.trim() ?? null;
}

function extractEmail(html: string): string | null {
  const match = html.match(
    /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/,
  );
  if (!match?.[1]) return null;
  const email = match[1].toLowerCase();
  if (/example\.com|sentry\.|wixpress|cloudflare|schema\.org/.test(email)) return null;
  return email;
}

function extractLocationHint(html: string): string | null {
  const text = stripTags(html).slice(0, 8000);
  const patterns = [
    /\b(?:serving|based in|located in|proudly serving)\s+([A-Z][a-zA-Z\s]{2,40}(?:,\s*[A-Z]{2})?)/,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s*[A-Z]{2})\b/,
    /\b(Myrtle Beach|Grand Strand|North Myrtle|Conway|Surfside|Murrells Inlet|Pawleys Island|Georgetown)(?:[,\s]+SC)?\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const hint = match[1].trim();
      if (hint.length >= 4 && hint.length <= 60) return hint;
    }
  }
  return null;
}

function extractThemeColor(html: string): string | null {
  const meta =
    html.match(
      /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i,
    )?.[1];
  if (meta && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(meta.trim())) {
    return meta.trim();
  }

  const ms =
    html.match(
      /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i,
    )?.[1];
  if (ms && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(ms.trim())) {
    return ms.trim();
  }

  return null;
}

function extractLogoUrl(html: string, baseUrl: string): string | null {
  const ogImage =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    )?.[1];
  if (ogImage) {
    const abs = absoluteUrl(decodeEntities(ogImage.trim()), baseUrl);
    if (abs) return abs;
  }

  const apple =
    html.match(
      /<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon[^"']*["']/i,
    )?.[1];
  if (apple) {
    const abs = absoluteUrl(decodeEntities(apple.trim()), baseUrl);
    if (abs) return abs;
  }

  const logoImg = [
    ...html.matchAll(
      /<img[^>]+(?:class|id|alt)=["'][^"']*(?:logo|brand|site-logo)[^"']*["'][^>]*>/gi,
    ),
  ];
  for (const match of logoImg) {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1];
    if (src && !src.startsWith("data:")) {
      const abs = absoluteUrl(decodeEntities(src.trim()), baseUrl);
      if (abs) return abs;
    }
  }

  return null;
}

function extractNavItems(html: string): string[] {
  const navBlocks = [
    ...html.matchAll(/<nav[\s\S]{0,12000}?<\/nav>/gi),
    ...html.matchAll(
      /<(?:header|div)[^>]*(?:class|id)=["'][^"']*(?:nav|menu|header)[^"']*["'][^>]*>[\s\S]{0,8000}?<\/(?:header|div)>/gi,
    ),
  ].map((m) => m[0]);

  const source = navBlocks.length ? navBlocks.join("\n") : html.slice(0, 20000);
  const labels = [...source.matchAll(/<a[^>]*>([\s\S]{1,60}?)<\/a>/gi)]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((t) => t.length >= 2 && t.length <= 28)
    .filter((t) => !/^https?:/i.test(t))
    .filter(
      (t) =>
        !/^(home|logo|skip|menu|close|search|cart|login|sign\s*in)$/i.test(t),
    );

  const unique: string[] = [];
  for (const label of labels) {
    if (!unique.some((u) => u.toLowerCase() === label.toLowerCase())) {
      unique.push(label);
    }
    if (unique.length >= 6) break;
  }
  return unique;
}

function extractCtaHints(html: string): string[] {
  const texts = [
    ...html.matchAll(/<(?:a|button)[^>]*>([\s\S]{2,60}?)<\/(?:a|button)>/gi),
  ]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((t) => t.length >= 2 && t.length <= 42)
    .filter((t) =>
      /call|quote|contact|book|schedule|get started|request|free estimate|free quote|get a|learn more|appointment|consult|estimate/i.test(
        t,
      ),
    )
    // Drop bare nav labels that are weak CTAs
    .filter((t) => !/^(contact|about|services|home|menu|blog)$/i.test(t));

  const score = (t: string): number => {
    let s = 0;
    if (/request|get started|book|schedule|free quote|free estimate|call us|get a/i.test(t)) s += 5;
    if (/quote|estimate|appointment|consult/i.test(t)) s += 3;
    if (/call|contact/i.test(t)) s += 1;
    if (t.split(/\s+/).length >= 2) s += 2;
    return s;
  };

  const unique: string[] = [];
  const ranked = [...texts].sort((a, b) => score(b) - score(a) || b.length - a.length);
  for (const t of ranked) {
    if (!unique.some((u) => u.toLowerCase() === t.toLowerCase())) unique.push(t);
    if (unique.length >= 5) break;
  }
  return unique;
}

function extractHeroParagraph(html: string, h1: string): string {
  // Prefer first substantial paragraph after h1
  if (h1) {
    const h1Index = html.search(/<h1[^>]*>/i);
    if (h1Index >= 0) {
      const after = html.slice(h1Index, h1Index + 6000);
      const paragraphs = [...after.matchAll(/<p[^>]*>([\s\S]{20,400}?)<\/p>/gi)]
        .map((m) => stripTags(m[1] ?? ""))
        .filter((t) => t.length >= 40 && t.length <= 280)
        .filter((t) => !/cookie|privacy|subscribe|newsletter/i.test(t));
      if (paragraphs[0]) return paragraphs[0];
    }
  }

  const firstPs = [...html.matchAll(/<p[^>]*>([\s\S]{40,400}?)<\/p>/gi)]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((t) => t.length >= 40 && t.length <= 280)
    .filter((t) => !/cookie|privacy|subscribe|newsletter|copyright/i.test(t));
  return firstPs[0] ?? "";
}

function extractServices(html: string): ExtractedService[] {
  const services: ExtractedService[] = [];
  const headingRe = /<(h[2-3])[^>]*>([\s\S]{2,100}?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null && services.length < 6) {
    const title = stripTags(match[2] ?? "");
    if (title.length < 3 || title.length > 56) continue;
    if (
      /welcome|home|about us|about|contact|blog|menu|faq|testimonials?|reviews?|our team|meet the|gallery|news|resources/i.test(
        title,
      )
    ) {
      continue;
    }

    const after = html.slice(match.index + match[0].length, match.index + match[0].length + 900);
    const nextP = after.match(/<p[^>]*>([\s\S]{15,320}?)<\/p>/i);
    let desc = nextP ? stripTags(nextP[1] ?? "") : "";
    if (desc.length < 20) {
      const nextLi = after.match(/<li[^>]*>([\s\S]{10,200}?)<\/li>/i);
      desc = nextLi ? stripTags(nextLi[1] ?? "") : "";
    }
    if (desc.length < 20) {
      desc = "Presented more clearly so visitors understand the value right away.";
    } else if (desc.length > 160) {
      desc = `${desc.slice(0, 157)}…`;
    }

    if (services.some((s) => s.title.toLowerCase() === title.toLowerCase())) continue;
    services.push({ title, desc });
  }

  return services.slice(0, 4);
}

function extractBrandCandidates(
  html: string,
  title: string,
  ogTitle: string,
  h1: string,
): string[] {
  const candidates: string[] = [];
  const logoAlt =
    html.match(
      /<img[^>]+(?:class|id)=["'][^"']*logo[^"']*["'][^>]*alt=["']([^"']{2,80})["']/i,
    )?.[1] ??
    html.match(
      /<img[^>]+alt=["']([^"']{2,80})["'][^>]*(?:class|id)=["'][^"']*logo[^"']*["']/i,
    )?.[1];

  for (const raw of [logoAlt, ogTitle, title.split(/[|\-–—]/)[0], h1]) {
    const cleaned = stripTags(raw ?? "").trim();
    if (cleaned.length >= 2 && cleaned.length <= 60) {
      if (!candidates.some((c) => c.toLowerCase() === cleaned.toLowerCase())) {
        candidates.push(cleaned);
      }
    }
  }
  return candidates.slice(0, 4);
}

function scoreFetchQuality(signals: Omit<SiteSignals, "fetchQuality" | "fetched" | "blockedReason">): FetchQuality {
  let score = 0;
  if (signals.h1) score += 2;
  if (signals.metaDesc.length > 40 || signals.heroParagraph.length > 40) score += 2;
  if (signals.services.length >= 2) score += 2;
  if (signals.ctaHints.length >= 1) score += 1;
  if (signals.navItems.length >= 2) score += 1;
  if (signals.phone || signals.email) score += 1;
  if (score >= 5) return "strong";
  if (score >= 2) return "limited";
  return "failed";
}

export function parseHomepageHtml(html: string, baseUrl: string): SiteSignals {
  if (isChallengePage(html)) {
    return {
      ...emptySiteSignals(),
      fetched: false,
      fetchQuality: "failed",
      blockedReason: BLOCKED_REASON,
    };
  }

  const data = extractHtmlData(html);
  const title = stripTags(data.title);
  const h1 = stripTags(data.h1);
  const metaDesc = stripTags(data.metaDesc);
  const ogTitle = stripTags(data.ogTitle);
  const services = extractServices(html);
  const base: Omit<SiteSignals, "fetchQuality" | "fetched" | "blockedReason"> = {
    title,
    h1,
    heroParagraph: extractHeroParagraph(html, h1),
    metaDesc,
    ogTitle,
    phone: extractPhone(html),
    email: extractEmail(html),
    locationHint: extractLocationHint(html),
    navItems: extractNavItems(html),
    services,
    serviceHints: services.map((s) => s.title),
    ctaHints: extractCtaHints(html),
    logoUrl: extractLogoUrl(html, baseUrl),
    themeColor: extractThemeColor(html),
    brandCandidates: extractBrandCandidates(html, title, ogTitle, h1),
  };

  const fetchQuality = scoreFetchQuality(base);
  return {
    fetched: true,
    fetchQuality: fetchQuality === "failed" ? "limited" : fetchQuality,
    blockedReason: null,
    ...base,
  };
}

export function emptySiteSignals(): SiteSignals {
  return {
    fetched: false,
    fetchQuality: "failed",
    blockedReason: null,
    title: "",
    h1: "",
    heroParagraph: "",
    metaDesc: "",
    ogTitle: "",
    phone: null,
    email: null,
    locationHint: null,
    navItems: [],
    services: [],
    serviceHints: [],
    ctaHints: [],
    logoUrl: null,
    themeColor: null,
    brandCandidates: [],
  };
}

export async function extractSiteSignals(websiteUrl: string): Promise<SiteSignals> {
  const url = normalizeAuditUrl(websiteUrl);
  const result = await fetchWithTimeout(url);
  if (!result.ok || !result.html || result.html.length < 80) {
    return emptySiteSignals();
  }

  if (isChallengePage(result.html)) {
    return {
      ...emptySiteSignals(),
      blockedReason: BLOCKED_REASON,
    };
  }

  // JS shells with almost no text content → limited
  const signals = parseHomepageHtml(result.html, getOrigin(url) || url);
  const textLen = stripTags(result.html).length;
  if (textLen < 200 && signals.services.length === 0 && !signals.h1) {
    return { ...signals, fetchQuality: "limited" };
  }
  return signals;
}
