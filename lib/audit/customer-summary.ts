import {
  buildCustomerHeadline,
  buildCustomerSummary,
} from "@/lib/results/plain-language";
import type { StructuredFinding, StrengthItem } from "./report-builder";
import { topOpportunities } from "./report-builder";

export type CustomerExecutiveContent = {
  customerHeadline: string;
  customerExecutiveSummary: string;
};

export function buildCustomerExecutiveContent(input: {
  companyName: string;
  scorecard: { overall: number };
  strengths: StrengthItem[];
  structuredFindings: StructuredFinding[];
}): CustomerExecutiveContent {
  const cautionFindings = input.structuredFindings.filter(
    (f) => f.status === "Not confirmed" || f.status === "Absent",
  );
  const improvementCount = Math.max(
    cautionFindings.length,
    topOpportunities(input.structuredFindings).length,
  );

  return {
    customerHeadline: buildCustomerHeadline(input.scorecard.overall, improvementCount),
    customerExecutiveSummary: buildCustomerSummary(
      input.companyName,
      input.scorecard.overall,
      input.strengths.length,
      improvementCount,
    ),
  };
}
