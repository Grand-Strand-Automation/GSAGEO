// ─── Tri-state answer type ──────────────────────────────────────────────────
export type TriState = "yes" | "no" | "not-sure";

// ─── Step 1: Company basics ─────────────────────────────────────────────────
export interface CompanyValues {
  contactName: string;
  companyName: string;
  workEmail: string;
  userCount: string;
  deviceCount: string;
  locationCount: string;
  industry: string;
  sensitiveData: TriState;
  usesMicrosoft365: TriState;
}

// ─── Step 2: Monthly spend ──────────────────────────────────────────────────
export interface SpendValues {
  managedSupport: number;
  microsoft365: number;
  emailSecurity: number;
  endpointSecurity: number;
  backupRecovery: number;
  networkFirewall: number;
  cloudSoftware: number;
  adminTimeMonthly: number; // hours/month — converted to cost at $45/hr
}

// ─── Step 3: Overlap & process ──────────────────────────────────────────────
export interface OverlapValues {
  multipleSecurityTools: TriState;
  multipleBackupTools: TriState;
  splitVendors: TriState;
  unusedSoftware: TriState;
  formerEmployeeLingers: TriState;
  manualOnboarding: TriState;
  manualOffboarding: TriState;
  microsoft365LicensingClear: TriState;
  sharedMailboxManual: TriState;
}

// ─── Step 4: Compliance & control ──────────────────────────────────────────
export interface ComplianceValues {
  mfaForAll: TriState;
  onboardingDocumented: TriState;
  offboardingDocumented: TriState;
  adminRolesReviewed: TriState;
  backupOwnershipClear: TriState;
  testRestores: TriState;
  accessChangesTracked: TriState;
  needsComplianceSupport: TriState;
}

// ─── Full calculator state ──────────────────────────────────────────────────
export interface CalculatorValues {
  company: CompanyValues;
  spend: SpendValues;
  overlap: OverlapValues;
  compliance: ComplianceValues;
}

// ─── Scoring output types ───────────────────────────────────────────────────
export type OverlapLevel = "Low" | "Moderate" | "High";
export type ComplianceLevel = "Strong baseline" | "Needs review" | "Priority gap";

export interface SpendSummary {
  monthly: number;
  annual: number;
}

export interface SavingsRange {
  monthlyLow: number;
  monthlyHigh: number;
  annualLow: number;
  annualHigh: number;
}

export interface RecommendationItem {
  title: string;
  description: string;
}

export interface ResultsOutput {
  spend: SpendSummary;
  overlapLevel: OverlapLevel;
  overlapScore: number;
  overlapMax: number;
  complianceLevel: ComplianceLevel;
  complianceScore: number;
  complianceMax: number;
  savingsRange: SavingsRange;
  recommendations: RecommendationItem[];
}
