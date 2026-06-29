import Link from "next/link";
import { ArrowRight, CalendarDays, Globe, Sparkles } from "lucide-react";
import type { ReportViewModel } from "@/lib/results/report-view-model";
import { ScoreBadge } from "./ScoreBadge";
import { gradeToneClassesForGrade } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null): string {
  if (!iso) return "Recently completed";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ReportHero({
  report,
  showAdminBanner,
}: {
  report: ReportViewModel;
  showAdminBanner?: boolean;
}) {
  return (
    <header className="report-hero relative overflow-hidden rounded-3xl border border-brand-navy/10 shadow-card-md">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-hero via-brand-navy to-brand-dark" />
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_top_right,_#60b8f0_0,_transparent_45%)]" />

      <div className="relative px-6 py-8 md:px-10 md:py-12">
        {showAdminBanner ? (
          <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/80">
            Admin preview — full technical report
          </div>
        ) : null}

        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 mb-4">
              <Sparkles size={14} className="text-brand-sky" />
              GEO Assessment Report
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-[2.65rem] font-heading font-extrabold text-white leading-tight">
              {report.companyName}
            </h1>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
              <Globe size={15} className="text-brand-sky shrink-0" />
              {report.domain}
            </p>

            <p className="mt-6 text-[15px] leading-relaxed text-white/80">{report.executiveSummary}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/65">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <CalendarDays size={13} />
                Prepared {formatDate(report.publishedAt ?? report.auditedAt)}
              </span>
              {report.topOpportunityLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-sky/30 bg-brand-sky/10 px-3 py-1.5 text-brand-sky">
                  Top opportunity: {report.topOpportunityLabel}
                </span>
              ) : null}
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 capitalize">
                Status: {report.auditStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={`mailto:shawn@gsally.com?subject=GEO assessment follow-up — ${encodeURIComponent(report.companyName)}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-navy font-heading font-semibold px-5 py-3.5 text-sm hover:bg-brand-cream transition-colors"
              >
                Request implementation help
                <ArrowRight size={16} />
              </Link>
              <a
                href="#fix-previews"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 text-white font-heading font-semibold px-5 py-3.5 text-sm hover:bg-white/10 transition-colors"
              >
                View example fixes
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="rounded-2xl bg-white/95 backdrop-blur p-5 md:p-6 text-center shadow-card-md min-w-[200px]">
              <ScoreBadge score={report.overallScore} grade={report.overallGrade} size="xl" />
              <p className="mt-4 text-sm font-heading font-bold text-brand-navy">AI Visibility Readiness</p>
              <p className={cn("text-xs mt-1 font-medium", gradeToneClassesForGrade(report.overallGrade).text)}>
                {report.overallInterpretation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
