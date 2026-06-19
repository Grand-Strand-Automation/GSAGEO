import { buildContentAssetFindings } from "./asset-detection";
import {
  checkHomepageAvailability,
  fetchRobotsTxt,
  fetchSitemapUrls,
  fetchWithTimeout,
  normalizeAuditUrl,
} from "./crawl-checks";
import { extractEntityInfo, extractHtmlData } from "./content-extraction";
import { isJsAppShell } from "./js-shell";
import { classifyDiscoveredUrl } from "./route-classifier";
import { detectSchemaFindings } from "./schema-detection";
import type { AssetFinding, ClassifiedUrl, DiscoveryResult, TechnicalFindings } from "./types";
import { AUDIT_VERSION } from "./types";
import { dedupeUrls, getOrigin, resolveInternalUrl } from "./url-utils";

const SAMPLE_FETCH_LIMIT = 6;

function technicalFinding(
  ok: boolean,
  reasonPresent: string,
  reasonMissing: string,
  evidence_urls: string[],
  discoveryComplete: boolean,
): AssetFinding {
  if (ok) {
    return {
      status: "present",
      confidence: "high",
      reason: reasonPresent,
      evidence_urls,
      depth: "strong",
    };
  }
  return {
    status: discoveryComplete ? "absent" : "not_confirmed",
    confidence: discoveryComplete ? "high" : "low",
    reason: reasonMissing,
    evidence_urls,
    depth: "limited",
  };
}

async function samplePages(urls: string[]): Promise<Map<string, string>> {
  const samples = new Map<string, string>();
  for (const url of urls.slice(0, SAMPLE_FETCH_LIMIT)) {
    const resp = await fetchWithTimeout(url);
    if (resp.ok && resp.html) samples.set(url, resp.html);
  }
  return samples;
}

export async function runDiscovery(baseUrlRaw: string, companyName: string): Promise<DiscoveryResult> {
  const baseUrl = normalizeAuditUrl(baseUrlRaw);
  const origin = getOrigin(baseUrl);

  const [homepageResult, robotsResult] = await Promise.all([
    checkHomepageAvailability(baseUrl),
    fetchRobotsTxt(baseUrl),
  ]);

  const sitemapResult = await fetchSitemapUrls(baseUrl, robotsResult.sitemapUrls);
  const homepageHtml = homepageResult.html;
  const htmlData = extractHtmlData(homepageHtml);
  const homepageIsJsShell = isJsAppShell(homepageHtml);

  const linkUrls = htmlData.allLinks
    .map((href) => resolveInternalUrl(href, baseUrl))
    .filter((u): u is string => Boolean(u));

  const allUrls = dedupeUrls([origin, ...sitemapResult.urls, ...linkUrls], baseUrl);

  const classified: ClassifiedUrl[] = allUrls.map((url) => {
    const source: ClassifiedUrl["source"] = sitemapResult.urls.includes(url)
      ? "sitemap"
      : "homepage_link";
    return classifyDiscoveredUrl(url, source);
  });

  const prioritySampleUrls = [
    ...classified.filter((c) => c.bucket !== "other" && c.bucket !== "homepage").map((c) => c.url),
  ];
  const pageSamples = await samplePages(dedupeUrls(prioritySampleUrls, baseUrl));

  const schema = detectSchemaFindings(homepageHtml, baseUrl);
  const discoveryComplete = true;

  const technical: TechnicalFindings = {
    robots_txt: technicalFinding(
      robotsResult.ok,
      "robots.txt returned successfully and was parsed",
      "robots.txt was not found or could not be parsed",
      [robotsResult.url],
      discoveryComplete,
    ),
    sitemap_xml: technicalFinding(
      sitemapResult.sitemapOk,
      `Sitemap discovered with ${sitemapResult.urlCount} URLs`,
      "No accessible sitemap.xml was found",
      sitemapResult.sitemapEvidenceUrls.length
        ? sitemapResult.sitemapEvidenceUrls
        : [`${origin}/sitemap.xml`],
      discoveryComplete,
    ),
    sitemap_url_count: sitemapResult.urlCount,
    canonical: htmlData.canonical
      ? {
          status: "present",
          confidence: "high",
          reason: "Canonical tag detected on homepage",
          evidence_urls: [htmlData.canonical.startsWith("http") ? htmlData.canonical : `${origin}${htmlData.canonical}`],
          depth: "strong",
        }
      : {
          status: "not_confirmed",
          confidence: "medium",
          reason: homepageIsJsShell
            ? "Canonical not found in homepage head; may exist on rendered routes"
            : "No canonical tag detected on homepage",
          evidence_urls: [baseUrl],
          depth: "weak",
        },
    js_shell_detected: homepageIsJsShell,
  };

  const assets = buildContentAssetFindings({
    classified,
    homepageHtml,
    pageSamples,
    discoveryComplete,
    jsShell: homepageIsJsShell,
    faqSchemaPresent: schema.faq_schema.status === "present",
  });

  const entityInfoRaw = extractEntityInfo(homepageHtml, companyName);

  return {
    baseUrl,
    auditedAt: new Date().toISOString(),
    auditVersion: AUDIT_VERSION,
    httpStatus: homepageResult.status,
    discoveryComplete,
    sitemapUrls: sitemapResult.urls,
    classifiedUrls: classified,
    homepageHtml,
    homepageIsJsShell,
    technical,
    schema,
    assets,
    htmlMeta: {
      title: htmlData.title,
      metaDesc: htmlData.metaDesc,
      canonical: htmlData.canonical,
      h1: htmlData.h1,
      ogTitle: htmlData.ogTitle,
    },
    entityInfo: {
      businessNameInHtml: entityInfoRaw.businessNameInHtml,
      phoneCount: entityInfoRaw.phoneCount,
      emailCount: entityInfoRaw.emailCount,
      hasAddress: entityInfoRaw.hasAddress,
      hasContactInfo: entityInfoRaw.hasContactInfo,
    },
  };
}

/** Pure discovery for tests — no network. */
export function runDiscoveryFromFixtures(input: {
  baseUrl: string;
  companyName: string;
  homepageHtml: string;
  httpStatus?: number;
  sitemapUrls: string[];
  robotsOk?: boolean;
  robotsUrl?: string;
  sitemapEvidenceUrls?: string[];
  pageSamples?: Record<string, string>;
}): DiscoveryResult {
  const baseUrl = normalizeAuditUrl(input.baseUrl);
  const origin = getOrigin(baseUrl);
  const homepageHtml = input.homepageHtml;
  const htmlData = extractHtmlData(homepageHtml);
  const homepageIsJsShell = isJsAppShell(homepageHtml);

  const linkUrls = htmlData.allLinks
    .map((href) => resolveInternalUrl(href, baseUrl))
    .filter((u): u is string => Boolean(u));

  const allUrls = dedupeUrls([origin, ...input.sitemapUrls, ...linkUrls], baseUrl);
  const classified = allUrls.map((url) =>
    classifyDiscoveredUrl(url, input.sitemapUrls.includes(url) ? "sitemap" : "homepage_link"),
  );

  const pageSamples = new Map(Object.entries(input.pageSamples ?? {}));
  const schema = detectSchemaFindings(homepageHtml, baseUrl);
  const discoveryComplete = true;

  const technical: TechnicalFindings = {
    robots_txt: technicalFinding(
      input.robotsOk ?? true,
      "robots.txt returned successfully and was parsed",
      "robots.txt was not found or could not be parsed",
      [input.robotsUrl ?? `${origin}/robots.txt`],
      discoveryComplete,
    ),
    sitemap_xml: technicalFinding(
      input.sitemapUrls.length > 0,
      `Sitemap discovered with ${input.sitemapUrls.length} URLs`,
      "No accessible sitemap.xml was found",
      input.sitemapEvidenceUrls ?? [`${origin}/sitemap.xml`],
      discoveryComplete,
    ),
    sitemap_url_count: input.sitemapUrls.length,
    canonical: htmlData.canonical
      ? {
          status: "present",
          confidence: "high",
          reason: "Canonical tag detected on homepage",
          evidence_urls: [htmlData.canonical],
          depth: "strong",
        }
      : {
          status: "not_confirmed",
          confidence: "medium",
          reason: "No canonical tag detected on homepage",
          evidence_urls: [baseUrl],
          depth: "weak",
        },
    js_shell_detected: homepageIsJsShell,
  };

  const assets = buildContentAssetFindings({
    classified,
    homepageHtml,
    pageSamples,
    discoveryComplete,
    jsShell: homepageIsJsShell,
    faqSchemaPresent: schema.faq_schema.status === "present",
  });

  const entityInfoRaw = extractEntityInfo(homepageHtml, input.companyName);

  return {
    baseUrl,
    auditedAt: new Date().toISOString(),
    auditVersion: AUDIT_VERSION,
    httpStatus: input.httpStatus ?? 200,
    discoveryComplete,
    sitemapUrls: input.sitemapUrls,
    classifiedUrls: classified,
    homepageHtml,
    homepageIsJsShell,
    technical,
    schema,
    assets,
    htmlMeta: {
      title: htmlData.title,
      metaDesc: htmlData.metaDesc,
      canonical: htmlData.canonical,
      h1: htmlData.h1,
      ogTitle: htmlData.ogTitle,
    },
    entityInfo: {
      businessNameInHtml: entityInfoRaw.businessNameInHtml,
      phoneCount: entityInfoRaw.phoneCount,
      emailCount: entityInfoRaw.emailCount,
      hasAddress: entityInfoRaw.hasAddress,
      hasContactInfo: entityInfoRaw.hasContactInfo,
    },
  };
}
