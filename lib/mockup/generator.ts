import { createHash, randomBytes } from "crypto";
import {
  categoryLabel,
  goalLabel,
  styleLabel,
  type MockupRequestInput,
} from "@/lib/validation/mockup";
import {
  extractSiteSignals,
  type FetchQuality,
  type SiteSignals,
} from "@/lib/mockup/extract-site";
import {
  buildContentStrategy,
  buildCustomerHeadline,
  buildCustomerSubheadline,
  buildImprovementNotes,
  personalizationSummary,
  pickPrimaryCta,
  resolveServices,
  type ContentStrategy,
  type SectionKey,
} from "@/lib/mockup/content-strategy";
import {
  generateConceptFieldsWithOpenAi,
  isOpenAiConfigured,
  mergeLlmFieldsIntoConcept,
} from "@/lib/mockup/openai-concept";

export type { SiteSignals, FetchQuality } from "@/lib/mockup/extract-site";
export {
  extractSiteSignals,
  parseHomepageHtml,
  emptySiteSignals,
  isChallengePage,
} from "@/lib/mockup/extract-site";
export type { ContentStrategy, SectionKey } from "@/lib/mockup/content-strategy";

export type MockupTheme = {
  key: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  heroGradient: string;
  buttonText: string;
};

export type CurrentSnapshot = {
  screenshotUrl: string | null;
  screenshotStatus: "ready" | "unavailable" | "pending";
  headline: string | null;
  subheadline: string | null;
  primaryCta: string | null;
  services: { title: string; desc: string }[];
  phone: string | null;
  navItems: string[];
  fetchQuality: FetchQuality;
  blockedReason: string | null;
};

export type MockupConcept = {
  version: string;
  label: string;
  businessName: string;
  categoryLabel: string;
  styleLabel: string;
  goalLabel: string;
  /** Customer-facing eyebrow inside the hero (not redesign commentary). */
  heroEyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  navItems: string[];
  services: { title: string; desc: string }[];
  servicesHeading: string;
  trustHeading: string;
  trustLine: string;
  /** Customer-facing trust chips inside the mockup (never meta redesign notes). */
  proofPoints: string[];
  ctaBandHeadline: string;
  ctaBandSub: string;
  sectionPlan: SectionKey[];
  processSteps?: { title: string; desc: string }[];
  serviceAreaLine?: string;
  footerNote: string;
  /** Owner-facing — render OUTSIDE the mockup frame only. */
  improvementNotes: string[];
  /** Short personalization line for the result page. */
  personalizationLine: string;
  theme: MockupTheme;
  logoUrl: string | null;
  phone: string | null;
  currentSnapshot: CurrentSnapshot;
  sourceSignals: {
    usedLiveSite: boolean;
    fetchQuality: FetchQuality;
    detectedHeadline: string | null;
    detectedTitle: string | null;
    usedRealServices: boolean;
    usedRealCta: boolean;
    generatedBy?: "openai" | "rules";
    siteBlocked?: boolean;
    niche?: string;
  };
  disclaimer: string;
};

const THEMES: Record<string, MockupTheme> = {
  clean_modern: {
    key: "clean_modern",
    background: "#f4f7fb",
    surface: "#ffffff",
    text: "#0f2744",
    muted: "#5b6b7c",
    accent: "#1f5e95",
    accentSoft: "#e8f2fb",
    heroGradient: "linear-gradient(145deg, #0e2f54 0%, #1f5e95 100%)",
    buttonText: "#ffffff",
  },
  premium_professional: {
    key: "premium_professional",
    background: "#f7f5f1",
    surface: "#ffffff",
    text: "#1a2332",
    muted: "#5c6570",
    accent: "#0e2f54",
    accentSoft: "#eef2f6",
    heroGradient: "linear-gradient(145deg, #002040 0%, #0e2f54 55%, #1a4060 100%)",
    buttonText: "#ffffff",
  },
  bold_conversion: {
    key: "bold_conversion",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0b1220",
    muted: "#4b5563",
    accent: "#c45c26",
    accentSoft: "#fff1e8",
    heroGradient: "linear-gradient(145deg, #111827 0%, #1f2937 60%, #374151 100%)",
    buttonText: "#ffffff",
  },
  simple_trustworthy: {
    key: "simple_trustworthy",
    background: "#f5f8f6",
    surface: "#ffffff",
    text: "#143528",
    muted: "#4d6358",
    accent: "#2f6b4f",
    accentSoft: "#e7f2ec",
    heroGradient: "linear-gradient(145deg, #1b4332 0%, #2d6a4f 100%)",
    buttonText: "#ffffff",
  },
};

/** Industry-tinted theme overlays for stronger visual fit. */
function nicheThemeTint(theme: MockupTheme, niche: string): MockupTheme {
  switch (niche) {
    case "marine":
      return {
        ...theme,
        accent: theme.key === "bold_conversion" ? "#1a6b8a" : "#1a5f7a",
        accentSoft: "#e6f3f7",
        heroGradient: "linear-gradient(145deg, #0a3d4d 0%, #1a5f7a 55%, #2a7a9a 100%)",
      };
    case "hvac":
    case "plumbing":
    case "electrical":
    case "roofing":
      if (theme.key === "simple_trustworthy") return theme;
      return {
        ...theme,
        accent: theme.key === "bold_conversion" ? "#c45c26" : "#1f5e95",
        heroGradient:
          theme.key === "bold_conversion"
            ? theme.heroGradient
            : "linear-gradient(145deg, #0e2f54 0%, #1f5e95 100%)",
      };
    case "legal":
      return {
        ...theme,
        accent: "#0e2f54",
        accentSoft: "#eef2f6",
        heroGradient: "linear-gradient(145deg, #002040 0%, #0e2f54 55%, #1a4060 100%)",
      };
    case "medspa":
    case "dental":
      return {
        ...theme,
        accent: theme.key === "bold_conversion" ? "#8b5e6e" : "#4a6fa5",
        accentSoft: "#f3eef1",
        heroGradient: "linear-gradient(145deg, #2c3e50 0%, #4a6fa5 100%)",
      };
    case "it_msp":
      return {
        ...theme,
        accent: "#1f5e95",
        accentSoft: "#e8f2fb",
        heroGradient: "linear-gradient(145deg, #0b1f33 0%, #1f5e95 100%)",
      };
    default:
      return theme;
  }
}

function softAccentOverride(theme: MockupTheme, themeColor: string | null): MockupTheme {
  if (!themeColor || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(themeColor)) return theme;
  return {
    ...theme,
    accent: themeColor,
    accentSoft: `${themeColor}18`,
  };
}

function buildNavItems(signals: SiteSignals, strategy: ContentStrategy): string[] {
  if (signals.navItems.length >= 3) {
    return signals.navItems.slice(0, 5);
  }

  const defaultsByNiche: Record<string, string[]> = {
    legal: ["Practice Areas", "About", "Results", "Contact"],
    marine: ["Services", "Yard", "About", "Contact"],
    dental: ["Services", "Our Team", "Patient Info", "Contact"],
    medspa: ["Treatments", "About", "Results", "Book"],
    it_msp: ["Services", "Support", "About", "Contact"],
  };

  const defaults =
    defaultsByNiche[strategy.niche] ?? ["Services", "About", "Reviews", "Contact"];

  if (signals.navItems.length === 0) return defaults;
  const merged = [...signals.navItems];
  for (const d of defaults) {
    if (merged.length >= 4) break;
    if (!merged.some((n) => n.toLowerCase() === d.toLowerCase())) merged.push(d);
  }
  return merged.slice(0, 5);
}

function buildTrustLine(signals: SiteSignals, businessName: string): string {
  const parts: string[] = [];
  if (signals.locationHint) parts.push(`Serving ${signals.locationHint}`);
  if (signals.phone) parts.push(`Call ${signals.phone}`);
  if (!parts.length && signals.email) parts.push(signals.email);
  if (!parts.length) {
    return `${businessName} · Clear communication · Easy next steps`;
  }
  return parts.join(" · ");
}

function buildCurrentSnapshot(
  signals: SiteSignals,
  screenshotUrl: string | null = null,
): CurrentSnapshot {
  const blocked = Boolean(signals.blockedReason);
  const usableShot = blocked ? null : screenshotUrl;

  return {
    screenshotUrl: usableShot,
    screenshotStatus: usableShot ? "ready" : "unavailable",
    headline: blocked ? null : signals.h1 || signals.ogTitle || signals.title || null,
    subheadline: blocked ? null : signals.heroParagraph || signals.metaDesc || null,
    primaryCta: blocked ? null : signals.ctaHints[0] ?? null,
    services: blocked ? [] : signals.services.slice(0, 4),
    phone: signals.phone,
    navItems: blocked ? [] : signals.navItems.slice(0, 6),
    fetchQuality: signals.fetchQuality,
    blockedReason: signals.blockedReason,
  };
}

export function buildMockupConcept(
  input: MockupRequestInput,
  signals: SiteSignals,
  options?: { screenshotUrl?: string | null },
): MockupConcept {
  const strategy = buildContentStrategy(input, signals);
  const baseTheme = THEMES[input.preferred_style] ?? THEMES.clean_modern;
  const tinted = nicheThemeTint(baseTheme, strategy.niche);
  const theme = softAccentOverride(tinted, signals.themeColor);
  const { services, usedReal: usedRealServices } = resolveServices(
    input,
    signals,
    strategy.niche,
  );
  const { cta: primaryCta, usedReal: usedRealCta } = pickPrimaryCta(
    input,
    signals,
    strategy.niche,
  );
  const businessName = input.business_name.trim();
  const screenshotUrl = options?.screenshotUrl ?? null;

  return {
    version: "3.0",
    label: "Sample homepage concept",
    businessName,
    categoryLabel: categoryLabel(input.business_category),
    styleLabel: styleLabel(input.preferred_style),
    goalLabel: goalLabel(input.homepage_goal),
    heroEyebrow: strategy.heroEyebrow,
    headline: buildCustomerHeadline(input, signals, strategy.niche),
    subheadline: buildCustomerSubheadline(input, signals, strategy.niche),
    primaryCta,
    secondaryCta: strategy.secondaryCta,
    navItems: buildNavItems(signals, strategy),
    services,
    servicesHeading: strategy.servicesHeading,
    trustHeading: strategy.trustHeading,
    trustLine: buildTrustLine(signals, businessName),
    proofPoints: strategy.trustPoints,
    ctaBandHeadline: strategy.ctaBandHeadline,
    ctaBandSub: strategy.ctaBandSub,
    sectionPlan: strategy.sectionPlan,
    processSteps: strategy.processSteps,
    serviceAreaLine: strategy.serviceAreaLine,
    footerNote: `${businessName} · ${strategy.heroEyebrow}`,
    improvementNotes: buildImprovementNotes(input, signals, strategy),
    personalizationLine: personalizationSummary(input, signals, strategy),
    theme,
    logoUrl: signals.logoUrl,
    phone: signals.phone,
    currentSnapshot: buildCurrentSnapshot(signals, screenshotUrl),
    sourceSignals: {
      usedLiveSite: signals.fetched && !signals.blockedReason,
      fetchQuality: signals.fetchQuality,
      detectedHeadline: signals.h1 || null,
      detectedTitle: signals.title || null,
      usedRealServices,
      usedRealCta,
      generatedBy: "rules",
      siteBlocked: Boolean(signals.blockedReason),
      niche: strategy.niche,
    },
    disclaimer:
      "Preview only — sample homepage direction based on your business and preferences. Final design and launch details are refined during onboarding.",
  };
}

export async function generateMockupConcept(input: MockupRequestInput): Promise<{
  concept: MockupConcept;
  signals: SiteSignals;
  generation: { source: "openai" | "rules"; openAiError?: string; model?: string };
}> {
  const signals = await extractSiteSignals(input.website_url);
  let concept = buildMockupConcept(input, signals);

  if (isOpenAiConfigured()) {
    const llm = await generateConceptFieldsWithOpenAi(input, signals);
    if (llm.ok) {
      concept = mergeLlmFieldsIntoConcept(concept, llm.fields, { usedOpenAi: true });
      return {
        concept,
        signals,
        generation: { source: "openai", model: llm.model },
      };
    }
    console.warn("[mockup] OpenAI concept failed, using rules fallback:", llm.error);
    return {
      concept,
      signals,
      generation: { source: "rules", openAiError: llm.error },
    };
  }

  return { concept, signals, generation: { source: "rules" } };
}

export function attachScreenshotToConcept(
  concept: MockupConcept,
  screenshotUrl: string | null,
): MockupConcept {
  const blocked = Boolean(
    concept.currentSnapshot?.blockedReason || concept.sourceSignals?.siteBlocked,
  );
  const usable = blocked ? null : screenshotUrl;
  return {
    ...concept,
    currentSnapshot: {
      ...concept.currentSnapshot,
      screenshotUrl: usable,
      screenshotStatus: usable ? "ready" : "unavailable",
    },
  };
}

/** Mark concept as site-blocked and clear any challenge screenshot */
export function markConceptSiteBlocked(
  concept: MockupConcept,
  reason: string,
): MockupConcept {
  return {
    ...concept,
    currentSnapshot: {
      ...concept.currentSnapshot,
      screenshotUrl: null,
      screenshotStatus: "unavailable",
      headline: null,
      subheadline: null,
      primaryCta: null,
      services: [],
      navItems: [],
      blockedReason: reason,
      fetchQuality: "failed",
    },
    sourceSignals: {
      ...concept.sourceSignals,
      usedLiveSite: false,
      fetchQuality: "failed",
      siteBlocked: true,
      detectedHeadline: null,
    },
  };
}

export function createMockupAccessToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("hex");
  const tokenHash = hashMockupToken(token);
  return { token, tokenHash };
}

export function hashMockupToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
