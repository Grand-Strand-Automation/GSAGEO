import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPlanLabel } from "@/lib/brand/plans";

export function ResultsCTA({
  companyName,
  selectedPlan,
  suggestedTier,
}: {
  companyName: string;
  selectedPlan: string | null;
  suggestedTier: string | null;
}) {
  const planLabel = selectedPlan ? formatPlanLabel(selectedPlan) : suggestedTier;

  return (
    <section className="report-cta rounded-3xl overflow-hidden border border-brand-navy/10 shadow-card-md">
      <div className="bg-gradient-to-br from-brand-navy via-brand-dark to-brand-hero px-6 py-10 md:px-10 md:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">
          Recommended next step
        </p>
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white max-w-2xl">
          Want help making these improvements?
        </h2>
        <p className="mt-4 text-sm md:text-[15px] text-white/75 leading-relaxed max-w-2xl">
          {planLabel
            ? `We can help you tackle the priorities in this report — starting with ${planLabel.toLowerCase()} if that fits your goals.`
            : "We can help you improve the pages flagged in this report, one practical step at a time."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`mailto:shawn@gsally.com?subject=GEO implementation help — ${encodeURIComponent(companyName)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-navy font-heading font-semibold px-6 py-3.5 text-sm hover:bg-brand-cream transition-colors"
          >
            Get help with this
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/audit"
            className="inline-flex items-center justify-center rounded-xl border border-white/25 text-white font-heading font-semibold px-6 py-3.5 text-sm hover:bg-white/10 transition-colors"
          >
            View service options
          </Link>
        </div>
      </div>
    </section>
  );
}
