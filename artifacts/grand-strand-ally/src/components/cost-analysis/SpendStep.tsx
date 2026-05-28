import type { SpendValues } from "@/lib/cost-analysis-types";

interface Props {
  values: SpendValues;
  onChange: (v: SpendValues) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CostField {
  key: keyof SpendValues;
  label: string;
  hint: string;
  isHours?: boolean;
}

const FIELDS: CostField[] = [
  {
    key: "managedSupport",
    label: "Managed support or helpdesk",
    hint: "What you pay a managed service provider or support vendor per month",
  },
  {
    key: "microsoft365",
    label: "Microsoft 365 licenses",
    hint: "Total monthly cost for all Microsoft 365 plans across your team",
  },
  {
    key: "emailSecurity",
    label: "Email security or filtering",
    hint: "Anti-spam, anti-phishing, or email archiving tools",
  },
  {
    key: "endpointSecurity",
    label: "Endpoint security or antivirus",
    hint: "Security software installed on computers and devices",
  },
  {
    key: "backupRecovery",
    label: "Backup and recovery",
    hint: "Cloud backup, on-site backup, or disaster recovery services",
  },
  {
    key: "networkFirewall",
    label: "Network and firewall support",
    hint: "Firewall, managed switch, Wi-Fi infrastructure, or network monitoring",
  },
  {
    key: "cloudSoftware",
    label: "Other cloud software and recurring tools",
    hint: "Any other recurring software subscriptions used for work",
  },
];

function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative w-36">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5B6B] text-sm pointer-events-none">
        $
      </span>
      <input
        type="number"
        min="0"
        step="1"
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
        placeholder="0"
        className="w-full h-10 pl-7 pr-3 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent text-right"
      />
    </div>
  );
}

export function SpendStep({ values, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof SpendValues>(k: K, v: SpendValues[K]) =>
    onChange({ ...values, [k]: v });

  const total =
    (values.managedSupport || 0) +
    (values.microsoft365 || 0) +
    (values.emailSecurity || 0) +
    (values.endpointSecurity || 0) +
    (values.backupRecovery || 0) +
    (values.networkFirewall || 0) +
    (values.cloudSoftware || 0) +
    (values.adminTimeMonthly || 0) * 45;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Estimate your current monthly spend
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          Enter your best estimates. Round numbers are fine — this analysis is directional, not exact.
        </p>
      </div>

      <div className="divide-y divide-[#D7E1EA] border border-[#D7E1EA] rounded-xl overflow-hidden">
        {FIELDS.map(({ key, label, hint }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-[#F7F5F1] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0E2F54]">{label}</p>
              <p className="text-xs text-[#4B5B6B] mt-0.5">{hint}</p>
            </div>
            <CurrencyInput
              value={values[key] as number}
              onChange={(v) => set(key, v)}
            />
          </div>
        ))}

        {/* Admin time row */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#DCEAF7]/30 hover:bg-[#DCEAF7]/50 transition-colors">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0E2F54]">
              Internal time spent on information technology tasks
            </p>
            <p className="text-xs text-[#4B5B6B] mt-0.5">
              Estimated hours per month your staff spends on support, troubleshooting, or administration. Valued at $45/hr.
            </p>
          </div>
          <div className="relative w-36">
            <input
              type="number"
              min="0"
              step="1"
              value={values.adminTimeMonthly || ""}
              onChange={(e) =>
                set("adminTimeMonthly", Math.max(0, parseFloat(e.target.value) || 0))
              }
              placeholder="0"
              className="w-full h-10 pl-3 pr-10 text-sm border border-[#D7E1EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60B8F0] focus:border-transparent text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5B6B] text-xs pointer-events-none">
              hrs
            </span>
          </div>
        </div>
      </div>

      {/* Running total */}
      {total > 0 && (
        <div className="bg-[#0E2F54] rounded-xl px-5 py-4 flex items-center justify-between">
          <span className="text-white/70 text-sm">Estimated monthly total</span>
          <span className="text-white font-bold text-lg">
            ${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo
          </span>
        </div>
      )}

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
          Next: Overlap Questions →
        </button>
      </div>
    </div>
  );
}
