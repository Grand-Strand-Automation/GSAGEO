import { isAssetPresent } from "./asset-detection";
import type { DiscoveryResult } from "./types";

function grade(score: number): string {
  return score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";
}

function assetScore(finding: { status: string; confidence: string }, max = 100): number {
  switch (finding.status) {
    case "present":
      return finding.confidence === "high" ? max : Math.round(max * 0.85);
    case "likely_present":
      return Math.round(max * 0.7);
    case "not_confirmed":
      return Math.round(max * 0.35);
    default:
      return 0;
  }
}

export function generateScorecard(discovery: DiscoveryResult) {
  const { technical, assets, htmlMeta, entityInfo, httpStatus } = discovery;

  const crawlScore = Math.round(
    (httpStatus === 200 ? 40 : 0) +
      assetScore(technical.robots_txt, 30) +
      assetScore(technical.sitemap_xml, 30),
  );

  const techRaw =
    (htmlMeta.title ? 20 : 0) +
    (htmlMeta.title.length >= 30 && htmlMeta.title.length <= 90 ? 15 : htmlMeta.title ? 5 : 0) +
    (htmlMeta.metaDesc ? 20 : 0) +
    (htmlMeta.metaDesc.length >= 80 && htmlMeta.metaDesc.length <= 165 ? 10 : htmlMeta.metaDesc ? 3 : 0) +
    assetScore(technical.canonical, 20) +
    (htmlMeta.h1 || discovery.homepageIsJsShell ? 15 : 0);

  const entityScore =
    (entityInfo.businessNameInHtml ? 34 : 0) +
    (entityInfo.hasAddress ? 33 : 0) +
    (entityInfo.hasContactInfo ? 33 : 0);

  const serviceScore = assetScore(assets.service_pages, 100);
  const trustScore = Math.round(
    (assetScore(assets.case_studies, 45) +
      assetScore(assets.about_page, 30) +
      assetScore(assets.educational_content, 25)) /
      1,
  );

  const aecScore = Math.round(
    assetScore(assets.faq_content_presence, 30) +
      assetScore(assets.process_page, 25) +
      assetScore(assets.educational_content, 25) +
      (discovery.schema.organization_schema.status === "present" ? 20 : 0),
  );

  const structScore = Math.min(
    100,
    discovery.classifiedUrls.length <= 5
      ? 25
      : discovery.classifiedUrls.length <= 12
        ? 50
        : discovery.classifiedUrls.length <= 20
          ? 75
          : 100,
  );

  const convScore = Math.round(
    assetScore(assets.contact_page, 40) +
      assetScore(assets.conversion_page, 35) +
      assetScore(assets.service_pages, 25),
  );

  const cats = {
    crawlability: { score: crawlScore, grade: grade(crawlScore), label: "Crawlability" },
    technicalReadiness: {
      score: Math.min(100, techRaw),
      grade: grade(Math.min(100, techRaw)),
      label: "Technical Readiness",
    },
    entityClarity: { score: entityScore, grade: grade(entityScore), label: "Entity Clarity" },
    servicePageDepth: { score: serviceScore, grade: grade(serviceScore), label: "Service-Page Depth" },
    trustContent: { score: trustScore, grade: grade(trustScore), label: "Trust and Proof Content" },
    answerEngineCoverage: { score: aecScore, grade: grade(aecScore), label: "Answer-Engine Coverage" },
    internalStructure: { score: structScore, grade: grade(structScore), label: "Internal Structure" },
    conversionReadiness: { score: convScore, grade: grade(convScore), label: "Conversion Readiness" },
  };

  const weights = [0.15, 0.2, 0.15, 0.15, 0.1, 0.1, 0.1, 0.05];
  const scores = Object.values(cats).map((c) => c.score);
  const overall = Math.round(scores.reduce((acc, s, i) => acc + s * weights[i], 0));

  return { overall, overallGrade: grade(overall), categories: cats };
}

export function generateRecommendations(
  discovery: DiscoveryResult,
  scorecard: ReturnType<typeof generateScorecard>,
) {
  const fixes: { priority: string; title: string; description: string }[] = [];
  const gaps: { impact: string; title: string; description: string }[] = [];
  const { assets, technical, schema, htmlMeta, httpStatus } = discovery;

  if (httpStatus !== 200) {
    fixes.push({
      priority: "critical",
      title: "Homepage Not Reachable",
      description:
        "The site could not be accessed at the submitted URL. Verify the URL is correct, the site is live, and no firewall or robot rules are blocking crawlers.",
    });
  }

  if (!htmlMeta.title) {
    fixes.push({
      priority: "high",
      title: "Missing Title Tag",
      description:
        "Add a descriptive title tag (30–70 characters) to every page. This is one of the primary signals AI systems use to understand page content.",
    });
  }

  if (!htmlMeta.metaDesc) {
    fixes.push({
      priority: "high",
      title: "Missing Meta Description",
      description:
        "Add a meta description (100–160 characters) to each page. Clear summaries help AI systems represent your content accurately.",
    });
  }

  if (discovery.entityInfo.hasContactInfo === false && !isAssetPresent(assets.contact_page)) {
    fixes.push({
      priority: "high",
      title: "Contact Information Not Clearly Visible",
      description:
        "Make your phone number, email address, or location visible on the homepage or a dedicated contact page.",
    });
  }

  if (!isAssetPresent(assets.contact_page)) {
    fixes.push({
      priority: "high",
      title: "Contact Page Not Confirmed",
      description:
        "No dedicated contact page was confirmed after sitemap and route discovery. If one exists, ensure it is linked in nav/footer and listed in your sitemap.",
    });
  } else if (assets.contact_page.status === "likely_present") {
    gaps.push({
      impact: "medium",
      title: "Strengthen Contact Page Signals",
      description: assets.contact_page.reason,
    });
  }

  if (technical.sitemap_xml.status === "absent") {
    fixes.push({
      priority: "medium",
      title: "Sitemap Not Confirmed",
      description:
        "Publish an XML sitemap and reference it in robots.txt so crawlers and AI systems can discover your pages reliably.",
    });
  } else if (technical.sitemap_xml.status === "likely_present" || technical.sitemap_xml.status === "not_confirmed") {
    gaps.push({
      impact: "low",
      title: "Verify Sitemap Coverage",
      description: technical.sitemap_xml.reason,
    });
  }

  if (technical.robots_txt.status === "absent") {
    fixes.push({
      priority: "medium",
      title: "Robots.txt Not Confirmed",
      description: "Add a robots.txt file at your domain root with crawl guidance and sitemap reference.",
    });
  }

  if (!htmlMeta.canonical && !discovery.homepageIsJsShell) {
    fixes.push({
      priority: "medium",
      title: "Missing Canonical Tags",
      description:
        "Add rel=canonical tags across your pages. This prevents AI systems from indexing fragmented or duplicated versions of your content.",
    });
  }

  if (!isAssetPresent(assets.faq_content_presence)) {
    gaps.push({
      impact: "high",
      title: "FAQ Content Not Confirmed",
      description: assets.faq_content_presence.reason,
    });
  } else if (schema.faq_schema.status !== "present") {
    gaps.push({
      impact: "medium",
      title: "Add FAQ Schema Markup",
      description:
        "FAQ content appears present, but FAQPage schema was not detected. Adding structured FAQ markup can improve AI citation clarity.",
    });
  }

  if (!isAssetPresent(assets.case_studies)) {
    gaps.push({
      impact: "high",
      title: "Proof Content Not Confirmed",
      description: assets.case_studies.reason,
    });
  } else if (assets.case_studies.depth === "weak") {
    gaps.push({
      impact: "medium",
      title: "Expand Case Study Depth",
      description:
        "Proof content is present but may be limited in depth. Add more outcome detail, metrics, and anonymized client summaries.",
    });
  }

  if (!isAssetPresent(assets.service_pages)) {
    gaps.push({
      impact: "high",
      title: "Dedicated Service Pages Not Confirmed",
      description: assets.service_pages.reason,
    });
  } else if ((assets.service_pages.count ?? 0) < 3) {
    gaps.push({
      impact: "medium",
      title: "Expand Service Page Coverage",
      description: `Service pages detected (${assets.service_pages.count ?? 0}), but additional dedicated offering pages may strengthen AI visibility.`,
    });
  }

  if (!isAssetPresent(assets.process_page)) {
    gaps.push({
      impact: "medium",
      title: "Process Page Not Confirmed",
      description: assets.process_page.reason,
    });
  }

  if (!isAssetPresent(assets.educational_content)) {
    gaps.push({
      impact: "low",
      title: "Educational Content Not Confirmed",
      description: assets.educational_content.reason,
    });
  } else if ((assets.educational_content.count ?? 0) < 2) {
    gaps.push({
      impact: "low",
      title: "Grow Educational Content Library",
      description:
        "Educational pages were detected. Adding more guides and checklists can expand AI indexing surface area.",
    });
  }

  if (schema.organization_schema.status !== "present") {
    gaps.push({
      impact: "medium",
      title: "Add Organization / LocalBusiness Schema",
      description: schema.organization_schema.reason,
    });
  }

  if (discovery.homepageIsJsShell) {
    gaps.push({
      impact: "medium",
      title: "Improve Server-Rendered Content Signals",
      description:
        "This site appears to use a client-rendered app shell. Ensure key content, headings, and schema are available in initial HTML or via sitemap-backed routes for crawlers.",
    });
  }

  const { overall } = scorecard;
  const suggestedTier =
    overall < 40
      ? "AI Visibility Monitor — $99/mo"
      : overall < 65
        ? "AI Visibility Growth — starting at $499/mo"
        : "Managed GEO / AI Visibility — starting at $1,250/mo";

  return {
    topFixes: fixes.slice(0, 5),
    topContentGaps: gaps.slice(0, 5),
    allFixes: fixes,
    allContentGaps: gaps,
    suggestedTier,
  };
}
