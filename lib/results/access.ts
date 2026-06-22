import type { CustomerResultsState } from "@/lib/results/customer-state";
import { getCustomerReportByToken } from "@/lib/results/customer-report";
import type { ResultsBundle } from "@/lib/types/database";

export type { CustomerResultsState };

export { isResultsVisible, resolveCustomerState } from "@/lib/results/customer-state";

export async function loadResultsByToken(rawToken: string): Promise<{
  state: CustomerResultsState;
  bundle: ResultsBundle | null;
}> {
  return getCustomerReportByToken(rawToken);
}
