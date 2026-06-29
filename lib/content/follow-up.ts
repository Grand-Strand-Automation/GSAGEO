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
    "We'll review your submission and send back a clear, easy-to-read assessment with practical next steps. If you'd like, you can book a short review call now — or explore month-to-month support when you're ready to keep improving over time.",
  reassurance: "No pressure. No long contracts. Just clear findings and a simple path forward.",
  primaryCta: "Book My Review",
  secondaryCta: "See Monthly Plans",
  secondaryHref: "/#pricing",
  tertiaryCta: "Return Home",
  tertiaryHref: "/",
  whatHappensNext: [
    "We review your website and visibility",
    "We send your assessment with top findings",
    "We recommend the clearest next step — including monthly support if it fits",
  ],
} as const;

export const VISIBILITY_MONITOR = {
  id: "visibility-monitor",
  name: "AI Visibility Monitor",
  tagline: "Lighter monthly oversight for businesses that want a simple snapshot and clear priorities.",
  summary:
    "For most businesses that want to stay informed without full hands-on support every month, AI Visibility Monitor keeps you covered with a monthly snapshot, score refresh, and priority recommendations.",
  includes: [
    "Monthly visibility snapshot",
    "Plain-English score refresh",
    "Top priority recommendations",
    "Email summary each month",
    "Clear guidance on what to improve next",
  ],
  outcome:
    "Ongoing visibility oversight without guessing what changed or what to focus on next.",
  timeline: "Month-to-month · cancel anytime.",
  ctaLabel: "See Monthly Plans",
  ctaHref: "/#pricing",
} as const;

export const VISIBILITY_GROWTH = {
  id: "visibility-growth",
  name: "AI Visibility Growth",
  tagline: "The recommended monthly plan for steady, practical improvement.",
  summary:
    "For most businesses, the best next step is ongoing monthly support that helps turn assessment findings into practical improvements over time — with clear priorities, guidance, and steady progress each month.",
  includes: [
    "Monthly visibility review",
    "Content and page improvement guidance",
    "Priority refresh recommendations each month",
    "Practical action summaries you can act on",
    "Steady progress on clarity, trust, and visibility",
  ],
  outcome:
    "Visible monthly progress on the areas that affect how clearly your business is understood online.",
  timeline: "Month-to-month · cancel anytime.",
  ctaLabel: "Start Monthly Support",
  ctaHref: "/#pricing",
} as const;

export const STRATEGY_SESSION = {
  id: "strategy-session",
  name: "Assessment Review Session",
  tagline: "A focused conversation to understand what matters most right now.",
  summary:
    "If you want clarity before choosing a monthly plan, a short review session is the simplest way to walk through your assessment and decide what level of ongoing support makes sense.",
  includes: [
    "Walkthrough of your top findings",
    "Plain-English explanation of priorities",
    "A practical recommendation for the right monthly plan",
  ],
  outcome: "Confidence about what to fix first — and which monthly plan fits best.",
  timeline: "One focused session, then month-to-month if you continue.",
  ctaLabel: "Book My Review",
} as const;

export const BRIDGE_OFFERS = {
  "visibility-monitor": VISIBILITY_MONITOR,
  "visibility-growth": VISIBILITY_GROWTH,
  "strategy-session": STRATEGY_SESSION,
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
      "The easiest next step is a short review call — or choose month-to-month support when you are ready to keep improving over time.",
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
    subject: "What ongoing monthly support could look like",
    preview: "A simple path from assessment findings to steady monthly progress.",
    headline: "What ongoing monthly support could look like",
    body: [
      "You don't have to tackle everything at once.",
      "AI Visibility Growth focuses on the highest-impact improvements each month — clarity, trust, content, and visibility — with practical guidance and steady progress, not a huge technical project.",
      "Month-to-month · cancel anytime.",
    ],
    cta: "See Monthly Plans",
    ctaHref: "/#pricing",
  },
  followUpDay5: {
    subject: "A simpler way to keep improving",
    preview: "Monthly support without long contracts or overwhelming projects.",
    headline: "A simpler way to keep improving",
    body: [
      "Many business owners worry that improving visibility means a massive website overhaul or a long agency contract.",
      "Usually it doesn't. Monthly support helps you fix what matters most each month — in plain language, with a practical plan you can actually follow.",
    ],
    cta: "Book My Review",
  },
  followUpDay7: {
    subject: "Would you like help with the next step?",
    preview: "Happy to help you decide what makes sense.",
    headline: "Would you like help with the next step?",
    body: [
      "If you'd like to walk through your assessment and choose the right monthly plan, you can book a short review call.",
      "Or simply reply to this email and tell us what you're trying to improve — we'll point you toward the lightest option that still makes sense.",
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
