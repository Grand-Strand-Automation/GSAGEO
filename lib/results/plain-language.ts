import type { StructuredFinding } from "@/lib/audit/report-builder";
import type { GeoFixPreview } from "@/lib/types/database";
import type { ScoreCategory } from "./report-view-model";
import { scoreTone } from "./score-utils";

const JARGON_REPLACEMENTS: [RegExp, string][] = [
  [/\bGEO\b/gi, "online visibility"],
  [/\bAI visibility\b/gi, "how clearly your business shows up online"],
  [/\bAI systems?\b/gi, "search tools"],
  [/\banswer[- ]engine\b/gi, "search and question tools"],
  [/\bentity clarity\b/gi, "clear business information"],
  [/\bentity schema\b/gi, "structured business details"],
  [/\bstructured data\b/gi, "clear business information"],
  [/\bschema markup\b/gi, "clear business details on the site"],
  [/\bJSON-LD\b/gi, "business details"],
  [/\bcrawlability\b/gi, "how easy your site is to read"],
  [/\bcrawl(er|ing)?\b/gi, "review"],
  [/\bsitemap\b/gi, "site page list"],
  [/\brobots\.txt\b/gi, "site access instructions"],
  [/\binternal linking\b/gi, "links between your pages"],
  [/\binternal structure\b/gi, "how your pages connect"],
  [/\bsemantic\b/gi, "clear"],
  [/\bindexing signals?\b/gi, "how search tools understand your site"],
  [/\bcontent architecture\b/gi, "how your pages are organized"],
  [/\bconversion readiness\b/gi, "how easy it is for visitors to take the next step"],
  [/\bNAP data\b/gi, "name, address, and phone details"],
  [/\bserver-rendered\b/gi, "visible on first load"],
  [/\bclient-rendered\b/gi, "loaded after the page opens"],
  [/\bmeta description\b/gi, "short page summary"],
  [/\btitle tag\b/gi, "page title"],
  [/\bFAQ schema\b/gi, "FAQ details on the page"],
  [/\bOrganization schema\b/gi, "business details on the page"],
  [/\bService schema\b/gi, "service details on the page"],
  [/\bvanity metrics?\b/gi, "surface-level scores"],
  [/\bvisibility readiness score\b/gi, "overall website clarity"],
  [/\breadiness score\b/gi, "overall clarity"],
];

const FINDING_LABELS: Record<string, string> = {
  "FAQ content": "Customer questions are answered on the site",
  "FAQ schema": "FAQ details are easy for search tools to read",
  "Process / methodology page": "How you work is explained clearly",
  "Case studies / proof content": "Proof that you deliver results",
  "Contact page": "A clear way to contact you",
  "About / company page": "Background about your business",
  "Dedicated service pages": "Individual pages for your main services",
  "Conversion / offer page": "A clear next step for visitors",
  "Educational resources": "Helpful guides or tips for customers",
  "robots.txt": "Basic site setup for search tools",
  "sitemap.xml": "A complete list of your important pages",
  "Organization / entity schema": "Clear business details on the site",
  "Service / offer schema": "Clear service details on the site",
  "Server-rendered content signals": "Key information shows up right away",
};

const STRENGTH_TITLES: Record<string, string> = {
  "FAQ content detected": "You already answer common customer questions",
  "Process page identified": "You explain how you work",
  "Proof or case-study content detected": "You show real results or proof",
  "Contact page present": "Visitors can easily reach you",
  "About page present": "You introduce your business clearly",
  "Dedicated service pages detected": "Your main services have their own pages",
  "Educational content detected": "You offer helpful supporting content",
  "Conversion or offer page detected": "You guide visitors toward a next step",
  "robots.txt is accessible": "Your site is set up for search tools to review it",
  "XML sitemap discovered": "Your important pages are listed for review",
  "Entity schema detected": "Your business details are clearly presented",
  "Homepage title tag present": "Your homepage introduces itself clearly",
};

const CUSTOMER_SCORE_GROUPS: {
  key: string;
  label: string;
  sourceKeys: string[];
}[] = [
  {
    key: "website_clarity",
    label: "Website clarity",
    sourceKeys: ["crawlability", "technicalReadiness", "internalStructure"],
  },
  {
    key: "service_pages",
    label: "Service page quality",
    sourceKeys: ["servicePageDepth"],
  },
  {
    key: "trust",
    label: "Trust and credibility",
    sourceKeys: ["trustContent"],
  },
  {
    key: "cta",
    label: "Calls to action",
    sourceKeys: ["conversionReadiness"],
  },
  {
    key: "business_info",
    label: "Business information",
    sourceKeys: ["entityClarity"],
  },
  {
    key: "questions",
    label: "Questions and supporting content",
    sourceKeys: ["answerEngineCoverage"],
  },
];

export type CustomerSimpleStatus = "good" | "needs_attention" | "weak";

export function simplifyText(text: string): string {
  let out = text.trim();
  for (const [pattern, replacement] of JARGON_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1");
}

export function simplifyFindingLabel(label: string): string {
  return simplifyText(FINDING_LABELS[label] ?? label);
}

export function simplifyStrengthTitle(title: string): string {
  return simplifyText(STRENGTH_TITLES[title] ?? title.replace(/\bdetected\b/gi, "in place"));
}

export function simplifyStrengthSummary(summary: string): string {
  const simplified = simplifyText(summary);
  if (simplified.length > 140) {
    return `${simplified.slice(0, 137).trim()}…`;
  }
  return simplified;
}

export function customerStatusFromScore(score: number): CustomerSimpleStatus {
  if (score >= 70) return "good";
  if (score >= 45) return "needs_attention";
  return "weak";
}

export function customerStatusLabel(status: CustomerSimpleStatus): string {
  switch (status) {
    case "good":
      return "Good";
    case "needs_attention":
      return "Needs attention";
    default:
      return "Weak";
  }
}

export function buildCustomerScorecard(categories: ScoreCategory[]) {
  const byKey = Object.fromEntries(categories.map((c) => [c.key, c.score]));

  return CUSTOMER_SCORE_GROUPS.map((group) => {
    const scores = group.sourceKeys.map((key) => byKey[key]).filter((s) => typeof s === "number");
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const status = customerStatusFromScore(avg);
    return {
      key: group.key,
      label: group.label,
      status,
      statusLabel: customerStatusLabel(status),
    };
  });
}

export function buildCustomerHeadline(overallScore: number, improvementCount: number): string {
  if (overallScore >= 78 && improvementCount <= 2) {
    return "Your website is in good shape, with a few areas to strengthen";
  }
  if (overallScore >= 55) {
    return "Your website shows promise, but some important areas need to be clearer";
  }
  return "Your website has a solid start, but several areas need clearer messaging";
}

export function buildCustomerSummary(
  companyName: string,
  overallScore: number,
  strengthCount: number,
  improvementCount: number,
): string {
  const tone = scoreTone(overallScore);
  const strengthLine =
    strengthCount > 0
      ? `Your site already does several things well.`
      : `Your site has a foundation to build on.`;

  const gapLine =
    improvementCount > 0
      ? `We also found ${improvementCount} main area${improvementCount === 1 ? "" : "s"} where clearer messaging could help visitors understand your business faster.`
      : `We did not flag major clarity gaps in this review.`;

  const toneLine =
    tone === "strong" || tone === "good"
      ? `${companyName}'s website comes across as professional, but a few details could be easier to find and understand.`
      : `${companyName}'s website introduces the business, but some pages may not explain your services, trust signals, and next steps clearly enough.`;

  return simplifyText(`${toneLine} ${strengthLine} ${gapLine}`);
}

export function buildWhatThisMayAffect(weakLabels: string[]): string {
  if (weakLabels.length === 0) {
    return simplifyText(
      "Small clarity gaps can make it harder for visitors to quickly decide whether your business is the right fit — and for search tools to confidently recommend you.",
    );
  }

  const focus = weakLabels.slice(0, 2).join(" and ").toLowerCase();
  return simplifyText(
    `Gaps in ${focus} can make it harder for people — and search tools — to quickly understand when your business is the right fit.`,
  );
}

export function simplifyFindingBullet(finding: StructuredFinding): string {
  const label = simplifyFindingLabel(finding.label);
  const summary = simplifyText(finding.summary);
  if (summary.length <= 100) {
    return `${label}: ${summary}`;
  }
  return label;
}

export function simplifyPriority(finding: StructuredFinding) {
  return {
    title: simplifyFindingLabel(finding.label),
    summary: simplifyText(finding.summary),
    whyItMatters: simplifyText(
      finding.impact === "high"
        ? "This affects how quickly visitors understand whether you are a good fit."
        : "This can make your site feel less complete or harder to trust at a glance.",
    ),
    whatToDoNext: simplifyText(finding.recommendation),
  };
}

export function simplifyFixPreview(preview: GeoFixPreview) {
  const typeSuggestions: Record<string, string> = {
    faq: "Add a short FAQ section that answers the questions customers ask most often.",
    service_page: "Strengthen a key service page with who it is for, what is included, and the next step.",
    cta: "Make the next step on your site more obvious — call, book, or request help.",
    internal_linking: "Connect related pages so visitors can move naturally from services to proof and contact.",
    schema: "Make your business name, services, and contact details easier to find and understand.",
    trust: "Add trust-building details such as reviews, credentials, or real examples of your work.",
    messaging: "Tighten the wording on key pages so your value is clear in plain language.",
  };

  return {
    title: simplifyText(preview.title),
    suggestion:
      typeSuggestions[preview.type] ??
      simplifyText(preview.issue_summary || preview.title),
    explanation: simplifyText(
      preview.why_it_matters ||
        "This kind of update helps visitors understand your business faster.",
    ),
  };
}

export function buildNextBestStep(
  topPriorityTitle: string | null,
  suggestedTier: string | null,
): string {
  if (topPriorityTitle) {
    return simplifyText(
      `Start with "${topPriorityTitle}" — then strengthen the supporting pages and trust content around it.`,
    );
  }
  if (suggestedTier) {
    return simplifyText(
      `Pick one high-impact page to improve first, then build supporting content around it.`,
    );
  }
  return simplifyText(
    "Pick your most important service page and make the offer, proof, and next step clearer on that page first.",
  );
}

export function overallStatusLabel(score: number): string {
  const tone = scoreTone(score);
  switch (tone) {
    case "strong":
      return "Strong overall";
    case "good":
      return "Good foundation";
    case "moderate":
      return "Room to improve";
    case "attention":
      return "Needs attention";
    default:
      return "Needs focused work";
  }
}
