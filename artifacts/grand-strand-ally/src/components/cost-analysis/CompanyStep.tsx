import type { CompanyValues, TriState } from "@/lib/cost-analysis-types";

interface Props {
  values: CompanyValues;
  onChange: (v: CompanyValues) => void;
  onNext: () => void;
}

const INDUSTRIES = [
  "Healthcare or medical services",
  "Legal or professional services",
  "Financial services or accounting",
  "Real estate",
  "Hospitality or tourism",
  "Retail or e-commerce",
  "Construction or trades",
  "Non-profit",
  "Government or public sector",
  "Other",
];

function TriField({
  question,
  value,
  onChange,
}: {
  question: string;
  value: TriState;
  onChange: (v: TriState) => void;
}) {
  const opts: { val: TriState; label: string }[] = [
    { val: "yes", label: "Yes" },
    { val: "no", label: "No" },
    { val: "not-sure", label: "Not sure" },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-[#0E2F54] mb-2.5">{question}</p>
      <div className="flex flex-wrap gap-2">
        {opts.map(({ val, label }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              value === val
                ? "bg-[#0E2F54] text-white border-[#0E2F54]"
                : "bg-white text-[#4B5B6B] border-[#D7E1EA] hover:border-[#1F5E95] hover:text-[#1F5E95]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CompanyStep({ values, onChange, onNext }: Props) {
  const set = <K extends keyof CompanyValues>(k: K, v: CompanyValues[K]) =>
    onChange({ ...values, [k]: v });

  const canProceed =
    values.contactName.trim().length >= 2 &&
    values.companyName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.workEmail);

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Tell us about your business
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          These details help us tailor the analysis to your environment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Your name *" hint="">
          <input
            type="text"
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder="Jane Doe"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>

        <Field label="Work email *" hint="">
          <input
            type="email"
            value={values.workEmail}
            onChange={(e) => set("workEmail", e.target.value)}
            placeholder="jane@company.com"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>

        <Field label="Company name *" hint="">
          <input
            type="text"
            value={values.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="Acme Company"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>

        <Field label="Industry" hint="">
          <select
            value={values.industry}
            onChange={(e) => set("industry", e.target.value)}
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent bg-white"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Number of users" hint="People using company accounts">
          <input
            type="number"
            min="1"
            value={values.userCount}
            onChange={(e) => set("userCount", e.target.value)}
            placeholder="e.g. 12"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>

        <Field label="Number of devices" hint="Computers, laptops, workstations">
          <input
            type="number"
            min="1"
            value={values.deviceCount}
            onChange={(e) => set("deviceCount", e.target.value)}
            placeholder="e.g. 15"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>

        <Field label="Number of locations" hint="Offices, sites, or remote locations">
          <input
            type="number"
            min="1"
            value={values.locationCount}
            onChange={(e) => set("locationCount", e.target.value)}
            placeholder="e.g. 2"
            className="w-full h-11 px-3.5 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
        <TriField
          question="Does your business handle sensitive or regulated information?"
          value={values.sensitiveData}
          onChange={(v) => set("sensitiveData", v)}
        />
        <TriField
          question="Does your business use Microsoft 365?"
          value={values.usesMicrosoft365}
          onChange={(v) => set("usesMicrosoft365", v)}
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
        >
          Next: Monthly Costs →
        </button>
      </div>

      {!canProceed && (
        <p className="text-xs text-[#4B5B6B] text-right -mt-4">
          Name, company name, and a valid work email are required to continue.
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#0E2F54]">{label}</label>
      {hint && <p className="text-xs text-[#4B5B6B] -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}
