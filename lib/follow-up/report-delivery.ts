import { createAdminClient } from "@/lib/supabase/admin";
import { sendReportDeliveryEmail } from "@/lib/follow-up/service";
import { getRecommendedOffer } from "@/lib/follow-up/recommend";

export async function deliverReportEmailForJob(jobId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: job } = await supabase
    .from("geo_audit_jobs")
    .select("id, submission_id, status, published_at")
    .eq("id", jobId)
    .single();

  if (!job || !["published", "complete"].includes(job.status)) return;

  const { data: result } = await supabase
    .from("geo_audit_results")
    .select("customer_headline, customer_executive_summary, scorecard_json, recommendations_json, next_step_json")
    .eq("audit_job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!result) return;

  const scorecard = (result.scorecard_json ?? {}) as { overall?: number };
  const recommendations = (result.recommendations_json ?? {}) as {
    suggestedTier?: string;
    topOpportunities?: unknown[];
  };
  const nextStep = (result.next_step_json ?? {}) as { topOpportunities?: unknown[] };

  const issueCount =
    (nextStep.topOpportunities?.length ?? 0) ||
    (recommendations.topOpportunities as unknown[] | undefined)?.length ||
    0;

  await sendReportDeliveryEmail({
    submissionId: job.submission_id,
    auditJobId: jobId,
    report: {
      headline: result.customer_headline,
      summary: result.customer_executive_summary,
      overallScore: scorecard.overall,
      issueCount,
      suggestedTier: recommendations.suggestedTier ?? null,
    },
  });

  const offer = getRecommendedOffer({
    overallScore: scorecard.overall,
    issueCount,
    suggestedTier: recommendations.suggestedTier ?? null,
  });

  await supabase
    .from("geo_submissions")
    .update({ recommended_offer: offer.id })
    .eq("id", job.submission_id);
}
