export const HOME_HERO = {
  eyebrow: "Website Design + Redesign",
  headline: "Get a Better Website — Starting With a Custom Homepage Concept",
  subheadline:
    "Share your website, company details, and goals, and we’ll review whether a homepage refresh or a full redesign makes the most sense. Request a custom homepage mockup and we’ll follow up by email.",
  primaryCta: "Request a Homepage Mockup",
  primaryHref: "#mockup",
  secondaryCta: "See Before & After Examples",
  secondaryHref: "#examples",
  tertiaryCta: "Learn about GEO next",
  tertiaryHref: "#geo",
  supportLine:
    "Homepage refreshes available · Full website redesigns available · GEO support after launch",
  reviewCardTitle: "What you’ll get when you request a mockup",
  reviewCardBullets: [
    "A tailored homepage concept reviewed by our team",
    "Clear guidance on refresh vs full redesign",
    "Stronger messaging and CTA direction for your business",
    "A simple path into the $99 homepage refresh or a full redesign",
    "Follow-up by email — no instant automated output on the page",
  ],
} as const;

export const MOCKUP_EXPECTATION =
  "Custom mockups are prepared after we review your business details — not generated instantly on this page. Final design, content, and launch details are refined during onboarding.";

export const BEFORE_AFTER = {
  label: "Examples",
  title: "See the difference a clearer website can make",
  intro:
    "A stronger homepage can improve first impressions, clarify what you do, and make it easier for visitors to take the next step.",
  disclaimer:
    "Illustrative before/after examples — sample redesign directions, not claims about a specific client.",
  examples: [
    {
      id: "messaging",
      label: "Sample redesign direction",
      title: "Clearer messaging above the fold",
      beforeLabel: "Before",
      afterLabel: "After",
      beforePoints: [
        "Vague headline that does not say what the business does",
        "Weak or buried call to action",
        "Crowded, hard-to-scan first screen",
      ],
      afterPoints: [
        "Headline that states the offer and who it serves",
        "Primary CTA placed where visitors expect it",
        "Cleaner hierarchy so the first impression feels confident",
      ],
      changed: ["Clearer messaging", "Stronger CTA placement", "More modern layout"],
    },
    {
      id: "trust",
      label: "Example homepage improvement",
      title: "Improved trust and next steps",
      beforeLabel: "Before",
      afterLabel: "After",
      beforePoints: [
        "Little proof or credibility near the hero",
        "Services listed without clear structure",
        "Visitors unsure what to do next",
      ],
      afterPoints: [
        "Trust cues placed near the primary action",
        "Service overview that is easy to scan",
        "Obvious path to call, book, or request a quote",
      ],
      changed: ["Improved trust structure", "Easier-to-scan service overview", "Stronger CTA placement"],
    },
    {
      id: "structure",
      label: "Illustrative before/after",
      title: "A layout visitors can actually use",
      beforeLabel: "Before",
      afterLabel: "After",
      beforePoints: [
        "Long walls of text with little visual rhythm",
        "Inconsistent sections that feel outdated",
        "Mobile experience that feels cramped",
      ],
      afterPoints: [
        "Sectioned layout with clear breathing room",
        "Modern structure that still feels on-brand",
        "Mobile-first spacing and readable type",
      ],
      changed: ["More modern layout", "Clearer messaging", "Improved trust structure"],
    },
  ],
} as const;

export const HOW_MOCKUP_WORKS = {
  label: "How it works",
  title: "From request to the right design path",
  intro:
    "A simple, high-trust process: share your site, we review the fit, prepare a custom mockup when requested, then move into refresh, redesign, or GEO when it makes sense.",
  steps: [
    {
      title: "Share your website",
      desc: "Submit your company name, website URL, and what you want to improve.",
    },
    {
      title: "We review the fit",
      desc: "We assess whether a homepage refresh or full redesign makes more sense.",
    },
    {
      title: "Request a custom mockup",
      desc: "If you want a homepage concept, we’ll follow up by email with next steps.",
    },
    {
      title: "Design, GEO, and beyond",
      desc: "Once your site is stronger, GEO support and broader digital help can follow if useful.",
    },
  ],
} as const;

export const DESIGN_OFFERS = {
  label: "Design options",
  title: "Choose the right starting point",
  intro:
    "Whether you need a focused first step or a broader overhaul, we offer both a quick homepage refresh and full website design / redesign.",
  helper: "Not sure which fits best? Request a mockup and we’ll help you choose the right path.",
  offers: [
    {
      id: "refresh",
      name: "Homepage Refresh",
      price: "$99",
      badge: "Fast entry offer",
      period: "One-time · clear scope",
      desc: "A focused first step for businesses that want a cleaner, clearer homepage without committing to a full redesign right away.",
      includes: [
        "Homepage refresh",
        "2–3 key sub pages",
        "Clearer headline and CTAs",
        "Modern layout direction",
        "Business-specific messaging",
      ],
      cta: "Start My $99 Homepage Refresh",
      href: "/start?tier=monitor",
      primary: false,
    },
    {
      id: "full",
      name: "Full Website Design / Redesign",
      price: "Custom scope",
      badge: "Complete project",
      period: "Broader visual, structural, and messaging overhaul",
      desc: "A more complete website project for businesses that need a broader redesign — not just a homepage refresh.",
      includes: [
        "Full site design or redesign",
        "Information architecture & page structure",
        "Messaging and conversion-focused layout",
        "Multi-page visual system",
        "Guided discovery and project scoping",
      ],
      cta: "Request Full Redesign Guidance",
      href: "/#mockup",
      primary: true,
    },
  ],
} as const;

export const WHATS_INCLUDED_INTRO =
  "Built for businesses that need a clearer, more modern website — whether you start with a focused homepage refresh or a full redesign.";

export const WHATS_INCLUDED = [
  {
    title: "Homepage Concept / Mockup",
    desc: "A tailored homepage direction prepared after we review your business and goals.",
  },
  {
    title: "$99 Homepage Refresh",
    desc: "A practical refresh of your homepage and 2–3 key sub pages when a focused start is enough.",
  },
  {
    title: "Full Website Redesign",
    desc: "Broader visual, structural, and messaging work when the whole site needs an overhaul.",
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
    title: "GEO After Launch",
    desc: "Once the site is stronger, GEO / AI visibility support can be the natural next step.",
  },
];

export const DELIVERABLES_HEADING = "What You Get";

export const DELIVERABLES_INTRO =
  "Professional website design support — from a focused refresh to a full redesign — with a clear request-led mockup path.";

export const DELIVERABLES_SUPPORT =
  "Designed to make your website clearer, more credible, and easier to act on — for any type of business.";

export const DELIVERABLES = [
  {
    title: "Custom Mockup Request",
    desc: "Tell us about your site and goals; we follow up with a tailored homepage concept.",
  },
  {
    title: "Homepage Refresh Path",
    desc: "Turn the approved direction into a refreshed homepage and a few key pages for $99.",
  },
  {
    title: "Full Redesign Path",
    desc: "Expand into a broader website project when structure, brand, and messaging need more work.",
  },
  {
    title: "Clear Next Steps",
    desc: "Practical guidance so you know whether refresh, redesign, or GEO comes next.",
  },
];

export const GOOD_FIT = [
  "Businesses that need a clearer, more modern website",
  "Companies that want a stronger first impression online",
  "Owners tired of an outdated site that does not convert well",
  "Teams that want clearer messaging, better structure, and stronger calls to action",
  "Organizations open to either a focused refresh or a full redesign",
  "Companies that want a practical next step without vague marketing fluff",
];

export const NOT_FIT = [
  "Businesses looking for a free finished website with no engagement",
  "Companies that need a massive custom app or complex software platform",
  "Anyone expecting instant automated mockups generated on this page",
  "Anyone expecting guaranteed rankings or overnight lead spikes",
];

export const WHY_ONGOING = {
  label: "Why this works",
  title: "Why a Clearer Website Beats a Vague Rebuild Promise",
  body: [
    "Most businesses do not need endless agency theater to improve results. They need clearer messaging, stronger calls to action, and a site structure visitors can trust.",
    "That is why we offer two honest paths: a focused $99 homepage refresh when a fast first step is enough, and full website design / redesign when the whole experience needs more work.",
  ],
  support: "Request a mockup · Choose refresh or redesign · Add GEO when the foundation is ready.",
} as const;

export const BROADER_SUPPORT = {
  label: "Beyond the website",
  title: "Need broader support too?",
  body: "If your business also needs help beyond the website — such as visibility, systems, support structure, or operational clarity — we can help there too.",
  cta: "Visit the main Grand Strand Ally site",
  href: "https://gsally.com",
} as const;

/** Kept for pricing section compatibility; dual offers live in DESIGN_OFFERS. */
export const PRICING_HEADLINE = "Website design options";

export const PRICING_INTRO =
  "Start with a custom homepage mockup request, then choose the path that fits — a focused $99 refresh or a full website redesign.";

export const PRICING_SUBLINE =
  "Homepage refreshes · Full redesigns · GEO as a next-stage offer";

export const PRICING_REASSURANCE = [
  "Request-led mockups",
  "Clear refresh scope",
  "Full redesign available",
  "GEO after launch",
];

export const PRICING_HELPER =
  "Request a homepage mockup first. We’ll help you decide whether the $99 refresh or a full redesign is the better fit.";

export const PRICING_DOWNGRADE_NOTE =
  "Need more pages later? We can expand from a refresh into broader redesign work when it makes sense.";

export const PRICING_CUSTOM_NOTE =
  "Need support across multiple locations, a larger footprint, or a custom scope?";

/** Single intake-compatible tier for /start — full redesign uses mockup request. */
export const TIERS = [
  {
    name: "$99 Homepage Refresh",
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
      "Simple onboarding after mockup review",
    ],
    cta: "Start My $99 Homepage Refresh",
    primary: true,
  },
];

export const GEO_SECONDARY = {
  label: "What comes after the redesign?",
  title: "Once your website is clearer, GEO is the natural next step",
  body: "A stronger website is the foundation. GEO helps improve how clearly your business appears in AI-driven search and answer engines — after the design work makes your offer easier to understand.",
  primaryCta: "Start Free GEO Assessment",
  primaryHref: "/audit",
  secondaryCta: "Learn what GEO covers",
  secondaryHref: "/#understanding-geo",
} as const;

export const ASSESSMENT_PREVIEW = {
  eyebrow: "SAMPLE GEO REPORT",
  title: "GEO / AI Visibility — available after your site is stronger",
  description:
    "If AI search visibility matters for your business, our free assessment shows what looks strong, what needs work, and what to improve first.",
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
    heading: "Ready for AI visibility after the redesign?",
    body: "Request a free GEO assessment once your website foundation is clearer — or explore it anytime if that is already a priority.",
    label: "Start Free GEO Assessment",
    href: "/audit",
    secondaryLabel: "Request a homepage mockup",
    secondaryHref: "/#mockup",
  },
} as const;

export const FAQ_ITEMS = [
  {
    q: "Do I get a live mockup instantly?",
    a: "No. We no longer generate instant automated mockups on this page. Request a homepage mockup through the form, and we’ll review your details and follow up by email.",
  },
  {
    q: "How do I request a homepage mockup?",
    a: "Share your company name, website URL, email, and a few details about what you want to improve. We’ll review the fit and follow up with next steps for a custom homepage concept.",
  },
  {
    q: "What is included in the $99 homepage refresh?",
    a: "A refresh of your homepage plus 2–3 key sub pages — clearer messaging, stronger calls to action, and a more modern layout direction for the pages visitors use most.",
  },
  {
    q: "When should I choose full website redesign instead?",
    a: "Choose a full redesign when the whole site needs a broader visual, structural, and messaging overhaul — not just a clearer homepage. Request a mockup and we’ll help you decide.",
  },
  {
    q: "Do you only work with service businesses?",
    a: "No. The offer is for all types of businesses that need a clearer, more modern website — not only service businesses.",
  },
  {
    q: "Can you redesign the full site, not just the homepage?",
    a: "Yes. Full website design and redesign are a core offer alongside the focused $99 homepage refresh.",
  },
  {
    q: "What happens after the redesign?",
    a: "Once your site is clearer and stronger, GEO / AI visibility support is available as the natural next step — plus broader Grand Strand Ally support if you need it.",
  },
  {
    q: "Is GEO still available?",
    a: "Yes. GEO assessments and AI visibility support remain available as a next-stage offer after website design or redesign work.",
  },
];
