import { renderToBuffer } from "@react-pdf/renderer";
import type { ResultsBundle } from "@/lib/types/database";
import { buildCustomerReportViewModel } from "@/lib/results/customer-report-view-model";
import { buildReportViewModel } from "@/lib/results/report-view-model";
import { loadPublishedReportFromBundle } from "@/lib/results/published-report";
import { CustomerAuditReportPdfDocument } from "./CustomerAuditReportPdfDocument";
import { AuditReportPdfDocument } from "./AuditReportPdfDocument";

export function buildPdfFilename(
  domain: string,
  dateIso?: string | null,
  variant: "customer" | "technical" = "customer",
): string {
  const safeDomain = domain.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
  const date = dateIso ? new Date(dateIso) : new Date();
  const stamp = date.toISOString().slice(0, 10);
  const prefix = variant === "technical" ? "geo-report-technical" : "geo-report";
  return `${prefix}-${safeDomain}-${stamp}.pdf`;
}

export async function generatePublishedReportPdf(bundle: ResultsBundle): Promise<{
  buffer: Buffer;
  filename: string;
}> {
  const published = await loadPublishedReportFromBundle(bundle);
  if (!published.ok) {
    throw new Error("Report is not published or has no customer-visible content.");
  }

  const report = buildCustomerReportViewModel(published.bundle);
  const buffer = await renderToBuffer(<CustomerAuditReportPdfDocument report={report} />);

  return {
    buffer: Buffer.from(buffer),
    filename: buildPdfFilename(report.domain, report.publishedAt ?? report.auditedAt, "customer"),
  };
}

export async function generateTechnicalReportPdf(bundle: ResultsBundle): Promise<{
  buffer: Buffer;
  filename: string;
}> {
  const published = await loadPublishedReportFromBundle(bundle);
  if (!published.ok) {
    throw new Error("Report is not published or has no customer-visible content.");
  }

  const report = buildReportViewModel({
    submission: published.bundle.submission,
    job: published.bundle.job,
    result: published.bundle.result,
    previews: published.bundle.previews,
  });
  const buffer = await renderToBuffer(<AuditReportPdfDocument report={report} />);

  return {
    buffer: Buffer.from(buffer),
    filename: buildPdfFilename(report.domain, report.publishedAt ?? report.auditedAt, "technical"),
  };
}
