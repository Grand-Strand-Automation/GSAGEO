import type { ResultsBundle } from "@/lib/types/database";
import { AuditReportView } from "./AuditReportView";

export function CustomerResultsView({
  bundle,
  token,
}: {
  bundle: ResultsBundle;
  token?: string;
}) {
  return <AuditReportView bundle={bundle} shareToken={token} />;
}
