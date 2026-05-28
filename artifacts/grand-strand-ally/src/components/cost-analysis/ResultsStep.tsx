import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ResultsOutput, CompanyValues } from "@/lib/cost-analysis-types";
import { ScoreBadge } from "./ScoreBadge";

interface Props {
  results: ResultsOutput;
  company: CompanyValues;
  onBack: () => void;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function AssumptionsAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#D7E1EA] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#F7F5F1] hover:bg-[#DCEAF7] text-left transition-colors"
      >
        <span className="text-sm font-semibold text-[#0E2F54]">
          How we estimate this
        </span>
        {open ? (
          <ChevronUp size={16} className="text-[#4B5B6B] shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#4B5B6B] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white space-y-3 text-sm text-[#4B5B6B] leading-relaxed">
          <p>
            <strong className="text-[#0E2F54]">Spend total:</strong> The sum of all monthly costs you entered, plus an estimate for internal administrative time valued at $45 per hour.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Overlap risk:</strong> A weighted score based on your answers about duplicate tools, manual processes, and licensing clarity. A higher score suggests more opportunity to reduce waste.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Compliance and control:</strong> A weighted score based on documented processes, multi-factor authentication coverage, backup ownership, and access management. A higher score indicates more gaps worth reviewing.
          </p>
          <p>
            <strong className="text-[#0E2F54]">Savings range:</strong> Derived from your overlap level as a percentage of your estimated monthly spend. Low overlap environments typically show 6–12% opportunity; high overlap environments can show 18–28%. These are directional estimates only.
          </p>
          <p className="border-t border-[#D7E1EA] pt-3 text-xs">
            This analysis is based entirely on your inputs and uses industry-typical estimates. It is not an audit, a guarantee, or a final recommendation. A real review with a Grand Strand Ally consultant will produce a more accurate picture.
          </p>
        </div>
      )}
    </div>
  );
}

export function ResultsStep({ results, company, onBack }: Props) {
  const [reportRequested, setReportRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleGetReport() {
    setSubmitting(true);

    // TODO: Connect to email/CRM service here.
    // Example: await fetch('/api/cost-analysis-report', {
    //   method: 'POST',
    //   body: JSON.stringify({ company, results }),
    // });
    // Compatible with Resend, Formspree, Airtable, or any REST endpoint.

    console.log("[Cost Analysis] Report requested:", { company, results });

    setTimeout(() => {
      setSubmitting(false);
      setReportRequested(true);
    }, 800);
  }

  const hasSpend = results.spend.monthly > 0;

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-xl font-heading font-bold text-[#0E2F54] mb-1">
          Your information technology cost analysis
        </h3>
        <p className="text-sm text-[#4B5B6B]">
          Based on your inputs, here is a directional view of your current spend, areas of likely overlap, and control gaps worth reviewing.
        </p>
      </div>

      {/* ── Spend summary ── */}
      {hasSpend ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Estimated monthly spend"
            value={`$${fmt(results.spend.monthly)}`}
            sub="per month"
          />
          <StatCard
            label="Estimated annual spend"
            value={`$${fmt(results.spend.annual)}`}
            sub="per year"
          />
        </div>
      ) : (
        <div className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl px-5 py-4">
          <p className="text-sm text-[#4B5B6B]">
            No monthly costs were entered. Overlap and compliance findings still apply.
          </p>
        </div>
      )}

      {/* ── Scores ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScoreCard
          title="Overlap risk"
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

      {/* ── Savings range ── */}
      {hasSpend && (
        <div className="bg-[#0E2F54] rounded-xl px-5 py-5">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
            Estimated savings opportunity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-xs mb-1">Monthly</p>
              <p className="text-white font-bold text-2xl">
                ${fmt(results.savingsRange.monthlyLow)} – ${fmt(results.savingsRange.monthlyHigh)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Annual</p>
              <p className="text-white font-bold text-2xl">
                ${fmt(results.savingsRange.annualLow)} – ${fmt(results.savingsRange.annualHigh)}
              </p>
            </div>
          </div>
          <p className="text-white/45 text-xs mt-4 leading-relaxed">
            This range is directional and based on the overlap level identified above. It represents the estimated opportunity, not a guaranteed reduction. A full review will produce a more accurate picture.
          </p>
        </div>
      )}

      {/* ── Recommendations ── */}
      {results.recommendations.length > 0 && (
        <div>
          <h4 className="text-base font-heading font-bold text-[#0E2F54] mb-4">
            Recommended areas to review
          </h4>
          <div className="space-y-3">
            {results.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex gap-4 bg-white border border-[#D7E1EA] rounded-xl px-5 py-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#DCEAF7] text-[#1F5E95] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0E2F54] mb-0.5">{rec.title}</p>
                  <p className="text-sm text-[#4B5B6B] leading-relaxed">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Assumptions accordion ── */}
      <AssumptionsAccordion />

      {/* ── Lead capture / CTA ── */}
      <div className="bg-[#F7F5F1] border border-[#D7E1EA] rounded-xl px-5 py-6">
        {reportRequested ? (
          <div className="text-center py-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9l4.5 4.5 7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#0E2F54] mb-1">
              Your report request was received.
            </p>
            <p className="text-sm text-[#4B5B6B] mb-4">
              We will follow up at {company.workEmail} within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-7 rounded-lg transition-colors"
            >
              Book a Free Cost Analysis
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-[#0E2F54] mb-1">
              Want a full review of your environment?
            </p>
            <p className="text-sm text-[#4B5B6B] mb-5">
              A Grand Strand Ally consultant will review your actual tools, costs, and setup — and walk you through specific findings and practical next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleGetReport}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 bg-[#1F5E95] hover:bg-[#1a5080] disabled:opacity-60 text-white font-semibold text-sm h-11 px-6 rounded-lg transition-colors"
              >
                {submitting ? "Sending…" : "Get My Full Report"}
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#0E2F54] hover:bg-[#0A2440] text-white font-semibold text-sm h-11 px-6 rounded-lg transition-colors"
              >
                Book a Free Cost Analysis
              </Link>
            </div>
            <p className="text-xs text-[#4B5B6B] mt-3">
              "Get My Full Report" sends your results summary to {company.workEmail}. No obligation.
            </p>
          </>
        )}
      </div>

      <div className="flex justify-start pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#4B5B6B] hover:text-[#0E2F54] h-11 px-4 rounded-lg border border-[#D7E1EA] hover:border-[#0E2F54] transition-colors"
        >
          ← Revise answers
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-[#D7E1EA] rounded-xl px-5 py-5">
      <p className="text-xs text-[#4B5B6B] mb-2">{label}</p>
      <p className="text-2xl font-bold text-[#0E2F54]">{value}</p>
      <p className="text-xs text-[#4B5B6B] mt-0.5">{sub}</p>
    </div>
  );
}

function ScoreCard({
  title,
  badge,
  description,
}: {
  title: string;
  badge: React.ReactNode;
  description: string;
}) {
  return (
    <div className="bg-white border border-[#D7E1EA] rounded-xl px-5 py-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#0E2F54]">{title}</p>
        {badge}
      </div>
      <p className="text-sm text-[#4B5B6B] leading-relaxed">{description}</p>
    </div>
  );
}
