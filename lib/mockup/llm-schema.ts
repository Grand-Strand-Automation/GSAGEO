import { z } from "zod";
import { isMetaHomepageCopy } from "@/lib/mockup/content-strategy";

const itemSchema = z.object({
  title: z.string().min(2).max(80),
  desc: z.string().min(4).max(280),
});

const sectionSchema = z.object({
  type: z.string().min(2).max(40).optional(),
  heading: z.string().min(2).max(120),
  body: z.string().min(4).max(320).optional(),
  items: z.array(itemSchema).min(1).max(6).optional(),
});

/**
 * Preferred structured homepage concept from OpenAI.
 * Flat legacy keys are also accepted via normalizeLlmPayload.
 */
export const structuredHomepageSchema = z.object({
  businessType: z.string().min(2).max(80).optional(),
  audienceType: z.string().min(2).max(120).optional(),
  tone: z.string().min(2).max(80).optional(),
  hero: z
    .object({
      eyebrow: z.string().min(2).max(80).optional(),
      headline: z.string().min(8).max(180),
      subheadline: z.string().min(12).max(360),
      primaryCta: z.string().min(2).max(56),
      secondaryCta: z.string().min(2).max(56),
      trustLine: z.string().min(4).max(180),
    })
    .optional(),
  // Flat aliases (legacy / repair paths)
  heroEyebrow: z.string().min(2).max(80).optional(),
  headline: z.string().min(8).max(180).optional(),
  subheadline: z.string().min(12).max(360).optional(),
  primaryCta: z.string().min(2).max(56).optional(),
  secondaryCta: z.string().min(2).max(56).optional(),
  trustLine: z.string().min(4).max(180).optional(),
  navItems: z.array(z.string().min(1).max(40)).min(2).max(8),
  services: z.array(itemSchema).min(2).max(5).optional(),
  servicesHeading: z.string().min(2).max(64).optional(),
  trustHeading: z.string().min(2).max(64).optional(),
  proofPoints: z.array(z.string().min(2).max(100)).min(1).max(5),
  ctaBandHeadline: z.string().min(4).max(120).optional(),
  ctaBandSub: z.string().min(4).max(200).optional(),
  processSteps: z.array(itemSchema).min(2).max(4).optional(),
  sections: z.array(sectionSchema).min(1).max(8).optional(),
  improvementNotes: z.array(z.string().min(4).max(220)).min(2).max(8).optional(),
  improvementSummary: z.array(z.string().min(4).max(220)).min(2).max(8).optional(),
  designDirection: z.string().min(8).max(280).optional(),
});

export type StructuredHomepageRaw = z.infer<typeof structuredHomepageSchema>;

/** Flattened fields used by MockupConcept merge. */
export type LlmConceptFields = {
  heroEyebrow?: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  navItems: string[];
  services: { title: string; desc: string }[];
  servicesHeading?: string;
  trustHeading?: string;
  trustLine: string;
  proofPoints: string[];
  ctaBandHeadline?: string;
  ctaBandSub?: string;
  processSteps?: { title: string; desc: string }[];
  improvementNotes: string[];
  businessType?: string;
  audienceType?: string;
  tone?: string;
  designDirection?: string;
  sections?: StructuredHomepageRaw["sections"];
};

const LOG_PREFIX = "[mockup:schema]";

function findSection(
  sections: NonNullable<StructuredHomepageRaw["sections"]> | undefined,
  type: string,
) {
  return sections?.find((s) => (s.type ?? "").toLowerCase() === type.toLowerCase());
}

/**
 * Map common LLM key aliases / nested hero → expected keys.
 */
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

  // Nested hero → flat
  if (src.hero && typeof src.hero === "object" && !Array.isArray(src.hero)) {
    const hero = src.hero as Record<string, unknown>;
    if (out.heroEyebrow == null && hero.eyebrow != null) out.heroEyebrow = hero.eyebrow;
    if (out.headline == null && hero.headline != null) out.headline = hero.headline;
    if (out.subheadline == null && hero.subheadline != null) out.subheadline = hero.subheadline;
    if (out.primaryCta == null && hero.primaryCta != null) out.primaryCta = hero.primaryCta;
    if (out.secondaryCta == null && hero.secondaryCta != null) out.secondaryCta = hero.secondaryCta;
    if (out.trustLine == null && hero.trustLine != null) out.trustLine = hero.trustLine;
  }

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
  alias("improvementSummary", ["improvement_summary"]);
  alias("designDirection", ["design_direction", "visualDirection"]);
  alias("businessType", ["business_type"]);
  alias("audienceType", ["audience_type", "audience"]);

  // Prefer improvementSummary naming
  if (!out.improvementNotes && out.improvementSummary) {
    out.improvementNotes = out.improvementSummary;
  }
  if (!out.improvementSummary && out.improvementNotes) {
    out.improvementSummary = out.improvementNotes;
  }

  // Extract services / process / cta from sections[]
  if (Array.isArray(out.sections)) {
    const sections = out.sections as NonNullable<StructuredHomepageRaw["sections"]>;
    const servicesSec = findSection(sections, "services") ?? sections.find((s) => s.items?.length);
    const trustSec = findSection(sections, "trust");
    const processSec = findSection(sections, "process");
    const ctaSec = findSection(sections, "cta");

    if (!out.services && servicesSec?.items?.length) {
      out.services = servicesSec.items;
    }
    if (!out.servicesHeading && servicesSec?.heading) {
      out.servicesHeading = servicesSec.heading;
    }
    if (!out.trustHeading && trustSec?.heading) {
      out.trustHeading = trustSec.heading;
    }
    if (!out.processSteps && processSec?.items?.length) {
      out.processSteps = processSec.items;
    }
    if (!out.ctaBandHeadline && ctaSec?.heading) {
      out.ctaBandHeadline = ctaSec.heading;
    }
    if (!out.ctaBandSub && ctaSec?.body) {
      out.ctaBandSub = ctaSec.body;
    }
  }

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
  if (Array.isArray(out.improvementSummary)) {
    out.improvementSummary = out.improvementSummary
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
  if (!Array.isArray(out.improvementSummary) || out.improvementSummary.length < 2) {
    out.improvementSummary = out.improvementNotes;
  }
  if (!Array.isArray(out.proofPoints) || out.proofPoints.length < 1) {
    out.proofPoints = ["Trusted locally", "Clear communication", "Easy next steps"];
  }
  if (!Array.isArray(out.navItems) || out.navItems.length < 2) {
    out.navItems = ["Services", "About", "Reviews", "Contact"];
  }

  // Ensure required flat fields exist for schema when only nested hero was provided
  if (!out.headline && out.hero && typeof out.hero === "object") {
    const hero = out.hero as Record<string, unknown>;
    out.headline = hero.headline;
    out.subheadline = hero.subheadline;
    out.primaryCta = hero.primaryCta;
    out.secondaryCta = hero.secondaryCta;
    out.trustLine = hero.trustLine;
  }

  return out;
}

export type ParseLlmResult =
  | { ok: true; fields: LlmConceptFields }
  | { ok: false; error: string; errorCode: string };

/**
 * Parse + validate OpenAI JSON into renderable LlmConceptFields.
 */
export function parseAndValidateLlmContent(content: string): ParseLlmResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      ok: false,
      error: "OpenAI returned non-JSON content",
      errorCode: "parse",
    };
  }

  const normalized = normalizeLlmPayload(parsed);
  const validated = structuredHomepageSchema.safeParse(normalized);
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
    };
  }

  const data = validated.data;
  const headline = data.hero?.headline ?? data.headline;
  const subheadline = data.hero?.subheadline ?? data.subheadline;
  const primaryCta = data.hero?.primaryCta ?? data.primaryCta;
  const secondaryCta = data.hero?.secondaryCta ?? data.secondaryCta;
  const trustLine = data.hero?.trustLine ?? data.trustLine;
  const heroEyebrow = data.hero?.eyebrow ?? data.heroEyebrow;

  if (!headline || !subheadline || !primaryCta || !secondaryCta || !trustLine) {
    return {
      ok: false,
      error: "OpenAI JSON missing required hero fields",
      errorCode: "schema",
    };
  }

  if (isMetaHomepageCopy(headline)) {
    console.warn(LOG_PREFIX, "rejected meta headline", {
      headlinePreview: headline.slice(0, 80),
    });
    return {
      ok: false,
      error: "OpenAI returned meta redesign headline",
      errorCode: "meta_copy",
    };
  }

  const services =
    data.services ??
    findSection(data.sections, "services")?.items ??
    data.sections?.find((s) => s.items?.length)?.items;

  if (!services || services.length < 2) {
    return {
      ok: false,
      error: "OpenAI JSON missing services section",
      errorCode: "schema",
    };
  }

  const improvementNotes = data.improvementSummary ?? data.improvementNotes ?? [];
  if (improvementNotes.length < 2) {
    return {
      ok: false,
      error: "OpenAI JSON missing improvement summary",
      errorCode: "schema",
    };
  }

  const fields: LlmConceptFields = {
    heroEyebrow,
    headline,
    subheadline,
    primaryCta,
    secondaryCta,
    navItems: data.navItems,
    services,
    servicesHeading: data.servicesHeading ?? findSection(data.sections, "services")?.heading,
    trustHeading: data.trustHeading ?? findSection(data.sections, "trust")?.heading,
    trustLine,
    proofPoints: data.proofPoints,
    ctaBandHeadline: data.ctaBandHeadline ?? findSection(data.sections, "cta")?.heading,
    ctaBandSub: data.ctaBandSub ?? findSection(data.sections, "cta")?.body,
    processSteps:
      data.processSteps ?? findSection(data.sections, "process")?.items ?? undefined,
    improvementNotes,
    businessType: data.businessType,
    audienceType: data.audienceType,
    tone: data.tone,
    designDirection: data.designDirection,
    sections: data.sections,
  };

  return { ok: true, fields };
}

/** @deprecated Prefer parseAndValidateLlmContent */
export const llmConceptSchema = structuredHomepageSchema;
