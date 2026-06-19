import type { DiscoveryResult } from "./types";
import type { StructuredFinding } from "./report-builder";
import { isAssetPresent } from "./asset-detection";

export type FixPreviewDraft = {
  type: "faq" | "service_page" | "cta" | "internal_linking" | "schema" | "trust" | "messaging";
  title: string;
  issue_summary: string;
  why_it_matters: string;
  before_text: string | null;
  after_text: string;
  html_preview: string | null;
  evidence_urls: string[];
  priority: "fix_first" | "improve_next" | "nice_to_add";
  implementation_effort: "light" | "medium" | "larger";
};

type PreviewContext = {
  companyName: string;
  websiteUrl: string;
  primaryService: string | null;
  serviceArea: string | null;
  discovery: DiscoveryResult;
  opportunities: StructuredFinding[];
};

function faqPreview(ctx: PreviewContext): FixPreviewDraft {
  const service = ctx.primaryService ?? "your core services";
  const area = ctx.serviceArea ?? "your service area";
  const faqs = [
    { q: `What does ${ctx.companyName} do?`, a: `${ctx.companyName} helps businesses in ${area} with ${service}. We focus on practical outcomes, clear communication, and a no-pressure approach.` },
    { q: "Who is this a good fit for?", a: "Small and medium businesses that want clearer visibility, stronger site structure, and practical recommendations—not hype or vague promises." },
    { q: "How does the process work?", a: "We review your site, identify priority fixes, and provide a structured plan. You can implement recommendations yourself or work with us for ongoing support." },
    { q: "How long until we see results?", a: "Technical and content improvements can begin immediately. AI visibility gains typically build over weeks and months as structure and content depth improve." },
    { q: "Do you require a long-term contract?", a: "Our starting plans are month-to-month where noted. Larger engagements are scoped clearly before work begins." },
    { q: "What makes you different?", a: "We emphasize evidence-based audits, plain-language reporting, and fixes that match how real buyers search—including AI-driven discovery." },
  ];

  const afterText = faqs.map((f, i) => `${i + 1}. ${f.q}\n${f.a}`).join("\n\n");

  return {
    type: "faq",
    title: "Example FAQ page structure",
    issue_summary: isAssetPresent(ctx.discovery.assets.faq_content_presence)
      ? "FAQ content appears present; expanding and schema-marking FAQs could strengthen AI citations."
      : "A dedicated FAQ page was not confirmed—buyers and AI systems both benefit from clear Q&A content.",
    why_it_matters:
      "FAQ pages are among the most cited content types in AI-generated answers. Clear questions and practical answers improve trust and discoverability.",
    before_text: null,
    after_text: afterText,
    html_preview: `<section><h2>Frequently Asked Questions</h2>${faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</section>`,
    evidence_urls: ctx.discovery.assets.faq_content_presence.evidence_urls,
    priority: isAssetPresent(ctx.discovery.assets.faq_content_presence) ? "improve_next" : "fix_first",
    implementation_effort: "medium",
  };
}

function servicePagePreview(ctx: PreviewContext): FixPreviewDraft {
  const service = ctx.primaryService ?? "your primary service";
  const afterText = [
    `Headline: ${service} for ${ctx.serviceArea ?? "local businesses"}`,
    "",
    "Who this is for",
    "Businesses that need clearer service positioning and stronger AI/search visibility.",
    "",
    "Problems this solves",
    "- Unclear offering pages",
    "- Thin or generic service copy",
    "- Weak internal linking between services",
    "",
    "What's included",
    "- Structured page sections (overview, fit, process, FAQs, CTA)",
    "- Practical recommendations tied to your audit findings",
    "",
    "Next step",
    "Request a review call or start with a monitored visibility plan.",
  ].join("\n");

  return {
    type: "service_page",
    title: "Example service page structure",
    issue_summary: `Service clarity for “${service}” can be strengthened with a dedicated, structured page.`,
    why_it_matters:
      "AI systems rely on distinct service pages to understand offerings. One strong page per service beats a single generic overview.",
    before_text: "Generic services overview with limited section structure.",
    after_text: afterText,
    html_preview: null,
    evidence_urls: ctx.discovery.assets.service_pages.evidence_urls.slice(0, 3),
    priority: "fix_first",
    implementation_effort: "larger",
  };
}

function ctaPreview(ctx: PreviewContext): FixPreviewDraft {
  return {
    type: "cta",
    title: "Example CTA rewrite",
    issue_summary: "Calls to action can be clearer about the next step and reduce friction.",
    why_it_matters:
      "AI systems and human visitors both respond to specific, calm conversion language—not vague “learn more” buttons alone.",
    before_text: "Contact us today to learn more.",
    after_text:
      "Request your AI visibility review — we will analyze your site structure, identify priority fixes, and follow up within 2–3 business days with practical next steps. No pressure, no long-term contract required for starter plans.",
    html_preview:
      '<div class="cta"><h3>Request your AI visibility review</h3><p>Practical findings and example fixes within 2–3 business days.</p><a href="/audit">Start with a review →</a></div>',
    evidence_urls: [ctx.websiteUrl],
    priority: "improve_next",
    implementation_effort: "light",
  };
}

function internalLinkingPreview(ctx: PreviewContext): FixPreviewDraft {
  const links = [
    { from: "Homepage", to: "/services or primary service page", anchor: "Explore our services" },
    { from: "Service pages", to: "/faq", anchor: "Common questions" },
    { from: "Service pages", to: "/contact", anchor: "Request a review" },
    { from: "FAQ page", to: "Top service page", anchor: "See how we help with [service]" },
    { from: "About page", to: "/case-studies or proof page", anchor: "See example outcomes" },
  ];

  const afterText = links.map((l) => `• ${l.from} → ${l.to} (“${l.anchor}”)`).join("\n");

  return {
    type: "internal_linking",
    title: "Example internal linking plan",
    issue_summary: "Cross-linking between key pages can be made more explicit.",
    why_it_matters:
      "Internal links help crawlers and AI systems understand page relationships and which pages matter most for each topic.",
    before_text: null,
    after_text: afterText,
    html_preview: null,
    evidence_urls: ctx.discovery.sitemapUrls.slice(0, 5),
    priority: "improve_next",
    implementation_effort: "light",
  };
}

function schemaPreview(ctx: PreviewContext): FixPreviewDraft {
  const sample = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: ctx.companyName,
    url: ctx.websiteUrl,
    areaServed: ctx.serviceArea ?? "Local service area",
    description: ctx.primaryService ?? "Professional services",
  };

  return {
    type: "schema",
    title: "Example organization / service schema",
    issue_summary:
      ctx.discovery.schema.organization_schema.status === "present"
        ? "Entity schema exists; extending with FAQ or Service schema may help."
        : "Organization or service schema was not confirmed in sampled HTML.",
    why_it_matters:
      "Structured data helps AI systems verify who you are, what you offer, and where you serve customers.",
    before_text: null,
    after_text: JSON.stringify(sample, null, 2),
    html_preview: `<script type="application/ld+json">${JSON.stringify(sample)}</script>`,
    evidence_urls: ctx.discovery.schema.organization_schema.evidence_urls,
    priority: "improve_next",
    implementation_effort: "medium",
  };
}

export function generateFixPreviews(
  ctx: Omit<PreviewContext, "opportunities">,
  opportunities: StructuredFinding[],
): FixPreviewDraft[] {
  const fullCtx: PreviewContext = { ...ctx, opportunities };
  const previews = [
    faqPreview(fullCtx),
    servicePagePreview(fullCtx),
    ctaPreview(fullCtx),
    internalLinkingPreview(fullCtx),
    schemaPreview(fullCtx),
  ];

  const priorityOrder = { fix_first: 0, improve_next: 1, nice_to_add: 2 };
  return previews.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
