import {
  categoryLabel,
  goalLabel,
  styleLabel,
  type MockupRequestInput,
} from "@/lib/validation/mockup";
import type { SiteSignals } from "@/lib/mockup/extract-site";
import { buildContentStrategy, inferNiche } from "@/lib/mockup/content-strategy";

/**
 * Internal OpenAI system prompt for homepage mockup generation.
 * Keep this file as the single source of truth for prompt behavior.
 */
export const HOMEPAGE_MOCKUP_SYSTEM_PROMPT = `You write homepage copy for real local and service businesses.

Return ONLY valid JSON matching the requested schema. No markdown fences. No commentary outside JSON.

CRITICAL SEPARATION:
- hero.*, sections[], navItems, proofPoints = CUSTOMER-FACING homepage copy (as if published on the business website).
- improvementSummary = OWNER-FACING review notes about what is stronger about this direction. Never put those ideas inside homepage fields.
- designDirection = short internal note about visual/layout feel (owner-facing only; never appear as homepage copy).

HARD FORBIDDEN in customer-facing fields (hero, sections, CTAs, proofPoints):
- "A clearer, more modern homepage for…"
- "A fresher homepage direction…"
- "Clearer first impression", "Stronger call to action", "Easier-to-scan layout"
- Words: mockup, redesign, AI, concept, sample, preview, template, wireframe, modernize (as marketing copy)
- Vague slogans: "Elevate your…", "Experience the…", "Unlock…", "Discover excellence", "Your trusted partner for…", "Welcome to the future of…"
- Generic CTAs as primary: "Get Started", "Learn More", "Explore" — only if nothing else fits

REQUIRED for homepage fields:
- Sound like a real business homepage visitors would read.
- Headline answers: what do you do / who is it for.
- Subheadline explains the offer and builds trust.
- CTA labels match the business type and goal (Request a Quote, Schedule Service, Book a Consultation, Call Us Today, Get a Free Estimate, etc.).
- proofPoints = short TRUST chips customers would believe (e.g. "Licensed & insured", "Serving Myrtle Beach", "Same-day options") — never redesign commentary.
- sections must include concrete offerings someone would buy/book where type is "services".
- Include the business name in the headline OR subheadline.
- Be specific to THIS business — not a generic professional-services brochure.
- Vary section structure by business type when it helps (e.g. process steps for contractors, trust/credentials for medical/legal).

If live site content is provided, reuse and clarify THAT language.
If site content is blocked/missing, infer from business name + URL + category + notes + location hints.
Example: "coastalmarinemb.com" / "Coastal Marine" → Myrtle Beach area marine / boat / marina services.

Tone: premium, plain English, practical, industry-aware.`;

/** Light domain/name hints so blocked sites still get specific copy */
export function inferBusinessHints(input: MockupRequestInput): string[] {
  const hints: string[] = [];
  const niche = inferNiche(input);
  if (niche !== "general") hints.push(`Inferred niche: ${niche.replace(/_/g, " ")}`);

  const blob = `${input.business_name} ${input.website_url} ${input.notes ?? ""}`.toLowerCase();

  if (/marine|marina|boat|yacht|dock|haul/.test(blob)) {
    hints.push("Likely marine / boat / marina services");
  }
  if (/\bmb\b|myrtle|grand strand|conway|surfside|murrells|pawleys|marinemb|mb\.com/.test(blob)) {
    hints.push("Likely Myrtle Beach / Grand Strand local market");
  }
  if (/plumb/.test(blob)) hints.push("Likely plumbing services");
  if (/hvac|heat|air cond|furnace/.test(blob)) hints.push("Likely HVAC services");
  if (/law|legal|attorney|lawyer/.test(blob)) hints.push("Likely legal services");
  if (/dental|dentist|ortho/.test(blob)) hints.push("Likely dental / healthcare");
  if (/roof/.test(blob)) hints.push("Likely roofing");
  if (/\bit\b|msp|managed service|tech support/.test(blob)) hints.push("Likely IT / MSP support");
  if (/wellness|spa|chiro|physio|therapy|clinic|medical/.test(blob)) {
    hints.push("Likely wellness / medical office");
  }

  try {
    const host = new URL(
      /^https?:\/\//i.test(input.website_url) ? input.website_url : `https://${input.website_url}`,
    ).hostname.replace(/^www\./, "");
    hints.push(`Domain: ${host}`);
  } catch {
    /* ignore */
  }

  return hints;
}

/** Normalize form input before prompt assembly. */
export function normalizeMockupInput(input: MockupRequestInput): MockupRequestInput {
  return {
    ...input,
    website_url: input.website_url.trim(),
    business_name: input.business_name.trim(),
    notes: input.notes?.trim() ? input.notes.trim().slice(0, 1000) : "",
    email: input.email.trim().toLowerCase(),
  };
}

/**
 * Build the dynamic user brief fed to OpenAI.
 */
export function buildHomepageMockupBrief(
  input: MockupRequestInput,
  signals: SiteSignals,
): string {
  const normalized = normalizeMockupInput(input);
  const blocked = Boolean(signals.blockedReason);
  const hasContent =
    signals.fetched &&
    !blocked &&
    (Boolean(signals.h1) ||
      signals.services.length > 0 ||
      Boolean(signals.metaDesc) ||
      Boolean(signals.heroParagraph));

  const hints = inferBusinessHints(normalized);
  const strategy = buildContentStrategy(normalized, signals);

  const lines: string[] = [
    "Write a believable homepage for this business — not a redesign pitch.",
    "",
    `Website URL: ${normalized.website_url}`,
    `Business name: ${normalized.business_name}`,
    `Category: ${categoryLabel(normalized.business_category)}`,
    `Inferred niche: ${strategy.niche}`,
    `Audience: ${strategy.audience}`,
    `Tone: ${strategy.tone}`,
    `Preferred style: ${styleLabel(normalized.preferred_style)}`,
    `Primary homepage goal: ${goalLabel(normalized.homepage_goal)}`,
    `Suggested primary CTA (you may refine): ${strategy.primaryCta}`,
    `Suggested secondary CTA: ${strategy.secondaryCta}`,
    `Section plan: ${strategy.sectionPlan.join(" → ")}`,
    `Hero eyebrow suggestion: ${strategy.heroEyebrow}`,
    `Optional notes: ${normalized.notes || "(none)"}`,
    "",
  ];

  if (hints.length) {
    lines.push("Inferred hints from name/URL/notes:");
    for (const h of hints) lines.push(`- ${h}`);
    lines.push("");
  }

  if (blocked) {
    lines.push(`Site extraction status: BLOCKED (bot / Cloudflare protection)`);
    lines.push(`Block reason: ${signals.blockedReason}`);
    lines.push(`Extracted homepage content: NONE`);
    lines.push(
      "IMPORTANT: Invent credible, specific services and messaging this exact business would put on a real homepage in their market. No generic corporate slogans. No redesign commentary.",
    );
  } else if (hasContent) {
    lines.push(`Site extraction status: ${signals.fetchQuality}`);
    lines.push(`Detected title: ${signals.title || "(none)"}`);
    lines.push(`Detected H1: ${signals.h1 || "(none)"}`);
    lines.push(`Hero / supporting text: ${signals.heroParagraph || signals.metaDesc || "(none)"}`);
    lines.push(`Detected CTAs: ${signals.ctaHints.join(" | ") || "(none)"}`);
    lines.push(`Detected nav: ${signals.navItems.join(" | ") || "(none)"}`);
    lines.push(`Phone: ${signals.phone || "(none)"}`);
    lines.push(`Location hint: ${signals.locationHint || "(none)"}`);
    if (signals.services.length) {
      lines.push("Detected services:");
      for (const s of signals.services.slice(0, 5)) {
        lines.push(`- ${s.title}: ${s.desc}`);
      }
    } else {
      lines.push("Detected services: (none)");
    }
    lines.push(
      "Reuse and clarify this business's real language; strengthen CTA and scanability without sounding like a redesign memo.",
    );
  } else {
    lines.push(`Site extraction status: limited / empty`);
    lines.push(`Extracted content: little or none`);
    lines.push(
      "Write specific copy from business name, URL hints, category, goal, and notes — not generic filler.",
    );
  }

  lines.push("");
  lines.push("Return JSON with exactly this shape (camelCase):");
  lines.push(
    JSON.stringify({
      businessType: "short business type label",
      audienceType: "who the homepage speaks to",
      tone: "tone of voice",
      hero: {
        eyebrow: "short industry/location line customers would see",
        headline: "customer-facing — what you do / who you help",
        subheadline: "customer-facing supporting sentence about the offer",
        primaryCta: "business-appropriate action label",
        secondaryCta: "secondary action",
        trustLine: "location/phone/trust cue",
      },
      navItems: ["Services", "About", "Contact"],
      proofPoints: ["Licensed & insured", "Local team", "Clear estimates"],
      sections: [
        {
          type: "services",
          heading: "Our services",
          items: [
            { title: "concrete offering", desc: "one practical sentence" },
            { title: "second offering", desc: "one practical sentence" },
            { title: "third offering", desc: "one practical sentence" },
          ],
        },
        {
          type: "trust",
          heading: "Why choose us",
          body: "short customer-facing trust paragraph",
        },
        {
          type: "process",
          heading: "How it works",
          items: [
            { title: "step one", desc: "short description" },
            { title: "step two", desc: "short description" },
            { title: "step three", desc: "short description" },
          ],
        },
        {
          type: "cta",
          heading: "customer-facing closing CTA headline",
          body: "customer-facing supporting line",
        },
      ],
      improvementSummary: [
        "owner-facing note about clearer headline",
        "owner-facing note about stronger CTA",
        "owner-facing note about service layout",
      ],
      designDirection: "one sentence on visual/layout feel for the refresh",
    }),
  );

  return lines.join("\n");
}

/** @deprecated Prefer buildHomepageMockupBrief — kept for existing tests/imports. */
export const buildOpenAiBrief = buildHomepageMockupBrief;

/** @deprecated Prefer HOMEPAGE_MOCKUP_SYSTEM_PROMPT */
export const SYSTEM_PROMPT = HOMEPAGE_MOCKUP_SYSTEM_PROMPT;
