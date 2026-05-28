/**
 * cost-analysis-scoring.ts
 *
 * Scoring and recommendation logic for the IT Cost Analysis calculator.
 *
 * TO EDIT QUESTIONS: See the step components in src/components/cost-analysis/
 * TO EDIT FORMULAS: Adjust weights in calcOverlapScore / calcComplianceScore below.
 * TO EDIT SAVINGS RANGE: Adjust base percentages and modifiers in calcSavingsRange below.
 * TO WIRE EMAIL: In ResultsStep.tsx, the handleGetReport function has a TODO comment
 *   showing exactly where to connect Resend, Formspree, Supabase, Airtable, etc.
 */

import type {
  CalculatorValues,
  SpendValues,
  OverlapValues,
  ComplianceValues,
  SpendSummary,
  OverlapLevel,
  ComplianceLevel,
  SavingsRange,
  RecommendationItem,
  ResultsOutput,
  TriState,
} from "./cost-analysis-types";

// ─── Spend calculation ──────────────────────────────────────────────────────
// Admin time cost = monthlyAdminHours × adminHourlyRate (user-provided, default $45/hr).
// All tool costs are summed from user-entered monthly amounts.

export function calcSpend(spend: SpendValues): SpendSummary {
  const toolCosts =
    (spend.managedSupport || 0) +
    (spend.microsoft365 || 0) +
    (spend.emailSecurity || 0) +
    (spend.endpointSecurity || 0) +
    (spend.backupRecovery || 0) +
    (spend.networkFirewall || 0) +
    (spend.cloudSoftware || 0);

  const rate = spend.adminHourlyRate > 0 ? spend.adminHourlyRate : 45;
  const adminCost = (spend.adminTimeMonthly || 0) * rate;
  const monthly = toolCosts + adminCost;

  return {
    monthly,
    annual: monthly * 12,
  };
}

// ─── Overlap scoring ────────────────────────────────────────────────────────
// Higher score = greater risk of tool overlap, licensing waste, or process gaps.
//
// Weights per question:
//   multiple security tools    = yes +2, not-sure +1
//   multiple backup tools      = yes +2, not-sure +1
//   split vendor support       = yes +2, not-sure +1
//   unsure about active tools  = yes +2, not-sure +1
//   former employees on plans  = yes +2, not-sure +1
//   manual onboarding          = yes +1
//   manual offboarding         = yes +1
//   M365 licensing unclear     = no  +2, not-sure +1  (reversed question)
//   shared mailbox manual      = yes +1
//
// Max score = 15
//
// Thresholds:
//   Low      = 0–3
//   Moderate = 4–8
//   High     = 9+
//
// TO ADJUST: Change the weight values passed to triRisk() / triRiskReversed().

export const OVERLAP_MAX = 15;

function triRisk(val: TriState, yesWeight: number, notSureWeight: number): number {
  if (val === "yes") return yesWeight;
  if (val === "not-sure") return notSureWeight;
  return 0;
}

// For questions where "no" is the risky answer (e.g. "Is licensing clear?")
function triRiskReversed(val: TriState, noWeight: number, notSureWeight: number): number {
  if (val === "no") return noWeight;
  if (val === "not-sure") return notSureWeight;
  return 0;
}

export function calcOverlapScore(o: OverlapValues): { score: number; level: OverlapLevel } {
  const score =
    triRisk(o.multipleSecurityTools, 2, 1) +
    triRisk(o.multipleBackupTools, 2, 1) +
    triRisk(o.splitVendors, 2, 1) +
    triRisk(o.unusedSoftware, 2, 1) +
    triRisk(o.formerEmployeeLingers, 2, 1) +
    triRisk(o.manualOnboarding, 1, 0) +     // +1 only (process gap, not tool cost)
    triRisk(o.manualOffboarding, 1, 0) +    // +1 only
    triRiskReversed(o.microsoft365LicensingClear, 2, 1) +
    triRisk(o.sharedMailboxManual, 1, 0);

  const level: OverlapLevel =
    score <= 3 ? "Low" : score <= 8 ? "Moderate" : "High";

  return { score, level };
}

// ─── Compliance scoring ─────────────────────────────────────────────────────
// Higher score = more compliance/control gaps present.
//
// Weights per question:
//   no multi-factor auth            = no +3, not-sure +2  (highest risk)
//   onboarding not documented       = no +2, not-sure +1
//   offboarding not documented      = no +2, not-sure +1
//   admin roles not reviewed        = no +2, not-sure +1
//   backup ownership unclear        = no +2, not-sure +1
//   restore testing absent          = no +2, not-sure +1
//   access changes not tracked      = no +2, not-sure +1
//   compliance-conscious needs      = yes +2, not-sure +1
//
// Max score = 17
//
// Thresholds:
//   Strong baseline = 0–3
//   Needs review    = 4–8
//   Priority gap    = 9+
//
// TO ADJUST: Change weights passed to complianceRisk() below.

export const COMPLIANCE_MAX = 17;

function complianceRisk(val: TriState, noWeight: number, notSureWeight: number): number {
  if (val === "no") return noWeight;
  if (val === "not-sure") return notSureWeight;
  return 0;
}

export function calcComplianceScore(c: ComplianceValues): { score: number; level: ComplianceLevel } {
  const score =
    complianceRisk(c.mfaForAll, 3, 2) +
    complianceRisk(c.onboardingDocumented, 2, 1) +
    complianceRisk(c.offboardingDocumented, 2, 1) +
    complianceRisk(c.adminRolesReviewed, 2, 1) +
    complianceRisk(c.backupOwnershipClear, 2, 1) +
    complianceRisk(c.testRestores, 2, 1) +
    complianceRisk(c.accessChangesTracked, 2, 1) +
    // Explicit compliance-conscious environment flag
    (c.needsComplianceSupport === "yes" ? 2 : c.needsComplianceSupport === "not-sure" ? 1 : 0);

  const level: ComplianceLevel =
    score <= 3 ? "Strong baseline" : score <= 8 ? "Needs review" : "Priority gap";

  return { score, level };
}

// ─── Savings range ──────────────────────────────────────────────────────────
// Base savings are a percentage of monthly spend, driven by the overlap level.
// Additional risk factors modestly widen the range.
// These are directional estimates only — not guaranteed savings.
//
// Base ranges:
//   Low overlap:      8–12% of monthly spend
//   Moderate overlap: 12–20% of monthly spend
//   High overlap:     18–30% of monthly spend
//
// Modifiers (each adds to the high end, some to the low end):
//   Unclear M365 licensing          → high +2%
//   Former employees on paid plans  → low +1%, high +2%
//   Both onboarding AND offboarding manual → low +1%, high +2%
//   Multiple support vendors         → high +1%
//   Duplicate backup OR security tools → high +2%
//
// TO ADJUST: Change base percentages or modifier increments below.

export function calcSavingsRange(
  monthly: number,
  overlapLevel: OverlapLevel,
  overlap: OverlapValues
): SavingsRange {
  let low: number, high: number;

  if (overlapLevel === "Low") {
    low = 0.08; high = 0.12;
  } else if (overlapLevel === "Moderate") {
    low = 0.12; high = 0.20;
  } else {
    low = 0.18; high = 0.30;
  }

  // Apply modifiers for specific additional risk factors
  if (overlap.microsoft365LicensingClear !== "yes") {
    high += 0.02;
  }
  if (overlap.formerEmployeeLingers === "yes") {
    low += 0.01;
    high += 0.02;
  }
  if (overlap.manualOnboarding === "yes" && overlap.manualOffboarding === "yes") {
    low += 0.01;
    high += 0.02;
  }
  if (overlap.splitVendors === "yes") {
    high += 0.01;
  }
  if (overlap.multipleBackupTools === "yes" || overlap.multipleSecurityTools === "yes") {
    high += 0.02;
  }

  // Cap to sensible upper limit
  high = Math.min(high, 0.40);

  // Round to nearest $25 to avoid false precision
  const round = (n: number) => Math.max(25, Math.round((monthly * n) / 25) * 25);

  return {
    monthlyLow: round(low),
    monthlyHigh: round(high),
    annualLow: round(low) * 12,
    annualHigh: round(high) * 12,
  };
}

// ─── Recommendations ────────────────────────────────────────────────────────
// Returns up to 5 prioritized recommendations based on calculator inputs.
// TO ADD/REMOVE: Add or remove recommendation blocks below.

export function buildRecommendations(
  values: CalculatorValues,
  overlapLevel: OverlapLevel,
  complianceLevel: ComplianceLevel
): RecommendationItem[] {
  const recs: RecommendationItem[] = [];

  // Multi-factor authentication (highest priority compliance gap)
  if (values.compliance.mfaForAll !== "yes") {
    recs.push({
      title: "Require multi-factor authentication for all users",
      description:
        "Multi-factor authentication is one of the most effective controls against account compromise. Inconsistent or missing coverage creates an avoidable risk.",
    });
  }

  // Microsoft 365 licensing
  if (
    values.company.usesMicrosoft365 !== "no" &&
    values.overlap.microsoft365LicensingClear !== "yes"
  ) {
    recs.push({
      title: "Review Microsoft 365 licensing assignments",
      description:
        "Unclear licensing often means users are assigned to plans they no longer need, or that overlap with other paid tools in your stack.",
    });
  }

  // Security tool overlap
  if (
    values.overlap.multipleSecurityTools === "yes" ||
    values.overlap.multipleSecurityTools === "not-sure"
  ) {
    recs.push({
      title: "Consolidate overlapping security tools",
      description:
        "Multiple security tools frequently duplicate coverage. A single properly configured solution often costs less and is easier to manage.",
    });
  }

  // Onboarding and offboarding
  if (
    values.overlap.manualOnboarding === "yes" ||
    values.overlap.manualOffboarding === "yes" ||
    values.compliance.onboardingDocumented !== "yes" ||
    values.compliance.offboardingDocumented !== "yes"
  ) {
    recs.push({
      title: "Standardize onboarding and offboarding",
      description:
        "Manual or undocumented processes leave access gaps, increase risk from former employee accounts, and are a common source of wasted license spend.",
    });
  }

  // Vendor sprawl
  if (values.overlap.splitVendors === "yes") {
    recs.push({
      title: "Clarify vendor ownership and support coverage",
      description:
        "When different vendors own different parts of your support environment, gaps and duplicate costs are common. A consolidated approach reduces confusion and cost.",
    });
  }

  // Backup
  if (
    values.compliance.backupOwnershipClear !== "yes" ||
    values.compliance.testRestores !== "yes"
  ) {
    recs.push({
      title: "Review backup ownership and restore testing",
      description:
        "Having a backup without a documented owner or regular restore testing means your recovery capability is largely untested when it matters most.",
    });
  }

  // Unused licenses / high overlap
  if (
    overlapLevel === "High" ||
    values.overlap.unusedSoftware === "yes" ||
    values.overlap.formerEmployeeLingers === "yes"
  ) {
    recs.push({
      title: "Audit active licenses and access rights",
      description:
        "Unused software licenses and active accounts for former employees are among the most common sources of preventable spend.",
    });
  }

  // Cap at 5
  return recs.slice(0, 5);
}

// ─── Full results ───────────────────────────────────────────────────────────

export function calculateResults(values: CalculatorValues): ResultsOutput {
  const spend = calcSpend(values.spend);
  const { score: overlapScore, level: overlapLevel } = calcOverlapScore(values.overlap);
  const { score: complianceScore, level: complianceLevel } = calcComplianceScore(values.compliance);
  // Pass overlap values so savings range can apply per-factor modifiers
  const savingsRange = calcSavingsRange(spend.monthly, overlapLevel, values.overlap);
  const recommendations = buildRecommendations(values, overlapLevel, complianceLevel);

  return {
    spend,
    overlapLevel,
    overlapScore,
    overlapMax: OVERLAP_MAX,
    complianceLevel,
    complianceScore,
    complianceMax: COMPLIANCE_MAX,
    savingsRange,
    recommendations,
  };
}
