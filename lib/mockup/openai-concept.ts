import { z } from "zod";
import {
  categoryLabel,
  goalLabel,
  styleLabel,
  type MockupRequestInput,
} from "@/lib/validation/mockup";
import type { SiteSignals } from "@/lib/mockup/extract-site";
import type { MockupConcept } from "@/lib/mockup/generator";

const OPENAI_TIMEOUT_MS = 45_000;

const llmConceptSchema = z.object({
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
  trustLine: z.string().min(8).max(160),
  proofPoints: z.array(z.string().min(4).max(80)).min(2).max(4),
  improvementNotes: z.array(z.string().min(8).max(180)).min(3).max(6),
});

export type LlmConceptFields = z.infer<typeof llmConceptSchema>;

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

const SYSTEM_PROMPT = `You are a senior conversion copywriter for local service-business websites.

Return ONLY valid JSON matching the requested schema. No markdown fences.

Hard rules:
- Customer-facing fields only. Never use: mockup, redesign, AI, concept, sample, preview, template.
- Sound like a real local business website — specific, concrete, trustworthy.
- FORBIDDEN vague slogans: "Elevate your…", "Experience the…", "Unlock…", "Discover excellence", "Your trusted partner for…", "Welcome to the future of…".
- Include the business name in the headline OR subheadline.
- Services must be concrete offerings (what someone would buy/book), each with a practical 1-sentence description — not fluff categories.
- Match the homepage goal: more calls → phone-forward CTA; more quotes → quote CTA; credibility → trust/proof; explain services → clear service framing; modernize → clearer modern messaging without buzzwords.
- If live site content is provided, reuse and clarify THAT language.
- If site content is blocked/missing, infer from business name + URL + category + notes + any location hints. Example: "coastalmarinemb.com" / "Coastal Marine" → Myrtle Beach area marine / boat / marina services.
- improvementNotes speak to the owner: what is clearer about this homepage direction vs a typical outdated site.
- Tone: premium, plain English, practical.`;

/** Light domain/name hints so blocked sites still get specific copy */
export function inferBusinessHints(input: MockupRequestInput): string[] {
  const hints: string[] = [];
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

  const lines: string[] = [
    "Write homepage copy for this business as if briefing a designer who will build a clearer first impression.",
    "",
    `Website URL: ${input.website_url}`,
    `Business name: ${input.business_name.trim()}`,
    `Category: ${categoryLabel(input.business_category)}`,
    `Preferred style: ${styleLabel(input.preferred_style)}`,
    `Primary homepage goal: ${goalLabel(input.homepage_goal)}`,
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
      "IMPORTANT: Do not write generic corporate slogans. Invent credible, specific services and messaging this exact business would put on a homepage in their market.",
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
      "Reuse and clarify this business's real language; strengthen CTA and scanability.",
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
      headline: "string — specific, includes or clearly names the business offer",
      subheadline: "string — practical supporting sentence",
      primaryCta: "string — action label",
      secondaryCta: "string",
      navItems: ["3-5 short labels"],
      services: [{ title: "concrete offering", desc: "one practical sentence" }],
      trustLine: "string — location/phone/trust cue",
      proofPoints: ["short chips"],
      improvementNotes: ["owner-facing notes about clarity improvements"],
    }),
  );

  return lines.join("\n");
}

export function mergeLlmFieldsIntoConcept(
  base: MockupConcept,
  fields: LlmConceptFields,
  meta: { usedOpenAi: boolean },
): MockupConcept {
  return {
    ...base,
    version: "2.1",
    headline: fields.headline.trim(),
    subheadline: fields.subheadline.trim(),
    primaryCta: fields.primaryCta.trim(),
    secondaryCta: fields.secondaryCta.trim(),
    navItems: fields.navItems.map((n) => n.trim()).filter(Boolean).slice(0, 5),
    services: fields.services.slice(0, 3).map((s) => ({
      title: s.title.trim(),
      desc: s.desc.trim(),
    })),
    trustLine: fields.trustLine.trim(),
    proofPoints: fields.proofPoints.map((p) => p.trim()).filter(Boolean).slice(0, 3),
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

    return { ok: true, fields: validated.data, model };
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI request failed";
    return { ok: false, error: message };
  } finally {
    clearTimeout(timer);
  }
}
