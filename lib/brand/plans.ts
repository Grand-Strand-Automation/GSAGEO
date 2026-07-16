/** Plan tier IDs used in /audit?tier=... and geo_submissions.selected_plan */
export const PLAN_TIER_IDS = ["monitor", "growth", "managed", "custom"] as const;
export type PlanTierId = (typeof PLAN_TIER_IDS)[number];
export type LegacyPlanTierId = "audit" | "foundation";

const LEGACY_TIER_MAP: Record<string, PlanTierId> = {
  audit: "monitor",
  foundation: "managed",
};

/** Normalize /audit?tier= query values, including legacy aliases. */
export function normalizeAuditTier(raw: string | null | undefined): PlanTierId | "" {
  if (!raw) return "";
  const tier = raw.trim().toLowerCase();
  if (tier in LEGACY_TIER_MAP) {
    return LEGACY_TIER_MAP[tier];
  }
  if ((PLAN_TIER_IDS as readonly string[]).includes(tier)) {
    return tier as PlanTierId;
  }
  return "";
}

/** Human-readable labels for admin and intake (includes legacy tiers) */
export const PLAN_LABELS: Record<string, string> = {
  monitor: "Website Refresh + Hosting — $199/mo · cancel anytime",
  growth: "Website Growth + Hosting — starting at $499/mo · cancel anytime",
  managed: "Managed Website + Growth — starting at $1,250/mo · cancel anytime",
  custom: "Custom website / GEO engagement",
  audit: "Website Refresh + Hosting — legacy assessment alias",
  foundation: "Managed Website + Growth — legacy foundation alias",
};

export function formatPlanLabel(plan: string | null | undefined): string {
  if (!plan) return "—";
  return PLAN_LABELS[plan] ?? plan;
}

/** Options for the assessment intake form select */
export const INTAKE_PLAN_OPTIONS = [
  { value: "monitor", label: PLAN_LABELS.monitor },
  { value: "growth", label: PLAN_LABELS.growth },
  { value: "managed", label: PLAN_LABELS.managed },
  { value: "custom", label: PLAN_LABELS.custom },
] as const;

export function planBadgeClass(plan: string | null | undefined): string {
  switch (plan) {
    case "monitor":
      return "bg-brand-cream text-brand-muted border border-brand-border";
    case "growth":
      return "bg-brand-blue-light text-brand-blue border border-brand-blue/20";
    case "managed":
      return "bg-brand-navy text-white border border-brand-navy";
    case "custom":
      return "bg-gray-50 text-gray-600 border border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
}
