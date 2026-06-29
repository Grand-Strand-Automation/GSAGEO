export const HOME_HERO = {
  eyebrow: "GEO / AI Visibility for service businesses",
  headline: "Find Out How Your Business Looks to AI Search",
  subheadline:
    "Customers are increasingly discovering service providers through ChatGPT, Google AI Overviews, and other answer-driven search tools. Our GEO / AI Visibility Assessment helps you see whether your website is clear, trustworthy, and structured well enough to be understood and recommended.",
  primaryCta: "Start Your Assessment",
  primaryHref: "/audit?tier=monitor",
  secondaryCta: "Learn How GEO Works",
  secondaryHref: "#understanding-geo",
  supportLine: "Built for Myrtle Beach and Grand Strand service businesses",
  reviewCardTitle: "What the assessment reviews",
  reviewCardBullets: [
    "Service page clarity",
    "FAQ and trust content",
    "Internal linking and structure",
    "AI visibility gaps",
    "Practical next-step recommendations",
  ],
} as const;

export type AssessmentPreviewStatus = "Limited" | "Moderate" | "Weak" | "Strong";

export const ASSESSMENT_PREVIEW = {
  label: "Sample output",
  title: "What a GEO Assessment Might Highlight",
  description:
    "Here's a simplified example of the type of issues and recommendations a GEO / AI Visibility assessment can surface. The goal is to give you a clearer sense of how the review is structured and what practical next steps might look like.",
  demoLabel: "Sample assessment snapshot · Illustrative preview only",
  categoriesReviewed: [
    "Service page clarity",
    "FAQ & answer coverage",
    "Trust & proof signals",
    "Entity & local relevance",
  ],
  reviewCards: [
    {
      title: "FAQ Coverage",
      status: "Limited" as AssessmentPreviewStatus,
      summary: "Key customer questions are not consistently answered across the site.",
    },
    {
      title: "Service Page Clarity",
      status: "Moderate" as AssessmentPreviewStatus,
      summary:
        "Core services are present, but some pages need clearer structure and more useful detail.",
    },
    {
      title: "Trust Signals",
      status: "Weak" as AssessmentPreviewStatus,
      summary:
        "The site would benefit from stronger proof, process clarity, and visible credibility indicators.",
    },
    {
      title: "Entity Clarity",
      status: "Moderate" as AssessmentPreviewStatus,
      summary:
        "The business is visible, but its specialization, service fit, and local relevance could be communicated more clearly.",
    },
  ],
  nextAction: {
    title: "Example Next Best Action",
    copy: "Strengthen one core service page, add a relevant FAQ section, improve internal links between supporting pages, and clarify the primary call to action.",
  },
  insight: {
    title: "What this tells you",
    copy: "A result like this helps identify where your site is clear, where it is underdeveloped, and what changes are most likely to improve visibility first.",
  },
  cta: {
    label: "Start Your Assessment",
    href: "/audit?tier=monitor",
    support:
      "Get a clearer picture of how your website is structured for AI-driven discovery and what to improve first.",
  },
} as const;

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
  "Organizations with a newly launched site and little content to improve",
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
  "Optional: ongoing support through AI Visibility Growth or Managed GEO engagements",
];

export const PRICING_HEADLINE = "AI Visibility Plans for Small and Medium Businesses";

export const PRICING_INTRO =
  "Choose a starting point that fits your current site, team, and growth goals — from a simple monthly visibility check to ongoing support and implementation guidance.";

export const PRICING_REASSURANCE = [
  "No bloated bundles",
  "Clear deliverables",
  "Built for practical next steps",
  "Month-to-month starting points where appropriate",
];

export const PRICING_HELPER =
  "Not sure where to start? Begin with Monitor and upgrade once you have a clearer picture of what needs attention.";

export const PRICING_CUSTOM_NOTE =
  "Need support across multiple locations, a larger service footprint, or a more involved implementation plan?";

export const TIERS = [
  {
    name: "AI Visibility Monitor",
    badge: "Best place to start",
    price: "$199/month",
    period: "Month-to-month · cancel anytime",
    tier: "monitor",
    desc: "A simple monthly starting point for businesses that want a clearer picture of how prepared they are for AI-driven search visibility — without committing to a larger engagement yet.",
    includes: [
      "Monthly AI visibility snapshot",
      "Basic crawlability and indexing check",
      "GEO scorecard refresh",
      "3 priority recommendations",
      "Email summary",
      "Cancel anytime",
    ],
    cta: "Start with AI Visibility Monitor",
    primary: false,
  },
  {
    name: "AI Visibility Growth",
    badge: "Most practical for growing teams",
    price: "Starting at $499/month",
    period: "Ongoing monthly guidance",
    tier: "growth",
    desc: "A practical fit for growing businesses that want recurring guidance, stronger content direction, and a clearer monthly plan — without stepping into full managed support immediately.",
    includes: [
      "Everything in Monitor",
      "Monthly visibility review",
      "Content gap updates",
      "Internal linking recommendations",
      "Search Console and Bing review",
      "1–2 refresh recommendations per month",
      "Monthly action summary",
    ],
    cta: "Start AI Visibility Growth",
    primary: true,
  },
  {
    name: "Managed GEO / AI Visibility",
    badge: "Higher-touch support",
    price: "Starting at $1,250/month",
    period: "Hands-on ongoing engagement",
    tier: "managed",
    desc: "A higher-touch engagement for businesses that want hands-on support improving structure, content coverage, and AI visibility over time.",
    includes: [
      "Everything in Growth",
      "Ongoing optimization support",
      "Implementation guidance",
      "Content planning and prioritization",
      "Structured data and page architecture recommendations",
      "More hands-on monthly support",
      "Priority roadmap reviews",
    ],
    cta: "Request Managed GEO / AI Visibility",
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
    a: "That depends on the plan. Monitor gives you a structured monthly snapshot and priority recommendations — not hands-on implementation. Growth adds recurring guidance and refresh recommendations. Managed GEO includes more hands-on support for structure, content, and ongoing improvement.",
  },
  {
    q: "How long does a GEO audit take?",
    a: "The automated component runs within minutes of form submission. The full written report is typically delivered within two to three business days.",
  },
  {
    q: "Can this be an ongoing monthly service?",
    a: "Yes. AI Visibility Monitor is a low-friction monthly starting point. AI Visibility Growth and Managed GEO are designed for businesses that want continued guidance and stronger visibility over time.",
  },
  {
    q: "What is the $199/month plan?",
    a: "AI Visibility Monitor is a monitoring and diagnostic tier — not full optimization or hands-on implementation. You receive a monthly snapshot, basic technical checks, a refreshed scorecard, and a short list of priority recommendations so you know what to work on next.",
  },
];
