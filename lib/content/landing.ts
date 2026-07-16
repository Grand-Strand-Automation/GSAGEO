export const HOME_HERO = {
  eyebrow: "Website Redesign + Hosting for service businesses",
  headline: "See What Your Website Could Look Like After a Redesign",
  subheadline:
    "Enter your current website, tell us a little about your business, and see a preview of what a clearer, more modern homepage could look like — with hosting and ongoing support available on a simple monthly plan.",
  primaryCta: "Preview My New Homepage",
  primaryHref: "#mockup",
  secondaryCta: "See Monthly Plans",
  secondaryHref: "#pricing",
  tertiaryCta: "Still interested in GEO?",
  tertiaryHref: "#geo",
  supportLine: "Instant homepage preview · Monthly redesign + hosting · Cancel anytime",
  reviewCardTitle: "What you get in the preview",
  reviewCardBullets: [
    "A sample homepage concept for your business",
    "Clearer headline and CTA direction",
    "A more modern first-impression layout",
    "Notes on what improved in the concept",
    "A simple path into monthly redesign + hosting",
  ],
} as const;

export const MOCKUP_EXPECTATION =
  "This is a sample homepage concept based on your site and preferences — not a finished website. Final design and launch details are refined during onboarding.";

export const HOW_MOCKUP_WORKS = {
  label: "How it works",
  title: "From preview to a better website",
  intro:
    "A simple path: see a sample homepage direction first, then choose monthly redesign + hosting if you want help launching and maintaining it.",
  steps: [
    {
      title: "Enter your website",
      desc: "Share your current site URL and business name so we can pull useful signals where possible.",
    },
    {
      title: "Tell us what you want",
      desc: "Pick a style and homepage goal — plus any must-include notes — in under a minute.",
    },
    {
      title: "Review a sample concept",
      desc: "See a polished homepage mockup direction tailored to your business and preferences.",
    },
    {
      title: "Choose a monthly plan",
      desc: "If you like the direction, launch with redesign, hosting, and ongoing support — month to month.",
    },
  ],
} as const;

export const WHATS_INCLUDED_INTRO =
  "Monthly redesign + hosting is built for service businesses that want a stronger website without a giant one-time project. We redesign, launch, host, and keep improving over time.";

export const WHATS_INCLUDED = [
  {
    title: "Homepage Redesign Direction",
    desc: "A clearer first impression with stronger messaging, layout, and calls to action.",
  },
  {
    title: "Reliable Hosting",
    desc: "Your site is hosted and kept online — no juggling separate hosting accounts.",
  },
  {
    title: "Ongoing Updates",
    desc: "Iterate on pages, content, and structure as your business needs change.",
  },
  {
    title: "Practical Support",
    desc: "Simple requests and improvements without waiting on a huge agency timeline.",
  },
  {
    title: "Clear Monthly Rhythm",
    desc: "You always know what improved and what we are working on next.",
  },
  {
    title: "Optional GEO Add-On",
    desc: "Want better AI visibility too? GEO support can be added when it makes sense.",
  },
];

export const DELIVERABLES_HEADING = "What You Get Each Month";

export const DELIVERABLES_INTRO =
  "This is ongoing website support — not a report and disappear engagement.";

export const DELIVERABLES_SUPPORT =
  "Designed to keep your website clear, credible, modern, and easier to maintain.";

export const DELIVERABLES = [
  {
    title: "Hosting Included",
    desc: "Your live site stays online with reliable monthly hosting support.",
  },
  {
    title: "Design & Content Iterations",
    desc: "Steady improvements to layout, messaging, and key pages.",
  },
  {
    title: "Priority Updates",
    desc: "Practical changes that strengthen calls, quotes, and credibility.",
  },
  {
    title: "Simple Progress Summary",
    desc: "A short monthly update on what changed and what is next.",
  },
];

export const GOOD_FIT = [
  "Service businesses that want a clearer, more modern website",
  "Owners tired of an outdated homepage that does not convert well",
  "Teams that prefer monthly redesign + hosting over a huge rebuild project",
  "Businesses that need stronger calls to action and clearer service explanations",
  "Companies that want ongoing updates without hiring a full-time web team",
  "Local and B2B service brands that need to look more credible online",
];

export const NOT_FIT = [
  "Businesses looking for a free finished website with no ongoing plan",
  "Companies that need a massive custom app or complex software platform",
  "Teams unwilling to review or approve simple monthly updates",
  "Anyone expecting guaranteed rankings or overnight lead spikes",
];

export const WHY_ONGOING = {
  label: "Why monthly",
  title: "Why Redesign + Hosting Works Better Month to Month",
  body: [
    "A one-time website project often goes stale. Services change, offers shift, and competitors update how they present themselves online.",
    "Monthly redesign + hosting keeps your site current — with hosting handled and improvements continuing as your business evolves.",
  ],
  support: "Continue only if it makes sense. Cancel anytime.",
} as const;

export const PRICING_HEADLINE = "Monthly Website Redesign + Hosting";

export const PRICING_INTRO =
  "Simple month-to-month plans to redesign, launch, host, and keep improving your website — without a big upfront project or long contract.";

export const PRICING_SUBLINE = "Month-to-month plans · Hosting included · Cancel anytime";

export const PRICING_REASSURANCE = [
  "Cancel anytime",
  "Month-to-month billing",
  "Hosting included",
  "No long contracts",
];

export const PRICING_HELPER =
  "Start with a free homepage mockup. Then choose the monthly plan that matches how hands-on you want the support to be.";

export const PRICING_DOWNGRADE_NOTE =
  "Need a lighter option? Website Refresh + Hosting keeps your site live with simpler monthly support — without the fuller growth cadence.";

export const PRICING_CUSTOM_NOTE =
  "Need support across multiple locations, a larger service footprint, or a custom scope?";

export const TIERS = [
  {
    name: "Website Refresh + Hosting",
    badge: "Lighter monthly support",
    price: "$199/month",
    period: "Month-to-month · cancel anytime",
    tier: "monitor",
    desc: "A lower-friction monthly option for businesses that want a clearer website, reliable hosting, and practical updates — without full hands-on growth work every month.",
    includes: [
      "Hosting included",
      "Homepage refresh direction",
      "Light monthly updates",
      "Priority support requests",
      "Simple monthly summary",
      "Cancel anytime",
    ],
    cta: "Start With Refresh",
    primary: false,
  },
  {
    name: "Website Growth + Hosting",
    badge: "Recommended · best overall fit",
    price: "Starting at $499/month",
    period: "Month-to-month · cancel anytime",
    tier: "growth",
    desc: "The clearest path for most service businesses. We redesign, launch, host, and continue improving your site with steady monthly progress.",
    includes: [
      "Everything in Refresh",
      "Fuller redesign support",
      "Ongoing page & content iterations",
      "Stronger CTA and conversion focus",
      "Monthly improvement cadence",
      "Optional GEO guidance when useful",
    ],
    cta: "Start Website Growth",
    primary: true,
  },
  {
    name: "Managed Website + Growth",
    badge: "Higher-touch monthly support",
    price: "Starting at $1,250/month",
    period: "Month-to-month · cancel anytime",
    tier: "managed",
    desc: "A higher-touch plan for businesses that want more done-with-you and done-for-you website support — deeper redesign work and ongoing optimization each month.",
    includes: [
      "Everything in Growth",
      "Higher-touch redesign support",
      "Deeper page and content work",
      "Priority roadmap reviews",
      "More hands-on monthly updates",
      "GEO / AI visibility support available",
    ],
    cta: "Request Managed Support",
    primary: false,
  },
];

export const GEO_SECONDARY = {
  label: "Also available",
  title: "Want to improve how your business appears in AI search too?",
  body: "GEO / AI visibility assessments are still available as a secondary service. If you want to understand how clearly your business shows up in AI-driven answers — and what to improve — you can start with a free assessment anytime.",
  primaryCta: "Start Free GEO Assessment",
  primaryHref: "/audit",
  secondaryCta: "Learn what GEO covers",
  secondaryHref: "/#understanding-geo",
} as const;

export const ASSESSMENT_PREVIEW = {
  eyebrow: "SAMPLE GEO REPORT",
  title: "Also available: GEO / AI Visibility Assessments",
  description:
    "If AI search visibility matters for your business, our free assessment still shows what looks strong, what needs work, and what to improve first.",
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
    heading: "Curious about AI visibility too?",
    body: "Request a free GEO assessment after you explore your homepage mockup — or jump straight in if that is your main focus.",
    label: "Start Free GEO Assessment",
    href: "/audit",
    secondaryLabel: "Back to redesign plans",
    secondaryHref: "/#pricing",
  },
} as const;

export const FAQ_ITEMS = [
  {
    q: "Is the homepage mockup my finished website?",
    a: "No. The mockup is a sample homepage concept based on your current site and preferences. It shows a clearer direction — final design, content, and launch details are refined during onboarding.",
  },
  {
    q: "What is included in monthly redesign + hosting?",
    a: "Hosting, redesign direction, ongoing updates, and practical support so your site stays clearer and more modern over time. Higher plans include more hands-on iteration each month.",
  },
  {
    q: "Is this a long contract?",
    a: "No. Plans are month-to-month. You can continue, change plans, or cancel based on what makes sense for your business.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All monthly plans are month-to-month with no long-term contract required.",
  },
  {
    q: "How is this different from a one-time website project?",
    a: "A one-time rebuild often goes stale. Monthly redesign + hosting launches a stronger site and keeps improving it — with hosting handled for you.",
  },
  {
    q: "Do I still offer GEO / AI visibility?",
    a: "Yes. GEO assessments and AI visibility support remain available as a secondary offer. They can also be paired with website growth plans when useful.",
  },
  {
    q: "What happens after I like the mockup?",
    a: "Choose a monthly plan and we turn the direction into a real website — then host and continue improving it over time.",
  },
  {
    q: "How fast is the preview?",
    a: "The homepage concept is generated right after you submit your URL and preferences — so you can review a sample direction immediately.",
  },
];
