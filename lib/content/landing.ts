export const GOOD_FIT = [
  "Service businesses that rely on inbound trust and referrals",
  "Local B2B companies not appearing in AI-generated search responses",
  "Companies with weak, thin, or disorganized service page content",
  "Teams that have invested in traditional SEO but not content quality or depth",
  "Businesses in compliance-aware or trust-dependent industries",
  "Organizations with no structured FAQ, process, or educational content",
  "Companies that want to understand their AI visibility baseline before investing further",
];

export const NOT_FIT = [
  "Businesses looking for guaranteed rankings or quick-turnaround results",
  "Companies still early in defining their product or service offering",
  "Organizations with a recently launched placeholder site and no content to improve",
  "Teams unwilling to add or revise content over time",
];

export const WHATS_INCLUDED = [
  { title: "GEO Audit and Scorecard", desc: "A structured review across eight GEO-readiness categories, each scored and graded." },
  { title: "AI Visibility Query Mapping", desc: "Analysis of queries where your business should appear — and whether your content supports that." },
  { title: "Technical Crawlability and Indexing", desc: "Sitemap, robots.txt, canonical tags, and indexability signals." },
  { title: "Service Page and Content Gap Analysis", desc: "Review of current service pages with specific recommendations." },
  { title: "Entity and Business Profile Consistency", desc: "How consistently your business name, location, and services appear." },
  { title: "Structured Data and Schema Review", desc: "Whether your pages use structured data that represents your business accurately." },
  { title: "Internal Linking and Page Architecture", desc: "How pages connect and whether structure helps AI systems understand relationships." },
  { title: "Content Recommendations", desc: "Specific recommendations for FAQs, comparison pages, case studies, and more." },
  { title: "Reporting and Roadmap", desc: "A clear, prioritized action plan with findings and suggested implementation path." },
];

export const DELIVERABLES = [
  "GEO scorecard across eight categories with a letter grade for each",
  "Prioritized action plan: top five technical fixes and top five content opportunities",
  "Content map showing recommended pages, topics, and content types",
  "Technical recommendations for site structure, schema markup, and crawlability",
  "Implementation roadmap with suggested tier and sequencing",
  "Optional: ongoing AI search optimization through the AI Search Growth engagement",
];

export const TIERS = [
  {
    name: "AI Search Visibility Audit",
    badge: "Best place to start",
    price: "$1,950",
    period: "One-time engagement",
    tier: "audit",
    desc: "A focused audit and roadmap for companies that want to understand how visible and structurally prepared they are for AI search.",
    includes: [
      "Technical GEO audit",
      "Sitemap, robots, and crawlability review",
      "Homepage and key service-page review",
      "Entity and business-profile consistency review",
      "Internal linking and page architecture review",
      "Service and content gap analysis",
      "AI search query map",
      "GEO scorecard",
      "Prioritized 90-day action plan",
      "Review call or walkthrough",
    ],
    cta: "Request a GEO Audit",
    primary: false,
  },
  {
    name: "AI Search Foundation",
    badge: "Most popular",
    price: "Starting at $5,500",
    period: "One-time implementation package",
    tier: "foundation",
    desc: "A practical buildout for businesses that need key technical fixes, structure improvements, and first-wave AI-search-ready content.",
    includes: [
      "Everything in the Audit tier",
      "Technical GEO fixes implemented",
      "Sitemap, robots, and canonical cleanup",
      "Internal linking improvements",
      "Schema recommendations and implementation",
      "3–6 priority pages or page rewrites",
      "FAQ or FAQ hub framework",
      "Proof-content and case-study framework",
      "Reporting setup",
      "Implementation summary",
    ],
    cta: "Build My GEO Foundation",
    primary: true,
  },
  {
    name: "AI Search Growth",
    badge: "Ongoing support",
    price: "Starting at $2,500/mo",
    period: "Ongoing monthly optimization",
    tier: "growth",
    desc: "Ongoing monitoring and expansion for companies that want continued improvement in AI search visibility and content coverage.",
    includes: [
      "Monthly GEO monitoring and technical checks",
      "Search Console and Bing Webmaster review",
      "Monthly content opportunity updates",
      "2–4 content briefs per month",
      "1–2 refresh recommendations per month",
      "Internal linking recommendations",
      "Structured data and entity consistency review",
      "Monthly priority action list",
      "Monthly strategy summary or walkthrough",
    ],
    cta: "Start Monthly GEO Growth",
    primary: false,
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is Generative Engine Optimization?",
    a: "Generative Engine Optimization (GEO) is the practice of improving how your business is understood, cited, and surfaced by AI-powered search systems. Unlike traditional SEO, GEO focuses on content clarity, entity recognition, structured data, and page types that AI systems use to generate trustworthy answers.",
  },
  {
    q: "How is GEO different from SEO?",
    a: "Traditional SEO is primarily about ranking in a list of links. GEO is about being cited inside an AI-generated answer. The signals that matter are different: entity consistency, content depth, structured data, and specific page types like FAQs and case studies.",
  },
  {
    q: "We already invest in SEO — does GEO add anything?",
    a: "Usually, yes. Most SEO work focuses on keywords and backlinks. GEO focuses on content structure, entity clarity, and schema markup — areas frequently underdeveloped even on sites with strong traditional SEO.",
  },
  {
    q: "What does the audit actually look at?",
    a: "The audit covers eight areas: crawlability, technical readiness, entity clarity, service page depth, trust content, answer-engine coverage, internal structure, and conversion readiness. Each area is scored and graded with evidence from your site.",
  },
  {
    q: "Do you fix the issues you find?",
    a: "That depends on the tier. The Audit documents findings and a prioritized plan. Foundation and Growth tiers include hands-on implementation.",
  },
  {
    q: "How long does a GEO audit take?",
    a: "The automated component runs within minutes of form submission. The full written report is typically delivered within two to three business days.",
  },
  {
    q: "Can this be an ongoing monthly service?",
    a: "Yes. The AI Search Growth tier is designed for businesses that want continuous improvement rather than a single audit snapshot.",
  },
];
