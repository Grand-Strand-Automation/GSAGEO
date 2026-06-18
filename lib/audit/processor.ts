import { createAdminClient } from "@/lib/supabase/admin";
import {
  checkHomepageAvailability,
  checkRobotsTxt,
  checkSitemapXml,
  normalizeUrl,
  AUDIT_VERSION,
} from "./crawl-checks";
import { extractContentStructure } from "./content-extraction";
import { generateScorecard, generateRecommendations } from "./scoring";

export type AuditRunResult = {
  summary: string;
  scorecard: ReturnType<typeof generateScorecard>;
  findings: Record<string, unknown>;
  recommendations: ReturnType<typeof generateRecommendations>;
};

/**
 * Run automated GEO audit checks against a submitted website.
 * TODO: Move long-running audits to a dedicated worker / Vercel Cron queue when volume grows.
 */
export async function runAuditChecks(
  websiteUrl: string,
  companyName: string,
): Promise<AuditRunResult> {
  const baseUrl = normalizeUrl(websiteUrl);

  const [homepageResult, sitemapOk, robotsOk] = await Promise.all([
    checkHomepageAvailability(baseUrl),
    checkSitemapXml(baseUrl),
    checkRobotsTxt(baseUrl),
  ]);

  const { htmlData, pageTypes, entityInfo } = extractContentStructure(
    homepageResult.html,
    baseUrl,
    companyName,
  );

  const scorecard = generateScorecard(
    homepageResult.status,
    sitemapOk,
    robotsOk,
    htmlData,
    pageTypes,
    entityInfo,
  );

  const recommendations = generateRecommendations(
    scorecard,
    pageTypes,
    htmlData,
    homepageResult.status,
  );

  const findings = {
    auditedAt: new Date().toISOString(),
    auditVersion: AUDIT_VERSION,
    baseUrl,
    httpStatus: homepageResult.status,
    sitemapPresent: sitemapOk,
    robotsPresent: robotsOk,
    extractedData: {
      title: htmlData.title,
      titleLength: htmlData.title.length,
      metaDesc: htmlData.metaDesc,
      metaDescLength: htmlData.metaDesc.length,
      canonical: htmlData.canonical,
      h1: htmlData.h1,
      hasStructuredData: htmlData.hasStructuredData,
      ogTitle: htmlData.ogTitle,
    },
    pageTypes,
    entityInfo,
  };

  const summary = `Overall GEO score: ${scorecard.overall}/100 (${scorecard.overallGrade}). Suggested tier: ${recommendations.suggestedTier}.`;

  return { summary, scorecard, findings, recommendations };
}

/**
 * Process a queued audit job: update status, run checks, persist results.
 */
export async function processAuditJob(jobId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: job, error: jobError } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    console.error("[audit] Job not found:", jobId, jobError);
    return;
  }

  if (job.status === "complete" || job.status === "processing") {
    return;
  }

  const { data: submission, error: subError } = await supabase
    .from("geo_submissions")
    .select("id, website_url, company_name")
    .eq("id", job.submission_id)
    .single();

  if (subError || !submission) {
    console.error("[audit] Submission not found for job:", jobId, subError);
    return;
  }

  await supabase
    .from("geo_audit_jobs")
    .update({ status: "processing", started_at: new Date().toISOString() })
    .eq("id", jobId);

  try {
    const result = await runAuditChecks(submission.website_url, submission.company_name);

    const { error: resultError } = await supabase.from("geo_audit_results").insert({
      submission_id: submission.id,
      audit_job_id: jobId,
      summary: result.summary,
      scorecard_json: result.scorecard,
      findings_json: result.findings,
      recommendations_json: result.recommendations,
      next_step_json: {
        suggestedTier: result.recommendations.suggestedTier,
        topFixes: result.recommendations.topFixes,
        topContentGaps: result.recommendations.topContentGaps,
      },
    });

    if (resultError) throw resultError;

    await supabase
      .from("geo_audit_jobs")
      .update({
        status: "complete",
        completed_at: new Date().toISOString(),
        audit_version: AUDIT_VERSION,
      })
      .eq("id", jobId);

    // TODO: Send admin notification via Resend when RESEND_API_KEY is configured
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit failure";
    console.error("[audit] Job failed:", jobId, err);
    await supabase
      .from("geo_audit_jobs")
      .update({
        status: "failed",
        failure_reason: message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  }
}

/** Process all queued jobs — intended for Vercel Cron backup. */
export async function processQueuedJobs(limit = 5): Promise<number> {
  const supabase = createAdminClient();
  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("id")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!jobs?.length) return 0;

  for (const job of jobs) {
    await processAuditJob(job.id);
  }
  return jobs.length;
}
