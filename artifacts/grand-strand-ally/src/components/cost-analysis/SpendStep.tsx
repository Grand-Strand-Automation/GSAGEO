import type { SpendValues } from "@/lib/cost-analysis-types";

interface Props {
  values: SpendValues;
  onChange: (v: SpendValues) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CostField {
  key: keyof Pick<
    SpendValues,
    | "managedSupport"
    | "microsoft365"
    | "emailSecurity"
    | "endpointSecurity"
    | "backupRecovery"
    | "networkFirewall"
    | "cloudSoftware"
  >;
  label: string;
  hint: string;
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

  const rate = values.adminHourlyRate > 0 ? values.adminHourlyRate : 45;
  const adminCost = (values.adminTimeMonthly || 0) * rate;

  const total =
    (values.managedSupport || 0) +
    (values.microsoft365 || 0) +
    (values.emailSecurity || 0) +
    (values.endpointSecurity || 0) +
    (values.backupRecovery || 0) +
    (values.networkFirewall || 0) +
    (values.cloudSoftware || 0) +
    adminCost;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Estimate your current monthly spend
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          These can be estimates if you do not have exact numbers. Round numbers are fine — this analysis is directional, not exact.
        </p>
      </div>

      {/* Tool cost rows */}
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
      </div>

      {/* Internal admin time section */}
      <div className="border border-[#D7E1EA] rounded-xl overflow-hidden">
        <div className="bg-[#DCEAF7]/40 px-5 py-3 border-b border-[#D7E1EA]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4B5B6B]">
            Internal administrative time
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-[#F7F5F1] transition-colors border-b border-[#D7E1EA]">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0E2F54]">
              Hours per month spent on information technology tasks
            </p>
            <p className="text-xs text-[#4B5B6B] mt-0.5">
              Troubleshooting, software setup, vendor calls, user management, and similar tasks
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

        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-[#F7F5F1] transition-colors">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0E2F54]">
              Internal hourly rate for that time
            </p>
            <p className="text-xs text-[#4B5B6B] mt-0.5">
              Use the fully-loaded hourly cost of the person handling these tasks. Default is $45/hr.
            </p>
          </div>
          <CurrencyInput
            value={values.adminHourlyRate}
            onChange={(v) => set("adminHourlyRate", v || 45)}
          />
        </div>
      </div>

      {/* Admin cost note */}
      {values.adminTimeMonthly > 0 && (
        <div className="text-xs text-[#4B5B6B] text-right -mt-3">
          Internal admin cost: {values.adminTimeMonthly} hrs × ${rate}/hr ={" "}
          <strong className="text-[#0E2F54]">
            ${adminCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo
          </strong>
        </div>
      )}

      {/* Running total */}
      {total > 0 && (
        <div className="bg-[#0E2F54] rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-white/60 text-xs block">Estimated monthly total</span>
            <span className="text-white/50 text-[11px]">Tool costs + internal admin overhead</span>
          </div>
          <span className="text-white font-bold text-xl">
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
