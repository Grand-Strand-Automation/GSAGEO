import { classifyDiscoveredUrl } from "@/lib/audit/route-classifier";
import type { StructuredFinding } from "@/lib/audit/report-builder";
import { pathFromUrl } from "@/lib/audit/url-utils";

export type PageAnalysisItem = {
  url: string;
  path: string;
  pageType: string;
  pageTypeLabel: string;
  summary: string;
  contentDepth: "strong" | "moderate" | "limited" | "unknown";
  ctaStrength: "clear" | "moderate" | "weak" | "unknown";
  trustSignals: "present" | "partial" | "limited" | "unknown";
  linkingQuality: "strong" | "moderate" | "weak" | "unknown";
  relatedFindings: string[];
  recommendedNextStep: string;
};

const PAGE_TYPE_LABELS: Record<string, string> = {
  faq: "FAQ",
  process: "Process",
  case_studies: "Case studies",
  contact: "Contact",
  about: "About",
  service_page: "Service",
  conversion_page: "Conversion",
  educational_resource: "Educational",
  homepage: "Homepage",
  legal: "Legal",
  other: "Page",
};

function pageTypeLabel(bucket: string): string {
  return PAGE_TYPE_LABELS[bucket] ?? "Page";
}

function inferSignals(
  bucket: string,
  findings: StructuredFinding[],
): Pick<
  PageAnalysisItem,
  "contentDepth" | "ctaStrength" | "trustSignals" | "linkingQuality" | "recommendedNextStep"
> {
  const related = findings.filter((f) =>
    f.category === "content" || f.category === "conversion" || f.category === "trust",
  );

  const hasGap = related.some((f) => f.status === "Absent" || f.status === "Not confirmed");

  if (bucket === "homepage") {
    return {
      contentDepth: hasGap ? "moderate" : "strong",
      ctaStrength: hasGap ? "moderate" : "clear",
      trustSignals: "partial",
      linkingQuality: "moderate",
      recommendedNextStep: "Strengthen homepage messaging and links to priority service pages.",
    };
  }

  if (bucket === "faq") {
    return {
      contentDepth: hasGap ? "limited" : "strong",
      ctaStrength: "moderate",
      trustSignals: "present",
      linkingQuality: "moderate",
      recommendedNextStep: "Cross-link FAQs from service pages with descriptive anchor text.",
    };
  }

  if (bucket === "service_page") {
    return {
      contentDepth: hasGap ? "moderate" : "strong",
      ctaStrength: hasGap ? "weak" : "clear",
      trustSignals: "partial",
      linkingQuality: hasGap ? "weak" : "moderate",
      recommendedNextStep: "Add clearer sections: who it is for, problems solved, and next step CTA.",
    };
  }

  if (bucket === "contact" || bucket === "conversion_page") {
    return {
      contentDepth: "moderate",
      ctaStrength: hasGap ? "weak" : "clear",
      trustSignals: "present",
      linkingQuality: "moderate",
      recommendedNextStep: "Make the next step explicit with calm, practical conversion language.",
    };
  }

  if (bucket === "case_studies") {
    return {
      contentDepth: hasGap ? "limited" : "strong",
      ctaStrength: "moderate",
      trustSignals: hasGap ? "limited" : "present",
      linkingQuality: "moderate",
      recommendedNextStep: "Add outcome detail and link proof content from service pages.",
    };
  }

  return {
    contentDepth: "unknown",
    ctaStrength: "unknown",
    trustSignals: "unknown",
    linkingQuality: "unknown",
    recommendedNextStep: "Review page structure and internal links to related offerings.",
  };
}

export function buildPageAnalysis(
  sitemapUrls: string[] | undefined,
  baseUrl: string,
  findings: StructuredFinding[],
): PageAnalysisItem[] {
  const urls = dedupeUrls([baseUrl, ...(sitemapUrls ?? [])]).slice(0, 14);

  return urls.map((url) => {
    const classified = classifyDiscoveredUrl(url, "sitemap");
    const bucket = classified.bucket;
    const path = pathFromUrl(url) || "/";
    const relatedFindings = findings
      .filter((f) =>
        f.evidence_urls.some((e) => e === url || e.includes(path) || url.includes(e)),
      )
      .map((f) => f.label);

    const signals = inferSignals(bucket, findings);
    const summary =
      relatedFindings.length > 0
        ? `Reviewed as part of the assessment. Related findings: ${relatedFindings.slice(0, 2).join(", ")}.`
        : `${pageTypeLabel(bucket)} page identified in sitemap or discovery.`;

    return {
      url,
      path,
      pageType: bucket,
      pageTypeLabel: pageTypeLabel(bucket),
      summary,
      relatedFindings,
      ...signals,
    };
  });
}

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    try {
      const normalized = new URL(url).href;
      if (!seen.has(normalized)) {
        seen.add(normalized);
        out.push(normalized);
      }
    } catch {
      // skip invalid
    }
  }
  return out;
}
