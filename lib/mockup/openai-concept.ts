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

const SYSTEM_PROMPT = `You are a senior web designer writing homepage copy for local and service businesses.

Return ONLY valid JSON matching the requested schema. No markdown fences.

Rules:
- This is a sample homepage concept / preview — not a finished website.
- Write customer-facing copy only. Do NOT use words like "mockup", "redesign", "AI", "concept", or "sample" in headline, subheadline, CTAs, services, or trustLine.
- Prefer the business's real language when site content is provided.
- If site content is missing or blocked, invent credible, specific copy from the business name, category, goal, style, and notes — not generic filler.
- Headline should be clear and conversion-oriented for the stated homepage goal.
- Services should feel specific to this business type (e.g. marina / marine services if that fits the name).
- improvementNotes are for the business owner reviewing the preview: plain English about what is clearer vs a typical outdated site.
- Keep tone premium, practical, and plain-English.`;

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

  const lines: string[] = [
    "Create a homepage redesign concept for this business.",
    "",
    `Website URL: ${input.website_url}`,
    `Business name: ${input.business_name.trim()}`,
    `Category: ${categoryLabel(input.business_category)}`,
    `Preferred style: ${styleLabel(input.preferred_style)}`,
    `Primary homepage goal: ${goalLabel(input.homepage_goal)}`,
    `Optional notes: ${input.notes?.trim() || "(none)"}`,
    "",
  ];

  if (blocked) {
    lines.push(`Site extraction status: blocked`);
    lines.push(`Block reason: ${signals.blockedReason}`);
    lines.push(`Extracted content: none available`);
    lines.push(
      "Write a strong concept from the business details above as if briefing a designer who cannot see the live site.",
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
      "Reuse and clarify this business's real language where it is strong; improve clarity and CTA strength.",
    );
  } else {
    lines.push(`Site extraction status: limited / empty`);
    lines.push(`Extracted content: little or none`);
    lines.push("Write a strong concept from the business details above.");
  }

  lines.push("");
  lines.push("Return JSON with exactly these keys:");
  lines.push(
    JSON.stringify({
      headline: "string",
      subheadline: "string",
      primaryCta: "string",
      secondaryCta: "string",
      navItems: ["string"],
      services: [{ title: "string", desc: "string" }],
      trustLine: "string",
      proofPoints: ["string"],
      improvementNotes: ["string"],
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
        temperature: 0.7,
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
