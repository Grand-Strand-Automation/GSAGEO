import type { PlanTierId } from "@/lib/brand/plans";

export type SubscriptionPlanKey = Exclude<PlanTierId, "custom">;

export type SubscriptionStatus =
  | "lead"
  | "active"
  | "past_due"
  | "scheduled_cancel"
  | "canceled"
  | "paused";

export type CancellationReason =
  | "too_expensive_right_now"
  | "too_busy"
  | "not_enough_value_yet"
  | "one_time_review_only"
  | "handling_internally"
  | "need_lighter_plan"
  | "billing_issue"
  | "switching_providers"
  | "didnt_understand_whats_included"
  | "other";

export type SaveOfferType =
  | "downgrade_monitor"
  | "downgrade_growth"
  | "pause_30_days"
  | "pause_60_days"
  | "review_call"
  | "billing_help"
  | "clarify_plan"
  | "clean_cancel";

export type SubscriptionEventName =
  | "subscription_started"
  | "plan_viewed"
  | "comparison_table_viewed"
  | "downgrade_flow_started"
  | "downgrade_completed"
  | "pause_selected"
  | "cancel_flow_started"
  | "cancellation_reason_selected"
  | "save_offer_shown"
  | "save_offer_accepted"
  | "cancellation_completed"
  | "payment_failed"
  | "payment_recovered"
  | "plan_reactivated"
  | "winback_email_sent"
  | "subscription_restarted";

export type ChurnRiskLevel = "low" | "medium" | "high";
export type CustomerHealthStatus = "green" | "yellow" | "red";

export type SubscriptionPlanConfig = {
  key: SubscriptionPlanKey;
  displayName: string;
  description: string;
  monthlyPositioning: string;
  shortSummary: string;
  bestFit: string;
  featureList: string[];
  supportLevel: string;
  tierOrder: number;
  isRecommended: boolean;
  isDowngradeTarget: boolean;
  priceLabel: string;
  providerProductEnv?: string;
  providerPriceEnv?: string;
  allowedUpgradePaths: SubscriptionPlanKey[];
  allowedDowngradePaths: SubscriptionPlanKey[];
  ctaLabel: string;
  downgradeCtaLabel: string;
};

export type DowngradePath = {
  sourcePlan: SubscriptionPlanKey;
  targetPlan: SubscriptionPlanKey;
  effectiveTiming: "next_billing_cycle";
  customerCopy: string;
  confirmationCopy: string;
  adminEvent: SubscriptionEventName;
  analyticsEvent: SubscriptionEventName;
};

export type PlanComparisonRow = {
  key: string;
  label: string;
  values: Record<SubscriptionPlanKey, string>;
};

export type CancellationReasonConfig = {
  key: CancellationReason;
  label: string;
  helper: string;
};

export type SaveOfferConfig = {
  type: SaveOfferType;
  label: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetPlan?: SubscriptionPlanKey;
};

export type SaveOfferRule = {
  reason: CancellationReason;
  primary: SaveOfferType;
  secondary: SaveOfferType;
};

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanKey, SubscriptionPlanConfig> = {
  monitor: {
    key: "monitor",
    displayName: "AI Visibility Monitor",
    description:
      "Simple monthly visibility oversight for businesses that want monitoring and clear recommendations without hands-on monthly support.",
    monthlyPositioning: "Simple monthly visibility oversight.",
    shortSummary: "Monthly snapshot, score refresh, and top priorities.",
    bestFit:
      "Businesses that want monitoring and clear recommendations without hands-on monthly support.",
    featureList: [
      "Monthly visibility snapshot",
      "Plain-English score refresh",
      "Top monthly priorities",
      "Practical recommendations",
      "Email summary",
      "Cancel anytime",
    ],
    supportLevel: "Oversight",
    tierOrder: 1,
    isRecommended: false,
    isDowngradeTarget: true,
    priceLabel: "$199/month",
    providerProductEnv: "BILLING_PRODUCT_MONITOR",
    providerPriceEnv: "BILLING_PRICE_MONITOR",
    allowedUpgradePaths: ["growth", "managed"],
    allowedDowngradePaths: [],
    ctaLabel: "Choose Monitor",
    downgradeCtaLabel: "Switch to Monitor",
  },
  growth: {
    key: "growth",
    displayName: "AI Visibility Growth",
    description:
      "The core monthly plan for steady progress: practical guidance, content direction, and support turning findings into action.",
    monthlyPositioning: "Steady monthly progress without a heavy retainer.",
    shortSummary: "Practical ongoing support for consistent monthly movement.",
    bestFit:
      "Businesses that want more than reporting and want visible monthly improvements.",
    featureList: [
      "Everything in Monitor",
      "Monthly improvement guidance",
      "Light hands-on support",
      "Content and page direction",
      "Monthly action summary",
      "Cancel anytime",
    ],
    supportLevel: "Light hands-on support",
    tierOrder: 2,
    isRecommended: true,
    isDowngradeTarget: false,
    priceLabel: "Starting at $499/month",
    providerProductEnv: "BILLING_PRODUCT_GROWTH",
    providerPriceEnv: "BILLING_PRICE_GROWTH",
    allowedUpgradePaths: ["managed"],
    allowedDowngradePaths: ["monitor"],
    ctaLabel: "Stay on Growth",
    downgradeCtaLabel: "Switch to Growth",
  },
  managed: {
    key: "managed",
    displayName: "Managed GEO / AI Visibility",
    description:
      "Premium higher-touch monthly help for businesses that want deeper done-with-you or done-for-you support.",
    monthlyPositioning: "More hands-on monthly help for businesses that want deeper support.",
    shortSummary: "Higher-touch support for deeper monthly implementation help.",
    bestFit:
      "Businesses that want done-with-you or done-for-you support.",
    featureList: [
      "Everything in Growth",
      "Higher-touch monthly support",
      "Hands-on optimization help",
      "Implementation prioritization",
      "Priority roadmap reviews",
      "Cancel anytime",
    ],
    supportLevel: "Higher-touch support",
    tierOrder: 3,
    isRecommended: false,
    isDowngradeTarget: false,
    priceLabel: "Starting at $1,250/month",
    providerProductEnv: "BILLING_PRODUCT_MANAGED",
    providerPriceEnv: "BILLING_PRICE_MANAGED",
    allowedUpgradePaths: [],
    allowedDowngradePaths: ["growth"],
    ctaLabel: "Request Managed support",
    downgradeCtaLabel: "Switch to Managed",
  },
};

export const PLAN_COMPARISON_ROWS: PlanComparisonRow[] = [
  {
    key: "visibility_snapshot",
    label: "Monthly visibility snapshot",
    values: { monitor: "Yes", growth: "Yes", managed: "Yes" },
  },
  {
    key: "score_refresh",
    label: "Plain-English score refresh",
    values: { monitor: "Yes", growth: "Yes", managed: "Yes" },
  },
  {
    key: "top_priorities",
    label: "Top monthly priorities",
    values: { monitor: "Yes", growth: "Yes", managed: "Yes" },
  },
  {
    key: "recommendations",
    label: "Practical recommendations",
    values: { monitor: "Yes", growth: "Yes", managed: "Yes" },
  },
  {
    key: "improvement_guidance",
    label: "Monthly improvement guidance",
    values: { monitor: "No", growth: "Yes", managed: "Yes" },
  },
  {
    key: "hands_on_support",
    label: "Hands-on support",
    values: { monitor: "No", growth: "Light", managed: "Higher-touch" },
  },
  {
    key: "ongoing_progress",
    label: "Best for ongoing progress",
    values: { monitor: "Limited", growth: "Yes", managed: "Yes" },
  },
  {
    key: "cancel_anytime",
    label: "Cancel anytime",
    values: { monitor: "Yes", growth: "Yes", managed: "Yes" },
  },
];

export const DOWNGRADE_PATHS: DowngradePath[] = [
  {
    sourcePlan: "managed",
    targetPlan: "growth",
    effectiveTiming: "next_billing_cycle",
    customerCopy: "Want to stay supported without the higher-touch plan? Switch to Growth.",
    confirmationCopy:
      "Your plan will switch to AI Visibility Growth on your next billing date.",
    adminEvent: "downgrade_completed",
    analyticsEvent: "downgrade_completed",
  },
  {
    sourcePlan: "growth",
    targetPlan: "monitor",
    effectiveTiming: "next_billing_cycle",
    customerCopy: "Need lighter support? Keep monthly visibility oversight with Monitor.",
    confirmationCopy:
      "Your plan will switch to AI Visibility Monitor on your next billing date.",
    adminEvent: "downgrade_completed",
    analyticsEvent: "downgrade_completed",
  },
];

export const PAUSE_SUPPORT = {
  supported: false,
  fallbackOffer: "downgrade_monitor" as const,
  message:
    "Automated billing pause is not available yet. The lighter Monitor plan is the safest flexible option right now.",
  durations: [30, 60] as const,
};

export const CANCELLATION_REASONS: CancellationReasonConfig[] = [
  {
    key: "too_expensive_right_now",
    label: "It is too expensive right now",
    helper: "We can show a lighter monthly option before you cancel.",
  },
  {
    key: "too_busy",
    label: "We are too busy to use it right now",
    helper: "A lighter plan may keep oversight in place until timing is better.",
  },
  {
    key: "not_enough_value_yet",
    label: "We have not seen enough value yet",
    helper: "We can clarify what is included or help review the plan fit.",
  },
  {
    key: "one_time_review_only",
    label: "We only wanted the one-time review",
    helper: "Monitor can keep a light monthly check-in if that is useful.",
  },
  {
    key: "handling_internally",
    label: "We are handling this internally",
    helper: "Monitor can still provide a monthly outside snapshot.",
  },
  {
    key: "need_lighter_plan",
    label: "We need a lighter plan",
    helper: "We will show the best downgrade option.",
  },
  {
    key: "billing_issue",
    label: "There is a billing or payment issue",
    helper: "We can route you toward payment support before canceling.",
  },
  {
    key: "switching_providers",
    label: "We are switching providers",
    helper: "You can continue cancellation after an optional review option.",
  },
  {
    key: "didnt_understand_whats_included",
    label: "I did not understand what was included",
    helper: "We can clarify the plan and show a lighter option.",
  },
  {
    key: "other",
    label: "Something else",
    helper: "You can share a note or continue cancellation.",
  },
];

export const SAVE_OFFERS: Record<SaveOfferType, SaveOfferConfig> = {
  downgrade_monitor: {
    type: "downgrade_monitor",
    label: "Switch to Monitor",
    title: "Need a lighter option?",
    description:
      "Monitor keeps monthly visibility oversight and clear priorities without the heavier support level.",
    ctaLabel: "Switch to Monitor",
    targetPlan: "monitor",
  },
  downgrade_growth: {
    type: "downgrade_growth",
    label: "Switch to Growth",
    title: "Stay supported at a lighter level",
    description:
      "Growth keeps steady monthly progress without the higher-touch Managed scope.",
    ctaLabel: "Switch to Growth",
    targetPlan: "growth",
  },
  pause_30_days: {
    type: "pause_30_days",
    label: "Pause 30 days",
    title: "Too much right now?",
    description: PAUSE_SUPPORT.supported
      ? "Pause monthly billing and deliverables for 30 days."
      : PAUSE_SUPPORT.message,
    ctaLabel: PAUSE_SUPPORT.supported ? "Pause 30 days" : "See Monitor instead",
    targetPlan: PAUSE_SUPPORT.supported ? undefined : "monitor",
  },
  pause_60_days: {
    type: "pause_60_days",
    label: "Pause 60 days",
    title: "Need a longer break?",
    description: PAUSE_SUPPORT.supported
      ? "Pause monthly billing and deliverables for 60 days."
      : PAUSE_SUPPORT.message,
    ctaLabel: PAUSE_SUPPORT.supported ? "Pause 60 days" : "See Monitor instead",
    targetPlan: PAUSE_SUPPORT.supported ? undefined : "monitor",
  },
  review_call: {
    type: "review_call",
    label: "Request a review call",
    title: "Want help making sense of the value?",
    description:
      "We can review what is included, what has changed, and whether a lighter plan makes more sense.",
    ctaLabel: "Request help",
  },
  billing_help: {
    type: "billing_help",
    label: "Get billing help",
    title: "Need help with billing?",
    description:
      "If the issue is payment-related, we can help update payment details or review billing before you cancel.",
    ctaLabel: "Request billing help",
  },
  clarify_plan: {
    type: "clarify_plan",
    label: "Clarify my plan",
    title: "Want a clearer explanation first?",
    description:
      "We can explain what your plan includes and show a lighter option if the current scope is more than you need.",
    ctaLabel: "Clarify my plan",
  },
  clean_cancel: {
    type: "clean_cancel",
    label: "Continue cancellation",
    title: "Continue cancellation",
    description:
      "You can continue cancellation without accepting another option.",
    ctaLabel: "Continue cancellation",
  },
};

export const SAVE_OFFER_RULES: Record<CancellationReason, SaveOfferRule> = {
  too_expensive_right_now: {
    reason: "too_expensive_right_now",
    primary: "downgrade_monitor",
    secondary: "pause_30_days",
  },
  too_busy: {
    reason: "too_busy",
    primary: "pause_30_days",
    secondary: "downgrade_monitor",
  },
  not_enough_value_yet: {
    reason: "not_enough_value_yet",
    primary: "review_call",
    secondary: "downgrade_monitor",
  },
  one_time_review_only: {
    reason: "one_time_review_only",
    primary: "downgrade_monitor",
    secondary: "clean_cancel",
  },
  handling_internally: {
    reason: "handling_internally",
    primary: "downgrade_monitor",
    secondary: "clean_cancel",
  },
  need_lighter_plan: {
    reason: "need_lighter_plan",
    primary: "downgrade_monitor",
    secondary: "pause_30_days",
  },
  billing_issue: {
    reason: "billing_issue",
    primary: "billing_help",
    secondary: "review_call",
  },
  switching_providers: {
    reason: "switching_providers",
    primary: "review_call",
    secondary: "clean_cancel",
  },
  didnt_understand_whats_included: {
    reason: "didnt_understand_whats_included",
    primary: "clarify_plan",
    secondary: "review_call",
  },
  other: {
    reason: "other",
    primary: "clarify_plan",
    secondary: "clean_cancel",
  },
};

export const HEALTH_RULES = {
  redRiskPoints: 70,
  yellowRiskPoints: 35,
  noEngagementDays: 30,
  staleReportViewDays: 45,
  cancellationStartedPoints: 35,
  paymentIssuePoints: 30,
  downgradeInquiryPoints: 25,
} as const;

export const SUBSCRIPTION_EVENT_NAMES: Record<SubscriptionEventName, SubscriptionEventName> = {
  subscription_started: "subscription_started",
  plan_viewed: "plan_viewed",
  comparison_table_viewed: "comparison_table_viewed",
  downgrade_flow_started: "downgrade_flow_started",
  downgrade_completed: "downgrade_completed",
  pause_selected: "pause_selected",
  cancel_flow_started: "cancel_flow_started",
  cancellation_reason_selected: "cancellation_reason_selected",
  save_offer_shown: "save_offer_shown",
  save_offer_accepted: "save_offer_accepted",
  cancellation_completed: "cancellation_completed",
  payment_failed: "payment_failed",
  payment_recovered: "payment_recovered",
  plan_reactivated: "plan_reactivated",
  winback_email_sent: "winback_email_sent",
  subscription_restarted: "subscription_restarted",
};

export function isSubscriptionPlanKey(value: string | null | undefined): value is SubscriptionPlanKey {
  return value === "monitor" || value === "growth" || value === "managed";
}

export function getSubscriptionPlan(value: string | null | undefined): SubscriptionPlanConfig {
  return SUBSCRIPTION_PLANS[isSubscriptionPlanKey(value) ? value : "growth"];
}

export function getDowngradePath(
  sourcePlan: SubscriptionPlanKey,
  targetPlan: SubscriptionPlanKey,
): DowngradePath | null {
  return DOWNGRADE_PATHS.find((path) => path.sourcePlan === sourcePlan && path.targetPlan === targetPlan) ?? null;
}

export function getPrimaryDowngradeTarget(plan: SubscriptionPlanKey): SubscriptionPlanKey | null {
  return SUBSCRIPTION_PLANS[plan].allowedDowngradePaths[0] ?? null;
}

export function getSaveOfferForReason(reason: CancellationReason): {
  primary: SaveOfferConfig;
  secondary: SaveOfferConfig;
} {
  const rule = SAVE_OFFER_RULES[reason] ?? SAVE_OFFER_RULES.other;
  return {
    primary: SAVE_OFFERS[rule.primary],
    secondary: SAVE_OFFERS[rule.secondary],
  };
}
