import Link from "next/link";
import type { ResultsBundle } from "@/lib/types/database";
import { formatPlanLabel } from "@/lib/brand/plans";

type Strength = { title: string; summary: string; evidence_urls?: string[] };
type Opportunity = {
  label: string;
  status: string;
  summary: string;
  recommendation: string;
  priority: string;
};

export function CustomerResultsView({ bundle, token }: { bundle: ResultsBundle; token: string }) {
  const { submission, result, previews } = bundle;
  const scorecard = result?.scorecard_json as {
    overall?: number;
    overallGrade?: string;
    categories?: Record<string, { score: number; grade: string; label: string }>;
  } | null;
  const strengths = (result?.strengths_json ?? []) as Strength[];
  const nextSteps = result?.next_step_json as {
    suggestedTier?: string;
    topOpportunities?: Opportunity[];
  } | null;
  const opportunities = nextSteps?.topOpportunities ?? [];

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-16">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto space-y-8">
        <header className="text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-blue mb-2">
            Private audit results
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-2">
            {submission.company_name}
          </h1>
          <p className="text-sm text-brand-muted">{submission.website_url}</p>
          {scorecard?.overall != null && (
            <p className="mt-4 text-lg font-heading font-bold text-brand-navy">
              AI visibility readiness: {scorecard.overall}/100 ({scorecard.overallGrade})
            </p>
          )}
        </header>

        {result?.executive_summary && (
          <section className="card-brand p-6 md:p-8 shadow-card-md">
            <h2 className="text-xs font-bold uppercase text-brand-blue mb-3">Executive summary</h2>
            <p className="text-sm text-brand-muted leading-relaxed">{result.executive_summary}</p>
          </section>
        )}

        {strengths.length > 0 && (
          <section className="card-brand p-6 md:p-8 shadow-card-md">
            <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Strengths detected</h2>
            <ul className="space-y-4">
              {strengths.map((s) => (
                <li key={s.title} className="border-l-2 border-brand-blue pl-4">
                  <p className="font-semibold text-brand-navy text-sm">{s.title}</p>
                  <p className="text-sm text-brand-muted mt-1">{s.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {opportunities.length > 0 && (
          <section className="card-brand p-6 md:p-8 shadow-card-md">
            <h2 className="text-xs font-bold uppercase text-brand-blue mb-4">Priority opportunities</h2>
            <ul className="space-y-4">
              {opportunities.map((o) => (
                <li key={o.label} className="rounded-lg border border-brand-border p-4 bg-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-brand-navy text-sm">{o.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cream text-brand-muted">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted">{o.summary}</p>
                  <p className="text-sm text-brand-navy mt-2">{o.recommendation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {previews.length > 0 && (
          <section className="card-brand p-6 md:p-8 shadow-card-md">
            <h2 className="text-xs font-bold uppercase text-brand-blue mb-2">
              What the fixes could look like
            </h2>
            <p className="text-sm text-brand-muted mb-6">
              Example implementation previews — not guaranteed final copy. One practical way these
              improvements could be structured.
            </p>
            <div className="space-y-6">
              {previews.map((p) => (
                <article key={p.id} className="rounded-xl border border-brand-border bg-white p-5">
                  <p className="text-xs font-bold uppercase text-brand-subtle mb-1">{p.type.replace("_", " ")}</p>
                  <h3 className="font-heading font-bold text-brand-navy mb-2">{p.title}</h3>
                  <p className="text-sm text-brand-muted mb-2">
                    <strong className="text-brand-navy">Issue:</strong> {p.issue_summary}
                  </p>
                  <p className="text-sm text-brand-muted mb-4">
                    <strong className="text-brand-navy">Why it matters:</strong> {p.why_it_matters}
                  </p>
                  {p.before_text ? (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase text-brand-subtle mb-1">Before (example)</p>
                      <p className="text-sm text-brand-muted italic">{p.before_text}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-xs font-bold uppercase text-brand-subtle mb-1">
                      Example improvement
                    </p>
                    <pre className="text-sm text-brand-navy whitespace-pre-wrap font-sans bg-brand-cream rounded-lg p-4 border border-brand-border">
                      {p.after_text}
                    </pre>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="card-brand p-6 md:p-8 shadow-card-md bg-brand-navy text-white">
          <h2 className="text-xs font-bold uppercase text-white/60 mb-3">Recommended next steps</h2>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            {nextSteps?.suggestedTier
              ? `Based on this review, a good fit may be ${formatPlanLabel(submission.selected_plan) || nextSteps.suggestedTier}.`
              : "We can help implement these improvements or monitor progress month to month."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`mailto:shawn@gsally.com?subject=GEO audit follow-up — ${encodeURIComponent(submission.company_name)}`}
              className="inline-flex items-center justify-center bg-white text-brand-navy font-heading font-semibold px-5 py-3 rounded-lg text-sm hover:bg-brand-cream"
            >
              Request implementation help →
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center border border-white/30 text-white font-heading font-semibold px-5 py-3 rounded-lg text-sm hover:bg-white/10"
            >
              Explore plans
            </Link>
          </div>
        </section>

        <p className="text-center text-xs text-brand-subtle">
          Private link — do not share publicly.{" "}
          <Link href="/" className="text-brand-blue hover:underline">
            GEO home
          </Link>
        </p>
      </div>
    </div>
  );
}
