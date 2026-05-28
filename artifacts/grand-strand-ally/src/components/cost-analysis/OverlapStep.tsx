import type { OverlapValues, TriState } from "@/lib/cost-analysis-types";

interface Props {
  values: OverlapValues;
  onChange: (v: OverlapValues) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Question {
  key: keyof OverlapValues;
  text: string;
}

const QUESTIONS: Question[] = [
  {
    key: "multipleSecurityTools",
    text: "Do you currently pay for more than one security or antivirus tool?",
  },
  {
    key: "multipleBackupTools",
    text: "Do you have more than one backup or recovery solution running?",
  },
  {
    key: "splitVendors",
    text: "Do different vendors handle different parts of your support environment?",
  },
  {
    key: "unusedSoftware",
    text: "Are you unsure whether all of your paid software is still actively used?",
  },
  {
    key: "formerEmployeeLingers",
    text: "Have former employees ever been left assigned to paid licenses longer than expected?",
  },
  {
    key: "manualOnboarding",
    text: "Is new employee onboarding handled manually, without a defined checklist or process?",
  },
  {
    key: "manualOffboarding",
    text: "Is employee offboarding handled manually, without a documented process?",
  },
  {
    key: "microsoft365LicensingClear",
    text: "Do you know exactly which Microsoft 365 plan each user needs?",
  },
  {
    key: "sharedMailboxManual",
    text: "Are shared mailbox handoffs or email forwarding managed manually?",
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

export function OverlapStep({ values, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof OverlapValues>(k: K, v: OverlapValues[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Overlap and process questions
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          These questions help identify common sources of duplicate spend and process gaps.
          Answer with your best understanding.
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
          className="inline-flex items-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
        >
          Next: Compliance Questions →
        </button>
      </div>
    </div>
  );
}
