import { renderToBuffer } from "@react-pdf/renderer";
import type { ResultsBundle } from "@/lib/types/database";
import { buildReportViewModel } from "@/lib/results/report-view-model";
import { loadPublishedReportFromBundle } from "@/lib/results/published-report";
import { AuditReportPdfDocument } from "./AuditReportPdfDocument";

export function buildPdfFilename(domain: string, dateIso?: string | null): string {
  const safeDomain = domain.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
  const date = dateIso ? new Date(dateIso) : new Date();
  const stamp = date.toISOString().slice(0, 10);
  return `geo-report-${safeDomain}-${stamp}.pdf`;
}

export async function generatePublishedReportPdf(bundle: ResultsBundle): Promise<{
  buffer: Buffer;
  filename: string;
}> {
  const published = await loadPublishedReportFromBundle(bundle);
  if (!published.ok) {
    throw new Error("Report is not published or has no customer-visible content.");
  }

  const report = buildReportViewModel(published.bundle);
  const buffer = await renderToBuffer(<AuditReportPdfDocument report={report} />);

  return {
    buffer: Buffer.from(buffer),
    filename: buildPdfFilename(report.domain, report.publishedAt ?? report.auditedAt),
  };
}
