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

const OPENAI_TIMEOUT_MS = 35_000;
const LOG_PREFIX = "[mockup:openai]";

const llmConceptSchema = z.object({
  heroEyebrow: z.string().min(2).max(80).optional(),
  headline: z.string().min(8).max(180),
  subheadline: z.string().min(12).max(360),
  primaryCta: z.string().min(2).max(56),
  secondaryCta: z.string().min(2).max(56),
  navItems: z.array(z.string().min(1).max(40)).min(2).max(8),
  services: z
    .array(
      z.object({
        title: z.string().min(2).max(80),
        desc: z.string().min(8).max(280),
      }),
    )
    .min(2)
    .max(5),
  servicesHeading: z.string().min(2).max(64).optional(),
  trustHeading: z.string().min(2).max(64).optional(),
  trustLine: z.string().min(4).max(180),
  proofPoints: z.array(z.string().min(2).max(100)).min(1).max(5),
  ctaBandHeadline: z.string().min(4).max(120).optional(),
  ctaBandSub: z.string().min(4).max(200).optional(),
  processSteps: z
    .array(
      z.object({
        title: z.string().min(2).max(64),
        desc: z.string().min(4).max(200),
      }),
    )
    .min(2)
    .max(4)
    .optional(),
  improvementNotes: z.array(z.string().min(4).max(220)).min(2).max(8),
});

export type LlmConceptFields = z.infer<typeof llmConceptSchema>;

export type OpenAiEnvStatus = {
  configured: boolean;
  keyPresent: boolean;
  keyLength: number;
  model: string;
  /** True if a NEXT_PUBLIC_ OpenAI key was found (misconfiguration). */
  publicKeyDetected: boolean;
  reason?: string;
};

/**
 * Read OpenAI config server-side only. Strips wrapping quotes from Vercel UI pastes.
 * Never logs the raw key.
 */
export function getOpenAiEnvStatus(): OpenAiEnvStatus {
  const publicKeyDetected = Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim());
  const raw = process.env.OPENAI_API_KEY;
  const cleaned = cleanSecret(raw);
  const model = cleanSecret(process.env.OPENAI_MODEL) || "gpt-4o-mini";

  if (publicKeyDetected && !cleaned) {
    return {
      configured: false,
      keyPresent: false,
      keyLength: 0,
      model,
      publicKeyDetected: true,
      reason:
        "NEXT_PUBLIC_OPENAI_API_KEY is set but OPENAI_API_KEY is missing — use server-only OPENAI_API_KEY",
    };
  }

  if (!cleaned) {
    return {
      configured: false,
      keyPresent: false,
      keyLength: 0,
      model,
      publicKeyDetected,
      reason: "OPENAI_API_KEY is missing or empty",
    };
  }

  if (cleaned.length < 20) {
    return {
      configured: false,
      keyPresent: true,
      keyLength: cleaned.length,
      model,
      publicKeyDetected,
      reason: "OPENAI_API_KEY looks too short to be valid",
    };
  }

  return {
    configured: true,
    keyPresent: true,
    keyLength: cleaned.length,
    model,
    publicKeyDetected,
  };
}

function cleanSecret(value: string | undefined | null): string {
  if (!value) return "";
  let v = value.trim();
  // Vercel / dotenv sometimes preserve wrapping quotes
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function getOpenAiApiKey(): string | null {
  const status = getOpenAiEnvStatus();
  if (!status.configured) return null;
  return cleanSecret(process.env.OPENAI_API_KEY);
}

export function isOpenAiConfigured(): boolean {
  return getOpenAiEnvStatus().configured;
}

export function getOpenAiModel(): string {
  return getOpenAiEnvStatus().model;
}

/** Log once-per-process env diagnostics (no secrets). */
let loggedEnvStatus = false;
export function logOpenAiEnvDiagnostics(force = false): OpenAiEnvStatus {
  const status = getOpenAiEnvStatus();
  if (!loggedEnvStatus || force) {
    loggedEnvStatus = true;
    console.info(LOG_PREFIX, "env status", {
      configured: status.configured,
      keyPresent: status.keyPresent,
      keyLength: status.keyLength,
      model: status.model,
      publicKeyDetected: status.publicKeyDetected,
      reason: status.reason ?? null,
    });
  }
  return status;
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
- Generic CTAs as primary: "Get Started", "Learn More", "Explore" — only if nothing else fits

REQUIRED for homepage fields:
- Sound like a real business homepage visitors would read.
- Headline answers: what do you do / who is it for.
- Subheadline explains the offer and builds trust.
- CTA labels match the business type and goal (Request a Quote, Schedule Service, Book a Consultation, Call Us Today, Get a Free Estimate, etc.).
- proofPoints = short TRUST chips customers would believe (e.g. "Licensed & insured", "Serving Myrtle Beach", "Same-day options") — never redesign commentary.
- Services = concrete offerings someone would buy/book, each with a practical 1-sentence description.
- Include the business name in the headline OR subheadline.
- Be specific to THIS business — not a generic professional-services brochure.

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
    `Suggested secondary CTA: ${strategy.secondaryCta}`,
    `Section plan: ${strategy.sectionPlan.join(" → ")}`,
    `Hero eyebrow suggestion: ${strategy.heroEyebrow}`,
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
  lines.push("Return JSON with exactly these keys (camelCase):");
  lines.push(
    JSON.stringify({
      heroEyebrow: "short industry/location line customers would see",
      headline: "customer-facing — what you do / who you help",
      subheadline: "customer-facing supporting sentence about the offer",
      primaryCta: "business-appropriate action label",
      secondaryCta: "secondary action",
      navItems: ["Services", "About", "Contact"],
      services: [
        { title: "concrete offering", desc: "one practical sentence" },
        { title: "second offering", desc: "one practical sentence" },
        { title: "third offering", desc: "one practical sentence" },
      ],
      servicesHeading: "Our services",
      trustHeading: "Why choose us",
      trustLine: "location/phone/trust cue",
      proofPoints: ["Licensed & insured", "Local team", "Clear estimates"],
      ctaBandHeadline: "customer-facing closing CTA headline",
      ctaBandSub: "customer-facing supporting line",
      processSteps: [
        { title: "step one", desc: "short description" },
        { title: "step two", desc: "short description" },
        { title: "step three", desc: "short description" },
      ],
      improvementNotes: [
        "owner-facing note about clearer headline",
        "owner-facing note about stronger CTA",
        "owner-facing note about service layout",
      ],
    }),
  );

  return lines.join("\n");
}

/** Map common LLM key aliases → expected schema keys. */
export function normalizeLlmPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const src = raw as Record<string, unknown>;
  const out: Record<string, unknown> = { ...src };

  const alias = (canonical: string, aliases: string[]) => {
    if (out[canonical] != null) return;
    for (const a of aliases) {
      if (src[a] != null) {
        out[canonical] = src[a];
        return;
      }
    }
  };

  alias("heroEyebrow", ["hero_eyebrow", "eyebrow", "categoryLabel", "category"]);
  alias("headline", ["heroHeadline", "hero_headline", "title", "h1"]);
  alias("subheadline", ["heroSubheadline", "hero_subheadline", "subtitle", "subhead"]);
  alias("primaryCta", ["primaryCTA", "primary_cta", "cta", "mainCta"]);
  alias("secondaryCta", ["secondaryCTA", "secondary_cta", "altCta"]);
  alias("navItems", ["nav", "navigation", "menuItems"]);
  alias("trustLine", ["trust_line", "trust"]);
  alias("proofPoints", ["proof_points", "trustPoints", "trust_points", "chips"]);
  alias("servicesHeading", ["services_heading", "servicesTitle"]);
  alias("trustHeading", ["trust_heading", "whyUsHeading"]);
  alias("ctaBandHeadline", ["cta_band_headline", "closingHeadline", "ctaHeadline"]);
  alias("ctaBandSub", ["cta_band_sub", "closingSubheadline", "ctaSubheadline"]);
  alias("processSteps", ["process_steps", "steps", "howItWorks"]);
  alias("improvementNotes", ["improvement_notes", "improvements", "notes"]);

  // Normalize services array shapes
  if (Array.isArray(out.services)) {
    out.services = out.services.map((item) => {
      if (!item || typeof item !== "object") return item;
      const s = item as Record<string, unknown>;
      return {
        title: String(s.title ?? s.name ?? s.heading ?? "").trim(),
        desc: String(s.desc ?? s.description ?? s.copy ?? s.body ?? "").trim(),
      };
    });
  }

  // Truncate/pad common fields for schema resilience
  if (typeof out.headline === "string") out.headline = out.headline.trim().slice(0, 180);
  if (typeof out.subheadline === "string") out.subheadline = out.subheadline.trim().slice(0, 360);
  if (typeof out.primaryCta === "string") out.primaryCta = out.primaryCta.trim().slice(0, 56);
  if (typeof out.secondaryCta === "string") out.secondaryCta = out.secondaryCta.trim().slice(0, 56);
  if (typeof out.trustLine === "string") out.trustLine = out.trustLine.trim().slice(0, 180);

  if (Array.isArray(out.navItems)) {
    out.navItems = out.navItems.map((n) => String(n).trim()).filter(Boolean).slice(0, 6);
  }
  if (Array.isArray(out.proofPoints)) {
    out.proofPoints = out.proofPoints.map((n) => String(n).trim()).filter(Boolean).slice(0, 4);
  }
  if (Array.isArray(out.improvementNotes)) {
    out.improvementNotes = out.improvementNotes
      .map((n) => String(n).trim())
      .filter(Boolean)
      .slice(0, 6);
  }
  if (Array.isArray(out.services)) {
    out.services = (out.services as { title: string; desc: string }[])
      .filter((s) => s.title && s.desc)
      .slice(0, 4)
      .map((s) => ({
        title: s.title.slice(0, 80),
        desc: s.desc.slice(0, 280),
      }));
  }

  // Defaults for frequently-missing optional-ish fields
  if (!out.secondaryCta && typeof out.primaryCta === "string") {
    out.secondaryCta = "View Services";
  }
  if (!Array.isArray(out.improvementNotes) || out.improvementNotes.length < 2) {
    out.improvementNotes = [
      "Customer-facing headline that states what you do",
      "Stronger primary CTA above the fold",
      "Services presented so visitors can scan offerings quickly",
    ];
  }
  if (!Array.isArray(out.proofPoints) || out.proofPoints.length < 1) {
    out.proofPoints = ["Trusted locally", "Clear communication", "Easy next steps"];
  }
  if (!Array.isArray(out.navItems) || out.navItems.length < 2) {
    out.navItems = ["Services", "About", "Reviews", "Contact"];
  }

  return out;
}

function sanitizeProofPoints(points: string[], fallback: string[]): string[] {
  const cleaned = points.map((p) => p.trim()).filter((p) => p && !isMetaHomepageCopy(p));
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
  const services = fields.services.slice(0, 3).map((s) => ({
    title: s.title.trim(),
    desc: sanitizeHomepageField(s.desc, s.desc.trim()),
  }));
  // Ensure 3 services for the preview grid
  while (services.length < 3 && base.services[services.length]) {
    services.push(base.services[services.length]!);
  }

  return {
    ...base,
    version: "3.2",
    heroEyebrow: fields.heroEyebrow
      ? sanitizeHomepageField(fields.heroEyebrow, base.heroEyebrow)
      : base.heroEyebrow,
    headline: sanitizeHomepageField(fields.headline, base.headline),
    subheadline: sanitizeHomepageField(fields.subheadline, base.subheadline),
    primaryCta: sanitizeHomepageField(fields.primaryCta, base.primaryCta),
    secondaryCta: sanitizeHomepageField(fields.secondaryCta, base.secondaryCta),
    navItems: fields.navItems.map((n) => n.trim()).filter(Boolean).slice(0, 5),
    services,
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
  | { ok: true; fields: LlmConceptFields; model: string; attempts: number }
  | { ok: false; error: string; errorCode: string; attempts: number };

async function callOpenAiOnce(params: {
  apiKey: string;
  model: string;
  brief: string;
  temperature: number;
}): Promise<{ ok: true; content: string } | { ok: false; error: string; errorCode: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const started = Date.now();
    console.info(LOG_PREFIX, "request start", {
      model: params.model,
      temperature: params.temperature,
      briefChars: params.brief.length,
    });

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        temperature: params.temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: params.brief },
        ],
      }),
    });

    const elapsedMs = Date.now() - started;

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(LOG_PREFIX, "http error", {
        status: resp.status,
        elapsedMs,
        bodyPreview: errText.slice(0, 240),
      });
      return {
        ok: false,
        error: `OpenAI HTTP ${resp.status}${errText ? `: ${errText.slice(0, 200)}` : ""}`,
        errorCode: resp.status === 401 || resp.status === 403 ? "auth" : "http",
      };
    }

    const json = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { total_tokens?: number };
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.error(LOG_PREFIX, "empty response", { elapsedMs });
      return { ok: false, error: "Empty OpenAI response", errorCode: "empty" };
    }

    console.info(LOG_PREFIX, "request success", {
      elapsedMs,
      contentChars: content.length,
      tokens: json.usage?.total_tokens ?? null,
    });
    return { ok: true, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI request failed";
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error(LOG_PREFIX, aborted ? "timeout" : "request exception", { message });
    return {
      ok: false,
      error: aborted ? `OpenAI timeout after ${OPENAI_TIMEOUT_MS}ms` : message,
      errorCode: aborted ? "timeout" : "network",
    };
  } finally {
    clearTimeout(timer);
  }
}

function parseAndValidate(content: string): OpenAiConceptResult | { ok: true; fields: LlmConceptFields } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      ok: false,
      error: "OpenAI returned non-JSON content",
      errorCode: "parse",
      attempts: 1,
    };
  }

  const normalized = normalizeLlmPayload(parsed);
  const validated = llmConceptSchema.safeParse(normalized);
  if (!validated.success) {
    const issue = validated.error.issues[0];
    console.warn(LOG_PREFIX, "schema validation failed", {
      path: issue?.path?.join(".") ?? "",
      message: issue?.message ?? "invalid",
    });
    return {
      ok: false,
      error: `OpenAI JSON failed validation: ${issue?.message ?? "invalid"} (${issue?.path?.join(".") ?? ""})`,
      errorCode: "schema",
      attempts: 1,
    };
  }

  if (isMetaHomepageCopy(validated.data.headline)) {
    console.warn(LOG_PREFIX, "rejected meta headline", {
      headlinePreview: validated.data.headline.slice(0, 80),
    });
    return {
      ok: false,
      error: "OpenAI returned meta redesign headline",
      errorCode: "meta_copy",
      attempts: 1,
    };
  }

  return { ok: true, fields: validated.data };
}

/**
 * Call OpenAI Chat Completions with JSON object response.
 * Retries once on schema/parse/meta failures with a stricter repair brief.
 */
export async function generateConceptFieldsWithOpenAi(
  input: MockupRequestInput,
  signals: SiteSignals,
): Promise<OpenAiConceptResult> {
  const env = logOpenAiEnvDiagnostics();
  const apiKey = getOpenAiApiKey();

  if (!apiKey) {
    console.error(LOG_PREFIX, "skipped — key not configured", {
      reason: env.reason,
      publicKeyDetected: env.publicKeyDetected,
    });
    return {
      ok: false,
      error: env.reason ?? "OPENAI_API_KEY not configured",
      errorCode: "missing_key",
      attempts: 0,
    };
  }

  const model = env.model;
  const brief = buildOpenAiBrief(input, signals);
  let attempts = 0;

  const first = await callOpenAiOnce({ apiKey, model, brief, temperature: 0.5 });
  attempts += 1;
  if (!first.ok) {
    return { ok: false, error: first.error, errorCode: first.errorCode, attempts };
  }

  const parsed1 = parseAndValidate(first.content);
  if (parsed1.ok && "fields" in parsed1) {
    return { ok: true, fields: parsed1.fields, model, attempts };
  }

  // Retry once with repair instructions
  console.warn(LOG_PREFIX, "retrying after validation/parse failure", {
    firstError: !parsed1.ok ? parsed1.error : "unknown",
  });
  const repairBrief = `${brief}

CRITICAL REPAIR PASS:
Your previous JSON was invalid or used forbidden meta redesign copy.
Return valid JSON only. Use camelCase keys exactly as specified.
Headline must be customer-facing (what the business does), never "a clearer homepage for…".
Include at least 3 services with title+desc, 3 proofPoints (trust chips), and 3 improvementNotes (owner-facing).`;

  const second = await callOpenAiOnce({
    apiKey,
    model,
    brief: repairBrief,
    temperature: 0.25,
  });
  attempts += 1;
  if (!second.ok) {
    return { ok: false, error: second.error, errorCode: second.errorCode, attempts };
  }

  const parsed2 = parseAndValidate(second.content);
  if (parsed2.ok && "fields" in parsed2) {
    return { ok: true, fields: parsed2.fields, model, attempts };
  }

  return {
    ok: false,
    error: !parsed2.ok ? parsed2.error : "OpenAI validation failed after retry",
    errorCode: !parsed2.ok ? parsed2.errorCode : "schema",
    attempts,
  };
}
