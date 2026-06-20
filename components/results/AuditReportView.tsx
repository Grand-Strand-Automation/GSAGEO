import Link from "next/link";
import type { ResultsBundle } from "@/lib/types/database";
import { buildReportViewModel } from "@/lib/results/report-view-model";
import { ReportHero } from "./report/ReportHero";
import { StatCard } from "./report/StatCard";
import { SectionShell } from "./report/SectionShell";
import { ScorecardGrid } from "./report/ScorecardGrid";
import { CategoryScoreChart, CoverageSummaryChart } from "./report/CategoryScoreChart";
import { RecommendationCard, FindingCard } from "./report/FindingCard";
import { PageAnalysisCard } from "./report/PageAnalysisCard";
import { FixPreviewCard } from "./report/FixPreviewCard";
import { RoadmapSection } from "./report/RoadmapSection";
import { ResultsCTA } from "./report/ResultsCTA";
import { ReportNav, ReportNavMobile } from "./report/ReportNav";

export function AuditReportView({
  bundle,
  showAdminBanner = false,
  embedded = false,
  footerNote,
}: {
  bundle: ResultsBundle;
  showAdminBanner?: boolean;
  embedded?: boolean;
  footerNote?: React.ReactNode;
}) {
  const report = buildReportViewModel({
    submission: bundle.submission,
    job: bundle.job,
    result: bundle.result,
    previews: bundle.previews,
  });

  const categoryLabels = Object.keys(report.findingsByCategory);

  return (
    <div className={embedded ? "report-page bg-brand-cream pb-20" : "report-page bg-brand-cream min-h-screen pt-24 pb-20"}>
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="grid xl:grid-cols-[1fr_13rem] gap-8 xl:gap-10 items-start">
          <div className="min-w-0 space-y-10 md:space-y-14">
            <ReportHero report={report} showAdminBanner={showAdminBanner} />
            <ReportNavMobile />

            <div id="summary">
              <SectionShell
                eyebrow="At a glance"
                title="Quick visual summary"
                description="The most important signals from your automated GEO / AI visibility review."
              >
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                  {report.quickStats.map((stat) => (
                    <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} />
                  ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-5 md:gap-6 mt-6">
                  <CoverageSummaryChart
                    strengths={report.strengths.length}
                    opportunities={report.opportunities.length}
                    cautions={report.cautionFindings.length}
                  />
                  <div className="rounded-2xl border border-brand-border bg-white p-5 md:p-6 shadow-card-md">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-subtle mb-3">
                      Audit snapshot
                    </p>
                    <ul className="space-y-3 text-sm text-brand-muted">
                      <li>
                        <span className="font-semibold text-brand-navy">Prepared for:</span>{" "}
                        {report.preparedFor}
                      </li>
                      <li>
                        <span className="font-semibold text-brand-navy">Website:</span> {report.websiteUrl}
                      </li>
                      <li>
                        <span className="font-semibold text-brand-navy">Sitemap URLs discovered:</span>{" "}
                        {report.sitemapUrlCount}
                      </li>
                      <li>
                        <span className="font-semibold text-brand-navy">Overall interpretation:</span>{" "}
                        {report.overallInterpretation}
                      </li>
                    </ul>
                  </div>
                </div>
              </SectionShell>
            </div>

            <div id="scorecard">
              <SectionShell
                eyebrow="Scorecard"
                title="Readiness by category"
                description="Category scores reflect crawlability, content depth, trust signals, and conversion readiness — not vanity metrics."
              >
                <div className="grid xl:grid-cols-2 gap-6">
                  <ScorecardGrid
                    categories={report.categories}
                    strongest={report.strongestCategory}
                    weakest={report.weakestCategory}
                  />
                  <CategoryScoreChart categories={report.categories} />
                </div>
              </SectionShell>
            </div>

            <div id="priorities">
              <SectionShell
                eyebrow="Top priorities"
                title="Fix first"
                description="The highest-value actions based on impact, confidence, and business relevance."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  {report.opportunities.length > 0 ? (
                    report.opportunities.map((item, index) => (
                      <RecommendationCard key={item.label} finding={item} rank={index + 1} />
                    ))
                  ) : (
                    <p className="text-sm text-brand-muted md:col-span-2">
                      No major priority gaps were flagged in this audit snapshot.
                    </p>
                  )}
                </div>
              </SectionShell>
            </div>

            <div id="findings">
              <SectionShell
                eyebrow="Detailed findings"
                title="Strengths, opportunities, and cautions"
                description="Grouped by category with evidence-backed statuses. Expand any item for recommendations and reviewed URLs."
              >
                {report.strengths.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-heading font-bold text-brand-navy mb-4">Strengths detected</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {report.strengths.map((s) => (
                        <div
                          key={s.title}
                          className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card"
                        >
                          <p className="font-heading font-bold text-brand-navy text-sm">{s.title}</p>
                          <p className="text-sm text-brand-muted mt-2 leading-relaxed">{s.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {categoryLabels.map((category) => (
                    <div key={category}>
                      <h3 className="font-heading font-bold text-brand-navy capitalize mb-4">
                        {category.replace(/_/g, " ")}
                      </h3>
                      <div className="space-y-4">
                        {report.findingsByCategory[category]?.map((finding) => (
                          <FindingCard
                            key={`${category}-${finding.label}`}
                            finding={finding}
                            variant={
                              finding.status === "Present" || finding.status === "Likely present"
                                ? "strength"
                                : finding.status === "Not confirmed" || finding.status === "Absent"
                                  ? "caution"
                                  : "default"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionShell>
            </div>

            <div id="pages">
              <SectionShell
                eyebrow="Page analysis"
                title="Key pages reviewed"
                description="Important routes discovered through sitemap and site structure analysis."
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {report.pageAnalysis.map((page) => (
                    <PageAnalysisCard key={page.url} page={page} />
                  ))}
                </div>
              </SectionShell>
            </div>

            <div id="fix-previews">
              <SectionShell
                eyebrow="Example improvements"
                title="What the fixes could look like"
                description="Sample implementation previews — practical examples, not guaranteed final copy. One way these improvements could be structured."
              >
                <div className="space-y-6">
                  {report.previews.map((preview) => (
                    <FixPreviewCard key={preview.id} preview={preview} />
                  ))}
                </div>
              </SectionShell>
            </div>

            <div id="roadmap">
              <SectionShell
                eyebrow="Implementation plan"
                title="Priority roadmap"
                description="A practical sequence for addressing findings without trying to fix everything at once."
              >
                <RoadmapSection roadmap={report.roadmap} />
              </SectionShell>
            </div>

            <ResultsCTA
              companyName={report.companyName}
              selectedPlan={bundle.submission.selected_plan}
              suggestedTier={report.suggestedTier}
            />

            {footerNote ?? (
              <p className="text-center text-xs text-brand-subtle pt-2">
                Private report — do not share publicly.{" "}
                <Link href="/" className="text-brand-blue hover:underline">
                  GEO home
                </Link>
              </p>
            )}
          </div>

          <ReportNav />
        </div>
      </div>
    </div>
  );
}
