/**
 * Content strategy layer for homepage mockups.
 *
 * Input → business strategy → homepage plan → rendered mockup copy.
 * Keeps customer-facing homepage content separate from owner-facing improvement notes.
 */

import type { MockupRequestInput } from "@/lib/validation/mockup";
import type { SiteSignals } from "@/lib/mockup/extract-site";

export type SectionKey =
  | "hero"
  | "services"
  | "trust"
  | "process"
  | "service_area"
  | "cta";

export type NicheHint =
  | "marine"
  | "plumbing"
  | "hvac"
  | "roofing"
  | "electrical"
  | "dental"
  | "legal"
  | "it_msp"
  | "medspa"
  | "general";

export type ContentStrategy = {
  niche: NicheHint;
  audience: "homeowners" | "patients" | "clients" | "guests" | "businesses" | "buyers";
  tone: "practical" | "premium" | "warm" | "direct";
  objective: string;
  primaryCta: string;
  secondaryCta: string;
  heroEyebrow: string;
  servicesHeading: string;
  trustHeading: string;
  ctaBandHeadline: string;
  ctaBandSub: string;
  sectionPlan: SectionKey[];
  trustPoints: string[];
  processSteps?: { title: string; desc: string }[];
  serviceAreaLine?: string;
};

const META_COPY_RE =
  /\b(clearer|fresher|modern(ize|izing)?|redesign|mockup|concept|preview|template|wireframe|first impression|easier-to-scan|stronger (call|cta|layout)|homepage direction)\b/i;

export function isMetaHomepageCopy(text: string): boolean {
  return META_COPY_RE.test(text);
}

/** Infer niche from name, URL, notes, and optional extracted text. */
export function inferNiche(input: MockupRequestInput, signals?: SiteSignals): NicheHint {
  const blob = [
    input.business_name,
    input.website_url,
    input.notes ?? "",
    input.business_category,
    signals?.h1 ?? "",
    signals?.metaDesc ?? "",
    signals?.title ?? "",
    ...(signals?.services.map((s) => s.title) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (/marine|marina|boat|yacht|dock|haul.?out|boatyard/.test(blob)) return "marine";
  if (/plumb/.test(blob)) return "plumbing";
  if (/hvac|heat(ing)?|air.?cond|furnace|ac\b|cooling/.test(blob)) return "hvac";
  if (/roof/.test(blob)) return "roofing";
  if (/electr(ic|ician)|wiring/.test(blob)) return "electrical";
  if (/dental|dentist|ortho|hygien/.test(blob)) return "dental";
  if (/law|legal|attorney|lawyer|counsel/.test(blob) || input.business_category === "legal")
    return "legal";
  if (
    /\bit\b|msp|managed service|tech support|cyber|network|computer repair|help desk/.test(blob) ||
    (input.business_category === "b2b" && /tech|it |support|software/.test(blob))
  )
    return "it_msp";
  if (/med.?spa|aesthetics|botox|laser|wellness spa|skin care clinic/.test(blob)) return "medspa";

  return "general";
}

function audienceFor(
  category: MockupRequestInput["business_category"],
  niche: NicheHint,
): ContentStrategy["audience"] {
  if (niche === "legal" || category === "legal" || category === "professional_services")
    return "clients";
  if (niche === "dental" || niche === "medspa" || category === "healthcare") return "patients";
  if (category === "hospitality") return "guests";
  if (category === "b2b" || niche === "it_msp") return "businesses";
  if (category === "real_estate") return "buyers";
  return "homeowners";
}

function toneFor(
  style: MockupRequestInput["preferred_style"],
  niche: NicheHint,
): ContentStrategy["tone"] {
  if (style === "premium_professional" || niche === "legal" || niche === "medspa") return "premium";
  if (style === "bold_conversion" || niche === "plumbing" || niche === "hvac" || niche === "roofing")
    return "direct";
  if (style === "simple_trustworthy" || niche === "dental" || niche === "marine") return "warm";
  return "practical";
}

/** Primary CTA from goal + category + niche. Prefer real site CTAs when usable. */
export function pickPrimaryCta(
  input: MockupRequestInput,
  signals: SiteSignals,
  niche: NicheHint,
): { cta: string; usedReal: boolean } {
  const real = signals.ctaHints[0]?.trim();
  if (real && real.length >= 3 && real.length <= 40 && !isMetaHomepageCopy(real)) {
    // Soft-reject ultra-generic site CTAs when we can do better from goal
    if (!/^(get started|learn more|explore|click here|submit)$/i.test(real)) {
      return { cta: real, usedReal: true };
    }
  }

  const goal = input.homepage_goal;
  const cat = input.business_category;

  if (goal === "more_calls") {
    if (signals.phone) return { cta: `Call ${signals.phone}`, usedReal: false };
    if (niche === "marine") return { cta: "Call for Availability", usedReal: false };
    if (cat === "healthcare" || niche === "dental" || niche === "medspa")
      return { cta: "Call to Schedule", usedReal: false };
    if (cat === "legal" || niche === "legal") return { cta: "Call Our Office", usedReal: false };
    return { cta: "Call Us Today", usedReal: false };
  }

  if (goal === "more_quotes") {
    if (niche === "marine" || cat === "home_services" || niche === "plumbing" || niche === "hvac")
      return { cta: "Request a Quote", usedReal: false };
    if (cat === "automotive") return { cta: "Get an Estimate", usedReal: false };
    return { cta: "Request a Quote", usedReal: false };
  }

  if (goal === "look_credible") {
    if (cat === "legal" || niche === "legal") return { cta: "Book a Consultation", usedReal: false };
    if (niche === "it_msp" || cat === "b2b") return { cta: "Talk to an Expert", usedReal: false };
    if (cat === "healthcare" || niche === "medspa") return { cta: "Book a Consultation", usedReal: false };
    return { cta: "Speak With Our Team", usedReal: false };
  }

  if (goal === "explain_services") {
    if (cat === "legal") return { cta: "View Practice Areas", usedReal: false };
    if (cat === "real_estate") return { cta: "Browse Listings", usedReal: false };
    return { cta: "See Our Services", usedReal: false };
  }

  // modernize / default — still business-specific
  if (niche === "marine") return { cta: "Schedule Service", usedReal: false };
  if (niche === "plumbing" || niche === "hvac" || niche === "roofing" || niche === "electrical")
    return { cta: "Request Service", usedReal: false };
  if (niche === "dental" || niche === "medspa") return { cta: "Book an Appointment", usedReal: false };
  if (niche === "legal") return { cta: "Book a Consultation", usedReal: false };
  if (niche === "it_msp") return { cta: "Request Support", usedReal: false };
  if (cat === "home_services") return { cta: "Get a Free Estimate", usedReal: false };
  if (cat === "hospitality") return { cta: "Check Availability", usedReal: false };
  if (cat === "real_estate") return { cta: "Schedule a Showing", usedReal: false };
  if (cat === "automotive") return { cta: "Schedule Service", usedReal: false };
  if (cat === "healthcare") return { cta: "Book an Appointment", usedReal: false };
  if (cat === "legal") return { cta: "Book a Consultation", usedReal: false };
  if (cat === "b2b") return { cta: "Request a Consultation", usedReal: false };
  return { cta: "Contact Us", usedReal: false };
}

export function pickSecondaryCta(
  input: MockupRequestInput,
  signals: SiteSignals,
  primary: string,
): string {
  const second = signals.ctaHints[1]?.trim();
  if (
    second &&
    second.toLowerCase() !== primary.toLowerCase() &&
    !isMetaHomepageCopy(second) &&
    !/^(get started|learn more|explore)$/i.test(second)
  ) {
    return second;
  }

  const cat = input.business_category;
  if (signals.navItems.some((n) => /service|practice|offer/i.test(n))) {
    if (cat === "legal") return "View Practice Areas";
    return "View Services";
  }
  if (signals.phone && !/call/i.test(primary)) return "Call Us";
  if (cat === "hospitality") return "View Rooms";
  if (cat === "real_estate") return "Explore Homes";
  if (cat === "healthcare") return "Meet Our Team";
  return "About Us";
}

function nicheServices(niche: NicheHint): { title: string; desc: string }[] | null {
  switch (niche) {
    case "marine":
      return [
        {
          title: "Haul-Out & Yard Service",
          desc: "Safe haul-outs and yard space when your boat needs work done right.",
        },
        {
          title: "Mechanical & Systems Care",
          desc: "Engine, electrical, and onboard systems service from a local marine team.",
        },
        {
          title: "Seasonal Storage & Prep",
          desc: "Storage and seasonal prep so your boat is ready when you are.",
        },
      ];
    case "plumbing":
      return [
        {
          title: "Repairs & Diagnostics",
          desc: "Honest assessments and reliable repairs for leaks, fixtures, and lines.",
        },
        {
          title: "Water Heaters",
          desc: "Install and service tank and tankless systems for consistent hot water.",
        },
        {
          title: "Drain Cleaning",
          desc: "Clear stubborn clogs and keep drains flowing for homes and businesses.",
        },
      ];
    case "hvac":
      return [
        {
          title: "AC & Heating Repair",
          desc: "Fast diagnostics and repairs so your system runs when you need it.",
        },
        {
          title: "System Installs",
          desc: "Right-sized installs with clear options and upfront estimates.",
        },
        {
          title: "Maintenance Plans",
          desc: "Seasonal tune-ups that help prevent breakdowns and extend equipment life.",
        },
      ];
    case "roofing":
      return [
        {
          title: "Roof Repair",
          desc: "Leak fixes and storm damage repairs with clear documentation.",
        },
        {
          title: "Roof Replacement",
          desc: "Full replacements with materials and timelines explained upfront.",
        },
        {
          title: "Inspections",
          desc: "Thorough inspections so you know what needs attention — and what does not.",
        },
      ];
    case "electrical":
      return [
        {
          title: "Electrical Repairs",
          desc: "Safe troubleshooting for outlets, panels, and wiring issues.",
        },
        {
          title: "Panel Upgrades",
          desc: "Capacity upgrades and modernization for growing electrical needs.",
        },
        {
          title: "Lighting & Safety",
          desc: "Lighting installs and safety improvements for homes and businesses.",
        },
      ];
    case "dental":
      return [
        {
          title: "Preventive Care",
          desc: "Cleanings, exams, and guidance that keep smiles healthy long-term.",
        },
        {
          title: "Restorative Treatment",
          desc: "Fillings, crowns, and repairs explained in plain language.",
        },
        {
          title: "Cosmetic Options",
          desc: "Whitening and smile improvements tailored to your goals.",
        },
      ];
    case "legal":
      return [
        {
          title: "Initial Consultation",
          desc: "Clear guidance on your situation and practical next steps.",
        },
        {
          title: "Case Support",
          desc: "Focused representation with communication you can understand.",
        },
        {
          title: "Document Preparation",
          desc: "Careful drafting and review for agreements that matter.",
        },
      ];
    case "it_msp":
      return [
        {
          title: "Managed IT Support",
          desc: "Day-to-day support so your team stays productive and secure.",
        },
        {
          title: "Network & Security",
          desc: "Practical security baselines and reliable network operations.",
        },
        {
          title: "Cloud & Microsoft 365",
          desc: "Setup, administration, and guidance for the tools you already use.",
        },
      ];
    case "medspa":
      return [
        {
          title: "Consultations",
          desc: "Personalized consults so you understand options before you book.",
        },
        {
          title: "Skin Treatments",
          desc: "Results-focused treatments with clear aftercare guidance.",
        },
        {
          title: "Injectables & Aesthetics",
          desc: "Careful, professional aesthetic services in a comfortable setting.",
        },
      ];
    default:
      return null;
  }
}

const CATEGORY_SERVICES: Record<string, { title: string; desc: string }[]> = {
  home_services: [
    { title: "Residential Service", desc: "Reliable help for homeowners who need it done right." },
    { title: "Commercial Support", desc: "Dependable service for local businesses and properties." },
    { title: "Emergency Response", desc: "Fast help when timing matters most." },
  ],
  professional_services: [
    { title: "Strategy & Planning", desc: "Clear guidance tailored to your goals and constraints." },
    { title: "Hands-On Delivery", desc: "Practical work that moves projects forward." },
    { title: "Ongoing Advisory", desc: "Steady support as priorities change." },
  ],
  healthcare: [
    { title: "Patient-Focused Care", desc: "Supportive care with plain-language explanations." },
    { title: "Specialized Services", desc: "Treatment options matched to what you need." },
    { title: "Easy Scheduling", desc: "Simple booking and responsive follow-up." },
  ],
  legal: [
    { title: "Clear Guidance", desc: "Straightforward counsel for important decisions." },
    { title: "Case Support", desc: "Focused representation with practical next steps." },
    { title: "Client Communication", desc: "Updates you can understand — not legal jargon." },
  ],
  real_estate: [
    { title: "Buying Support", desc: "Guidance from search through closing." },
    { title: "Selling Strategy", desc: "Pricing and presentation that attract serious buyers." },
    { title: "Local Expertise", desc: "Market knowledge that helps you move with confidence." },
  ],
  automotive: [
    { title: "Diagnostics & Repair", desc: "Honest assessments and quality workmanship." },
    { title: "Maintenance Plans", desc: "Scheduled care that keeps your vehicle reliable." },
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
    { title: "How We Work", desc: "A simple process customers can trust." },
    { title: "Get in Touch", desc: "An easy next step for new inquiries." },
  ],
};

export function resolveServices(
  input: MockupRequestInput,
  signals: SiteSignals,
  niche: NicheHint,
): { services: { title: string; desc: string }[]; usedReal: boolean } {
  if (signals.services.length >= 1) {
    const list = signals.services.slice(0, 3).map((s) => ({
      title: s.title,
      desc:
        s.desc && !isMetaHomepageCopy(s.desc)
          ? s.desc
          : `Practical ${s.title.toLowerCase()} support from ${input.business_name.trim()}.`,
    }));
    if (list.length < 3) {
      const pad = nicheServices(niche) ?? CATEGORY_SERVICES[input.business_category] ?? CATEGORY_SERVICES.other;
      for (const fb of pad) {
        if (list.length >= 3) break;
        if (!list.some((s) => s.title.toLowerCase() === fb.title.toLowerCase())) list.push(fb);
      }
    }
    return { services: list.slice(0, 3), usedReal: true };
  }

  if (signals.serviceHints.length >= 2) {
    return {
      services: signals.serviceHints.slice(0, 3).map((title) => ({
        title,
        desc: `${title} from ${input.business_name.trim()} — explained clearly so you know what to expect.`,
      })),
      usedReal: true,
    };
  }

  const nicheList = nicheServices(niche);
  if (nicheList) return { services: nicheList, usedReal: false };

  return {
    services: CATEGORY_SERVICES[input.business_category] ?? CATEGORY_SERVICES.other,
    usedReal: false,
  };
}

function trustPointsFor(
  niche: NicheHint,
  category: MockupRequestInput["business_category"],
  signals: SiteSignals,
  businessName: string,
): string[] {
  const points: string[] = [];
  if (signals.locationHint) points.push(`Serving ${signals.locationHint}`);
  if (signals.phone) points.push(`Call ${signals.phone}`);

  const nichePoints: Record<NicheHint, string[]> = {
    marine: ["Local marine expertise", "Haul-out ready", "Owner communication"],
    plumbing: ["Licensed & insured", "Upfront estimates", "Emergency available"],
    hvac: ["Certified technicians", "Same-day options", "Maintenance plans"],
    roofing: ["Storm-ready teams", "Photo documentation", "Warranty guidance"],
    electrical: ["Code-compliant work", "Safety-first approach", "Clear timelines"],
    dental: ["Gentle care", "Plain-language plans", "Flexible scheduling"],
    legal: ["Confidential consults", "Clear next steps", "Local counsel"],
    it_msp: ["Proactive monitoring", "Fast response", "Documented systems"],
    medspa: ["Licensed providers", "Personalized plans", "Comfortable visits"],
    general: ["Trusted locally", "Clear communication", "Easy next steps"],
  };

  const catExtras: Partial<Record<string, string[]>> = {
    hospitality: ["Guest-first hospitality", "Local tips", "Easy booking"],
    real_estate: ["Local market insight", "Responsive showings", "Clear process"],
    automotive: ["Honest diagnostics", "Quality parts", "Respectful service"],
    healthcare: ["Patient-centered care", "Easy scheduling", "Clear explanations"],
    b2b: ["Business outcomes focus", "Reliable follow-through", "Practical advice"],
  };

  const pool = [
    ...(nichePoints[niche] ?? nichePoints.general),
    ...(catExtras[category] ?? []),
  ];

  for (const p of pool) {
    if (points.length >= 3) break;
    if (!points.some((x) => x.toLowerCase() === p.toLowerCase())) points.push(p);
  }

  while (points.length < 3) {
    points.push(`${businessName} · Ready to help`);
    break;
  }

  return points.slice(0, 3);
}

function sectionPlanFor(
  category: MockupRequestInput["business_category"],
  niche: NicheHint,
): SectionKey[] {
  if (niche === "marine" || niche === "plumbing" || niche === "hvac" || niche === "roofing" || niche === "electrical") {
    return ["hero", "services", "trust", "process", "cta"];
  }
  if (category === "home_services" || category === "automotive") {
    return ["hero", "services", "trust", "service_area", "cta"];
  }
  if (category === "legal" || niche === "legal" || category === "professional_services") {
    return ["hero", "services", "trust", "process", "cta"];
  }
  if (category === "healthcare" || niche === "dental" || niche === "medspa") {
    return ["hero", "services", "trust", "process", "cta"];
  }
  if (category === "b2b" || niche === "it_msp") {
    return ["hero", "services", "trust", "process", "cta"];
  }
  if (category === "hospitality" || category === "real_estate") {
    return ["hero", "services", "trust", "cta"];
  }
  return ["hero", "services", "trust", "cta"];
}

function processStepsFor(niche: NicheHint, category: string): { title: string; desc: string }[] {
  if (niche === "marine") {
    return [
      { title: "Tell us what you need", desc: "Share the boat, timing, and the work you want done." },
      { title: "Get a clear plan", desc: "We outline options, timing, and next steps." },
      { title: "Schedule service", desc: "Book haul-out or yard time when you are ready." },
    ];
  }
  if (niche === "legal" || category === "legal") {
    return [
      { title: "Schedule a consult", desc: "Share your situation in a confidential conversation." },
      { title: "Understand your options", desc: "We explain paths forward in plain language." },
      { title: "Move with a plan", desc: "Agree on next steps and stay informed." },
    ];
  }
  if (niche === "it_msp" || category === "b2b") {
    return [
      { title: "Share your priorities", desc: "Tell us what is slowing the team down." },
      { title: "Review a practical plan", desc: "We outline support, security, and ownership." },
      { title: "Get steady support", desc: "Ongoing help with clear communication." },
    ];
  }
  if (category === "healthcare" || niche === "dental" || niche === "medspa") {
    return [
      { title: "Book a visit", desc: "Choose a time that works for you." },
      { title: "Talk through goals", desc: "We listen and explain options clearly." },
      { title: "Start care", desc: "A plan you understand — with follow-up you can count on." },
    ];
  }
  // trades / home services default
  return [
    { title: "Request service", desc: "Tell us what you need and when you need it." },
    { title: "Get a clear estimate", desc: "Upfront options so there are no surprises." },
    { title: "We get it done", desc: "Quality work with respectful communication." },
  ];
}

function heroEyebrow(
  niche: NicheHint,
  category: MockupRequestInput["business_category"],
  signals: SiteSignals,
): string {
  if (signals.locationHint) {
    if (niche === "marine") return `Marine service · ${signals.locationHint}`;
    if (category === "home_services") return `Local ${categoryLabelShort(category)} · ${signals.locationHint}`;
    return `${categoryLabelShort(category)} · ${signals.locationHint}`;
  }

  switch (niche) {
    case "marine":
      return "Marine & boat services";
    case "plumbing":
      return "Plumbing you can count on";
    case "hvac":
      return "Heating & cooling specialists";
    case "roofing":
      return "Roofing & storm repair";
    case "electrical":
      return "Licensed electrical service";
    case "dental":
      return "Dental care for your family";
    case "legal":
      return "Legal counsel you can trust";
    case "it_msp":
      return "IT support for growing teams";
    case "medspa":
      return "Aesthetic & wellness care";
    default:
      return categoryLabelShort(category);
  }
}

function categoryLabelShort(category: string): string {
  const map: Record<string, string> = {
    home_services: "Home services",
    professional_services: "Professional services",
    healthcare: "Healthcare & wellness",
    legal: "Legal services",
    real_estate: "Real estate",
    automotive: "Auto service",
    hospitality: "Hospitality",
    b2b: "Business services",
    other: "Local business",
  };
  return map[category] ?? "Local business";
}

function servicesHeading(niche: NicheHint, category: string): string {
  if (niche === "legal" || category === "legal") return "How we can help";
  if (niche === "marine") return "Marine services";
  if (category === "healthcare" || niche === "dental" || niche === "medspa") return "Our care options";
  if (category === "hospitality") return "What guests can expect";
  if (category === "real_estate") return "How we support you";
  return "Our services";
}

function trustHeading(niche: NicheHint, category: string): string {
  if (niche === "legal" || category === "legal") return "Why clients choose us";
  if (category === "healthcare" || niche === "dental" || niche === "medspa")
    return "Why patients trust us";
  if (category === "b2b" || niche === "it_msp") return "Why businesses work with us";
  if (category === "hospitality") return "Why guests return";
  return "Why choose us";
}

function ctaBandCopy(
  input: MockupRequestInput,
  niche: NicheHint,
  businessName: string,
): { headline: string; sub: string } {
  const goal = input.homepage_goal;
  if (goal === "more_calls") {
    return {
      headline: `Ready to talk with ${businessName}?`,
      sub: "Call today — we will help you find the right next step.",
    };
  }
  if (goal === "more_quotes") {
    return {
      headline: "Need a clear quote?",
      sub: "Tell us what you need and we will follow up with practical options.",
    };
  }
  if (niche === "marine") {
    return {
      headline: "Ready to get your boat taken care of?",
      sub: "Reach out for scheduling, yard availability, or a service conversation.",
    };
  }
  if (niche === "legal" || input.business_category === "legal") {
    return {
      headline: "Have a question about your situation?",
      sub: "Schedule a consultation and get clear guidance on next steps.",
    };
  }
  if (input.business_category === "healthcare" || niche === "dental" || niche === "medspa") {
    return {
      headline: "Ready to schedule?",
      sub: "Book a visit and we will take it from there.",
    };
  }
  return {
    headline: `Ready to work with ${businessName}?`,
    sub: "Reach out and we will help you take the next step with confidence.",
  };
}

function objectiveLine(input: MockupRequestInput): string {
  switch (input.homepage_goal) {
    case "more_calls":
      return "Make it easy for visitors to understand the offer and call.";
    case "more_quotes":
      return "Lead with clarity and a low-friction quote request.";
    case "look_credible":
      return "Build trust quickly with credible messaging and proof.";
    case "explain_services":
      return "Help visitors scan services and know how you help.";
    default:
      return "Present a modern, clear homepage that converts visitors.";
  }
}

/** Build the full content strategy used before assembling mockup copy. */
export function buildContentStrategy(
  input: MockupRequestInput,
  signals: SiteSignals,
): ContentStrategy {
  const niche = inferNiche(input, signals);
  const businessName = input.business_name.trim();
  const { cta: primaryCta } = pickPrimaryCta(input, signals, niche);
  const secondaryCta = pickSecondaryCta(input, signals, primaryCta);
  const audience = audienceFor(input.business_category, niche);
  const tone = toneFor(input.preferred_style, niche);
  const sectionPlan = sectionPlanFor(input.business_category, niche);
  const ctaBand = ctaBandCopy(input, niche, businessName);

  return {
    niche,
    audience,
    tone,
    objective: objectiveLine(input),
    primaryCta,
    secondaryCta,
    heroEyebrow: heroEyebrow(niche, input.business_category, signals),
    servicesHeading: servicesHeading(niche, input.business_category),
    trustHeading: trustHeading(niche, input.business_category),
    ctaBandHeadline: ctaBand.headline,
    ctaBandSub: ctaBand.sub,
    sectionPlan,
    trustPoints: trustPointsFor(niche, input.business_category, signals, businessName),
    processSteps: sectionPlan.includes("process")
      ? processStepsFor(niche, input.business_category)
      : undefined,
    serviceAreaLine: sectionPlan.includes("service_area")
      ? signals.locationHint
        ? `Proudly serving ${signals.locationHint} and surrounding communities.`
        : `Serving local homeowners and businesses with dependable ${categoryLabelShort(input.business_category).toLowerCase()}.`
      : undefined,
  };
}

/**
 * Customer-facing hero headline — never redesign commentary.
 */
export function buildCustomerHeadline(
  input: MockupRequestInput,
  signals: SiteSignals,
  niche: NicheHint,
): string {
  const name = input.business_name.trim();
  const siteHeadline = (signals.h1 || signals.ogTitle || "").replace(/\s+/g, " ").trim();

  if (
    siteHeadline.length >= 18 &&
    siteHeadline.length <= 100 &&
    !isMetaHomepageCopy(siteHeadline) &&
    !/lorem|untitled|^home$/i.test(siteHeadline)
  ) {
    return siteHeadline.length > 90 ? `${siteHeadline.slice(0, 87)}…` : siteHeadline;
  }

  // Niche-specific customer-facing headlines
  if (niche === "marine") {
    if (input.homepage_goal === "more_quotes")
      return `Boat service and yard support from ${name}`;
    if (input.homepage_goal === "more_calls")
      return `Need marine service? ${name} is ready to help.`;
    return `Reliable marine service for boat owners who need it done right`;
  }
  if (niche === "plumbing") {
    return input.homepage_goal === "more_calls"
      ? `Trusted plumbing when you need it — call ${name}`
      : `Reliable plumbing for homes and businesses`;
  }
  if (niche === "hvac") {
    return `Comfortable air and dependable heating from ${name}`;
  }
  if (niche === "roofing") {
    return `Roof repair and replacement you can trust`;
  }
  if (niche === "legal") {
    return input.homepage_goal === "look_credible"
      ? `Clear legal guidance from ${name}`
      : `Practical legal counsel for important decisions`;
  }
  if (niche === "dental") {
    return `Dental care that puts patients first`;
  }
  if (niche === "medspa") {
    return `Personalized aesthetic care in a calm, professional setting`;
  }
  if (niche === "it_msp") {
    return `IT support that keeps your team productive and secure`;
  }

  switch (input.business_category) {
    case "home_services":
      return input.homepage_goal === "more_quotes"
        ? `Get a clear estimate from ${name}`
        : `Dependable ${categoryLabelShort("home_services").toLowerCase()} for local homeowners`;
    case "professional_services":
      return `Practical expertise from ${name} — explained clearly`;
    case "healthcare":
      return `Care focused on patients, clarity, and follow-through`;
    case "legal":
      return `Straightforward legal counsel from ${name}`;
    case "real_estate":
      return `Local real estate guidance from search to closing`;
    case "automotive":
      return `Honest diagnostics and quality auto care`;
    case "hospitality":
      return `A welcoming stay with thoughtful local hospitality`;
    case "b2b":
      return `Business services that deliver clear outcomes`;
    default:
      return `${name} — trusted service with a clear next step`;
  }
}

/**
 * Customer-facing subheadline explaining the offer.
 */
export function buildCustomerSubheadline(
  input: MockupRequestInput,
  signals: SiteSignals,
  niche: NicheHint,
): string {
  const fromSite =
    (signals.heroParagraph && signals.heroParagraph.length > 40 && !isMetaHomepageCopy(signals.heroParagraph)
      ? signals.heroParagraph
      : null) ||
    (signals.metaDesc && signals.metaDesc.length > 40 && !isMetaHomepageCopy(signals.metaDesc)
      ? signals.metaDesc
      : null);

  if (fromSite) {
    return fromSite.length > 180 ? `${fromSite.slice(0, 177)}…` : fromSite;
  }

  const name = input.business_name.trim();
  const loc = signals.locationHint ? ` in ${signals.locationHint}` : "";

  if (niche === "marine") {
    return `From haul-outs and mechanical work to seasonal prep, ${name} helps boat owners keep vessels ready for the water${loc}.`;
  }
  if (niche === "plumbing") {
    return `${name} helps homeowners and businesses with repairs, installs, and urgent plumbing needs${loc}.`;
  }
  if (niche === "hvac") {
    return `Repair, install, and maintain heating and cooling systems with clear estimates and respectful service.`;
  }
  if (niche === "legal") {
    return `${name} helps clients understand their options and move forward with practical next steps.`;
  }
  if (niche === "it_msp") {
    return `Managed support, security baselines, and day-to-day help so your team can focus on the work that matters.`;
  }
  if (niche === "dental" || niche === "medspa") {
    return `Friendly care, plain-language plans, and scheduling that respects your time.`;
  }

  switch (input.homepage_goal) {
    case "more_calls":
      return `See what ${name} offers, then call with confidence — we make the next step simple.`;
    case "more_quotes":
      return `Tell us what you need and get a straightforward quote without the runaround.`;
    case "look_credible":
      return `Professional service explained clearly — so visitors know who you help and how to begin.`;
    case "explain_services":
      return `Browse our core services and quickly see how ${name} can help.`;
    default:
      return `${name} makes it easy to understand the offer, trust the team, and take the next step.`;
  }
}

/** Owner-facing improvement notes — never shown inside the mockup frame. */
export function buildImprovementNotes(
  input: MockupRequestInput,
  signals: SiteSignals,
  strategy: ContentStrategy,
): string[] {
  const notes: string[] = [];

  if (signals.blockedReason) {
    notes.push(
      "Live site was protected by bot security, so this direction was built from your business details",
    );
  } else if (!signals.fetched || signals.fetchQuality === "failed") {
    notes.push("Concept built from your business name, category, style, and goal");
  } else if (signals.fetchQuality === "limited") {
    notes.push("Some live-site details were limited, so your preferences filled the gaps");
  }

  notes.push("Customer-facing headline that states what you do and who you help");
  notes.push(`Primary CTA aligned to your goal: “${strategy.primaryCta}”`);
  notes.push("Services presented so visitors can scan offerings quickly");
  notes.push("Trust cues and conversion path placed where visitors expect them");

  if (input.homepage_goal === "more_calls") {
    notes.push("Call-focused path to reduce hesitation above the fold");
  }
  if (input.homepage_goal === "more_quotes") {
    notes.push("Quote-request path made obvious and low-friction");
  }
  if (strategy.niche !== "general") {
    notes.push(`Structure tuned for ${strategy.niche.replace(/_/g, " ")} businesses`);
  }
  if (input.notes?.trim()) {
    notes.push("Your notes were factored into messaging and emphasis");
  }
  if (signals.fetched && !signals.blockedReason && signals.services.length > 0) {
    notes.push("Real services from your site reorganized into a cleaner layout");
  }

  return [...new Set(notes)].slice(0, 6);
}

/** Short personalization line for the result page (outside the mockup). */
export function personalizationSummary(
  input: MockupRequestInput,
  signals: SiteSignals,
  strategy: ContentStrategy,
): string {
  const parts: string[] = [];
  parts.push(`Built around ${input.business_name.trim()}`);
  parts.push(input.preferred_style.replace(/_/g, " "));
  parts.push(`goal: ${input.homepage_goal.replace(/_/g, " ")}`);
  if (signals.fetched && !signals.blockedReason) {
    parts.push("informed by your current site");
  } else if (strategy.niche !== "general") {
    parts.push(`tuned for ${strategy.niche.replace(/_/g, " ")}`);
  }
  return parts.join(" · ");
}
