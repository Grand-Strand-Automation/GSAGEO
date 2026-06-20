import Link from "next/link";
import {
  AlertCircle,
  Clock3,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { CustomerResultsState } from "@/lib/results/access";

const COPY: Record<
  CustomerResultsState,
  { title: string; body: string; tone?: "error" | "waiting" | "info" }
> = {
  pending: {
    title: "Your audit is queued",
    body: "We received your request and your automated site review will begin shortly. Most reviews finish within a few minutes.",
    tone: "waiting",
  },
  processing: {
    title: "Your audit is in progress",
    body: "We are analyzing your site structure, sitemap, and key pages. This usually takes one to three minutes.",
    tone: "waiting",
  },
  awaiting_review: {
    title: "Your audit is being finalized",
    body: "Our team is reviewing your results before they are published. You will be able to view the full report here once ready.",
    tone: "info",
  },
  ready: {
    title: "Your results are ready",
    body: "Loading your report…",
    tone: "info",
  },
  failed: {
    title: "We could not complete your audit",
    body: "Something went wrong during the automated review. Please email shawn@gsally.com and we will follow up manually with your results.",
    tone: "error",
  },
  expired: {
    title: "This results link has expired",
    body: "Please contact shawn@gsally.com for a refreshed link.",
    tone: "error",
  },
  revoked: {
    title: "This results link is no longer valid",
    body: "Please contact shawn@gsally.com if you need access.",
    tone: "error",
  },
};

function StateIcon({ state }: { state: CustomerResultsState }) {
  if (state === "failed" || state === "expired" || state === "revoked") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={28} />
      </div>
    );
  }
  if (state === "awaiting_review") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-6">
        <ShieldCheck size={28} />
      </div>
    );
  }
  if (state === "processing" || state === "pending") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-6">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-16 h-16 rounded-2xl bg-brand-cream text-brand-muted flex items-center justify-center mx-auto mb-6">
      <Clock3 size={28} />
    </div>
  );
}

export function ResultsPendingView({
  state,
  token,
}: {
  state: CustomerResultsState;
  token: string;
}) {
  const copy = COPY[state] ?? COPY.pending;
  const isWaiting = state === "pending" || state === "processing" || state === "awaiting_review";

  return (
    <div className="report-page bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="report-pending-card rounded-3xl border border-brand-border bg-white shadow-card-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue" />
          <div className="p-8 md:p-12 text-center">
            <StateIcon state={state} />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-3">
              GEO Audit Report
            </p>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy mb-4">
              {copy.title}
            </h1>
            <p
              className={`text-sm md:text-[15px] leading-relaxed max-w-md mx-auto ${
                copy.tone === "error" ? "text-red-700" : "text-brand-muted"
              }`}
            >
              {copy.body}
            </p>

            {isWaiting ? (
              <div className="mt-8 rounded-2xl border border-brand-border bg-brand-cream/70 p-5 text-left max-w-md mx-auto">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-subtle mb-3">
                  While you wait
                </p>
                <ul className="space-y-2 text-sm text-brand-muted">
                  <li className="flex items-start gap-2">
                    <RefreshCw size={14} className="mt-0.5 shrink-0 text-brand-blue" />
                    Refresh this page in a minute to check progress
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="mt-0.5 shrink-0 text-brand-blue" />
                    Your private link remains the same — bookmark it for later
                  </li>
                </ul>
              </div>
            ) : null}

            {isWaiting ? (
              <Link
                href={`/results/${encodeURIComponent(token)}`}
                className="inline-flex items-center justify-center mt-8 rounded-xl bg-brand-blue text-white font-heading font-semibold px-6 py-3 text-sm hover:bg-brand-blue-hover transition-colors"
              >
                Refresh report status
              </Link>
            ) : null}

            <div className="mt-8">
              <Link href="/" className="text-sm text-brand-blue hover:underline">
                ← Back to GEO home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
