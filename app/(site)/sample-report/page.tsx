import { SampleReportPage } from "@/components/sample/SampleReportPage";
import { SAMPLE_REPORT_METADATA } from "@/lib/seo/metadata";

export const metadata = SAMPLE_REPORT_METADATA;

export default function SampleReportRoute() {
  return <SampleReportPage />;
}
