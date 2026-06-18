import type { extractEntityInfo, extractHtmlData, detectPageTypes } from "./content-extraction";

function grade(score: number): string {
  return score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";
}

export function generateScorecard(
  httpStatus: number,
  sitemapOk: boolean,
  robotsOk: boolean,
  htmlData: ReturnType<typeof extractHtmlData>,
  pageTypes: ReturnType<typeof detectPageTypes>,
  entityInfo: ReturnType<typeof extractEntityInfo>,
) {
  const crawlScore =
    (httpStatus === 200 ? 50 : 0) + (sitemapOk ? 25 : 0) + (robotsOk ? 25 : 0);

  const techRaw =
    (htmlData.title ? 20 : 0) +
    (htmlData.title.length >= 30 && htmlData.title.length <= 70 ? 15 : htmlData.title ? 5 : 0) +
    (htmlData.metaDesc ? 20 : 0) +
    (htmlData.metaDesc.length >= 80 && htmlData.metaDesc.length <= 165 ? 10 : htmlData.metaDesc ? 3 : 0) +
    (htmlData.canonical ? 20 : 0) +
    (htmlData.h1 ? 15 : 0);

  const entityScore =
    (entityInfo.businessNameInHtml ? 34 : 0) +
    (entityInfo.hasAddress || pageTypes.hasLocation ? 33 : 0) +
    (entityInfo.hasContactInfo ? 33 : 0);

  const spCount = pageTypes.servicePageCount;
  const spRaw =
    spCount === 0 ? 0 : spCount === 1 ? 35 : spCount === 2 ? 55 : spCount <= 4 ? 75 : 100;
  const serviceScore = pageTypes.hasServices ? Math.max(spRaw, 25) : spRaw;

  const trustScore =
    (pageTypes.hasCaseStudies ? 45 : 0) +
    (pageTypes.hasAbout ? 30 : 0) +
    (pageTypes.hasBlogOrResources ? 25 : 0);

  const aecScore =
    (pageTypes.hasFAQ ? 30 : 0) +
    (pageTypes.hasProcess ? 25 : 0) +
    (pageTypes.hasComparison ? 20 : 0) +
    (pageTypes.hasBlogOrResources ? 25 : 0);

  const lc = pageTypes.internalLinkCount;
  const structScore = lc === 0 ? 5 : lc <= 5 ? 20 : lc <= 15 ? 45 : lc <= 30 ? 72 : 100;

  const convScore =
    (pageTypes.hasContact ? 40 : 0) +
    (pageTypes.hasPricing ? 35 : 0) +
    (pageTypes.hasServices ? 25 : 0);

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
  scorecard: ReturnType<typeof generateScorecard>,
  pageTypes: ReturnType<typeof detectPageTypes>,
  htmlData: ReturnType<typeof extractHtmlData>,
  httpStatus: number,
) {
  const fixes: { priority: string; title: string; description: string }[] = [];
  const gaps: { impact: string; title: string; description: string }[] = [];

  if (httpStatus !== 200)
    fixes.push({
      priority: "critical",
      title: "Homepage Not Reachable",
      description:
        "The site could not be accessed at the submitted URL. Verify the URL is correct, the site is live, and no firewall or robot rules are blocking crawlers.",
    });

  if (!htmlData.title)
    fixes.push({
      priority: "high",
      title: "Missing Title Tag",
      description:
        "Add a descriptive title tag (30–70 characters) to every page. This is one of the primary signals AI systems use to understand page content.",
    });

  if (!htmlData.metaDesc)
    fixes.push({
      priority: "high",
      title: "Missing Meta Description",
      description:
        "Add a meta description (100–160 characters) to each page. Clear summaries help AI systems represent your content accurately.",
    });

  if (scorecard.categories.entityClarity.score < 34)
    fixes.push({
      priority: "high",
      title: "Contact Information Not Visible",
      description:
        "Make your phone number, email address, or location visible on the homepage. Entity clarity helps AI systems verify your business.",
    });

  if (!pageTypes.hasContact)
    fixes.push({
      priority: "high",
      title: "No Contact Page Found",
      description:
        "Add a dedicated contact page. This is expected by both users and AI crawlers as part of a trustworthy site structure.",
    });

  if (!htmlData.canonical)
    fixes.push({
      priority: "medium",
      title: "Missing Canonical Tags",
      description:
        "Add rel=canonical tags across your pages. This prevents AI systems from indexing fragmented or duplicated versions of your content.",
    });

  if (scorecard.categories.crawlability.score < 75)
    fixes.push({
      priority: "medium",
      title: "Sitemap or Robots File Missing",
      description:
        "Create an XML sitemap at /sitemap.xml and a robots.txt file. These help search engines and AI crawlers discover your pages.",
    });

  if (!htmlData.h1)
    fixes.push({
      priority: "medium",
      title: "Missing H1 Heading",
      description:
        "Add a clear H1 heading to each page describing its topic. This is the primary content classification signal for AI indexing systems.",
    });

  if (!pageTypes.hasFAQ)
    gaps.push({
      impact: "high",
      title: "Build a Dedicated FAQ Page",
      description:
        "FAQ pages are among the most reliably cited content types by AI answer engines.",
    });

  if (!pageTypes.hasCaseStudies)
    gaps.push({
      impact: "high",
      title: "Add Case Studies or Client Results",
      description:
        "Documented outcomes improve credibility signals for AI systems.",
    });

  if (!pageTypes.hasServices)
    gaps.push({
      impact: "high",
      title: "Build Dedicated Service Pages",
      description:
        "Each service you offer should have its own clearly structured page.",
    });

  if (!pageTypes.hasProcess)
    gaps.push({
      impact: "medium",
      title: "Document Your Process",
      description: "A clear 'how it works' page helps AI systems understand your offering.",
    });

  if (!pageTypes.hasPricing)
    gaps.push({
      impact: "medium",
      title: "Add a Pricing or Rates Page",
      description: "Pricing transparency pages are frequently cited in AI search answers.",
    });

  if (!pageTypes.hasLocation)
    gaps.push({
      impact: "medium",
      title: "Create Location or Service Area Pages",
      description: "Dedicated location pages improve local AI visibility.",
    });

  if (!pageTypes.hasComparison)
    gaps.push({
      impact: "medium",
      title: "Consider Comparison Pages",
      description: "Comparison pages are frequently surfaced by AI answer engines.",
    });

  if (!pageTypes.hasBlogOrResources)
    gaps.push({
      impact: "low",
      title: "Start a Resources or Articles Section",
      description: "Educational content increases the surface area of your site for AI indexing.",
    });

  const { overall } = scorecard;
  const suggestedTier =
    overall < 40
      ? "AI Search Foundation — Starting at $5,500"
      : overall < 65
        ? "AI Search Visibility Audit — $1,950 one-time"
        : "AI Search Growth — Starting at $2,500/mo";

  return {
    topFixes: fixes.slice(0, 5),
    topContentGaps: gaps.slice(0, 5),
    allFixes: fixes,
    allContentGaps: gaps,
    suggestedTier,
  };
}
