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
  generateConceptFieldsWithOpenAi,
  isOpenAiConfigured,
  mergeLlmFieldsIntoConcept,
} from "@/lib/mockup/openai-concept";

export type { SiteSignals, FetchQuality } from "@/lib/mockup/extract-site";
export { extractSiteSignals, parseHomepageHtml, emptySiteSignals, isChallengePage } from "@/lib/mockup/extract-site";

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
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  navItems: string[];
  services: { title: string; desc: string }[];
  trustLine: string;
  proofPoints: string[];
  footerNote: string;
  improvementNotes: string[];
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
  };
  disclaimer: string;
};

const SERVICE_FALLBACKS: Record<string, { title: string; desc: string }[]> = {
  home_services: [
    { title: "Residential Service", desc: "Reliable help for homeowners who need it done right." },
    { title: "Commercial Support", desc: "Dependable service for local businesses and properties." },
    { title: "Emergency Response", desc: "Fast help when timing matters most." },
  ],
  professional_services: [
    { title: "Strategy & Planning", desc: "Clear guidance tailored to your goals." },
    { title: "Hands-On Support", desc: "Practical help that moves work forward." },
    { title: "Ongoing Advisory", desc: "Steady support as your needs change." },
  ],
  healthcare: [
    { title: "Patient-Focused Care", desc: "Clear, supportive care for every visit." },
    { title: "Specialized Services", desc: "Treatment options explained in plain language." },
    { title: "Easy Scheduling", desc: "Simple booking and responsive follow-up." },
  ],
  legal: [
    { title: "Clear Guidance", desc: "Straightforward counsel for important decisions." },
    { title: "Case Support", desc: "Focused representation with practical next steps." },
    { title: "Client Communication", desc: "Updates you can understand, not legal jargon." },
  ],
  real_estate: [
    { title: "Buying Support", desc: "Guidance from search to closing." },
    { title: "Selling Strategy", desc: "Clear pricing and presentation that attracts buyers." },
    { title: "Local Expertise", desc: "Market knowledge that helps you move with confidence." },
  ],
  automotive: [
    { title: "Diagnostics & Repair", desc: "Honest assessments and quality workmanship." },
    { title: "Maintenance Plans", desc: "Keep your vehicle reliable with scheduled care." },
    { title: "Customer Care", desc: "Clear estimates and respectful service." },
  ],
  hospitality: [
    { title: "Guest Experience", desc: "Comfortable stays with thoughtful details." },
    { title: "Local Recommendations", desc: "Help guests enjoy the area with ease." },
    { title: "Easy Booking", desc: "Simple reservations and clear communication." },
  ],
  b2b: [
    { title: "Core Services", desc: "Practical solutions built for business outcomes." },
    { title: "Implementation Support", desc: "Help turning plans into working results." },
    { title: "Ongoing Partnership", desc: "Reliable support as priorities evolve." },
  ],
  other: [
    { title: "Primary Services", desc: "The work you are known for, explained clearly." },
    { title: "How We Help", desc: "A simple process customers can trust." },
    { title: "Get Started", desc: "An easy next step for new inquiries." },
  ],
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

function softAccentOverride(theme: MockupTheme, themeColor: string | null): MockupTheme {
  if (!themeColor || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(themeColor)) return theme;
  // Keep style family but borrow site accent for CTAs/chips
  return {
    ...theme,
    accent: themeColor,
    accentSoft: `${themeColor}18`,
  };
}

function polishHeadline(raw: string, businessName: string, goal: string): string {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  // If already clear and reasonably short, keep close to original
  if (cleaned.length >= 18 && cleaned.length <= 90 && !/lorem|untitled|home$/i.test(cleaned)) {
    if (goal === "more_calls" && !/call|phone|reach|contact/i.test(cleaned)) {
      return `${cleaned} — call ${businessName} today.`;
    }
    if (goal === "more_quotes" && !/quote|estimate|pricing/i.test(cleaned)) {
      return `${cleaned} Get a clear quote from ${businessName}.`;
    }
    return cleaned;
  }

  if (cleaned.length > 90) {
    return `${cleaned.slice(0, 87)}…`;
  }
  return cleaned;
}

function buildHeadline(input: MockupRequestInput, signals: SiteSignals): string {
  const name = input.business_name.trim();
  const siteHeadline = signals.h1 || signals.ogTitle || "";
  const polished = polishHeadline(siteHeadline, name, input.homepage_goal);
  if (polished && polished.length >= 12) return polished;

  switch (input.homepage_goal) {
    case "more_calls":
      return `Need ${categoryLabel(input.business_category).toLowerCase()} you can trust? ${name} is ready to help.`;
    case "more_quotes":
      return `Get a clear quote from ${name} — without the runaround.`;
    case "look_credible":
      return `${name}: clearer messaging and a more professional first impression.`;
    case "explain_services":
      return `Clear services. Straightforward next steps. That's ${name}.`;
    case "modernize":
    default:
      return `A clearer, more modern homepage for ${name}.`;
  }
}

function buildSubheadline(input: MockupRequestInput, signals: SiteSignals): string {
  const fromSite =
    (signals.heroParagraph && signals.heroParagraph.length > 40
      ? signals.heroParagraph
      : null) ||
    (signals.metaDesc && signals.metaDesc.length > 40 ? signals.metaDesc : null);

  if (fromSite) {
    const trimmed = fromSite.length > 180 ? `${fromSite.slice(0, 177)}…` : fromSite;
    return trimmed;
  }

  switch (input.homepage_goal) {
    case "more_calls":
      return "Make it easy for visitors to understand what you do and call with confidence.";
    case "more_quotes":
      return "Lead with clarity, trust, and a simple path to request a quote.";
    case "look_credible":
      return "Present your business with a stronger layout, cleaner messaging, and a more professional feel.";
    case "explain_services":
      return "Organize your services so customers can quickly see how you can help.";
    default:
      return "A fresher homepage direction focused on clarity, credibility, and a stronger first impression.";
  }
}

function buildPrimaryCta(input: MockupRequestInput, signals: SiteSignals): {
  cta: string;
  usedReal: boolean;
} {
  if (signals.ctaHints[0]) {
    return { cta: signals.ctaHints[0], usedReal: true };
  }
  switch (input.homepage_goal) {
    case "more_calls":
      return { cta: signals.phone ? `Call ${signals.phone}` : "Call Us Today", usedReal: false };
    case "more_quotes":
      return { cta: "Request a Quote", usedReal: false };
    case "look_credible":
      return { cta: "Talk With Our Team", usedReal: false };
    case "explain_services":
      return { cta: "Explore Our Services", usedReal: false };
    default:
      return { cta: "Get Started", usedReal: false };
  }
}

function buildSecondaryCta(signals: SiteSignals): string {
  const second = signals.ctaHints[1];
  if (second && second.toLowerCase() !== signals.ctaHints[0]?.toLowerCase()) {
    return second;
  }
  if (signals.navItems.some((n) => /service/i.test(n))) return "View Services";
  if (signals.navItems.some((n) => /about/i.test(n))) return "About Us";
  return "See How It Works";
}

function buildServices(
  input: MockupRequestInput,
  signals: SiteSignals,
): { services: { title: string; desc: string }[]; usedReal: boolean } {
  if (signals.services.length >= 1) {
    const list = signals.services.slice(0, 3);
    // Pad with remaining category items if only 1–2 found, but keep real ones first
    if (list.length < 3) {
      const fallbacks = SERVICE_FALLBACKS[input.business_category] ?? SERVICE_FALLBACKS.other;
      for (const fb of fallbacks) {
        if (list.length >= 3) break;
        if (!list.some((s) => s.title.toLowerCase() === fb.title.toLowerCase())) {
          list.push(fb);
        }
      }
    }
    return { services: list.slice(0, 3), usedReal: true };
  }

  // Legacy serviceHints only
  if (signals.serviceHints.length >= 2) {
    return {
      services: signals.serviceHints.slice(0, 3).map((title) => ({
        title,
        desc: "Presented more clearly so visitors understand the value right away.",
      })),
      usedReal: true,
    };
  }

  return {
    services: SERVICE_FALLBACKS[input.business_category] ?? SERVICE_FALLBACKS.other,
    usedReal: false,
  };
}

function buildNavItems(signals: SiteSignals): string[] {
  if (signals.navItems.length >= 3) {
    return signals.navItems.slice(0, 5);
  }
  const defaults = ["Services", "About", "Reviews", "Contact"];
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

function buildImprovementNotes(input: MockupRequestInput, signals: SiteSignals): string[] {
  const notes: string[] = [];

  if (signals.blockedReason) {
    notes.push(
      "Live site was protected by bot security, so this concept was built from your business details",
    );
  } else if (!signals.fetched || signals.fetchQuality === "failed") {
    notes.push("Concept built from your preferences — live site signals were limited");
  } else if (signals.fetchQuality === "limited") {
    notes.push("Some live-site details were limited, so preferences filled the gaps");
  }

  if (signals.fetched && !signals.blockedReason) {
    if (!signals.h1 || signals.h1.length < 12) {
      notes.push("Stronger homepage headline than the current page suggested");
    } else {
      notes.push(`Clearer presentation of your current message: “${signals.h1.slice(0, 48)}${signals.h1.length > 48 ? "…" : ""}”`);
    }

    if (signals.ctaHints.length === 0) {
      notes.push("Added a clearer primary call to action above the fold");
    } else {
      notes.push("Stronger CTA placement while keeping language close to your site");
    }

    if (signals.services.length === 0) {
      notes.push("Cleaner service layout so visitors can scan what you offer");
    } else {
      notes.push("Your real services reorganized into a cleaner, easier-to-scan layout");
    }
  } else {
    notes.push("Clearer headline that states what you do and who you help");
    notes.push("Stronger primary CTA placement above the fold");
    notes.push("Cleaner service layout that is easier to scan");
  }

  notes.push("More trustworthy visual structure and spacing");
  notes.push("A more modern first impression without clutter");

  if (input.homepage_goal === "more_calls") {
    notes.push("Call-focused CTA language to reduce hesitation");
  }
  if (input.homepage_goal === "more_quotes") {
    notes.push("Quote-request path made more obvious and low-friction");
  }
  if (input.notes?.trim()) {
    notes.push("Your notes were factored into the sample direction");
  }

  return [...new Set(notes)].slice(0, 6);
}

function buildCurrentSnapshot(
  signals: SiteSignals,
  screenshotUrl: string | null = null,
): CurrentSnapshot {
  const blocked = Boolean(signals.blockedReason);
  // Never show a Cloudflare challenge capture as "current homepage"
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
  const baseTheme = THEMES[input.preferred_style] ?? THEMES.clean_modern;
  const theme = softAccentOverride(baseTheme, signals.themeColor);
  const { services, usedReal: usedRealServices } = buildServices(input, signals);
  const { cta: primaryCta, usedReal: usedRealCta } = buildPrimaryCta(input, signals);
  const businessName = input.business_name.trim();
  const screenshotUrl = options?.screenshotUrl ?? null;

  return {
    version: "2.0",
    label: "Sample homepage concept",
    businessName,
    categoryLabel: categoryLabel(input.business_category),
    styleLabel: styleLabel(input.preferred_style),
    goalLabel: goalLabel(input.homepage_goal),
    headline: buildHeadline(input, signals),
    subheadline: buildSubheadline(input, signals),
    primaryCta,
    secondaryCta: buildSecondaryCta(signals),
    navItems: buildNavItems(signals),
    services,
    trustLine: buildTrustLine(signals, businessName),
    proofPoints: [
      usedRealServices ? "Built from your real services" : "Clearer first impression",
      usedRealCta ? "Your CTA language, stronger placement" : "Stronger call to action",
      "Easier-to-scan layout",
    ],
    footerNote: `${businessName} · Sample redesign direction`,
    improvementNotes: buildImprovementNotes(input, signals),
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
    },
    disclaimer:
      "Preview only — sample direction based on your site and preferences. Final design and launch details are refined during onboarding.",
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
  const blocked = Boolean(concept.currentSnapshot?.blockedReason || concept.sourceSignals?.siteBlocked);
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

export function createMockupAccessToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("hex");
  const tokenHash = hashMockupToken(token);
  return { token, tokenHash };
}

export function hashMockupToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
