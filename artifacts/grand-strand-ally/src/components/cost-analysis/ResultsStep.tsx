import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  ResultsOutput,
  CompanyValues,
  SpendValues,
  OverlapValues,
  ComplianceValues,
} from "@/lib/cost-analysis-types";
import { ScoreBadge } from "./ScoreBadge";

interface Props {
  results: ResultsOutput;
  company: CompanyValues;
  spend: SpendValues;
  overlap: OverlapValues;
  compliance: ComplianceValues;
  adminHourlyRate?: number;
  onBack: () => void;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const levelBorderClass: Record<string, string> = {
  Low: "border-l-emerald-400",
  Moderate: "border-l-amber-400",
  High: "border-l-red-400",
  "Strong baseline": "border-l-emerald-400",
  "Needs review": "border-l-amber-400",
  "Priority gap": "border-l-red-400",
};

const savingsContext: Record<string, string> = {
  Low:
    "Your environment appears relatively consolidated. The estimate below reflects savings typically found during a standard review and right-sizing exercise.",
  Moderate:
    "Your environment shows signs of tool overlap and process gaps. The estimate reflects savings commonly identified during a consolidation and clean-up review.",
  High:
    "Your environment shows significant overlap and control gaps. The estimate reflects the typical opportunity found in environments that need substantial consolidation and process work.",
};

function AssumptionsAccordion({ adminHourlyRate }: { adminHourlyRate: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#D7E1EA] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#F7F5F1] hover:bg-[#DCEAF7]/60 text-left transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#0E2F54]">How we estimate this</span>
        {open ? (
          <ChevronUp size={15} className="text-[#4B5B6B] shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-[#4B5B6B] shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 py-5 bg-white space-y-3.5 text-sm text-[#4B5B6B] leading-relaxed border-t border-[#D7E1EA]">
          <p>
            <strong className="text-[#0E2F54]">Spend total:</strong> The sum of all monthly costs
            you entered, plus an estimate for internal administrative time valued at $
            {fmt(adminHourlyRate)} per hour — the rate you provided.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Overlap risk:</strong> A weighted score based on
            your answers about duplicate tools, manual processes, and licensing clarity. A higher
            score suggests more opportunity to reduce waste and simplify your environment.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Compliance and control:</strong> A weighted score
            based on documented processes, multi-factor authentication coverage, backup ownership,
            and access management practices. A higher score indicates more control gaps worth
            reviewing.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Savings range:</strong> Derived from your overlap
            level as a percentage of your estimated monthly spend. Low overlap environments
            typically reflect an 8–12% opportunity; high overlap environments can reflect 18–30%.
            Specific factors — such as unclear licensing, former employees on paid plans, or
            duplicate tools — widen the range further. These are directional estimates only.
          </p>
          <p className="text-xs text-[#4B5B6B]/70 border-t border-[#D7E1EA] pt-3.5 leading-relaxed">
            This analysis is based entirely on your inputs and uses industry-typical estimates. It
            is not an audit, a guarantee, or a final recommendation. A real review with a Grand
            Strand Ally consultant will produce a more accurate and actionable picture.
          </p>
        </div>
      )}
    </div>
  );
}

export function ResultsStep({
  results,
  company,
  spend,
  overlap,
  compliance,
  adminHourlyRate = 45,
  onBack,
}: Props) {
  const [reportRequested, setReportRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleGetReport() {
    setSubmitting(true);
    try {
      await fetch("/api/cost-analysis-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, spend, overlap, compliance, results, adminHourlyRate }),
      });
    } catch (err) {
      console.error("[Cost Analysis] Failed to send report:", err);
    } finally {
      setSubmitting(false);
      setReportRequested(true);
    }
  }

  const hasSpend = results.spend.monthly > 0;
  const companyLabel = company.companyName || company.contactName || "your business";

  return (
    <div className="space-y-8">

      {/* ── Results header ── */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#DCEAF7] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7.5l3.5 3.5 6.5-6.5" stroke="#1F5E95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-[#0E2F54] leading-snug">
            Cost analysis for {companyLabel}
          </h3>
          <p className="text-sm text-[#4B5B6B] mt-0.5">
            Directional estimates based on your inputs. Figures reflect likely areas of overlap and
            control gaps — not a final audit.
          </p>
        </div>
      </div>

      {/* ── Spend summary ── */}
      {hasSpend ? (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4B5B6B] mb-3">
            Estimated current spend
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SpendCard
              label="Monthly"
              value={`$${fmt(results.spend.monthly)}`}
              sub="per month, based on your entries"
            />
            <SpendCard
              label="Annual"
              value={`$${fmt(results.spend.annual)}`}
              sub="annualized from monthly total"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl px-5 py-4">
          <p className="text-sm text-[#4B5B6B]">
            No monthly costs were entered. Overlap and compliance findings still apply.
          </p>
        </div>
      )}

      {/* ── Risk scores ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4B5B6B] mb-3">
          Risk overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScoreCard
            title="Overlap risk"
            level={results.overlapLevel}
            badge={<ScoreBadge label={results.overlapLevel} />}
            description={
              results.overlapLevel === "Low"
                ? "Your answers suggest limited overlap between tools and vendors. There may still be individual items worth reviewing."
                : results.overlapLevel === "Moderate"
                ? "Your environment shows signs of tool overlap or process gaps that are worth a closer look."
                : "Your answers indicate significant overlap or process gaps that are likely contributing to unnecessary cost and risk."
            }
          />
          <ScoreCard
            title="Compliance and control"
            level={results.complianceLevel}
            badge={<ScoreBadge label={results.complianceLevel} />}
            description={
              results.complianceLevel === "Strong baseline"
                ? "Your answers suggest a reasonable baseline of controls in place. Some areas may still benefit from review."
                : results.complianceLevel === "Needs review"
                ? "Several control areas appear unclear or undocumented. These are worth prioritizing before they become larger issues."
                : "Your answers point to significant control gaps — particularly around access management, multi-factor authentication, or backup coverage."
            }
          />
        </div>
      </div>

      {/* ── Savings opportunity ── */}
      {hasSpend && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4B5B6B] mb-3">
            Estimated savings opportunity
          </p>
          <div className="bg-[#0E2F54] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <p className="text-sm text-white/65 leading-relaxed">
                {savingsContext[results.overlapLevel]}
              </p>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-white/50 text-xs mb-1.5">Potential monthly savings</p>
                <p className="text-white font-bold text-2xl tracking-tight">
                  ${fmt(results.savingsRange.monthlyLow)}&thinsp;–&thinsp;${fmt(results.savingsRange.monthlyHigh)}
                </p>
                <p className="text-white/35 text-[11px] mt-1">per month</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1.5">Potential annual savings</p>
                <p className="text-white font-bold text-2xl tracking-tight">
                  ${fmt(results.savingsRange.annualLow)}&thinsp;–&thinsp;${fmt(results.savingsRange.annualHigh)}
                </p>
                <p className="text-white/35 text-[11px] mt-1">per year</p>
              </div>
            </div>
            <div className="px-6 pb-5">
              <p className="text-white/35 text-[11px] leading-relaxed">
                This is a directional range, not a guaranteed reduction. A full review will produce a more
                accurate picture specific to your tools and contracts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Recommended areas ── */}
      {results.recommendations.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#4B5B6B] mb-3">
            Areas worth reviewing
          </p>
          <div className="space-y-2.5">
            {results.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex gap-3.5 bg-white border border-[#D7E1EA] rounded-xl px-5 py-4"
              >
                <span className="w-5 h-5 rounded-full bg-[#DCEAF7] text-[#1F5E95] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0E2F54] mb-0.5 leading-snug">
                    {rec.title}
                  </p>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── What's next / CTA ── */}
      <div className="rounded-xl border border-[#D7E1EA] overflow-hidden">
        {reportRequested ? (
          <div className="bg-[#F7F5F1] px-6 py-8 text-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9l4.5 4.5 7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-base font-semibold text-[#0E2F54] mb-1.5">
              Results sent.
            </p>
            <p className="text-sm text-[#4B5B6B] mb-6 max-w-sm mx-auto leading-relaxed">
              We will follow up at <span className="text-[#0E2F54] font-medium">{company.workEmail}</span> within
              one business day to walk through your findings.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
            >
              Schedule a Free Cost Analysis →
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-[#0E2F54] px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-0.5">
                Next step
              </p>
              <p className="text-base font-heading font-bold text-white leading-snug">
                Get a real look at your environment.
              </p>
            </div>

            <div className="bg-[#F7F5F1] px-6 py-5">
              <p className="text-sm text-[#4B5B6B] leading-relaxed mb-5">
                A Grand Strand Ally consultant will review your actual tools, contracts, and setup —
                and walk you through specific findings and practical next steps. No obligation and no
                long-term commitment required.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-6 rounded-lg transition-colors sm:flex-1"
                >
                  Schedule a Free Cost Analysis →
                </Link>
                <button
                  type="button"
                  onClick={handleGetReport}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#DCEAF7] disabled:opacity-60 text-[#0E2F54] font-semibold text-sm h-11 px-6 rounded-lg border border-[#D7E1EA] hover:border-[#60B8F0] transition-colors"
                >
                  {submitting ? "Sending…" : "Email my results"}
                </button>
              </div>

              <p className="text-xs text-[#4B5B6B]/70 mt-3 leading-relaxed">
                "Email my results" sends a summary of this analysis to {company.workEmail}. We will
                follow up within one business day.
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Assumptions accordion ── */}
      <AssumptionsAccordion adminHourlyRate={adminHourlyRate} />

      {/* ── Back link ── */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#4B5B6B] hover:text-[#0E2F54] h-10 px-3 rounded-lg border border-[#D7E1EA] hover:border-[#0E2F54] transition-colors"
        >
          ← Revise answers
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SpendCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-[#D7E1EA] rounded-xl px-5 py-5 border-t-4 border-t-[#0E2F54]">
      <p className="text-xs font-semibold text-[#4B5B6B] uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#0E2F54] tracking-tight">{value}</p>
      <p className="text-xs text-[#4B5B6B] mt-1">{sub}</p>
    </div>
  );
}

function ScoreCard({
  title,
  level,
  badge,
  description,
}: {
  title: string;
  level: string;
  badge: React.ReactNode;
  description: string;
}) {
  const borderClass = levelBorderClass[level] ?? "border-l-[#D7E1EA]";
  return (
    <div
      className={`bg-white border border-[#D7E1EA] border-l-4 rounded-xl px-5 py-5 space-y-3 ${borderClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#0E2F54]">{title}</p>
        {badge}
      </div>
      <p className="text-sm text-[#4B5B6B] leading-relaxed">{description}</p>
    </div>
  );
}
