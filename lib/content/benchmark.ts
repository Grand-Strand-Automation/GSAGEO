import { siteConfig } from "@/lib/brand/site";

export const BENCHMARK_CTAS = {
  primaryAudit: "/audit?tier=monitor",
  bookReview: `mailto:${siteConfig.email}?subject=${encodeURIComponent("Myrtle Beach AI Visibility Benchmark — review request")}`,
  requestSummary: `mailto:${siteConfig.email}?subject=${encodeURIComponent("Myrtle Beach AI Visibility Benchmark — summary request")}`,
} as const;

export const BENCHMARK_HERO = {
  eyebrow: "Myrtle Beach · Grand Strand",
  headline: "Myrtle Beach AI Visibility Benchmark",
  subheadline:
    "See how your website stacks up for AI-driven search, recommendations, and answer engines. We benchmark Myrtle Beach and Grand Strand service businesses to identify the visibility gaps that traditional SEO reports often miss.",
  supportParagraph:
    "Many local businesses have decent websites but still may not be clearly understood by AI-driven search systems. This benchmark helps show where your site is strong, where it is unclear, and what likely needs to improve to earn more visibility in AI-generated answers.",
  chips: [
    "Built for Myrtle Beach & Grand Strand businesses",
    "Designed for service-based companies",
    "Focused on AI visibility, not just rankings",
  ],
  primaryCta: "Request Your AI Visibility Assessment",
  secondaryCta: "Book a Benchmark Review",
} as const;

export const BENCHMARK_INTRO = {
  label: "The Benchmark",
  title: "What the Myrtle Beach AI Visibility Benchmark Actually Measures",
  paragraphs: [
    "The Myrtle Beach AI Visibility Benchmark is a local review framework built to evaluate how well a business website is positioned for AI-driven discovery. Instead of only asking whether a site can rank in traditional search, this benchmark looks at whether the business is clearly described, well-structured, locally relevant, and easy for AI systems to interpret.",
    "As more people use AI-generated answers, summaries, and recommendations to find services, a website needs more than surface-level SEO. It needs clear service coverage, strong business identity signals, useful supporting content, and a structure that helps machines understand what the company does, where it operates, and why it is trustworthy.",
    "This benchmark exists to help Myrtle Beach and Grand Strand businesses understand where they stand now and what practical improvements would likely make the biggest difference.",
  ],
} as const;

export const BENCHMARK_AUDIENCE = [
  {
    title: "Home Services",
    copy: "Ideal for HVAC, plumbing, electrical, roofing, landscaping, remodeling, cleaning, and other local service businesses that depend on trust, service-area clarity, and strong lead flow.",
  },
  {
    title: "Professional & Trust-Based Services",
    copy: "A good fit for law firms, accountants, consultants, medical practices, wellness providers, and other businesses that need clear expertise signals and strong question-based content.",
  },
  {
    title: "Hospitality-Adjacent Businesses",
    copy: "Useful for tourism-related, property-related, and hospitality-support businesses that compete in a crowded local environment and need stronger digital positioning.",
  },
  {
    title: "Local B2B Service Firms",
    copy: "Works well for IT providers, compliance firms, operations support companies, agencies, and specialty service businesses with multiple offers and longer buying cycles.",
  },
  {
    title: "Multi-Service Businesses",
    copy: "Especially valuable for companies with several service lines that need better internal linking, clearer service pages, and stronger page-level structure.",
  },
  {
    title: "Businesses That Feel Underrepresented Online",
    copy: "If your business is credible in the real world but your website does not clearly communicate what you do, how you help, and why you are different, this benchmark is likely relevant.",
  },
] as const;

export const BENCHMARK_NOT_FIT = {
  title: "Probably Not a Fit For",
  copy: "This is usually not the right first step for brand-new placeholder sites, businesses that are not ready to improve site content, or companies looking for guaranteed rankings instead of practical visibility improvements.",
} as const;

export const BENCHMARK_CATEGORIES = [
  {
    title: "FAQ Presence & Question Coverage",
    copy: "We look for whether your site addresses the real questions a customer might ask before contacting you, including service concerns, trust questions, and location-related questions.",
    why: "AI systems often rely on clear question-and-answer style content to understand business relevance and usefulness.",
  },
  {
    title: "Service Page Depth",
    copy: "We review whether your core services are explained with enough depth, specificity, and structure to show what you do, who it is for, and how the service works.",
    why: "Thin or generic service pages make it harder for both users and AI systems to confidently understand your offer.",
  },
  {
    title: "Internal Linking Structure",
    copy: "We assess how well your important pages connect to each other, including whether service pages, FAQs, proof content, and supporting pages reinforce one another.",
    why: "Strong internal linking improves site clarity and helps search systems understand content relationships.",
  },
  {
    title: "Schema & Structured Data Readiness",
    copy: "We check whether your site appears ready for stronger structured data signals around your business, services, and supporting content.",
    why: "Structured data can help reinforce meaning, business identity, and page purpose.",
  },
  {
    title: "Entity Clarity",
    copy: "We evaluate how clearly your website communicates who your company is, what you do, where you work, and what makes you a relevant local provider.",
    why: "If your business identity is vague, AI systems may struggle to place you accurately in recommendations or summaries.",
  },
  {
    title: "Process Clarity",
    copy: "We review whether the site clearly explains how customers engage with you, what happens next, and how the buying process works.",
    why: "Process clarity improves trust, conversion readiness, and interpretability.",
  },
  {
    title: "Proof & Trust Signals",
    copy: "We look for trust-building content such as case studies, service proof, local credibility, outcomes, testimonials, process detail, and practical expertise signals.",
    why: "Trust signals help both people and machines understand why your business deserves confidence.",
  },
  {
    title: "CTA Clarity & Conversion Readiness",
    copy: "We review whether your site makes it obvious what a visitor should do next and whether the next step feels easy, relevant, and low-friction.",
    why: "A site can be informative but still weak at converting interest into action.",
  },
  {
    title: "Technical Discoverability",
    copy: "We look at foundational discoverability elements such as crawlability cues, sitemap visibility, and whether the site appears structured in a way that supports consistent access.",
    why: "If the site is difficult to access or interpret technically, stronger content alone may not be enough.",
  },
] as const;

export const BENCHMARK_COMMON_ISSUES = [
  {
    title: "Thin Service Pages",
    copy: "Many sites mention services without fully explaining who the service is for, what problems it solves, what is included, or why the business is a strong fit.",
  },
  {
    title: "Missing FAQ Coverage",
    copy: "Important customer questions are often left unanswered, especially around service fit, process, cost expectations, timing, geography, and trust concerns.",
  },
  {
    title: "Weak Internal Linking",
    copy: "Service pages, supporting pages, and trust content are often disconnected, which makes the site feel flatter and harder to interpret.",
  },
  {
    title: "Unclear Business Identity",
    copy: "Some websites do not clearly communicate what the company specializes in, how it is positioned locally, or what type of customer it best serves.",
  },
  {
    title: "Limited Proof Content",
    copy: "Many businesses have credibility in real life but not enough visible proof on the site to support trust and differentiation online.",
  },
  {
    title: "Weak Conversion Paths",
    copy: "Even when the service is valuable, the site may not make it easy for visitors to understand the next step or feel confident taking action.",
  },
  {
    title: "Content That Works for Humans but Not for AI",
    copy: "A site can look fine visually and still be difficult for AI systems to summarize because the content lacks structure, specificity, or supporting context.",
  },
] as const;

export const BENCHMARK_LOCAL_CONTEXT = {
  label: "Local Context",
  title: "Why This Matters in Myrtle Beach",
  paragraphs: [
    "Myrtle Beach and the Grand Strand are highly competitive local markets. Many businesses depend on service-area visibility, trust, referrals, and local discovery. That creates pressure not only to be found in traditional search, but also to be clearly represented when AI tools generate recommendations, summaries, or answer-style results.",
    "For service businesses here, visibility is not just about traffic. It is about whether your business is clearly understood, compared accurately, and presented confidently when someone asks an AI tool who they should call, which provider looks credible, or what local options seem best.",
    "This benchmark gives local business owners a more practical way to understand where their website may be under-communicating value.",
  ],
} as const;

export const BENCHMARK_STAT_STRIP = [
  { label: "Benchmark categories", value: "9" },
  { label: "Market focus", value: "Myrtle Beach & Grand Strand" },
  { label: "Approach", value: "Assessment-first & practical" },
] as const;

export const BENCHMARK_PROCESS = [
  {
    step: "01",
    title: "We Review Your Public Website Presence",
    copy: "We look at the public pages, structure, and messaging currently available on your site.",
  },
  {
    step: "02",
    title: "We Benchmark Key AI Visibility Signals",
    copy: "We assess the core signals that influence whether your business is easy to understand and surface in AI-driven discovery.",
  },
  {
    step: "03",
    title: "We Compare Against Common Local Patterns",
    copy: "We use local business context and recurring patterns to identify whether your site appears stronger, weaker, or less complete than it should.",
  },
  {
    step: "04",
    title: "We Highlight Priority Gaps",
    copy: "We identify where clarity, structure, trust, content depth, or conversion flow may be limiting visibility.",
  },
  {
    step: "05",
    title: "We Recommend the Next Best Moves",
    copy: "We translate the findings into practical next steps so you can improve the areas most likely to matter first.",
  },
] as const;

export const BENCHMARK_DELIVERABLES = [
  {
    title: "AI Visibility Benchmark Summary",
    copy: "A focused overview of how your site currently appears from an AI visibility perspective.",
  },
  {
    title: "Category-Level Findings",
    copy: "A breakdown of strengths, weaknesses, and unclear areas across the major benchmark categories.",
  },
  {
    title: "Priority Issues",
    copy: "A short list of the most important problems likely limiting clarity, trust, discoverability, or actionability.",
  },
  {
    title: "Recommended Next Steps",
    copy: "Practical suggestions to improve the parts of the site that appear most likely to matter first.",
  },
  {
    title: "Local Comparison Perspective",
    copy: "Context for how your site fits into common local patterns seen across Myrtle Beach and Grand Strand service businesses.",
  },
  {
    title: "Optional Assessment Follow-Up",
    copy: "A path into a deeper assessment or review conversation if you want more detailed help prioritizing improvements.",
  },
] as const;

export const BENCHMARK_PREVIEW_SAMPLES = [
  {
    category: "FAQ Coverage",
    status: "Limited" as const,
    summary: "Key customer questions are not consistently addressed across the site.",
  },
  {
    category: "Service Page Depth",
    status: "Moderate" as const,
    summary: "Core services are mentioned, but several pages would benefit from clearer detail and stronger structure.",
  },
  {
    category: "Entity Clarity",
    status: "Moderate" as const,
    summary: "The business is visible, but specialization and service fit could be communicated more clearly.",
  },
  {
    category: "CTA Clarity",
    status: "Weak" as const,
    summary: "The next step is present, but the conversion path could feel more direct and confidence-building.",
  },
] as const;

export const BENCHMARK_SAMPLE_ACTION = {
  title: "Example Next Best Action",
  copy: "Strengthen one core service page, add a relevant FAQ block, improve internal links between key service pages, and clarify the primary call to action.",
} as const;

export const BENCHMARK_WHY = {
  label: "Why GSAGEO",
  title: "Why Businesses Use GSAGEO for This",
  paragraphs: [
    "GSAGEO is built around a practical idea: many service businesses do not need more vague marketing advice. They need clearer visibility into what their website is actually communicating and where it is likely falling short.",
    "Our approach is local, structured, and assessment-first. We focus on service businesses, real-world clarity, and the content signals that help websites become easier to understand for both people and AI-driven systems.",
    "Because this benchmark is framed around Myrtle Beach and the Grand Strand, the recommendations are grounded in the kind of businesses, competition, and trust dynamics that matter here.",
  ],
  pillars: [
    { title: "Local business context", copy: "Framed for Myrtle Beach and Grand Strand service patterns, not generic national templates." },
    { title: "Practical recommendations", copy: "Findings translate into clear next steps — not abstract score dumps." },
    { title: "AI visibility specialization", copy: "Focused on how machines interpret your site, not rankings alone." },
    { title: "Built for service businesses", copy: "Designed for trust-based, locally competitive companies with real offers to explain." },
  ],
} as const;

export const BENCHMARK_MID_CTA = {
  title: "See How Your Website Compares",
  copy: "If your business depends on local trust, search visibility, and qualified inquiries, this benchmark gives you a clearer picture of how your website is currently performing from an AI visibility standpoint.",
  supportLine: "No hype. No generic score dump. Just a clearer view of what your site is communicating and where it may need work.",
} as const;

export const BENCHMARK_FAQ = [
  {
    q: "What is AI visibility?",
    a: "AI visibility refers to how clearly your business can be understood, summarized, and recommended by AI-driven search tools, answer engines, and related systems.",
  },
  {
    q: "How is this different from traditional SEO?",
    a: "Traditional SEO often focuses on rankings, keywords, and search traffic. AI visibility also depends on how clearly your website communicates services, expertise, structure, relevance, and trust in a way machines can interpret confidently.",
  },
  {
    q: "Is this only for Myrtle Beach businesses?",
    a: "The benchmark is designed around Myrtle Beach and Grand Strand business patterns, but the underlying framework is useful for many service-based businesses that rely on trust and local visibility.",
  },
  {
    q: "What kinds of businesses benefit most?",
    a: "Service businesses with multiple offers, local competition, trust-based buying decisions, or thin website content usually benefit the most.",
  },
  {
    q: "Do I need a full website rebuild?",
    a: "Usually not. Many businesses need clearer structure, stronger service pages, better internal linking, improved FAQs, or more useful trust content before they need a full redesign.",
  },
  {
    q: "What happens after the benchmark?",
    a: "After the benchmark, you will have a clearer picture of where your site appears strong, where it is unclear, and what the most practical next improvements may be.",
  },
  {
    q: "Is this a free review or a paid assessment?",
    a: "We can review the right next step based on your business, goals, and how detailed you want the analysis to be.",
  },
] as const;

export const BENCHMARK_FINAL_CTA = {
  title: "Your Website May Look Fine — But Is It Clear Enough for AI-Driven Discovery?",
  copy: "If your site is not clearly explaining what you do, who you help, and why you are a strong local option, there is a good chance it is underperforming in ways a normal website review will not catch. The Myrtle Beach AI Visibility Benchmark is designed to make those gaps easier to see — and easier to prioritize.",
} as const;

export const BENCHMARK_METADATA = {
  title: "Myrtle Beach AI Visibility Benchmark",
  description:
    "See how your website stacks up for AI-driven search and local visibility. The Myrtle Beach AI Visibility Benchmark helps service businesses identify FAQ, service-page, trust, schema, and conversion gaps.",
  path: "/myrtle-beach-ai-visibility-benchmark",
} as const;
