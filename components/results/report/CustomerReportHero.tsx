import Link from "next/link";
import { ArrowRight, CalendarDays, Globe, Sparkles } from "lucide-react";
import type { CustomerReportViewModel } from "@/lib/results/customer-report-view-model";
import { scoreToneClasses } from "@/lib/results/score-utils";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null): string {
  if (!iso) return "Recently completed";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function CustomerReportHero({ report }: { report: CustomerReportViewModel }) {
  const tone = scoreToneClasses(report.overallStatusTone);

  return (
    <header className="report-hero relative overflow-hidden rounded-3xl border border-brand-navy/10 shadow-card-md">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-hero via-brand-navy to-brand-dark" />
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_top_right,_#60b8f0_0,_transparent_45%)]" />

      <div className="relative px-6 py-8 md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 mb-4">
            <Sparkles size={14} className="text-brand-sky" />
            Website clarity report
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
            {report.companyName}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
            <Globe size={15} className="text-brand-sky shrink-0" />
            {report.domain}
          </p>

          <p className="mt-6 text-xl md:text-2xl font-heading font-bold text-white leading-snug">
            {report.headline}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80">{report.summary}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/65">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <CalendarDays size={13} />
              Prepared {formatDate(report.publishedAt ?? report.auditedAt)}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 font-semibold",
                tone.bg,
                tone.text,
                "border-white/20",
              )}
            >
              Overall: {report.overallStatus}
            </span>
          </div>

          <div className="mt-8">
            <Link
              href={`mailto:shawn@gsally.com?subject=Website review follow-up — ${encodeURIComponent(report.companyName)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-navy font-heading font-semibold px-5 py-3.5 text-sm hover:bg-brand-cream transition-colors"
            >
              Talk through these results
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
