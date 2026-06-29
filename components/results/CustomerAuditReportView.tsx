import Link from "next/link";
import type { ResultsBundle } from "@/lib/types/database";
import { buildCustomerReportViewModel } from "@/lib/results/customer-report-view-model";
import { SectionShell } from "./report/SectionShell";
import { CustomerReportHero } from "./report/CustomerReportHero";
import { CustomerSimpleScorecard } from "./report/CustomerSimpleScorecard";
import { CustomerPriorityCard } from "./report/CustomerPriorityCard";
import { CustomerFixExampleCard } from "./report/CustomerFixExampleCard";
import { ReportActionBar } from "./report/ReportActionBar";
import { ResultsCTA } from "./report/ResultsCTA";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function CustomerAuditReportView({
  bundle,
  shareToken,
}: {
  bundle: ResultsBundle;
  shareToken?: string;
}) {
  const report = buildCustomerReportViewModel(bundle);

  return (
    <div className="report-page bg-brand-cream min-h-screen pt-24 pb-20">
      <div className="container px-4 md:px-6 max-w-3xl">
        <div className="space-y-10 md:space-y-14">
          {shareToken ? <ReportActionBar token={shareToken} companyName={report.companyName} /> : null}

          <CustomerReportHero report={report} />

          <SectionShell
            eyebrow="Strengths"
            title="What looks good"
            description="A quick look at what is already working on your site."
          >
            <ul className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 md:p-6 space-y-3">
              {report.whatLooksGood.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-navy leading-relaxed">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionShell>

          <SectionShell
            eyebrow="Gaps"
            title="What needs improvement"
            description="The main areas where your site could be clearer or more complete."
          >
            <ul className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 md:p-6 space-y-3">
              {report.whatNeedsImprovement.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-navy leading-relaxed">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionShell>

          <SectionShell
            eyebrow="Why it matters"
            title="What this may affect"
            description="A practical way to think about these gaps."
          >
            <p className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 text-sm md:text-[15px] text-brand-muted leading-relaxed shadow-card">
              {report.whatThisMayAffect}
            </p>
          </SectionShell>

          <div id="scorecard">
            <SectionShell
              eyebrow="At a glance"
              title="How your site stacks up"
              description="A simple view of the main areas we reviewed — no technical scoring."
            >
              <CustomerSimpleScorecard rows={report.scorecard} />
            </SectionShell>
          </div>

          <div id="priorities">
            <SectionShell
              eyebrow="Focus here first"
              title="Top priorities"
              description="The three most important improvements to consider first."
            >
              <div className="space-y-4">
                {report.topPriorities.length > 0 ? (
                  report.topPriorities.map((priority, index) => (
                    <CustomerPriorityCard key={priority.title} priority={priority} rank={index + 1} />
                  ))
                ) : (
                  <p className="text-sm text-brand-muted">
                    No major priority gaps were flagged in this review.
                  </p>
                )}
              </div>
            </SectionShell>
          </div>

          {report.fixExamples.length > 0 ? (
            <div id="examples">
              <SectionShell
                eyebrow="Ideas"
                title="Simple improvement ideas"
                description="Plain-language examples of what stronger content could look like."
              >
                <div className="space-y-4">
                  {report.fixExamples.map((example) => (
                    <CustomerFixExampleCard key={example.title} example={example} />
                  ))}
                </div>
              </SectionShell>
            </div>
          ) : null}

          <section className="rounded-3xl border border-brand-border bg-white p-6 md:p-8 shadow-card-md">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue mb-3">
              Next best step
            </p>
            <h2 className="text-2xl font-heading font-extrabold text-brand-navy">
              Start with one high-impact improvement
            </h2>
            <p className="mt-4 text-sm md:text-[15px] text-brand-muted leading-relaxed">
              {report.nextBestStep}
            </p>
          </section>

          <ResultsCTA
            companyName={report.companyName}
            selectedPlan={bundle.submission.selected_plan}
            suggestedTier={report.suggestedTier}
          />

          <p className="text-center text-xs text-brand-subtle pt-2">
            Private report — do not share publicly.{" "}
            <Link href="/" className="text-brand-blue hover:underline">
              GEO home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
