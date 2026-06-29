"use client";

import { useEffect } from "react";
import { trackConversionEvent } from "@/lib/analytics/events";

export function ReportViewTracker({ submissionId }: { submissionId: string }) {
  useEffect(() => {
    trackConversionEvent("report_viewed", { submissionId });
  }, [submissionId]);

  return null;
}
