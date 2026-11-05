"use client";

import type { CustomerReportViewModel } from "@/lib/results/customer-report-view-model";
import { SectionShell } from "./SectionShell";
import { StatCard } from "./StatCard";
import { CoverageSummaryChart } from "./CategoryScoreChart";

export function CustomerVisualSummary({ report }: { report: CustomerReportViewModel }) {
  return (
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
            strengths={report.strengthCount}
            opportunities={report.opportunityCount}
            cautions={report.cautionCount}
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
                <span className="font-semibold text-brand-navy">Website:</span> {report.domain}
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
  );
}
