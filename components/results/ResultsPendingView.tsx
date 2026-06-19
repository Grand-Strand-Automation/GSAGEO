import Link from "next/link";
import type { CustomerResultsState } from "@/lib/results/access";

const COPY: Record<
  CustomerResultsState,
  { title: string; body: string; tone?: "error" | "info" }
> = {
  pending: {
    title: "Your audit is queued",
    body: "We received your request and your automated site review will begin shortly. Refresh this page in a few minutes.",
  },
  processing: {
    title: "Your audit is in progress",
    body: "We are analyzing your site structure, sitemap, and key pages. This usually takes a few minutes.",
  },
  awaiting_review: {
    title: "Your audit is being finalized",
    body: "Our team is reviewing your results before they are published. You will be able to view the full report here once ready.",
  },
  ready: {
    title: "Your results are ready",
    body: "Loading…",
  },
  failed: {
    title: "We could not complete your audit",
    body: "Something went wrong during the automated review. Our team has been notified—please email shawn@gsally.com and we will follow up manually.",
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
    <div className="bg-brand-cream min-h-screen pt-24 pb-16 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="card-brand p-8 md:p-10 shadow-card-md text-center">
          {isWaiting ? (
            <div className="w-12 h-12 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          ) : null}
          <p className="text-xs font-bold uppercase tracking-wide text-brand-blue mb-2">
            GEO Audit Results
          </p>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy mb-4">
            {copy.title}
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-md mx-auto ${copy.tone === "error" ? "text-red-700" : "text-brand-muted"}`}
          >
            {copy.body}
          </p>
          {isWaiting ? (
            <p className="text-xs text-brand-subtle mt-6">
              <Link href={`/results/${encodeURIComponent(token)}`} className="text-brand-blue hover:underline">
                Refresh this page
              </Link>{" "}
              to check again.
            </p>
          ) : null}
          <div className="mt-8">
            <Link href="/" className="text-sm text-brand-blue hover:underline">
              ← Back to GEO home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
