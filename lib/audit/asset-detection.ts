import type { AssetFinding, ClassifiedUrl, ConfidenceLevel, EvidenceStatus, RouteBucket } from "./types";
import { countByBucket, urlsByBucket } from "./route-classifier";

const WEIGHTS = {
  sitemap_route: 5,
  accessible_route: 5,
  page_title: 4,
  heading: 3,
  schema: 4,
  homepage_mention: 1,
} as const;

type EvidenceInput = {
  bucket: RouteBucket;
  classified: ClassifiedUrl[];
  homepageHtml: string;
  pageSamples: Map<string, string>;
  discoveryComplete: boolean;
  jsShell: boolean;
  schemaBonus?: boolean;
  countOverride?: number;
  label: string;
};

function scoreToStatus(score: number, discoveryComplete: boolean): EvidenceStatus {
  if (score >= 8) return "present";
  if (score >= 5) return "likely_present";
  if (score >= 1) return "not_confirmed";
  return discoveryComplete ? "absent" : "not_confirmed";
}

function scoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function extractTitle(html: string): string {
  return html.match(/<title[^>]*>([^<]{1,200})<\/title>/i)?.[1]?.trim().toLowerCase() ?? "";
}

function extractH1(html: string): string {
  return (
    html
      .match(/<h1[^>]*>([\s\S]{1,300}?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim()
      .toLowerCase() ?? ""
  );
}

function titleConfirmsBucket(bucket: RouteBucket, title: string, h1: string): boolean {
  const hay = `${title} ${h1}`;
  switch (bucket) {
    case "faq":
      return /faq|frequently asked|common questions/.test(hay);
    case "process":
      return /process|how it works|methodology|approach/.test(hay);
    case "case_studies":
      return /case stud|client result|success stor|proof|outcome/.test(hay);
    case "contact":
      return /contact|get in touch|reach us/.test(hay);
    case "about":
      return /about|who we are|our story|company/.test(hay);
    case "conversion_page":
      return /cost analysis|free analysis|audit|calculator|consultation|get started/.test(hay);
    case "educational_resource":
      return /guide|checklist|how to|how much|what .+ should|learn/.test(hay);
    case "service_page":
      return /service|support|management|solution|offering/.test(hay);
    default:
      return false;
  }
}

export function evaluateAssetEvidence(input: EvidenceInput): AssetFinding {
  const matches = urlsByBucket(input.classified, input.bucket);
  const evidence_urls = matches.map((m) => m.url);
  let score = 0;

  if (matches.some((m) => m.source === "sitemap")) {
    score += WEIGHTS.sitemap_route;
  } else if (matches.length > 0) {
    score += WEIGHTS.homepage_mention;
  }

  for (const match of matches.slice(0, 3)) {
    const sample = input.pageSamples.get(match.url);
    if (sample && sample.length > 200) {
      score += WEIGHTS.accessible_route;
      const title = extractTitle(sample);
      const h1 = extractH1(sample);
      if (titleConfirmsBucket(input.bucket, title, h1)) {
        score += WEIGHTS.page_title + WEIGHTS.heading;
      }
      break;
    }
  }

  if (input.schemaBonus) score += WEIGHTS.schema;

  const lcHome = input.homepageHtml.toLowerCase();
  if (input.bucket === "faq" && /faq|frequently asked questions|common questions/.test(lcHome)) {
    score += WEIGHTS.homepage_mention;
  }

  const status = scoreToStatus(score, input.discoveryComplete);
  const confidence = scoreToConfidence(score);
  const count = input.countOverride ?? matches.length;

  let reason: string;
  if (status === "present" || status === "likely_present") {
    const via = matches.some((m) => m.source === "sitemap") ? "sitemap and route discovery" : "discovered routes";
    reason =
      input.jsShell && matches.some((m) => m.source === "sitemap")
        ? `Dedicated ${input.label} detected via ${via}. Initial HTML is a JS app shell, so route/sitemap evidence was used.`
        : `Dedicated ${input.label} detected via ${via}${count > 1 ? ` (${count} pages)` : ""}.`;
  } else if (status === "not_confirmed") {
    reason = `${input.label} not confirmed after sitemap, link, and sample checks${input.jsShell ? " (site uses client-rendered pages)" : ""}.`;
  } else {
    reason = `No ${input.label} found after completing discovery checks.`;
  }

  const depth: AssetFinding["depth"] =
    score >= 8 ? "strong" : score >= 5 ? "weak" : status === "absent" ? "limited" : "limited";

  return {
    status,
    confidence,
    reason,
    evidence_urls,
    depth,
    count,
  };
}

export function buildContentAssetFindings(params: {
  classified: ClassifiedUrl[];
  homepageHtml: string;
  pageSamples: Map<string, string>;
  discoveryComplete: boolean;
  jsShell: boolean;
  faqSchemaPresent: boolean;
}): import("./types").ContentAssetFindings {
  const base = {
    classified: params.classified,
    homepageHtml: params.homepageHtml,
    pageSamples: params.pageSamples,
    discoveryComplete: params.discoveryComplete,
    jsShell: params.jsShell,
  };

  const serviceMatches = urlsByBucket(params.classified, "service_page");
  const eduMatches = urlsByBucket(params.classified, "educational_resource");

  return {
    faq_content_presence: evaluateAssetEvidence({
      ...base,
      bucket: "faq",
      label: "FAQ content",
      schemaBonus: params.faqSchemaPresent,
    }),
    process_page: evaluateAssetEvidence({ ...base, bucket: "process", label: "process page" }),
    case_studies: evaluateAssetEvidence({ ...base, bucket: "case_studies", label: "case study or proof content" }),
    contact_page: evaluateAssetEvidence({ ...base, bucket: "contact", label: "contact page" }),
    about_page: evaluateAssetEvidence({ ...base, bucket: "about", label: "about page" }),
    service_pages: evaluateAssetEvidence({
      ...base,
      bucket: "service_page",
      label: "service pages",
      countOverride: serviceMatches.length,
    }),
    conversion_page: evaluateAssetEvidence({
      ...base,
      bucket: "conversion_page",
      label: "offer or conversion page",
    }),
    educational_content: evaluateAssetEvidence({
      ...base,
      bucket: "educational_resource",
      label: "educational content",
      countOverride: eduMatches.length,
    }),
  };
}

export function isAssetPresent(finding: AssetFinding): boolean {
  return finding.status === "present" || finding.status === "likely_present";
}

export function countByBucketPresent(classified: ClassifiedUrl[], bucket: RouteBucket): number {
  return countByBucket(classified, bucket);
}
