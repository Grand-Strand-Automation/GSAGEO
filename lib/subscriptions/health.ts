import type { GeoSubmission } from "@/lib/types/database";
import {
  HEALTH_RULES,
  type ChurnRiskLevel,
  type CustomerHealthStatus,
} from "@/lib/subscriptions/config";

function daysSince(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  return Math.floor((Date.now() - time) / (24 * 60 * 60 * 1000));
}

export function calculateChurnRiskScore(submission: Partial<GeoSubmission>): number {
  let score = 0;

  if (submission.cancel_at_period_end || submission.cancellation_reason) {
    score += HEALTH_RULES.cancellationStartedPoints;
  }

  if (submission.payment_issue_status) {
    score += HEALTH_RULES.paymentIssuePoints;
  }

  if (submission.downgrade_reason || submission.next_plan) {
    score += HEALTH_RULES.downgradeInquiryPoints;
  }

  const engagementDays = daysSince(submission.last_engagement_at);
  if (engagementDays !== null && engagementDays > HEALTH_RULES.noEngagementDays) {
    score += 20;
  }

  const reportViewDays = daysSince(submission.last_report_viewed_at);
  if (reportViewDays !== null && reportViewDays > HEALTH_RULES.staleReportViewDays) {
    score += 15;
  }

  if (submission.subscription_status === "past_due") {
    score += 30;
  }

  if (submission.subscription_status === "canceled") {
    score += 70;
  }

  return Math.min(100, score);
}

export function calculateHealthStatus(submission: Partial<GeoSubmission>): {
  healthStatus: CustomerHealthStatus;
  churnRiskLevel: ChurnRiskLevel;
  score: number;
} {
  const score = calculateChurnRiskScore(submission);

  if (score >= HEALTH_RULES.redRiskPoints) {
    return { healthStatus: "red", churnRiskLevel: "high", score };
  }

  if (score >= HEALTH_RULES.yellowRiskPoints) {
    return { healthStatus: "yellow", churnRiskLevel: "medium", score };
  }

  return { healthStatus: "green", churnRiskLevel: "low", score };
}
