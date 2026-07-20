import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REVIEW_BOOKING_URL } from "@/lib/content/follow-up";
import { conversionDataAttribute } from "@/lib/analytics/events";

export function ResultsCTA({
  companyName,
}: {
  companyName: string;
  selectedPlan?: string | null;
  suggestedTier?: string | null;
}) {
  return (
    <section className="report-cta rounded-3xl overflow-hidden border border-brand-navy/10 shadow-card-md">
      <div className="bg-gradient-to-br from-brand-navy via-brand-dark to-brand-hero px-6 py-10 md:px-10 md:py-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-3">
          Ready for the next step?
        </p>
        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white max-w-2xl">
          Walk through your assessment with us
        </h2>
        <p className="mt-4 text-sm md:text-[15px] text-white/75 leading-relaxed max-w-2xl">
          A short review call is the easiest way to understand what stood out for {companyName} —
          and whether the $99 Website Refresh is the right next step.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={REVIEW_BOOKING_URL}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-navy font-heading font-semibold px-6 py-3.5 text-sm hover:bg-brand-cream transition-colors"
            {...conversionDataAttribute("review_book_clicked")}
          >
            Book My Review
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/25 text-white font-heading font-semibold px-6 py-3.5 text-sm hover:bg-white/10 transition-colors"
          >
            See the $99 refresh
          </Link>
        </div>
      </div>
    </section>
  );
}
