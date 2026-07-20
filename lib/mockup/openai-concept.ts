import type { MockupRequestInput } from "@/lib/validation/mockup";
import type { SiteSignals } from "@/lib/mockup/extract-site";
import type { MockupConcept } from "@/lib/mockup/generator";
import { isMetaHomepageCopy } from "@/lib/mockup/content-strategy";
import {
  getOpenAiClient,
  getOpenAiEnvStatus,
  isOpenAiConfigured,
  logOpenAiEnvDiagnostics,
  getOpenAiApiKey,
  getOpenAiModel,
} from "@/lib/openai/client";
import {
  buildHomepageMockupBrief,
  buildOpenAiBrief,
  HOMEPAGE_MOCKUP_SYSTEM_PROMPT,
  inferBusinessHints,
  normalizeMockupInput,
} from "@/lib/mockup/prompt";
import {
  normalizeLlmPayload,
  parseAndValidateLlmContent,
  type LlmConceptFields,
} from "@/lib/mockup/llm-schema";

const LOG_PREFIX = "[mockup:openai]";
const OPENAI_TIMEOUT_MS = 35_000;

export type { LlmConceptFields };
export type { OpenAiEnvStatus } from "@/lib/openai/client";

export {
  getOpenAiEnvStatus,
  isOpenAiConfigured,
  logOpenAiEnvDiagnostics,
  getOpenAiApiKey,
  getOpenAiModel,
};
export { buildOpenAiBrief, buildHomepageMockupBrief, inferBusinessHints, normalizeMockupInput };
export { normalizeLlmPayload };

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
  while (services.length < 3 && base.services[services.length]) {
    services.push(base.services[services.length]!);
  }

  const designNote = fields.designDirection?.trim();
  const improvementNotes = fields.improvementNotes.map((n) => n.trim()).filter(Boolean).slice(0, 6);

  return {
    ...base,
    version: "4.0",
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
    improvementNotes,
    sourceSignals: {
      ...base.sourceSignals,
      usedRealServices: base.sourceSignals.usedRealServices || fields.services.length > 0,
      usedRealCta: base.sourceSignals.usedRealCta,
      generatedBy: meta.usedOpenAi ? "openai" : base.sourceSignals.generatedBy ?? "rules",
      businessType: fields.businessType?.trim() || base.sourceSignals.businessType,
      audienceType: fields.audienceType?.trim() || base.sourceSignals.audienceType,
      tone: fields.tone?.trim() || base.sourceSignals.tone,
      designDirection: designNote || base.sourceSignals.designDirection,
    },
  };
}

export type OpenAiConceptResult =
  | { ok: true; fields: LlmConceptFields; model: string; attempts: number }
  | { ok: false; error: string; errorCode: string; attempts: number };

async function callOpenAiOnce(params: {
  model: string;
  brief: string;
  temperature: number;
}): Promise<{ ok: true; content: string } | { ok: false; error: string; errorCode: string }> {
  const started = Date.now();
  console.info(LOG_PREFIX, "request start", {
    model: params.model,
    temperature: params.temperature,
    briefChars: params.brief.length,
  });

  try {
    const client = getOpenAiClient();
    const completion = await client.chat.completions.create(
      {
        model: params.model,
        temperature: params.temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: HOMEPAGE_MOCKUP_SYSTEM_PROMPT },
          { role: "user", content: params.brief },
        ],
      },
      { timeout: OPENAI_TIMEOUT_MS },
    );

    const elapsedMs = Date.now() - started;
    const content = completion.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.error(LOG_PREFIX, "empty response", { elapsedMs });
      return { ok: false, error: "Empty OpenAI response", errorCode: "empty" };
    }

    console.info(LOG_PREFIX, "request success", {
      elapsedMs,
      contentChars: content.length,
      tokens: completion.usage?.total_tokens ?? null,
    });
    return { ok: true, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI request failed";
    const elapsedMs = Date.now() - started;
    const aborted =
      (err instanceof Error && err.name === "AbortError") ||
      /timeout|timed out|ETIMEDOUT/i.test(message);

    console.error(LOG_PREFIX, aborted ? "timeout" : "request exception", {
      message: message.slice(0, 240),
      elapsedMs,
    });

    // Auth errors from SDK
    const status =
      err && typeof err === "object" && "status" in err
        ? Number((err as { status?: number }).status)
        : undefined;
    if (status === 401 || status === 403) {
      return { ok: false, error: `OpenAI auth error (${status})`, errorCode: "auth" };
    }

    return {
      ok: false,
      error: aborted ? `OpenAI timeout after ${OPENAI_TIMEOUT_MS}ms` : message.slice(0, 240),
      errorCode: aborted ? "timeout" : "network",
    };
  }
}

/**
 * Call OpenAI (SDK) with JSON object response.
 * Retries once on schema/parse/meta failures with a stricter repair brief.
 */
export async function generateConceptFieldsWithOpenAi(
  input: MockupRequestInput,
  signals: SiteSignals,
): Promise<OpenAiConceptResult> {
  const env = logOpenAiEnvDiagnostics();

  if (!env.configured) {
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
  const brief = buildHomepageMockupBrief(normalizeMockupInput(input), signals);
  let attempts = 0;

  const first = await callOpenAiOnce({ model, brief, temperature: 0.5 });
  attempts += 1;
  if (!first.ok) {
    return { ok: false, error: first.error, errorCode: first.errorCode, attempts };
  }

  const parsed1 = parseAndValidateLlmContent(first.content);
  if (parsed1.ok) {
    console.info(LOG_PREFIX, "parse succeeded", { attempt: 1 });
    return { ok: true, fields: parsed1.fields, model, attempts };
  }

  console.warn(LOG_PREFIX, "retrying after validation/parse failure", {
    firstError: parsed1.error,
    errorCode: parsed1.errorCode,
  });

  const repairBrief = `${brief}

CRITICAL REPAIR PASS:
Your previous JSON was invalid or used forbidden meta redesign copy.
Return valid JSON only with the nested shape specified (businessType, audienceType, tone, hero, sections, improvementSummary, designDirection, navItems, proofPoints).
Headline must be customer-facing (what the business does), never "a clearer homepage for…".
Include a services section with at least 3 items, 3 proofPoints (trust chips), and 3 improvementSummary notes (owner-facing).`;

  const second = await callOpenAiOnce({
    model,
    brief: repairBrief,
    temperature: 0.25,
  });
  attempts += 1;
  if (!second.ok) {
    return { ok: false, error: second.error, errorCode: second.errorCode, attempts };
  }

  const parsed2 = parseAndValidateLlmContent(second.content);
  if (parsed2.ok) {
    console.info(LOG_PREFIX, "parse succeeded", { attempt: 2 });
    return { ok: true, fields: parsed2.fields, model, attempts };
  }

  console.error(LOG_PREFIX, "parse failed after retry", {
    error: parsed2.error,
    errorCode: parsed2.errorCode,
  });

  return {
    ok: false,
    error: parsed2.error,
    errorCode: parsed2.errorCode,
    attempts,
  };
}
