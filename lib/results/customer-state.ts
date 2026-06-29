import type { GeoAuditJob } from "@/lib/types/database";

export type CustomerResultsState =
  | "pending"
  | "processing"
  | "awaiting_review"
  | "ready"
  | "failed"
  | "expired"
  | "revoked";

export function resolveCustomerState(job: GeoAuditJob | null): CustomerResultsState {
  if (!job) return "pending";
  switch (job.status) {
    case "queued":
    case "submitted":
      return "pending";
    case "processing":
      return "processing";
    case "awaiting_review":
      return "awaiting_review";
    case "published":
    case "complete":
      return "ready";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}

export function isResultsVisible(job: GeoAuditJob | null): boolean {
  if (!job) return false;
  return job.status === "published" || (job.status === "complete" && Boolean(job.published_at));
}

export type CustomerStatusCopy = {
  title: string;
  body: string;
  tone: "waiting" | "info" | "success" | "error";
  ctaLabel: string;
};

export const CUSTOMER_STATUS_COPY: Record<CustomerResultsState, CustomerStatusCopy> = {
  pending: {
    title: "Your assessment is queued",
    body: "We received your request and started preparing your assessment. Most automated reviews finish within a few minutes.",
    tone: "waiting",
    ctaLabel: "View assessment status",
  },
  processing: {
    title: "Your assessment is in progress",
    body: "We are analyzing your site structure, sitemap, and key pages. Your report will appear at this link when ready.",
    tone: "waiting",
    ctaLabel: "Check progress",
  },
  awaiting_review: {
    title: "Your report is being finalized",
    body: "Your assessment findings are being reviewed before the full report is published here. Check back soon.",
    tone: "info",
    ctaLabel: "Check report status",
  },
  ready: {
    title: "Your assessment report is ready",
    body: "Your full GEO assessment report is available. You can review it, share it securely, or download a PDF.",
    tone: "success",
    ctaLabel: "View your report",
  },
  failed: {
    title: "We could not complete your assessment",
    body: "Something went wrong during the automated review. Please email shawn@gsally.com and we will follow up manually.",
    tone: "error",
    ctaLabel: "Contact support",
  },
  expired: {
    title: "This results link has expired",
    body: "Please contact shawn@gsally.com for a refreshed link.",
    tone: "error",
    ctaLabel: "Contact support",
  },
  revoked: {
    title: "This results link is no longer valid",
    body: "Please contact shawn@gsally.com if you need access to your report.",
    tone: "error",
    ctaLabel: "Contact support",
  },
};
