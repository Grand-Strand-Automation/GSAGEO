import type { ClassifiedUrl, RouteBucket } from "./types";
import { normalizePath, pathFromUrl } from "./url-utils";

const SLUG_RULES: { bucket: RouteBucket; patterns: RegExp[] }[] = [
  { bucket: "faq", patterns: [/\/faq\b/i, /\/faqs\b/i, /frequently-asked/i, /common-questions/i] },
  {
    bucket: "process",
    patterns: [/\/process\b/i, /how-it-works/i, /our-process/i, /methodology/i, /\/approach\b/i],
  },
  {
    bucket: "case_studies",
    patterns: [
      /case-stud/i,
      /success-stor/i,
      /client-results/i,
      /client-stor/i,
      /\/results\b/i,
      /\/testimonial/i,
      /\/portfolio\b/i,
    ],
  },
  { bucket: "contact", patterns: [/\/contact\b/i, /contact-us/i, /get-in-touch/i] },
  { bucket: "about", patterns: [/\/about\b/i, /about-us/i, /who-we-are/i] },
  {
    bucket: "conversion_page",
    patterns: [
      /free-it-cost-analysis/i,
      /cost-analysis/i,
      /free-audit/i,
      /geo-audit/i,
      /consultation/i,
      /calculator/i,
      /get-started/i,
      /request-a/i,
    ],
  },
  {
    bucket: "educational_resource",
    patterns: [
      /\/edu\//i,
      /\/guide/i,
      /\/learn\b/i,
      /checklist/i,
      /how-much/i,
      /how-to/i,
      /what-an/i,
      /should-include/i,
      /overlapping/i,
      /offboarding/i,
      /blog\b/i,
      /article/i,
      /resource/i,
    ],
  },
  { bucket: "legal", patterns: [/\/privacy/i, /\/terms/i, /\/legal/i] },
  {
    bucket: "service_page",
    patterns: [
      /\/services?\b/i,
      /\/solution/i,
      /-support/i,
      /-management/i,
      /-recovery/i,
      /-compliance/i,
      /-automation/i,
      /microsoft-365/i,
      /managed-it/i,
      /cybersecurity/i,
      /backup-recovery/i,
      /network-wifi/i,
      /onboarding-offboarding/i,
      /it-cost-analysis/i,
      /workflow-automation/i,
    ],
  },
];

export function classifyPath(path: string, title?: string): RouteBucket {
  const p = normalizePath(path);
  if (p === "/" || p === "") return "homepage";

  const haystack = `${p} ${(title ?? "").toLowerCase()}`;
  for (const rule of SLUG_RULES) {
    if (rule.patterns.some((re) => re.test(p) || re.test(haystack))) {
      return rule.bucket;
    }
  }
  return "other";
}

export function classifyDiscoveredUrl(
  url: string,
  source: ClassifiedUrl["source"],
  title?: string,
): ClassifiedUrl {
  const path = pathFromUrl(url);
  return {
    url,
    path,
    bucket: classifyPath(path, title),
    source,
    title,
  };
}

export function urlsByBucket(classified: ClassifiedUrl[], bucket: RouteBucket): ClassifiedUrl[] {
  return classified.filter((c) => c.bucket === bucket);
}

export function countByBucket(classified: ClassifiedUrl[], bucket: RouteBucket): number {
  return urlsByBucket(classified, bucket).length;
}
