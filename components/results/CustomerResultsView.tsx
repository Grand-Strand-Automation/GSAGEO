import type { ResultsBundle } from "@/lib/types/database";
import { CustomerAuditReportView } from "./CustomerAuditReportView";
import { ReportViewTracker } from "./ReportViewTracker";

export function CustomerResultsView({
  bundle,
  token,
}: {
  bundle: ResultsBundle;
  token?: string;
}) {
  return (
    <>
      <ReportViewTracker submissionId={bundle.submission.id} />
      <CustomerAuditReportView bundle={bundle} shareToken={token} />
    </>
  );
}
