import type { DiscoveryResult } from "./types";
import type { AssetFinding } from "./types";
import { isAssetPresent } from "./asset-detection";
import type { generateRecommendations } from "./scoring";

export type StructuredFinding = {
  label: string;
  category: string;
  status: string;
  confidence: string;
  summary: string;
  reason: string;
  evidence_urls: string[];
  recommendation: string;
  priority: "fix_first" | "improve_next" | "nice_to_add";
  impact: "high" | "medium" | "low";
};

export type StrengthItem = {
  title: string;
  summary: string;
  evidence_urls: string[];
};

function statusLabel(status: AssetFinding["status"]): string {
  switch (status) {
    case "present":
      return "Present";
    case "likely_present":
      return "Likely present";
    case "not_confirmed":
      return "Not confirmed";
    default:
      return "Absent";
  }
}

function findingFromAsset(
  label: string,
  category: string,
  asset: AssetFinding,
  recommendation: string,
  priority: StructuredFinding["priority"],
  impact: StructuredFinding["impact"],
): StructuredFinding {
  return {
    label,
    category,
    status: statusLabel(asset.status),
    confidence: asset.confidence,
    summary: asset.reason,
    reason: asset.reason,
    evidence_urls: asset.evidence_urls,
    recommendation,
    priority,
    impact,
  };
}

export function buildStructuredFindings(discovery: DiscoveryResult): StructuredFinding[] {
  const { assets, schema, technical } = discovery;
  const findings: StructuredFinding[] = [];

  findings.push(
    findingFromAsset(
      "FAQ content",
      "content",
      assets.faq_content_presence,
      isAssetPresent(assets.faq_content_presence)
        ? "Expand FAQ coverage and cross-link from service pages."
        : "Add a dedicated FAQ page with practical questions your buyers ask.",
      isAssetPresent(assets.faq_content_presence) ? "nice_to_add" : "fix_first",
      isAssetPresent(assets.faq_content_presence) ? "low" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "FAQ schema",
      "schema",
      schema.faq_schema,
      "Add FAQPage JSON-LD to help AI systems cite your answers accurately.",
      schema.faq_schema.status === "present" ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "Process / methodology page",
      "content",
      assets.process_page,
      "Document your process in clear steps so AI systems understand how you work.",
      isAssetPresent(assets.process_page) ? "nice_to_add" : "improve_next",
      isAssetPresent(assets.process_page) ? "low" : "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "Case studies / proof content",
      "trust",
      assets.case_studies,
      "Add anonymized outcomes, savings, or before/after summaries.",
      isAssetPresent(assets.case_studies) ? "nice_to_add" : "fix_first",
      isAssetPresent(assets.case_studies) ? "low" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "Contact page",
      "conversion",
      assets.contact_page,
      "Ensure a dedicated contact page is linked from nav and service pages.",
      isAssetPresent(assets.contact_page) ? "nice_to_add" : "fix_first",
      isAssetPresent(assets.contact_page) ? "low" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "About / company page",
      "entity",
      assets.about_page,
      "Strengthen entity clarity with company background and service area details.",
      isAssetPresent(assets.about_page) ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "Dedicated service pages",
      "services",
      assets.service_pages,
      "Build or deepen individual pages for each core offering.",
      isAssetPresent(assets.service_pages) ? "improve_next" : "fix_first",
      isAssetPresent(assets.service_pages) ? "medium" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "Conversion / offer page",
      "conversion",
      assets.conversion_page,
      "Add a focused landing page with a clear offer and next step.",
      isAssetPresent(assets.conversion_page) ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "Educational resources",
      "content",
      assets.educational_content,
      "Publish guides or checklists that answer common buyer questions.",
      isAssetPresent(assets.educational_content) ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "robots.txt",
      "technical",
      technical.robots_txt,
      "Publish robots.txt with sitemap reference.",
      technical.robots_txt.status === "present" ? "nice_to_add" : "fix_first",
      technical.robots_txt.status === "present" ? "low" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "sitemap.xml",
      "technical",
      technical.sitemap_xml,
      "Publish an XML sitemap listing key public pages.",
      technical.sitemap_xml.status === "present" ? "nice_to_add" : "fix_first",
      technical.sitemap_xml.status === "present" ? "low" : "high",
    ),
  );

  findings.push(
    findingFromAsset(
      "Organization / entity schema",
      "schema",
      schema.organization_schema,
      "Add LocalBusiness or Organization JSON-LD with consistent NAP data.",
      schema.organization_schema.status === "present" ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  findings.push(
    findingFromAsset(
      "Service / offer schema",
      "schema",
      schema.service_schema,
      "Describe services with Service or OfferCatalog schema where appropriate.",
      schema.service_schema.status === "present" ? "nice_to_add" : "improve_next",
      "medium",
    ),
  );

  if (discovery.homepageIsJsShell) {
    findings.push({
      label: "Server-rendered content signals",
      category: "technical",
      status: "Not confirmed",
      confidence: "medium",
      summary: "Homepage appears to use a client-rendered app shell.",
      reason: "Key content may not be visible in initial HTML; sitemap evidence was used where applicable.",
      evidence_urls: [discovery.baseUrl],
      recommendation:
        "Ensure titles, headings, and schema are available in initial HTML or via crawlable routes.",
      priority: "improve_next",
      impact: "medium",
    });
  }

  return findings;
}

export function buildStrengths(discovery: DiscoveryResult): StrengthItem[] {
  const strengths: StrengthItem[] = [];
  const { assets, schema, technical } = discovery;

  const add = (title: string, asset: AssetFinding) => {
    if (isAssetPresent(asset)) {
      strengths.push({
        title,
        summary: asset.reason,
        evidence_urls: asset.evidence_urls,
      });
    }
  };

  add("FAQ content detected", assets.faq_content_presence);
  add("Process page identified", assets.process_page);
  add("Proof or case-study content detected", assets.case_studies);
  add("Contact page present", assets.contact_page);
  add("About page present", assets.about_page);
  add("Dedicated service pages detected", assets.service_pages);
  add("Educational content detected", assets.educational_content);
  add("Conversion or offer page detected", assets.conversion_page);

  if (technical.robots_txt.status === "present") {
    strengths.push({
      title: "robots.txt is accessible",
      summary: technical.robots_txt.reason,
      evidence_urls: technical.robots_txt.evidence_urls,
    });
  }
  if (technical.sitemap_xml.status === "present") {
    strengths.push({
      title: "XML sitemap discovered",
      summary: `${technical.sitemap_url_count} URLs found in sitemap.`,
      evidence_urls: technical.sitemap_xml.evidence_urls,
    });
  }
  if (schema.organization_schema.status === "present") {
    strengths.push({
      title: "Entity schema detected",
      summary: schema.organization_schema.reason,
      evidence_urls: schema.organization_schema.evidence_urls,
    });
  }
  if (discovery.htmlMeta.title) {
    strengths.push({
      title: "Homepage title tag present",
      summary: discovery.htmlMeta.title,
      evidence_urls: [discovery.baseUrl],
    });
  }

  return strengths.slice(0, 8);
}

export function buildExecutiveSummary(
  companyName: string,
  discovery: DiscoveryResult,
  scorecard: { overall: number; overallGrade: string },
  recommendations: ReturnType<typeof generateRecommendations>,
): string {
  const strengths = buildStrengths(discovery);
  const strengthNote =
    strengths.length > 0
      ? `We detected ${strengths.length} existing strengths, including ${strengths[0]?.title.toLowerCase()}.`
      : "Your site has room to strengthen foundational GEO signals.";

  return (
    `${companyName} received an overall AI visibility readiness score of ${scorecard.overall}/100 (${scorecard.overallGrade}). ` +
    `${strengthNote} ` +
    `We identified ${recommendations.topContentGaps.length + recommendations.topFixes.length} practical opportunities to improve clarity for AI-driven search. ` +
    `This report highlights what we found, what is working, and example improvements GSAGEO could implement.`
  );
}

export function topOpportunities(findings: StructuredFinding[]): StructuredFinding[] {
  const order = { fix_first: 0, improve_next: 1, nice_to_add: 2 };
  return [...findings]
    .filter((f) => f.status === "Absent" || f.status === "Not confirmed" || f.priority === "fix_first")
    .sort((a, b) => order[a.priority] - order[b.priority])
    .slice(0, 5);
}
