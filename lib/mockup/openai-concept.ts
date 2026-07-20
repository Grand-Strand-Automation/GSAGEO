import { z } from "zod";
import {
  categoryLabel,
  goalLabel,
  styleLabel,
  type MockupRequestInput,
} from "@/lib/validation/mockup";
import type { SiteSignals } from "@/lib/mockup/extract-site";
import type { MockupConcept } from "@/lib/mockup/generator";
import {
  buildContentStrategy,
  inferNiche,
  isMetaHomepageCopy,
} from "@/lib/mockup/content-strategy";

const OPENAI_TIMEOUT_MS = 45_000;

const llmConceptSchema = z.object({
  heroEyebrow: z.string().min(2).max(64).optional(),
  headline: z.string().min(8).max(160),
  subheadline: z.string().min(20).max(320),
  primaryCta: z.string().min(2).max(48),
  secondaryCta: z.string().min(2).max(48),
  navItems: z.array(z.string().min(2).max(32)).min(3).max(6),
  services: z
    .array(
      z.object({
        title: z.string().min(2).max(64),
        desc: z.string().min(12).max(220),
      }),
    )
    .min(3)
    .max(4),
  servicesHeading: z.string().min(2).max(48).optional(),
  trustHeading: z.string().min(2).max(48).optional(),
  trustLine: z.string().min(8).max(160),
  /** Customer-facing trust chips — NOT redesign commentary. */
  proofPoints: z.array(z.string().min(4).max(80)).min(2).max(4),
  ctaBandHeadline: z.string().min(8).max(100).optional(),
  ctaBandSub: z.string().min(8).max(160).optional(),
  processSteps: z
    .array(
      z.object({
        title: z.string().min(2).max(48),
        desc: z.string().min(8).max(160),
      }),
    )
    .min(2)
    .max(4)
    .optional(),
  /** Owner-facing only — never rendered inside the homepage frame. */
  improvementNotes: z.array(z.string().min(8).max(180)).min(3).max(6),
});

export type LlmConceptFields = z.infer<typeof llmConceptSchema>;

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

const SYSTEM_PROMPT = `You write homepage copy for real local and service businesses.

Return ONLY valid JSON matching the requested schema. No markdown fences.

CRITICAL SEPARATION:
- headline, subheadline, primaryCta, secondaryCta, services, trustLine, proofPoints, ctaBandHeadline, ctaBandSub, processSteps = CUSTOMER-FACING homepage copy (as if published on the business website).
- improvementNotes = OWNER-FACING review notes about what is stronger about this direction. Never put those ideas inside homepage fields.

HARD FORBIDDEN in customer-facing fields:
- "A clearer, more modern homepage for…"
- "A fresher homepage direction…"
- "Clearer first impression", "Stronger call to action", "Easier-to-scan layout"
- Words: mockup, redesign, AI, concept, sample, preview, template, wireframe, modernize (as marketing copy)
- Vague slogans: "Elevate your…", "Experience the…", "Unlock…", "Discover excellence", "Your trusted partner for…", "Welcome to the future of…"

REQUIRED for homepage fields:
- Sound like a real business homepage visitors would read.
- Headline answers: what do you do / who is it for.
- Subheadline explains the offer and builds trust.
- CTA labels match the business type and goal (Request a Quote, Schedule Service, Book a Consultation, Call Us Today, etc.). Avoid Get Started / Learn More / Explore unless nothing else fits.
- proofPoints = short TRUST chips customers would believe (e.g. "Licensed & insured", "Serving Myrtle Beach", "Same-day options") — never redesign commentary.
- Services = concrete offerings someone would buy/book, with practical 1-sentence descriptions.
- Include the business name in the headline OR subheadline.

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

export function buildOpenAiBrief(
  input: MockupRequestInput,
  signals: SiteSignals,
): string {
  const blocked = Boolean(signals.blockedReason);
  const hasContent =
    signals.fetched &&
    !blocked &&
    (Boolean(signals.h1) ||
      signals.services.length > 0 ||
      Boolean(signals.metaDesc) ||
      Boolean(signals.heroParagraph));

  const hints = inferBusinessHints(input);
  const strategy = buildContentStrategy(input, signals);

  const lines: string[] = [
    "Write a believable homepage for this business — not a redesign pitch.",
    "",
    `Website URL: ${input.website_url}`,
    `Business name: ${input.business_name.trim()}`,
    `Category: ${categoryLabel(input.business_category)}`,
    `Inferred niche: ${strategy.niche}`,
    `Audience: ${strategy.audience}`,
    `Tone: ${strategy.tone}`,
    `Preferred style: ${styleLabel(input.preferred_style)}`,
    `Primary homepage goal: ${goalLabel(input.homepage_goal)}`,
    `Suggested primary CTA (you may refine): ${strategy.primaryCta}`,
    `Section plan: ${strategy.sectionPlan.join(" → ")}`,
    `Optional notes: ${input.notes?.trim() || "(none)"}`,
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
  lines.push("Return JSON with exactly these keys:");
  lines.push(
    JSON.stringify({
      heroEyebrow: "short industry/location line customers would see",
      headline: "customer-facing — what you do / who you help",
      subheadline: "customer-facing supporting sentence about the offer",
      primaryCta: "business-appropriate action label",
      secondaryCta: "secondary action",
      navItems: ["3-5 short labels"],
      services: [{ title: "concrete offering", desc: "one practical sentence" }],
      servicesHeading: "e.g. Our services",
      trustHeading: "e.g. Why choose us",
      trustLine: "location/phone/trust cue",
      proofPoints: ["customer trust chips — NOT redesign notes"],
      ctaBandHeadline: "customer-facing closing CTA headline",
      ctaBandSub: "customer-facing supporting line",
      processSteps: [{ title: "step", desc: "short description" }],
      improvementNotes: ["owner-facing notes about what is stronger — NOT homepage copy"],
    }),
  );

  return lines.join("\n");
}

function sanitizeProofPoints(
  points: string[],
  fallback: string[],
): string[] {
  const cleaned = points
    .map((p) => p.trim())
    .filter((p) => p && !isMetaHomepageCopy(p));
  if (cleaned.length >= 2) return cleaned.slice(0, 3);
  return fallback.slice(0, 3);
}

function sanitizeHomepageField(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed || isMetaHomepageCopy(trimmed)) return fallback;
  return trimmed;
}

export function mergeLlmFieldsIntoConcept(
  base: MockupConcept,
  fields: LlmConceptFields,
  meta: { usedOpenAi: boolean },
): MockupConcept {
  return {
    ...base,
    version: "3.1",
    heroEyebrow: fields.heroEyebrow
      ? sanitizeHomepageField(fields.heroEyebrow, base.heroEyebrow)
      : base.heroEyebrow,
    headline: sanitizeHomepageField(fields.headline, base.headline),
    subheadline: sanitizeHomepageField(fields.subheadline, base.subheadline),
    primaryCta: sanitizeHomepageField(fields.primaryCta, base.primaryCta),
    secondaryCta: sanitizeHomepageField(fields.secondaryCta, base.secondaryCta),
    navItems: fields.navItems.map((n) => n.trim()).filter(Boolean).slice(0, 5),
    services: fields.services.slice(0, 3).map((s) => ({
      title: s.title.trim(),
      desc: sanitizeHomepageField(s.desc, s.desc.trim()),
    })),
    servicesHeading: fields.servicesHeading?.trim() || base.servicesHeading,
    trustHeading: fields.trustHeading?.trim() || base.trustHeading,
    trustLine: sanitizeHomepageField(fields.trustLine, base.trustLine),
    proofPoints: sanitizeProofPoints(fields.proofPoints, base.proofPoints),
    ctaBandHeadline: fields.ctaBandHeadline
      ? sanitizeHomepageField(fields.ctaBandHeadline, base.ctaBandHeadline)
      : base.ctaBandHeadline,
    ctaBandSub: fields.ctaBandSub
      ? sanitizeHomepageField(fields.ctaBandSub, base.ctaBandSub)
      : base.ctaBandSub,
    processSteps: fields.processSteps?.length
      ? fields.processSteps.slice(0, 3).map((s) => ({
          title: s.title.trim(),
          desc: s.desc.trim(),
        }))
      : base.processSteps,
    improvementNotes: fields.improvementNotes.map((n) => n.trim()).filter(Boolean).slice(0, 6),
    sourceSignals: {
      ...base.sourceSignals,
      usedRealServices: base.sourceSignals.usedRealServices || fields.services.length > 0,
      usedRealCta: base.sourceSignals.usedRealCta,
      generatedBy: meta.usedOpenAi ? "openai" : base.sourceSignals.generatedBy ?? "rules",
    },
  };
}

export type OpenAiConceptResult =
  | { ok: true; fields: LlmConceptFields; model: string }
  | { ok: false; error: string };

/**
 * Call OpenAI Chat Completions with a ChatGPT-style brief and JSON object response.
 */
export async function generateConceptFieldsWithOpenAi(
  input: MockupRequestInput,
  signals: SiteSignals,
): Promise<OpenAiConceptResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "OPENAI_API_KEY not configured" };
  }

  const model = getOpenAiModel();
  const brief = buildOpenAiBrief(input, signals);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.55,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: brief },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      return {
        ok: false,
        error: `OpenAI HTTP ${resp.status}${errText ? `: ${errText.slice(0, 200)}` : ""}`,
      };
    }

    const json = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { ok: false, error: "Empty OpenAI response" };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { ok: false, error: "OpenAI returned non-JSON content" };
    }

    const validated = llmConceptSchema.safeParse(parsed);
    if (!validated.success) {
      return {
        ok: false,
        error: `OpenAI JSON failed validation: ${validated.error.issues[0]?.message ?? "invalid"}`,
      };
    }

    // Reject fully meta headlines even if schema-valid
    if (isMetaHomepageCopy(validated.data.headline)) {
      return { ok: false, error: "OpenAI returned meta redesign headline" };
    }

    return { ok: true, fields: validated.data, model };
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI request failed";
    return { ok: false, error: message };
  } finally {
    clearTimeout(timer);
  }
}
