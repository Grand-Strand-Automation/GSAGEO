export const HOME_HERO = {
  eyebrow: "$99 Website Refresh for service businesses",
  headline: "See What Your Homepage Could Look Like After a Refresh",
  subheadline:
    "Enter your current website, tell us a little about your business, and preview a clearer homepage direction — then refresh your homepage and 2–3 key sub pages for a flat $99.",
  primaryCta: "Preview My New Homepage",
  primaryHref: "#mockup",
  secondaryCta: "See the $99 Refresh",
  secondaryHref: "#pricing",
  tertiaryCta: "Still interested in GEO?",
  tertiaryHref: "#geo",
  supportLine: "Instant homepage preview · Homepage + 2–3 sub pages · Flat $99",
  reviewCardTitle: "What you get in the preview",
  reviewCardBullets: [
    "A sample homepage concept for your business",
    "Clearer headline and CTA direction",
    "A more modern first-impression layout",
    "Notes on what improved in the concept",
    "A simple path into the $99 website refresh",
  ],
} as const;

export const MOCKUP_EXPECTATION =
  "This is a sample homepage concept based on your site and preferences — not a finished website. Final design and launch details are refined during onboarding.";

export const HOW_MOCKUP_WORKS = {
  label: "How it works",
  title: "From preview to a refreshed website",
  intro:
    "A simple path: see a sample homepage direction first, then refresh your homepage and a few key pages for a flat $99.",
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
      title: "Start your $99 refresh",
      desc: "If you like the direction, we refresh your homepage and 2–3 important sub pages.",
    },
  ],
} as const;

export const WHATS_INCLUDED_INTRO =
  "The $99 Website Refresh is built for service businesses that want a stronger first impression without a giant rebuild. We refresh the pages visitors actually use to decide and contact you.";

export const WHATS_INCLUDED = [
  {
    title: "Homepage Refresh",
    desc: "A clearer first impression with stronger messaging, layout, and calls to action.",
  },
  {
    title: "2–3 Key Sub Pages",
    desc: "Refresh important supporting pages like Services, About, or Contact so the site feels consistent.",
  },
  {
    title: "Clearer CTAs",
    desc: "Make it easier for visitors to call, request a quote, or take the next step.",
  },
  {
    title: "Modern Layout Direction",
    desc: "Cleaner structure and spacing so your business looks more credible online.",
  },
  {
    title: "Business-Specific Copy",
    desc: "Messaging tailored to what you do — not a generic template speech.",
  },
  {
    title: "Optional GEO Add-On",
    desc: "Want better AI visibility too? GEO support can be added when it makes sense.",
  },
];

export const DELIVERABLES_HEADING = "What You Get";

export const DELIVERABLES_INTRO =
  "A focused website refresh — not a long monthly retainer and not a free finished site.";

export const DELIVERABLES_SUPPORT =
  "Designed to make your homepage and key pages clearer, more credible, and easier to act on.";

export const DELIVERABLES = [
  {
    title: "Homepage Concept → Live Refresh",
    desc: "Turn the sample direction into a refreshed homepage that matches your business.",
  },
  {
    title: "2–3 Supporting Pages",
    desc: "Update the pages that matter most for trust and conversion.",
  },
  {
    title: "Stronger Calls to Action",
    desc: "Practical changes that make next steps obvious.",
  },
  {
    title: "Simple Onboarding",
    desc: "Share a few details, approve the direction, and we get to work.",
  },
];

export const GOOD_FIT = [
  "Service businesses that want a clearer, more modern homepage",
  "Owners tired of an outdated site that does not convert well",
  "Teams that want a focused refresh — homepage plus a few key pages",
  "Businesses that need stronger calls to action and clearer service explanations",
  "Local and B2B service brands that need to look more credible online",
  "Companies that want a practical next step without a huge rebuild project",
];

export const NOT_FIT = [
  "Businesses looking for a free finished website with no engagement",
  "Companies that need a massive custom app or complex software platform",
  "Teams needing a full multi-site rebuild across dozens of pages",
  "Anyone expecting guaranteed rankings or overnight lead spikes",
];

export const WHY_ONGOING = {
  label: "Why this works",
  title: "Why a Focused Website Refresh Beats a Vague Rebuild",
  body: [
    "Most service businesses do not need a giant website project to improve results. They need a clearer homepage, stronger calls to action, and a few supporting pages that explain the offer with confidence.",
    "The $99 Website Refresh keeps the scope practical: homepage plus 2–3 key sub pages — enough to improve the first impression without months of agency work.",
  ],
  support: "Flat $99 · Homepage + 2–3 sub pages · Clear next step after your mockup.",
} as const;

export const PRICING_HEADLINE = "$99 Website Refresh";

export const PRICING_INTRO =
  "A focused refresh of your homepage and 2–3 key sub pages — clearer messaging, stronger CTAs, and a more modern first impression.";

export const PRICING_SUBLINE = "Flat $99 · Homepage + 2–3 sub pages · No monthly plan required";

export const PRICING_REASSURANCE = [
  "Flat $99 pricing",
  "Homepage included",
  "2–3 sub pages included",
  "Clear scope",
];

export const PRICING_HELPER =
  "Start with a free homepage mockup. If you like the direction, start the $99 Website Refresh.";

export const PRICING_DOWNGRADE_NOTE =
  "Need more than a few pages later? We can discuss additional page work after the refresh.";

export const PRICING_CUSTOM_NOTE =
  "Need support across multiple locations, a larger service footprint, or a custom scope?";

/** Single public offer — keep `tier: "monitor"` for intake/API compatibility. */
export const TIERS = [
  {
    name: "$99 Website Refresh",
    badge: "Homepage + 2–3 sub pages",
    price: "$99",
    period: "One-time refresh · clear scope",
    tier: "monitor",
    desc: "Refresh your homepage and 2–3 important sub pages with clearer messaging, stronger calls to action, and a more modern layout direction.",
    includes: [
      "Homepage refresh",
      "2–3 key sub pages",
      "Clearer headline and CTAs",
      "Modern layout direction",
      "Business-specific messaging",
      "Simple onboarding after your mockup",
    ],
    cta: "Start My $99 Website Refresh",
    primary: true,
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
    secondaryLabel: "Back to the $99 refresh",
    secondaryHref: "/#pricing",
  },
} as const;

export const FAQ_ITEMS = [
  {
    q: "Is the homepage mockup my finished website?",
    a: "No. The mockup is a sample homepage concept based on your current site and preferences. It shows a clearer direction — final design, content, and launch details are refined during onboarding.",
  },
  {
    q: "What is included in the $99 Website Refresh?",
    a: "A refresh of your homepage plus 2–3 key sub pages — clearer messaging, stronger calls to action, and a more modern layout direction for the pages visitors use most.",
  },
  {
    q: "Is this a monthly subscription?",
    a: "No. The current offer is a flat $99 website refresh. There is no monthly plan required to get started.",
  },
  {
    q: "Which sub pages are included?",
    a: "Typically the pages that matter most for trust and conversion — for example Services, About, and Contact. We confirm the exact 2–3 pages during onboarding.",
  },
  {
    q: "How is this different from a full website rebuild?",
    a: "A full rebuild can touch every page and take much longer. This refresh focuses on the homepage and a few high-impact supporting pages so you can improve the first impression quickly.",
  },
  {
    q: "Do you still offer GEO / AI visibility?",
    a: "Yes. GEO assessments and AI visibility support remain available as a secondary offer and can be paired with the website refresh when useful.",
  },
  {
    q: "What happens after I like the mockup?",
    a: "Start the $99 Website Refresh and we turn the sample direction into a refreshed homepage and 2–3 key sub pages.",
  },
  {
    q: "How fast is the preview?",
    a: "The homepage concept is generated right after you submit your URL and preferences — so you can review a sample direction immediately.",
  },
];
