import type { StructuredFinding } from "@/lib/audit/report-builder";
import type {
  FindingFixMapping,
  InternalFixContext,
  InternalFixDraft,
  InternalFixGeneratedContent,
  InternalFixType,
} from "./types";

function baseDraft(
  type: InternalFixType,
  finding: StructuredFinding,
  ctx: InternalFixContext,
  overrides: Partial<InternalFixDraft>,
): InternalFixDraft {
  return {
    type,
    related_finding_label: finding.label,
    related_finding_category: finding.category,
    title: overrides.title ?? `${finding.label} — internal fix draft`,
    issue_summary: overrides.issue_summary ?? finding.summary,
    why_it_matters:
      overrides.why_it_matters ??
      "This change strengthens how AI systems and buyers understand your offering.",
    affected_urls: overrides.affected_urls ?? finding.evidence_urls.slice(0, 5),
    generated_content: overrides.generated_content ?? {},
    generated_html: overrides.generated_html ?? null,
    generated_json: overrides.generated_json ?? null,
    implementation_notes: overrides.implementation_notes ?? finding.recommendation,
    implementation_effort: overrides.implementation_effort ?? effortForFinding(finding),
    priority: overrides.priority ?? finding.priority,
    confidence: overrides.confidence ?? confidenceForFinding(finding),
    status: overrides.status ?? "generated",
  };
}

function effortForFinding(finding: StructuredFinding): "light" | "medium" | "larger" {
  if (finding.category === "technical" || finding.label.includes("schema")) return "medium";
  if (finding.label.includes("service") || finding.label.includes("Educational")) return "larger";
  if (finding.label.includes("CTA") || finding.label.includes("Contact")) return "light";
  return finding.impact === "high" ? "medium" : "light";
}

function confidenceForFinding(finding: StructuredFinding): "high" | "medium" | "low" {
  if (finding.status === "Absent") return "high";
  if (finding.status === "Not confirmed") return finding.confidence === "high" ? "medium" : "low";
  return finding.confidence === "high" ? "high" : "medium";
}

function cautionNote(finding: StructuredFinding, mode: "cautious"): string {
  return `Cautious draft: ${finding.label} was "${finding.status}" with ${finding.confidence} confidence. Validate on-site before implementing.`;
}

function faqFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const service = ctx.primaryService ?? "your core services";
  const area = ctx.serviceArea ?? "your service area";
  const faqs = [
    {
      question: `What does ${ctx.companyName} do?`,
      answer: `${ctx.companyName} helps businesses in ${area} with ${service}. We focus on practical outcomes and clear communication.`,
      placement: "/faq (new or expanded section)",
    },
    {
      question: "Who is this a good fit for?",
      answer:
        "Small and medium businesses that want clearer visibility, stronger site structure, and practical recommendations.",
      placement: "/faq",
    },
    {
      question: "How does the process work?",
      answer:
        "We review your site, identify priority fixes, and provide a structured implementation plan with optional ongoing support.",
      placement: "/faq",
    },
    {
      question: "How long until we see results?",
      answer:
        "Technical and content improvements can begin immediately. AI visibility gains typically build over weeks as structure and depth improve.",
      placement: "/faq",
    },
    {
      question: "What makes you different?",
      answer:
        "Evidence-based audits, plain-language reporting, and fixes aligned with how real buyers search—including AI-driven discovery.",
      placement: "/faq",
    },
  ];

  const content: InternalFixGeneratedContent = {
    faqs,
    sections: [
      {
        heading: "Suggested page placement",
        body: "Add or expand a /faq page. Cross-link from homepage hero, service pages, and footer.",
      },
      {
        heading: "Topic grouping",
        body: "Group FAQs into: About the business · Fit & process · Timeline & pricing · Differentiation",
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return baseDraft("faq_fix", finding, ctx, {
    title: "FAQ draft — questions, answers, and placement",
    issue_summary: finding.summary,
    why_it_matters:
      "FAQ content is frequently cited by AI systems. Structured Q&A improves trust, conversion, and answer-engine coverage.",
    generated_content: content,
    generated_html: `<section class="faq-draft"><h2>Frequently Asked Questions</h2>${faqs
      .map((f) => `<details><summary>${f.question}</summary><p>${f.answer}</p></details>`)
      .join("")}</section>`,
    generated_json: { faqPageSchema: faqSchema },
    implementation_notes: [
      finding.recommendation,
      "Add FAQPage JSON-LD after publishing FAQ content.",
      "Link FAQ entries from relevant service pages with descriptive anchor text.",
    ].join(" "),
    implementation_effort: "medium",
  });
}

function servicePageFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const service = ctx.primaryService ?? "Primary service";
  const area = ctx.serviceArea ?? "local businesses";
  const content: InternalFixGeneratedContent = {
    sections: [
      { heading: "Headline", body: `${service} for ${area}` },
      {
        heading: "Who this is for",
        body: "Businesses that need clearer service positioning and stronger AI/search visibility without hype.",
      },
      {
        heading: "Problems this solves",
        body: "• Unclear offering pages\n• Thin or generic service copy\n• Weak internal linking between services\n• Missing proof near the offer",
      },
      {
        heading: "What's included",
        body: "Overview · Fit criteria · Process summary · FAQ block · Proof/trust block · Clear CTA",
      },
      {
        heading: "FAQ block (on-page)",
        body: "3–5 service-specific questions with practical answers (see FAQ fix draft if generated separately).",
      },
      {
        heading: "Trust / proof block",
        body: "Add 1–2 outcome summaries, client logos, or anonymized case highlights near the CTA.",
      },
      {
        heading: "CTA block",
        body: `Request a ${service} review — practical next steps within 2–3 business days. No pressure.`,
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("service_page_fix", finding, ctx, {
    title: `Service page rewrite — ${service}`,
    generated_content: content,
    implementation_notes:
      "Create one dedicated URL per core service. Avoid combining unrelated offers on a single thin page.",
    implementation_effort: "larger",
  });
}

function ctaFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const content: InternalFixGeneratedContent = {
    ctaVariants: [
      {
        label: "Primary CTA",
        copy: `Request your AI visibility review — we analyze ${ctx.companyName}'s site structure, identify priority fixes, and follow up within 2–3 business days.`,
        placement: "Homepage hero + service page footer",
      },
      {
        label: "Lower-friction CTA",
        copy: "See example audit findings — review a sample report before committing to changes.",
        placement: "Mid-page on service or conversion pages",
      },
      {
        label: "Contact CTA",
        copy: "Talk through your priorities — 20-minute fit call, no obligation.",
        placement: "/contact page headline",
      },
    ],
    sections: [
      {
        heading: "Placement notes",
        body: "Place primary CTA after proof section on service pages. Repeat a lighter CTA after FAQ blocks.",
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("cta_fix", finding, ctx, {
    title: "CTA rewrite — conversion copy variants",
    issue_summary: finding.summary,
    why_it_matters:
      "Specific, calm conversion language helps both human visitors and AI summaries understand the next step.",
    generated_content: content,
    generated_html:
      '<div class="cta-block"><h3>Request your AI visibility review</h3><p>Practical findings within 2–3 business days.</p></div>',
    implementation_effort: "light",
  });
}

function internalLinkFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
): InternalFixDraft {
  const links = [
    {
      source: "Homepage",
      target: ctx.sitemapUrls.find((u) => u.includes("/service")) ?? "/services",
      anchor: `Explore ${ctx.primaryService ?? "our services"}`,
      rationale: "Connect homepage intent to primary service offering.",
      priority: "high" as const,
    },
    {
      source: "Service pages",
      target: "/faq",
      anchor: "Common questions",
      rationale: "FAQ content supports AI citations and buyer objections.",
      priority: "medium" as const,
    },
    {
      source: "Service pages",
      target: "/contact",
      anchor: "Request a review",
      rationale: "Conversion path from consideration to action.",
      priority: "high" as const,
    },
    {
      source: "About page",
      target: ctx.sitemapUrls.find((u) => /case|proof|work/i.test(u)) ?? "/case-studies",
      anchor: "See example outcomes",
      rationale: "Entity clarity + proof proximity improves trust signals.",
      priority: "medium" as const,
    },
    {
      source: "FAQ page",
      target: ctx.sitemapUrls.find((u) => u.includes("/service")) ?? "/services",
      anchor: `How we help with ${ctx.primaryService ?? "your goals"}`,
      rationale: "Bidirectional linking between Q&A and offers.",
      priority: "medium" as const,
    },
  ];

  return baseDraft("internal_link_fix", finding, ctx, {
    title: "Internal linking plan",
    issue_summary: "Key pages should cross-link with descriptive anchor text.",
    why_it_matters:
      "Internal links clarify site hierarchy for crawlers and AI systems, and guide buyers through the funnel.",
    affected_urls: ctx.sitemapUrls.slice(0, 8),
    generated_content: { links },
    implementation_notes:
      "Implement 3–5 high-priority links first. Use natural anchor text; avoid generic 'click here'.",
    implementation_effort: "light",
    priority: "improve_next",
  });
}

function schemaFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: ctx.companyName,
    url: ctx.websiteUrl,
    areaServed: ctx.serviceArea ?? "Local service area",
    description: ctx.primaryService ?? "Professional services",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: ctx.primaryService ?? "Core service",
    provider: { "@type": "Organization", name: ctx.companyName },
    areaServed: ctx.serviceArea ?? "Local service area",
  };

  const content: InternalFixGeneratedContent = {
    schemaBlocks: [
      {
        schemaType: "Organization / ProfessionalService",
        json: orgSchema,
        placement: "Site-wide: <head> on homepage or global layout",
      },
      {
        schemaType: "Service",
        json: serviceSchema,
        placement: `Dedicated service page for ${ctx.primaryService ?? "primary offering"}`,
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("schema_fix", finding, ctx, {
    title: "Structured data — JSON-LD examples",
    generated_content: content,
    generated_json: { organization: orgSchema, service: serviceSchema },
    generated_html: `<script type="application/ld+json">${JSON.stringify(orgSchema)}</script>`,
    implementation_notes:
      "Validate in Google Rich Results Test. Match schema fields to visible on-page content (NAP, services, area).",
    implementation_effort: "medium",
  });
}

function trustContentFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const content: InternalFixGeneratedContent = {
    sections: [
      {
        heading: "Case study block template",
        body: `Client: [Industry] business in ${ctx.serviceArea ?? "region"}\nChallenge: [Specific visibility or conversion issue]\nApproach: [2–3 steps ${ctx.companyName} took]\nOutcome: [Measurable result — traffic, leads, clarity]\nQuote: "[Optional client quote]"`,
      },
      {
        heading: "Proof summary strip",
        body: "3 bullet outcomes · 2 logos or badges · 1 line of social proof near CTA",
      },
      {
        heading: "What proof is missing",
        body: finding.summary,
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("trust_content_fix", finding, ctx, {
    title: "Trust & proof content — case study and proof blocks",
    generated_content: content,
    implementation_effort: "medium",
  });
}

function processFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const content: InternalFixGeneratedContent = {
    sections: [
      { heading: "Step 1 — Discovery", body: "Review site structure, sitemap, and priority pages." },
      { heading: "Step 2 — Audit & plan", body: "Document findings with evidence URLs and prioritized fixes." },
      { heading: "Step 3 — Implementation", body: "Apply content, schema, and linking improvements." },
      { heading: "Step 4 — Monitor", body: "Track visibility signals and iterate monthly." },
      {
        heading: "Suggested page module",
        body: "Use a numbered timeline with short support copy under each step. Link to FAQ and contact.",
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("process_fix", finding, ctx, {
    title: "Process / methodology page outline",
    generated_content: content,
    implementation_effort: "medium",
  });
}

function educationalContentFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const service = ctx.primaryService ?? "your services";
  const content: InternalFixGeneratedContent = {
    topics: [
      {
        title: `How to evaluate ${service} providers`,
        angle: "Buyer education / comparison guide",
        addresses: "Helps AI systems associate your brand with evaluation-stage queries.",
      },
      {
        title: `Common mistakes before investing in ${service}`,
        angle: "Problem-aware content",
        addresses: "Captures buyers researching risks and prerequisites.",
      },
      {
        title: `Checklist: preparing your site for AI visibility`,
        angle: "Practical resource / lead magnet",
        addresses: "Demonstrates expertise and earns internal linking opportunities.",
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("educational_content_fix", finding, ctx, {
    title: "Educational content — topic ideas and angles",
    generated_content: content,
    implementation_effort: "larger",
  });
}

function aboutCopyFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const content: InternalFixGeneratedContent = {
    sections: [
      {
        heading: "Business description (entity clarity)",
        body: `${ctx.companyName} provides ${ctx.primaryService ?? "professional services"} to ${ctx.serviceArea ?? "businesses in the region"}. We help clients improve how their business is understood by search engines and AI systems through practical audits and implementation support.`,
      },
      {
        heading: "Credibility additions",
        body: "• Years in business / team background\n• Service area specificity\n• Certifications or affiliations (if applicable)\n• Link to proof/case studies",
      },
      {
        heading: "Trust signals to add",
        body: "Founder bio · Local presence · Clear contact methods · Consistent NAP with schema",
      },
    ],
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("about_copy_fix", finding, ctx, {
    title: "About page — entity clarity and trust copy",
    generated_content: content,
    implementation_effort: "medium",
  });
}

function pageQuickFix(
  finding: StructuredFinding,
  ctx: InternalFixContext,
  mode: FindingFixMapping["mode"],
): InternalFixDraft {
  const changes: InternalFixGeneratedContent["pageChanges"] = [
    {
      page: finding.evidence_urls[0] ?? ctx.websiteUrl,
      change: finding.recommendation,
      example: `Improve headline to state who you serve and what outcome you deliver (${ctx.primaryService ?? "core service"}).`,
    },
  ];

  if (finding.label.includes("robots") || finding.label.includes("sitemap")) {
    changes.push({
      page: ctx.websiteUrl,
      change: finding.recommendation,
      example:
        finding.label.includes("robots")
          ? "Publish robots.txt with Sitemap: directive pointing to XML sitemap."
          : "Publish XML sitemap listing homepage, services, FAQ, about, and contact.",
    });
  }

  if (finding.label.includes("Server-rendered")) {
    changes.push({
      page: ctx.websiteUrl,
      change: "Ensure title, H1, and key copy render in initial HTML.",
      example: "Add static fallback content or SSR for homepage hero and service summaries.",
    });
  }

  const content: InternalFixGeneratedContent = {
    pageChanges: changes,
    caution: mode === "cautious" ? cautionNote(finding, mode) : undefined,
  };

  return baseDraft("page_quick_fix", finding, ctx, {
    title: `Page-level quick fixes — ${finding.label}`,
    generated_content: content,
    implementation_effort: finding.category === "technical" ? "light" : "medium",
  });
}

function generateForType(
  type: InternalFixType,
  mapping: FindingFixMapping,
  ctx: InternalFixContext,
): InternalFixDraft {
  const { finding, mode } = mapping;
  switch (type) {
    case "faq_fix":
      return faqFix(finding, ctx, mode);
    case "service_page_fix":
      return servicePageFix(finding, ctx, mode);
    case "cta_fix":
      return ctaFix(finding, ctx, mode);
    case "internal_link_fix":
      return internalLinkFix(finding, ctx);
    case "schema_fix":
      return schemaFix(finding, ctx, mode);
    case "trust_content_fix":
      return trustContentFix(finding, ctx, mode);
    case "process_fix":
      return processFix(finding, ctx, mode);
    case "educational_content_fix":
      return educationalContentFix(finding, ctx, mode);
    case "about_copy_fix":
      return aboutCopyFix(finding, ctx, mode);
    case "page_quick_fix":
      return pageQuickFix(finding, ctx, mode);
    default:
      return pageQuickFix(finding, ctx, mode);
  }
}

export function generateInternalFixDrafts(
  mappings: FindingFixMapping[],
  ctx: InternalFixContext,
): InternalFixDraft[] {
  const drafts: InternalFixDraft[] = [];
  const seen = new Set<string>();

  for (const mapping of mappings) {
    for (const type of mapping.fixTypes) {
      const key = `${type}:${mapping.finding.label}`;
      if (seen.has(key)) continue;
      seen.add(key);
      drafts.push(generateForType(type, mapping, ctx));
    }
  }

  const priorityOrder = { fix_first: 0, improve_next: 1, nice_to_add: 2 };
  return drafts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export function regenerateSingleInternalFixDraft(
  type: InternalFixType,
  mapping: FindingFixMapping,
  ctx: InternalFixContext,
): InternalFixDraft {
  return generateForType(type, mapping, ctx);
}
