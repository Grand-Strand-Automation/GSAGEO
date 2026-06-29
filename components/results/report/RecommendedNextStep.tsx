import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BRIDGE_OFFERS, REVIEW_BOOKING_URL, type BridgeOfferId } from "@/lib/content/follow-up";
import { conversionDataAttribute } from "@/lib/analytics/events";

export function RecommendedNextStep({
  offerId,
  companyName,
}: {
  offerId: BridgeOfferId;
  companyName: string;
}) {
  const offer = BRIDGE_OFFERS[offerId] ?? BRIDGE_OFFERS["visibility-growth"];
  const primaryHref =
    "ctaHref" in offer && offer.ctaHref ? offer.ctaHref : REVIEW_BOOKING_URL;

  return (
    <section className="rounded-3xl border border-brand-border bg-white p-6 md:p-8 shadow-card-md">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-3">
        Recommended next step
      </p>
      <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy">
        {offer.name}
      </h2>
      <p className="mt-3 text-sm md:text-[15px] text-brand-muted leading-relaxed">
        {offer.summary}
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-brand-border bg-brand-cream/40 p-4 md:p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-3">
            What&apos;s included
          </p>
          <ul className="space-y-2">
            {offer.includes.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-brand-muted leading-snug">
                <CheckCircle2 size={16} className="text-brand-blue shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-2">
              Expected outcome
            </p>
            <p className="text-sm text-brand-muted leading-relaxed">{offer.outcome}</p>
            <p className="mt-4 text-xs text-brand-subtle">{offer.timeline}</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue text-white font-heading font-semibold px-5 py-3 text-sm hover:bg-brand-blue-hover transition-colors"
              {...conversionDataAttribute("review_book_clicked")}
            >
              {offer.ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`mailto:shawn@gsally.com?subject=${encodeURIComponent(`${offer.name} — ${companyName}`)}`}
              className="inline-flex items-center justify-center rounded-xl border border-brand-border text-brand-navy font-heading font-semibold px-5 py-3 text-sm hover:bg-brand-cream transition-colors"
            >
              Email us about this
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
