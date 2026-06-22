"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CUSTOMER_STATUS_COPY } from "@/lib/results/customer-state";
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
    <div className="flex flex-col min-h-[80vh] bg-brand-cream items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-lg w-full text-center card-brand p-10 shadow-card-md">
        <div className="w-16 h-16 bg-brand-blue-light text-brand-blue rounded-full flex items-center justify-center mx-auto mb-7">
          {loading && isWaiting ? (
            <Loader2 size={30} className="animate-spin" />
          ) : status?.ready ? (
            <Sparkles size={30} />
          ) : (
            <CheckCircle2 size={30} />
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-3">
          {status?.ready ? "Report ready" : "Submission received"}
        </p>

        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">
          {status?.ready ? copy.title : "We received your request."}
        </h1>

        <p className="text-brand-muted text-[15px] leading-relaxed mb-3 max-w-sm mx-auto">
          {status?.ready
            ? copy.body
            : "Your GEO audit request has been saved. We started preparing your private report — use the link below to check status or open the full report when it is ready."}
        </p>

        {status?.companyName ? (
          <p className="text-sm text-brand-navy font-semibold">{status.companyName}</p>
        ) : null}

        {token ? (
          <div className="mt-8 p-4 bg-brand-cream rounded-xl border border-brand-border text-left">
            <p className="text-xs font-bold uppercase text-brand-blue tracking-wide mb-2">
              Current status
            </p>
            <p className="text-sm font-semibold text-brand-navy mb-1">{copy.title}</p>
            <p className="text-sm text-brand-muted mb-4">{copy.body}</p>
            <Link
              href={resultsHref}
              className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:underline"
            >
              {copy.ctaLabel} <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          <p className="mt-6 text-sm text-brand-muted">
            If you arrived here without a private link, please contact shawn@gsally.com.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          {resultsHref ? (
            <ButtonLink href={resultsHref} size="md">
              {status?.ready ? "View your report →" : `${copy.ctaLabel} →`}
            </ButtonLink>
          ) : null}
          <ButtonLink href="/" size="md" variant={resultsHref ? "secondaryLight" : "primary"}>
            Return to GEO Home
          </ButtonLink>
        </div>

        {isWaiting && token ? (
          <p className="text-xs text-brand-subtle mt-6">
            This page updates automatically while your audit is being prepared.
          </p>
        ) : null}

        <p className="text-xs text-brand-subtle mt-6">
          Questions?{" "}
          <a href="mailto:shawn@gsally.com" className="text-brand-blue hover:underline">
            shawn@gsally.com
          </a>
        </p>
      </div>
    </div>
  );
}
