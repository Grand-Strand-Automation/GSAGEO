"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { REVIEW_BOOKING_URL, THANK_YOU } from "@/lib/content/follow-up";
import { CUSTOMER_STATUS_COPY } from "@/lib/results/customer-state";
import { trackConversionEvent } from "@/lib/analytics/events";
import { useCustomerReportStatus } from "./useCustomerReportStatus";

export function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const resultsHref = token ? `/results/${encodeURIComponent(token)}` : "";
  const { status, loading } = useCustomerReportStatus(token, Boolean(token));

  useEffect(() => {
    if (status?.ready && token) {
      router.prefetch(resultsHref);
    }
  }, [status?.ready, token, resultsHref, router]);

  const state = status?.state ?? "pending";
  const copy = CUSTOMER_STATUS_COPY[state];
  const isWaiting = state === "pending" || state === "processing" || state === "awaiting_review";

  return (
    <div className="flex flex-col min-h-[80vh] bg-brand-cream pt-20 pb-16 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center card-brand p-8 md:p-10 shadow-card-md">
          <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
            {loading && isWaiting ? (
              <Loader2 size={30} className="animate-spin" />
            ) : (
              <CheckCircle2 size={30} />
            )}
          </div>

          <span className="eyebrow-pill-gold-blue mb-5 inline-flex">
            {THANK_YOU.eyebrow}
          </span>

          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">
            {status?.ready ? copy.title : THANK_YOU.headline}
          </h1>

          <p className="text-brand-muted text-base md:text-[15px] leading-relaxed max-w-lg mx-auto">
            {status?.ready ? copy.body : THANK_YOU.supportCopy}
          </p>

          {status?.companyName ? (
            <p className="mt-3 text-sm text-brand-navy font-semibold">{status.companyName}</p>
          ) : null}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonLink
              href={REVIEW_BOOKING_URL}
              variant="gold"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => trackConversionEvent("thank_you_book_review_clicked")}
            >
              {THANK_YOU.primaryCta} →
            </ButtonLink>
            {resultsHref ? (
              <ButtonLink href={resultsHref} variant="secondaryLight" size="md" className="w-full sm:w-auto">
                {status?.ready ? "View your report →" : `${copy.ctaLabel} →`}
              </ButtonLink>
            ) : null}
          </div>

          <p className="mt-5 text-xs text-brand-subtle">{THANK_YOU.reassurance}</p>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {THANK_YOU.whatHappensNext.map((step, index) => (
            <div
              key={step}
              className="rounded-xl border border-brand-border bg-white p-4 text-left shadow-card"
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-blue mb-2">
                Step {index + 1}
              </p>
              <p className="text-sm text-brand-muted leading-snug">{step}</p>
            </div>
          ))}
        </div>

        {token ? (
          <div className="mt-8 rounded-xl border border-brand-border bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase text-brand-blue tracking-wide mb-2">
              Current status
            </p>
            <p className="text-sm font-semibold text-brand-navy">{copy.title}</p>
            <p className="text-sm text-brand-muted mt-1 mb-3">{copy.body}</p>
            <Link
              href={resultsHref}
              className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:underline"
            >
              {copy.ctaLabel} <ExternalLink size={14} />
            </Link>
            {isWaiting ? (
              <p className="text-xs text-brand-subtle mt-4 inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-brand-blue" />
                This page updates automatically while your assessment is being prepared.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center text-center">
          <Link
            href={THANK_YOU.secondaryHref}
            className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            {THANK_YOU.secondaryCta}
            <ArrowRight size={14} />
          </Link>
          <Link
            href={THANK_YOU.tertiaryHref}
            className="text-sm font-semibold text-brand-muted hover:text-brand-navy"
          >
            {THANK_YOU.tertiaryCta}
          </Link>
        </div>

        <p className="mt-8 text-xs text-brand-subtle text-center inline-flex items-center gap-1.5 justify-center w-full">
          <Mail size={13} />
          Questions?{" "}
          <a href="mailto:shawn@gsally.com" className="text-brand-blue hover:underline">
            shawn@gsally.com
          </a>
        </p>
      </div>
    </div>
  );
}
