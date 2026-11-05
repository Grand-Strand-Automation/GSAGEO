export const HOME_HERO = {
  eyebrow: "GEO / AI Visibility for service businesses",
  headline: "See How Clear Your Business Looks in AI Search",
  subheadline:
    "We assess how clearly your business can be understood in AI-driven search — what looks strong, what needs work, and what to improve first. Start with a free assessment, then continue with simple month-to-month support if you want help making improvements over time.",
  primaryCta: "Start Your Free Assessment",
  primaryHref: "/audit",
  secondaryCta: "See Monthly Plans",
  secondaryHref: "#pricing",
  supportLine: "Free assessment first · Month-to-month support available · Cancel anytime",
  reviewCardTitle: "What the free assessment covers",
  reviewCardBullets: [
    "How clearly your business appears in AI search",
    "Website clarity and trust signals",
    "What looks strong and what needs work",
    "Practical priorities to improve first",
    "A clear path to ongoing monthly support",
  ],
} as const;

export const ASSESSMENT_PREVIEW = {
  eyebrow: "SAMPLE REPORT PREVIEW",
  title: "What Your Free Assessment Can Show You",
  description:
    "This is a sample preview of the kind of easy-to-read assessment you receive after submitting your free request — a starting point, not the final product.",
  disclaimer:
    "Illustrative example — actual findings and recommendations will vary based on your business, website, and goals.",
  screenshots: [
    {
      src: "/brand/sample-report/sample-visual-summary.png",
      label: "Sample visual summary",
      alt: "Sample GEO assessment visual summary report screenshot",
    },
    {
      src: "/brand/sample-report/sample-report-hero.png",
      label: "Sample report overview",
      alt: "Sample GEO assessment report overview screenshot",
    },
  ],
  cta: {
    heading: "Ready to see where your business stands?",
    body: "Request your free assessment to get a clearer picture of what your website is doing well, what may be limiting visibility, and what to improve first.",
    label: "Start Your Free Assessment",
    href: "/audit",
    secondaryLabel: "See monthly plans",
    secondaryHref: "/#pricing",
  },
} as const;

export const GOOD_FIT = [
  "Service businesses that want a clearer picture of how they appear in AI search",
  "Local B2B companies not showing up well in AI-generated answers",
  "Teams with service pages, trust content, or messaging that feels unclear or thin",
  "Businesses that want practical monthly guidance — not a vague marketing retainer",
  "Companies in trust-dependent or compliance-aware industries",
  "Owners who want ongoing help improving clarity and visibility over time",
  "Teams ready to make steady improvements month to month",
];

export const NOT_FIT = [
  "Businesses looking for guaranteed rankings or overnight results",
  "Companies still early in defining their product or service offering",
  "Organizations with a brand-new site and very little content to work with",
  "Teams unwilling to review or update content over time",
];

export const WHATS_INCLUDED_INTRO =
  "Your free assessment is the starting point. Ongoing monthly support helps you keep improving clarity, trust, and visibility — with practical next steps each month.";

export const WHATS_INCLUDED = [
  {
    title: "Monthly Visibility Review",
    desc: "We check how your business and website are showing up — and what has changed since last month.",
  },
  {
    title: "Website Clarity",
    desc: "We help you improve whether your services, pages, and messaging are easy to understand.",
  },
  {
    title: "Trust & Credibility",
    desc: "We guide improvements that help your business feel more complete and trustworthy online.",
  },
  {
    title: "Content & Page Improvements",
    desc: "We recommend practical updates to key pages, FAQs, and content that support visibility.",
  },
  {
    title: "Clear Next Steps",
    desc: "Each month you get a simple summary of priorities — what to improve first and why.",
  },
  {
    title: "Ongoing Monthly Guidance",
    desc: "You are not left on your own after the assessment. Support continues as long as it makes sense for your business.",
  },
];

export const DELIVERABLES_HEADING = "What You Get Each Month";

export const DELIVERABLES_INTRO =
  "Monthly support is designed to keep progress moving — not hand you a report and disappear.";

export const DELIVERABLES_SUPPORT =
  "Designed to keep your business clear, credible, and easier to understand over time.";

export const DELIVERABLES = [
  {
    title: "Simple Score Refresh",
    desc: "A plain-English snapshot of how your business currently looks online.",
  },
  {
    title: "Clear Top Priorities",
    desc: "The most important issues and opportunities to focus on right now.",
  },
  {
    title: "Practical Recommendations",
    desc: "Straightforward suggestions for pages, content, trust, and structure.",
  },
  {
    title: "Monthly Progress Summary",
    desc: "A short update on what changed, what improved, and what to tackle next.",
  },
];

export const MONTHLY_RHYTHM = {
  label: "How it works",
  title: "How Monthly GEO Support Works",
  intro:
    "A simple rhythm that keeps your business clear and current — without turning this into a long, overwhelming project.",
  steps: [
    {
      title: "Review",
      desc: "We check how your site and business information are showing up and what has changed.",
    },
    {
      title: "Prioritize",
      desc: "We identify the most important issues and opportunities right now.",
    },
    {
      title: "Improve",
      desc: "We guide or support the updates that can make the biggest difference.",
    },
    {
      title: "Refresh",
      desc: "You receive a simple monthly summary with progress, priorities, and next steps.",
    },
  ],
} as const;

export const WHY_ONGOING = {
  label: "Why stay subscribed",
  title: "Why Ongoing Support Matters",
  body: [
    "The first assessment gives you a starting point. But AI visibility and website clarity are not static — your services change, competitors shift, and trust signals need regular attention.",
    "Monthly support helps you keep improving the areas that affect how clearly your business is understood over time — without guessing what to fix next.",
  ],
  support: "Continue only if it makes sense. Cancel anytime.",
} as const;

export const PRICING_HEADLINE = "Monthly AI Visibility Support";

export const PRICING_INTRO =
  "Simple month-to-month plans for businesses that want ongoing clarity and improvement — without long contracts. Start with a free assessment, then choose the level of support that fits.";

export const PRICING_SUBLINE = "Month-to-month plans · Cancel anytime · No long contracts";

export const PRICING_REASSURANCE = [
  "Cancel anytime",
  "Month-to-month billing",
  "No long contracts",
  "Flexible plan options",
];

export const PRICING_HELPER =
  "Not sure where to start? Begin with your free assessment — we'll help you choose the right monthly plan based on what we find.";

export const PRICING_DOWNGRADE_NOTE =
  "Need lighter support? AI Visibility Monitor keeps you covered with a simpler monthly snapshot and priority recommendations — without full hands-on support every month.";

export const PRICING_CUSTOM_NOTE =
  "Need support across multiple locations, a larger service footprint, or a custom scope?";

export const TIERS = [
  {
    name: "AI Visibility Monitor",
    badge: "Lighter monthly oversight",
    price: "$199/month",
    period: "Month-to-month · cancel anytime",
    tier: "monitor",
    desc: "A lower-friction monthly option for businesses that want visibility oversight, a simple monthly snapshot, and clear recommendations — without hands-on implementation every month.",
    includes: [
      "Monthly visibility snapshot",
      "Plain-English score refresh",
      "Top priority recommendations",
      "Email summary each month",
      "Clear guidance on what to improve next",
      "Cancel anytime",
    ],
    cta: "Start With Monitor",
    primary: false,
  },
  {
    name: "AI Visibility Growth",
    badge: "Recommended · best monthly value",
    price: "Starting at $499/month",
    period: "Month-to-month · cancel anytime",
    tier: "growth",
    desc: "The clearest path to ongoing improvement. For businesses that want steady monthly progress — practical guidance, content direction, and support turning findings into action.",
    includes: [
      "Everything in Monitor",
      "Monthly visibility review",
      "Content and page improvement guidance",
      "Priority refresh recommendations each month",
      "Practical action summaries you can act on",
      "Steady progress on clarity, trust, and visibility",
    ],
    cta: "Start AI Visibility Growth",
    primary: true,
  },
  {
    name: "Managed GEO / AI Visibility",
    badge: "More hands-on monthly support",
    price: "Starting at $1,250/month",
    period: "Month-to-month · cancel anytime",
    tier: "managed",
    desc: "A higher-touch monthly option for businesses that want more done-with-you and done-for-you support — deeper implementation help and ongoing optimization each month.",
    includes: [
      "Everything in Growth",
      "Hands-on optimization support",
      "Implementation guidance and prioritization",
      "Content planning and structure recommendations",
      "Deeper monthly support on key pages",
      "Priority roadmap reviews",
    ],
    cta: "Request Managed Support",
    primary: false,
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is Generative Engine Optimization?",
    a: "GEO is about improving how clearly your business is understood in AI-powered search — so tools like ChatGPT and Google AI Overviews can represent your services accurately. In plain terms: we help your website communicate who you are, what you do, and why customers can trust you.",
  },
  {
    q: "Is this a contract?",
    a: "No long-term contract is required. Monthly plans are designed to be flexible. You can continue, downgrade, or cancel based on what makes sense for your business.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All monthly plans are month-to-month. You can cancel when ongoing support no longer fits your needs — no long-term commitment required.",
  },
  {
    q: "What happens after the free assessment?",
    a: "You receive a clear, easy-to-read summary of what looks strong, what needs work, and what to improve first. If you want help making those improvements over time, you can choose a monthly support plan — or book a short review call to walk through the findings together.",
  },
  {
    q: "What does monthly support actually include?",
    a: "Each month we review how your business is showing up, identify top priorities, and give you practical recommendations for clarity, trust, content, and structure. Growth and Managed plans include more active guidance and support turning those recommendations into action.",
  },
  {
    q: "Do I need the monthly plan if I only want the assessment?",
    a: "No. The free assessment stands on its own. Monthly support is optional — for businesses that want ongoing help improving clarity and visibility over time.",
  },
  {
    q: "What if I want a lighter option?",
    a: "AI Visibility Monitor is designed for that. You get a monthly snapshot, score refresh, and priority recommendations — without the deeper hands-on support included in Growth or Managed.",
  },
  {
    q: "How hands-on is the support?",
    a: "It depends on the plan. Monitor gives you oversight and clear recommendations. Growth adds recurring guidance and monthly action summaries. Managed includes more hands-on support for structure, content, and implementation.",
  },
  {
    q: "How is this different from traditional SEO?",
    a: "Traditional SEO focuses on ranking in a list of links. GEO focuses on whether AI systems can understand and represent your business clearly — through content, structure, trust signals, and page clarity. Both matter, but the signals are different.",
  },
  {
    q: "How long does the free assessment take?",
    a: "The automated review runs within minutes of form submission. Your full written assessment is typically delivered within two to three business days.",
  },
];
