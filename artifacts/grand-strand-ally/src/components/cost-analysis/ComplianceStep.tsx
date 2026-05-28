import type { ComplianceValues, TriState } from "@/lib/cost-analysis-types";

interface Props {
  values: ComplianceValues;
  onChange: (v: ComplianceValues) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Question {
  key: keyof ComplianceValues;
  text: string;
}

const QUESTIONS: Question[] = [
  {
    key: "mfaForAll",
    text: "Is multi-factor authentication required for all users?",
  },
  {
    key: "onboardingDocumented",
    text: "Is your employee onboarding process documented and followed consistently?",
  },
  {
    key: "offboardingDocumented",
    text: "Is your employee offboarding process documented and followed consistently?",
  },
  {
    key: "adminRolesReviewed",
    text: "Are Microsoft 365 administrative roles limited and reviewed regularly?",
  },
  {
    key: "backupOwnershipClear",
    text: "Is it clear who owns and monitors your backup coverage?",
  },
  {
    key: "testRestores",
    text: "Do you periodically test whether backups can be restored successfully?",
  },
  {
    key: "accessChangesTracked",
    text: "Are access and permission changes tracked consistently?",
  },
  {
    key: "needsComplianceSupport",
    text: "Do you need support for a compliance-conscious environment (healthcare, legal, financial, or similar)?",
  },
];

function TriButtons({
  value,
  onChange,
}: {
  value: TriState;
  onChange: (v: TriState) => void;
}) {
  const opts: { val: TriState; label: string }[] = [
    { val: "yes", label: "Yes" },
    { val: "no", label: "No" },
    { val: "not-sure", label: "Not sure" },
  ];
  return (
    <div className="flex gap-2 shrink-0">
      {opts.map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
            value === val
              ? "bg-[#0E2F54] text-white border-[#0E2F54]"
              : "bg-white text-[#4B5B6B] border-[#D7E1EA] hover:border-[#1F5E95] hover:text-[#1F5E95]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ComplianceStep({ values, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof ComplianceValues>(k: K, v: ComplianceValues[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Compliance and control questions
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          These questions identify common control gaps. Answer honestly with your current state —
          "not sure" is a valid and useful answer.
        </p>
      </div>

      <div className="divide-y divide-[#D7E1EA] border border-[#D7E1EA] rounded-xl overflow-hidden">
        {QUESTIONS.map(({ key, text }) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 bg-white hover:bg-[#F7F5F1] transition-colors"
          >
            <p className="text-sm text-[#0E2F54] flex-1 leading-snug">{text}</p>
            <TriButtons
              value={values[key]}
              onChange={(v) => set(key, v)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#4B5B6B] hover:text-[#0E2F54] h-11 px-4 rounded-lg border border-[#D7E1EA] hover:border-[#0E2F54] transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
        >
          See My Results →
        </button>
      </div>
    </div>
  );
}
