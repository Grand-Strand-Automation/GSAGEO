/**
 * cost-analysis-scoring.ts
 *
 * Scoring and recommendation logic for the IT Cost Analysis calculator.
 *
 * TO EDIT QUESTIONS: See the step components in src/components/cost-analysis/
 * TO EDIT FORMULAS: Adjust weights in calcOverlapScore / calcComplianceScore below.
 * TO EDIT SAVINGS RANGE: Adjust percentages in calcSavingsRange below.
 * TO WIRE EMAIL: In ResultsStep.tsx, the handleSubmit function has a TODO comment
 *   for connecting Resend, Formspree, or another email/CRM service.
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
// Admin time is converted using a $45/hr internal cost estimate.
// Adjust ADMIN_HOURLY_RATE to change this assumption.
const ADMIN_HOURLY_RATE = 45;

export function calcSpend(spend: SpendValues): SpendSummary {
  const toolCosts =
    (spend.managedSupport || 0) +
    (spend.microsoft365 || 0) +
    (spend.emailSecurity || 0) +
    (spend.endpointSecurity || 0) +
    (spend.backupRecovery || 0) +
    (spend.networkFirewall || 0) +
    (spend.cloudSoftware || 0);

  const adminCost = (spend.adminTimeMonthly || 0) * ADMIN_HOURLY_RATE;
  const monthly = toolCosts + adminCost;

  return {
    monthly,
    annual: monthly * 12,
  };
}

// ─── Overlap scoring ────────────────────────────────────────────────────────
// Higher score = greater risk of tool overlap, licensing waste, or process gaps.
// Max score = 17.
//
// Thresholds:
//   Low      = 0–4
//   Moderate = 5–10
//   High     = 11+
//
// TO ADJUST: Change the weight values passed to overlapRisk() / overlapRiskReversed().

export const OVERLAP_MAX = 17;

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
    triRisk(o.manualOnboarding, 2, 0) +
    triRisk(o.manualOffboarding, 2, 0) +
    triRiskReversed(o.microsoft365LicensingClear, 2, 1) +
    triRisk(o.sharedMailboxManual, 1, 0);

  const level: OverlapLevel =
    score <= 4 ? "Low" : score <= 10 ? "Moderate" : "High";

  return { score, level };
}

// ─── Compliance scoring ─────────────────────────────────────────────────────
// Higher score = more compliance/control gaps present.
// Max score = 16.
//
// Thresholds:
//   Strong baseline = 0–3
//   Needs review    = 4–8
//   Priority gap    = 9+
//
// TO ADJUST: Change weights passed to complianceRisk() below.

export const COMPLIANCE_MAX = 16;

function complianceRisk(val: TriState, noWeight: number, notSureWeight: number): number {
  if (val === "no") return noWeight;
  if (val === "not-sure") return notSureWeight;
  return 0;
}

export function calcComplianceScore(c: ComplianceValues): { score: number; level: ComplianceLevel } {
  const score =
    complianceRisk(c.mfaForAll, 3, 2) +            // Multi-factor auth: highest weight
    complianceRisk(c.onboardingDocumented, 2, 1) +
    complianceRisk(c.offboardingDocumented, 2, 1) +
    complianceRisk(c.adminRolesReviewed, 2, 1) +
    complianceRisk(c.backupOwnershipClear, 2, 1) +
    complianceRisk(c.testRestores, 2, 1) +
    complianceRisk(c.accessChangesTracked, 2, 1) +
    (c.needsComplianceSupport !== "no" ? 1 : 0);   // Minor flag for explicit compliance need

  const level: ComplianceLevel =
    score <= 3 ? "Strong baseline" : score <= 8 ? "Needs review" : "Priority gap";

  return { score, level };
}

// ─── Savings range ──────────────────────────────────────────────────────────
// Returns a directional savings range based on monthly spend and overlap level.
// These are estimates — not guaranteed savings.
//
// TO ADJUST: Change the low/high percentages in each overlap case below.

export function calcSavingsRange(monthly: number, overlapLevel: OverlapLevel): SavingsRange {
  let low: number, high: number;

  if (overlapLevel === "Low") {
    low = 0.06; high = 0.12;
  } else if (overlapLevel === "Moderate") {
    low = 0.12; high = 0.20;
  } else {
    low = 0.18; high = 0.28;
  }

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

  // Unused licenses / high compliance gap
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
  const savingsRange = calcSavingsRange(spend.monthly, overlapLevel);
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
