import { createHash, randomBytes } from "crypto";
import { extractHtmlData } from "@/lib/audit/content-extraction";
import { fetchWithTimeout, normalizeAuditUrl } from "@/lib/audit/crawl-checks";
import {
  categoryLabel,
  goalLabel,
  styleLabel,
  type MockupRequestInput,
} from "@/lib/validation/mockup";

export type SiteSignals = {
  fetched: boolean;
  title: string;
  h1: string;
  metaDesc: string;
  ogTitle: string;
  phone: string | null;
  serviceHints: string[];
  ctaHints: string[];
};

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
  sourceSignals: {
    usedLiveSite: boolean;
    detectedHeadline: string | null;
    detectedTitle: string | null;
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

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractPhones(html: string): string | null {
  const match = html.match(/(\+?1[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
  return match?.[1]?.trim() ?? null;
}

function extractServiceHints(html: string): string[] {
  const headings = [...html.matchAll(/<h[2-3][^>]*>([\s\S]{2,80}?)<\/h[2-3]>/gi)]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((t) => t.length >= 3 && t.length <= 48)
    .filter((t) => !/welcome|home|about|contact|blog|menu/i.test(t));

  const unique = [...new Set(headings)];
  return unique.slice(0, 4);
}

function extractCtaHints(html: string): string[] {
  const texts = [...html.matchAll(/<(?:a|button)[^>]*>([\s\S]{2,60}?)<\/(?:a|button)>/gi)]
    .map((m) => stripTags(m[1] ?? ""))
    .filter((t) =>
      /call|quote|contact|book|schedule|get started|request|free|learn more|get a/i.test(t),
    )
    .filter((t) => t.length <= 40);
  return [...new Set(texts)].slice(0, 4);
}

export async function extractSiteSignals(websiteUrl: string): Promise<SiteSignals> {
  const url = normalizeAuditUrl(websiteUrl);
  const result = await fetchWithTimeout(url);
  if (!result.ok || !result.html) {
    return {
      fetched: false,
      title: "",
      h1: "",
      metaDesc: "",
      ogTitle: "",
      phone: null,
      serviceHints: [],
      ctaHints: [],
    };
  }

  const data = extractHtmlData(result.html);
  return {
    fetched: true,
    title: stripTags(data.title),
    h1: stripTags(data.h1),
    metaDesc: stripTags(data.metaDesc),
    ogTitle: stripTags(data.ogTitle),
    phone: extractPhones(result.html),
    serviceHints: extractServiceHints(result.html),
    ctaHints: extractCtaHints(result.html),
  };
}

function buildHeadline(
  input: MockupRequestInput,
  signals: SiteSignals,
): string {
  const name = input.business_name.trim();
  switch (input.homepage_goal) {
    case "more_calls":
      return `Need ${categoryLabel(input.business_category).toLowerCase()} you can trust? ${name} is ready to help.`;
    case "more_quotes":
      return `Get a clear quote from ${name} — without the runaround.`;
    case "look_credible":
      return `${name}: professional ${categoryLabel(input.business_category).toLowerCase()} with a clearer first impression.`;
    case "explain_services":
      return `Clear services. Straightforward next steps. That's ${name}.`;
    case "modernize":
    default:
      if (signals.h1 && signals.h1.length > 12 && signals.h1.length < 90) {
        return `A clearer take on “${signals.h1}” — redesigned for today's customers.`;
      }
      return `A clearer, more modern homepage for ${name}.`;
  }
}

function buildSubheadline(input: MockupRequestInput, signals: SiteSignals): string {
  if (signals.metaDesc && signals.metaDesc.length > 40) {
    return `${signals.metaDesc.slice(0, 160)}${signals.metaDesc.length > 160 ? "…" : ""}`;
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

function buildPrimaryCta(input: MockupRequestInput, signals: SiteSignals): string {
  if (signals.ctaHints[0]) return signals.ctaHints[0];
  switch (input.homepage_goal) {
    case "more_calls":
      return "Call Us Today";
    case "more_quotes":
      return "Request a Quote";
    case "look_credible":
      return "Talk With Our Team";
    case "explain_services":
      return "Explore Our Services";
    default:
      return "Get Started";
  }
}

function buildServices(
  input: MockupRequestInput,
  signals: SiteSignals,
): { title: string; desc: string }[] {
  if (signals.serviceHints.length >= 3) {
    return signals.serviceHints.slice(0, 3).map((title) => ({
      title,
      desc: "Presented more clearly so visitors understand the value right away.",
    }));
  }
  return SERVICE_FALLBACKS[input.business_category] ?? SERVICE_FALLBACKS.other;
}

function buildImprovementNotes(input: MockupRequestInput, signals: SiteSignals): string[] {
  const notes = [
    "Clearer headline that states what you do and who you help",
    "Stronger primary CTA placement above the fold",
    "Cleaner service layout that is easier to scan",
    "More trustworthy visual structure and spacing",
    "A more modern first impression without clutter",
  ];

  if (!signals.fetched) {
    notes.unshift("Concept built from your preferences — live site signals were limited");
  } else if (!signals.h1) {
    notes.unshift("Stronger homepage headline than the current page structure suggested");
  }

  if (input.homepage_goal === "more_calls") {
    notes.push("Call-focused CTA language to reduce hesitation");
  }
  if (input.homepage_goal === "more_quotes") {
    notes.push("Quote-request path made more obvious and low-friction");
  }
  if (input.notes?.trim()) {
    notes.push("Your notes were factored into the sample direction");
  }

  return notes.slice(0, 6);
}

export function buildMockupConcept(
  input: MockupRequestInput,
  signals: SiteSignals,
): MockupConcept {
  const theme = THEMES[input.preferred_style] ?? THEMES.clean_modern;
  const services = buildServices(input, signals);

  return {
    version: "1.0",
    label: "Sample homepage concept",
    businessName: input.business_name.trim(),
    categoryLabel: categoryLabel(input.business_category),
    styleLabel: styleLabel(input.preferred_style),
    goalLabel: goalLabel(input.homepage_goal),
    headline: buildHeadline(input, signals),
    subheadline: buildSubheadline(input, signals),
    primaryCta: buildPrimaryCta(input, signals),
    secondaryCta: "See How It Works",
    navItems: ["Services", "About", "Reviews", "Contact"],
    services,
    trustLine: signals.phone
      ? `Trusted local service · Call ${signals.phone}`
      : "Trusted service · Clear communication · Easy next steps",
    proofPoints: [
      "Clearer first impression",
      "Stronger call to action",
      "Easier-to-scan services",
    ],
    footerNote: `${input.business_name.trim()} · Sample redesign direction`,
    improvementNotes: buildImprovementNotes(input, signals),
    theme,
    sourceSignals: {
      usedLiveSite: signals.fetched,
      detectedHeadline: signals.h1 || null,
      detectedTitle: signals.title || null,
    },
    disclaimer:
      "Preview only — sample direction based on your site and preferences. Final design and launch details are refined during onboarding.",
  };
}

export async function generateMockupConcept(input: MockupRequestInput): Promise<{
  concept: MockupConcept;
  signals: SiteSignals;
}> {
  const signals = await extractSiteSignals(input.website_url);
  const concept = buildMockupConcept(input, signals);
  return { concept, signals };
}

export function createMockupAccessToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("hex");
  const tokenHash = hashMockupToken(token);
  return { token, tokenHash };
}

export function hashMockupToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
