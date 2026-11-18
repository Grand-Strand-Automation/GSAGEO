export const HOME_HERO = {
  eyebrow: "GEO (Generative Engine Optimization) for service businesses",
  headline: "When customers ask AI who to hire, does your business come up?",
  subheadline:
    "We check how ChatGPT, Google AI Overviews, Perplexity, Microsoft Copilot and Gemini read your website, show you what's holding you back, and help you fix it month to month.",
  primaryCta: "Check my site →",
  primaryHref: "/audit",
  checkRow: [
    "Free, results in minutes",
    "No obligation",
    "Grand Strand-based since 2015",
  ],
  sampleDomain: "coastalcomfort-hvac.example",
  sampleScore: 58,
  sampleSummary:
    "AI tools can find this business, but describe its services vaguely and rarely recommend it.",
  exampleLabel: "Example report: fictional business",
} as const;

export const ENGINES = [
  "ChatGPT",
  "Google AI Overviews",
  "Perplexity",
  "Microsoft Copilot",
  "Gemini",
] as const;

export const WHY_IT_MATTERS = {
  eyebrow: "Why it matters",
  title: "AI now answers the question before anyone clicks a link.",
  items: [
    {
      num: "01",
      title: "Buyers ask AI for a shortlist",
      body: '"Best commercial electrician near Myrtle Beach" now gets a written answer with three or four names, not ten blue links.',
    },
    {
      num: "02",
      title: "AI recommends what it understands",
      body: "These tools pull from your site and the web. Clear services, proof and structure get named; vague pages get skipped.",
    },
    {
      num: "03",
      title: "It's fixable, steadily",
      body: "Generative Engine Optimization (GEO) is ongoing work on clarity, trust, content and structure, not a one-time report.",
    },
  ],
} as const;

export const HOW_IT_WORKS = {
  id: "how",
  eyebrow: "How it works",
  title: "Start free. Keep going only if it's working.",
  side: "One free assessment, then a simple monthly loop. Month-to-month, cancel anytime.",
  steps: [
    {
      label: "Step 1 · Free",
      title: "Review",
      desc: "We scan your site and how AI tools describe you. You get a score and what's helping or hurting it.",
    },
    {
      label: "Step 2",
      title: "Prioritize",
      desc: "We pick the few changes most likely to move the needle, in plain language.",
    },
    {
      label: "Step 3",
      title: "Improve",
      desc: "You (or we, on Managed) update pages, proof and structure with clear guidance.",
    },
    {
      label: "Step 4 · Monthly",
      title: "Refresh",
      desc: "Each month we re-score, report progress and set the next priorities.",
    },
  ],
  monthlyBar: [
    "Score refresh",
    "Top priorities",
    "Practical recommendations",
    "Progress summary",
  ],
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
  "Want guaranteed rankings (nobody can promise that)",
  "Companies still early in defining their product or service offering",
  "Organizations with a brand-new site and very little content to work with",
  "Teams unwilling to review or update content over time",
];

export const WHATS_INCLUDED = [
  {
    title: "Monthly visibility review",
    desc: "We check how your business and website are showing up — and what has changed since last month.",
    icon: "review" as const,
  },
  {
    title: "Website clarity",
    desc: "We help you improve whether your services, pages, and messaging are easy to understand.",
    icon: "clarity" as const,
  },
  {
    title: "Trust & credibility",
    desc: "We guide improvements that help your business feel more complete and trustworthy online.",
    icon: "trust" as const,
  },
  {
    title: "Content & page improvements",
    desc: "We recommend practical updates to key pages, FAQs, and content that support visibility.",
    icon: "content" as const,
  },
  {
    title: "Clear next steps",
    desc: "A short, ranked list each month, never a 60-page audit nobody reads.",
    icon: "steps" as const,
  },
  {
    title: "Ongoing guidance",
    desc: "A real person in the Grand Strand to ask when something changes.",
    icon: "guidance" as const,
  },
];

/** Same order, labels, and values as SAMPLE_REPORT.signals. */
export const SAMPLE_TEASER_SCORES = [
  { name: "AI mentions", score: 58 },
  { name: "Service pages", score: 50 },
  { name: "Structured data", score: 32 },
  { name: "Entity clarity", score: 80 },
  { name: "Trust & proof", score: 70 },
  { name: "Local signals", score: 65 },
] as const;

export const TIERS = [
  {
    name: "Monitor",
    price: "$199/month",
    priceNote: null as string | null,
    tier: "monitor",
    includes: [
      "Monthly visibility snapshot",
      "Score refresh",
      "Priority recommendations",
      "Monthly email summary",
    ],
    cta: "Start with Monitor",
    primary: false,
  },
  {
    name: "Growth",
    price: "from $499/month",
    priceNote: null as string | null,
    tier: "growth",
    includes: [
      "Everything in Monitor",
      "Monthly live review call",
      "Written briefs for 1–3 key pages",
      "Action summary of what to ship",
      "Up to 1 hour/month of draft review or page edits",
    ],
    cta: "Start with Growth",
    primary: true,
  },
  {
    name: "Managed",
    price: "from $1,250/month",
    priceNote: null as string | null,
    tier: "managed",
    includes: [
      "Everything in Growth",
      "Hands-on implementation on priority pages",
      "Content planning for the month ahead",
      "Roadmap review each billing cycle",
    ],
    cta: "Request Managed",
    primary: false,
  },
];

/** TODO: Add real testimonials when available. Render proof section only when non-empty. */
export const TESTIMONIALS: Array<{
  quote: string;
  name: string;
  role: string;
  resultTitle: string;
  resultBody: string;
}> = [];

export const FAQ_ITEMS = [
  {
    q: "What is Generative Engine Optimization (GEO)?",
    a: "GEO is the work of making your business easy for AI tools like ChatGPT, Google AI Overviews, Perplexity and Microsoft Copilot to understand, trust and recommend. It focuses on clarity, structure, content and trust signals.",
  },
  {
    q: "How is this different from traditional SEO?",
    a: "SEO is about ranking pages in a list of links. GEO is about whether AI tools can confidently describe and recommend your business in a written answer. They overlap, and good SEO foundations help, but the priorities are different.",
  },
  {
    q: "How long does the free assessment take?",
    a: "About two minutes to request. Most reviews finish within minutes. We only reach out (within 2–3 business days) if we need more information.",
  },
  {
    q: "What happens after the free assessment?",
    a: "You get your score, what's helping, what's hurting and what to fix first. If ongoing help makes sense, pick a monthly plan. If not, the assessment is yours to keep.",
  },
  {
    q: "Do I need a monthly plan if I only want the assessment?",
    a: "No. The assessment is free with no obligation.",
  },
  {
    q: "Is this a contract? Can I cancel anytime?",
    a: "No long contracts. Every plan is month-to-month and you can cancel anytime.",
  },
  {
    q: "How hands-on is the support?",
    a: "Monitor is guidance only — snapshot, priorities, and recommendations. Growth adds a monthly review, page briefs, and up to about an hour of draft review or edits. Managed includes hands-on implementation on priority pages plus content planning and roadmap reviews.",
  },
  {
    q: "Can you guarantee I'll be recommended by AI?",
    a: "No one can honestly guarantee that. What we can do is make your business clearer and more credible to these tools, and show you the progress every month.",
  },
];

export const SAMPLE_ENGINE_ROWS = [
  { engine: "ChatGPT", status: "Mentioned, vague", tone: "warn" as const },
  { engine: "Google AI Overviews", status: "Not cited", tone: "bad" as const },
  { engine: "Perplexity", status: "Cited", tone: "good" as const },
  { engine: "Microsoft Copilot", status: "Not cited", tone: "bad" as const },
  { engine: "Gemini", status: "Mentioned, vague", tone: "warn" as const },
] as const;

/** Local trust block — photo/LinkedIn can be filled when assets are ready. */
export const ABOUT_BLOCK = {
  name: "Shawn Landau",
  role: "Founder, Grand Strand Ally",
  since: "Local since 2015",
  body: "Grand Strand Ally helps service businesses show up clearly when customers ask AI who to hire — with plain-language assessments and month-to-month support, not agency jargon.",
  /** Set when a public headshot is available under /public/brand/ */
  photoSrc: null as string | null,
  linkedinUrl: null as string | null,
} as const;
