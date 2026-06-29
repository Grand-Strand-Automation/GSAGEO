import type { ResultsBundle } from "@/lib/types/database";
import { CustomerAuditReportView } from "./CustomerAuditReportView";

export function CustomerResultsView({
  bundle,
  token,
}: {
  bundle: ResultsBundle;
  token?: string;
}) {
  return <CustomerAuditReportView bundle={bundle} shareToken={token} />;
}
