import { siteConfig } from "@/lib/brand/site";

const DEFAULT_BOOKING_MAILTO = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Book my GEO assessment review")}`;

/** Public booking link for thank-you page (set NEXT_PUBLIC_REVIEW_BOOKING_URL in production). */
export const REVIEW_BOOKING_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_REVIEW_BOOKING_URL?.trim()) ||
  DEFAULT_BOOKING_MAILTO;

export const THANK_YOU = {
  eyebrow: "Assessment request received",
  headline: "Your assessment request is in",
  supportCopy:
    "We'll review your submission and send back a clear, easy-to-read assessment. If you'd like, you can also book a short review call now so we can walk through the findings together.",
  reassurance: "No pressure. Just clear findings and practical next steps.",
  primaryCta: "Book My Review",
  secondaryCta: "See What's Included",
  secondaryHref: "/#whats-included",
  tertiaryCta: "Return Home",
  tertiaryHref: "/",
  whatHappensNext: [
    "We review your website and visibility",
    "We send your assessment with top findings",
    "We show you the clearest next step if you want help fixing it",
  ],
} as const;

export const QUICK_WINS_SPRINT = {
  id: "quick-wins-sprint",
  name: "GEO Quick Wins Sprint",
  tagline: "Fix the most important issues first — without a long, overwhelming project.",
  summary:
    "Based on this assessment, the best next step is to fix the most important issues first. A Quick Wins Sprint is designed to improve clarity, trust, and visibility without turning this into a long, overwhelming project.",
  includes: [
    "Top-priority clarity improvements on key pages",
    "Trust, FAQ, and content structure improvements",
    "Clearer calls to action and messaging",
    "Internal linking and page structure cleanup",
    "Recommended technical cleanup where it matters most",
  ],
  outcome:
    "A clearer website that is easier for customers and search tools to understand — with the highest-impact fixes handled first.",
  timeline: "Typically 2–4 weeks, depending on scope and approvals.",
  ctaLabel: "Book My Review",
} as const;

export const BRIDGE_OFFERS = {
  "quick-wins-sprint": QUICK_WINS_SPRINT,
  "visibility-growth": {
    id: "visibility-growth",
    name: "AI Visibility Growth",
    tagline: "Ongoing monthly guidance for businesses ready to keep improving.",
    summary:
      "Your assessment shows enough opportunity to benefit from steady, recurring improvements — not just a one-time fix. AI Visibility Growth gives you a practical monthly plan.",
    includes: [
      "Monthly visibility review",
      "Content and structure recommendations",
      "Priority refresh suggestions each month",
      "Clear action summaries you can act on",
    ],
    outcome: "Steadier progress on clarity, trust, and visibility over time.",
    timeline: "Month-to-month starting point.",
    ctaLabel: "Book My Review",
  },
  "strategy-session": {
    id: "strategy-session",
    name: "Assessment Review Session",
    tagline: "A focused conversation to understand what matters most right now.",
    summary:
      "If you want clarity before committing to implementation, a short review session is the simplest way to walk through your assessment and decide what to tackle first.",
    includes: [
      "Walkthrough of your top findings",
      "Plain-English explanation of priorities",
      "A practical recommendation for what to do next",
    ],
    outcome: "Confidence about what to fix first — without guesswork.",
    timeline: "One focused session.",
    ctaLabel: "Book My Review",
  },
} as const;

export type BridgeOfferId = keyof typeof BRIDGE_OFFERS;

export const EMAIL_COPY = {
  confirmation: {
    subject: "Your GEO assessment request is in",
    preview: "We received your request and will send a clear summary soon.",
    headline: "Thanks — we received your assessment request",
    body: [
      "We received your submission and started reviewing your website.",
      "You'll receive a clear, easy-to-read assessment summary with practical recommendations.",
      "If you'd like to walk through the findings live, you can book a short review call now.",
    ],
    cta: "Book My Review",
    support:
      "This review call is the easiest way to understand what stood out and what to fix first.",
  },
  reportReady: {
    subject: "Your assessment is ready — here's what stood out",
    preview: "Your website visibility assessment is ready to review.",
    headline: "Your assessment is ready",
    intro:
      "Your website visibility assessment is ready. Inside, you'll see what looks strong, what may be hurting clarity or trust, and what to improve first.",
    insideBlock:
      "Inside your assessment, you'll see what looks strong, what may be hurting clarity or trust, and what to improve first.",
    cta: "Book My Assessment Review",
    viewReportCta: "View Your Assessment",
    closing:
      "The easiest next step is a short review call so we can walk through the findings together and recommend one clear path forward.",
  },
  followUpDay1: {
    subject: "Two things that stood out in your assessment",
    preview: "A quick note on what your assessment usually reveals.",
    headline: "Two things that usually stand out",
    body: [
      "Most assessments reveal a few issues that affect how clearly a business is understood online — especially on service pages, trust content, and site structure.",
      "Your report highlights where those gaps may be showing up for your business.",
      "If you want help prioritizing what to fix first, a short review call is the simplest next step.",
    ],
    cta: "Book My Review",
  },
  followUpDay3: {
    subject: "What fixing the top issues could look like",
    preview: "A simple path from assessment findings to practical fixes.",
    headline: "What fixing the top issues could look like",
    body: [
      "You don't have to tackle everything at once.",
      "A GEO Quick Wins Sprint focuses on the highest-impact improvements first — clarity, trust, structure, and visibility — without turning this into a huge technical project.",
    ],
    cta: "Book My Review",
  },
  followUpDay5: {
    subject: "A simpler way to approach the fixes",
    preview: "You don't need a full rebuild to make meaningful progress.",
    headline: "A simpler way to approach the fixes",
    body: [
      "Many business owners worry that improving visibility means a massive website overhaul.",
      "Usually it doesn't. The best next step is fixing the issues that matter most first — in plain language, with a practical plan.",
    ],
    cta: "Book My Review",
  },
  followUpDay7: {
    subject: "Would you like help with the next step?",
    preview: "Happy to help you decide what to do next.",
    headline: "Would you like help with the next step?",
    body: [
      "If you'd like to walk through your assessment and decide what to tackle first, you can book a short review call.",
      "Or simply reply to this email and tell us what you're trying to improve — we'll point you in the right direction.",
    ],
    cta: "Book My Review",
  },
  adminNewSubmission: {
    subject: "New GEO assessment submission",
    headline: "New assessment submission",
  },
} as const;

export type FollowUpEmailKey =
  | "confirmation"
  | "reportReady"
  | "followUpDay1"
  | "followUpDay3"
  | "followUpDay5"
  | "followUpDay7"
  | "adminNewSubmission";

export const FOLLOW_UP_STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  confirmation_sent: "Confirmation sent",
  report_ready: "Report ready",
  report_sent: "Report emailed",
  booked_review: "Review booked",
  followup_day_1_sent: "Day 1 follow-up sent",
  followup_day_3_sent: "Day 3 follow-up sent",
  followup_day_5_sent: "Day 5 follow-up sent",
  followup_day_7_sent: "Day 7 follow-up sent",
  converted: "Converted",
  closed_not_interested: "Closed — not interested",
  not_a_fit: "Not a fit",
};
