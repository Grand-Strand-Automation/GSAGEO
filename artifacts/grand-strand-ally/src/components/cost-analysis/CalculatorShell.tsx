import { useState, useRef } from "react";
import type {
  CompanyValues,
  SpendValues,
  OverlapValues,
  ComplianceValues,
  TriState,
  ResultsOutput,
} from "@/lib/cost-analysis-types";
import { calculateResults } from "@/lib/cost-analysis-scoring";
import { ProgressBar } from "./ProgressBar";
import { CompanyStep } from "./CompanyStep";
import { SpendStep } from "./SpendStep";
import { OverlapStep } from "./OverlapStep";
import { ComplianceStep } from "./ComplianceStep";
import { ResultsStep } from "./ResultsStep";

const STEP_LABELS = ["Company", "Monthly Costs", "Overlap", "Compliance", "Results"];
const TOTAL_STEPS = 5;

const DEFAULT_TRISTATE: TriState = "not-sure";

const INITIAL_COMPANY: CompanyValues = {
  contactName: "",
  companyName: "",
  workEmail: "",
  userCount: "",
  deviceCount: "",
  locationCount: "",
  industry: "",
  sensitiveData: DEFAULT_TRISTATE,
  usesMicrosoft365: DEFAULT_TRISTATE,
};

const INITIAL_SPEND: SpendValues = {
  managedSupport: 0,
  microsoft365: 0,
  emailSecurity: 0,
  endpointSecurity: 0,
  backupRecovery: 0,
  networkFirewall: 0,
  cloudSoftware: 0,
  adminTimeMonthly: 0,
  adminHourlyRate: 45,
};

const INITIAL_OVERLAP: OverlapValues = {
  multipleSecurityTools: DEFAULT_TRISTATE,
  multipleBackupTools: DEFAULT_TRISTATE,
  splitVendors: DEFAULT_TRISTATE,
  unusedSoftware: DEFAULT_TRISTATE,
  formerEmployeeLingers: DEFAULT_TRISTATE,
  manualOnboarding: DEFAULT_TRISTATE,
  manualOffboarding: DEFAULT_TRISTATE,
  microsoft365LicensingClear: DEFAULT_TRISTATE,
  sharedMailboxManual: DEFAULT_TRISTATE,
};

const INITIAL_COMPLIANCE: ComplianceValues = {
  mfaForAll: DEFAULT_TRISTATE,
  onboardingDocumented: DEFAULT_TRISTATE,
  offboardingDocumented: DEFAULT_TRISTATE,
  adminRolesReviewed: DEFAULT_TRISTATE,
  backupOwnershipClear: DEFAULT_TRISTATE,
  testRestores: DEFAULT_TRISTATE,
  accessChangesTracked: DEFAULT_TRISTATE,
  needsComplianceSupport: DEFAULT_TRISTATE,
};

export function CalculatorShell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState<CompanyValues>(INITIAL_COMPANY);
  const [spend, setSpend] = useState<SpendValues>(INITIAL_SPEND);
  const [overlap, setOverlap] = useState<OverlapValues>(INITIAL_OVERLAP);
  const [compliance, setCompliance] = useState<ComplianceValues>(INITIAL_COMPLIANCE);
  const [results, setResults] = useState<ResultsOutput | null>(null);

  function scrollToShell() {
    if (shellRef.current) {
      const top = shellRef.current.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function goNext() {
    // Calculate results when moving from step 4 → 5
    if (step === 4) {
      const r = calculateResults({ company, spend, overlap, compliance });
      setResults(r);
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    scrollToShell();
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
    scrollToShell();
  }

  return (
    <div ref={shellRef} id="calculator" className="bg-white rounded-2xl border border-[#D7E1EA] shadow-sm p-6 md:p-8">
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

      {step === 1 && (
        <CompanyStep values={company} onChange={setCompany} onNext={goNext} />
      )}
      {step === 2 && (
        <SpendStep values={spend} onChange={setSpend} onNext={goNext} onBack={goBack} />
      )}
      {step === 3 && (
        <OverlapStep values={overlap} onChange={setOverlap} onNext={goNext} onBack={goBack} />
      )}
      {step === 4 && (
        <ComplianceStep
          values={compliance}
          onChange={setCompliance}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {step === 5 && results && (
        <ResultsStep results={results} company={company} onBack={goBack} />
      )}
    </div>
  );
}
