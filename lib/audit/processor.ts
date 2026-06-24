import { createAdminClient } from "@/lib/supabase/admin";
import { runDiscovery } from "./discovery";
import { generateFixPreviews } from "./preview-generator";
import {
  buildExecutiveSummary,
  buildStrengths,
  buildStructuredFindings,
  topOpportunities,
} from "./report-builder";
import { generateScorecard, generateRecommendations } from "./scoring";
import {
  generateResultsToken,
  getResultsTokenExpiry,
  hashResultsToken,
  isAuditAutoPublish,
  isAuditReviewRequired,
} from "@/lib/results/tokens";
import { AUDIT_VERSION } from "./types";
import {
  generateAndPersistInternalFixesForJob,
} from "@/lib/internal-fixes/persist";

export type AuditRunResult = {
  summary: string;
  executiveSummary: string;
  scorecard: ReturnType<typeof generateScorecard>;
  findings: Record<string, unknown>;
  recommendations: ReturnType<typeof generateRecommendations>;
  strengths: ReturnType<typeof buildStrengths>;
  structuredFindings: ReturnType<typeof buildStructuredFindings>;
  previews: ReturnType<typeof generateFixPreviews>;
};

export async function runAuditChecks(
  websiteUrl: string,
  companyName: string,
  context?: { primaryService?: string | null; serviceArea?: string | null },
): Promise<AuditRunResult> {
  const discovery = await runDiscovery(websiteUrl, companyName);
  const scorecard = generateScorecard(discovery);
  const recommendations = generateRecommendations(discovery, scorecard);
  const structuredFindings = buildStructuredFindings(discovery);
  const strengths = buildStrengths(discovery);
  const opportunities = topOpportunities(structuredFindings);
  const executiveSummary = buildExecutiveSummary(
    companyName,
    discovery,
    scorecard,
    recommendations,
  );

  const previews = generateFixPreviews(
    {
      companyName,
      websiteUrl: discovery.baseUrl,
      primaryService: context?.primaryService ?? null,
      serviceArea: context?.serviceArea ?? null,
      discovery,
    },
    opportunities,
  );

  const findings = {
    auditedAt: discovery.auditedAt,
    auditVersion: AUDIT_VERSION,
    baseUrl: discovery.baseUrl,
    httpStatus: discovery.httpStatus,
    discoveryComplete: discovery.discoveryComplete,
    homepageIsJsShell: discovery.homepageIsJsShell,
    sitemapUrlCount: discovery.technical.sitemap_url_count,
    technical: discovery.technical,
    schema: discovery.schema,
    assets: discovery.assets,
    structuredFindings,
    classifiedUrlCount: discovery.classifiedUrls.length,
    sitemapUrls: discovery.sitemapUrls,
    extractedData: {
      title: discovery.htmlMeta.title,
      titleLength: discovery.htmlMeta.title.length,
      metaDesc: discovery.htmlMeta.metaDesc,
      metaDescLength: discovery.htmlMeta.metaDesc.length,
      canonical: discovery.htmlMeta.canonical,
      h1: discovery.htmlMeta.h1,
      ogTitle: discovery.htmlMeta.ogTitle,
    },
    entityInfo: discovery.entityInfo,
  };

  const summary = `Overall GEO score: ${scorecard.overall}/100 (${scorecard.overallGrade}). Discovery found ${discovery.technical.sitemap_url_count} sitemap URLs.`;

  return {
    summary,
    executiveSummary,
    scorecard,
    findings,
    recommendations,
    strengths,
    structuredFindings,
    previews,
  };
}

export async function createResultsAccessToken(
  submissionId: string,
  jobId: string,
): Promise<string> {
  const supabase = createAdminClient();
  const rawToken = generateResultsToken();
  const expiresAt = getResultsTokenExpiry();

  const { error } = await supabase.from("geo_result_access_tokens").insert({
    submission_id: submissionId,
    audit_job_id: jobId,
    token_hash: hashResultsToken(rawToken),
    expires_at: expiresAt?.toISOString() ?? null,
  });

  if (error) throw new Error(`Failed to create results token: ${error.message}`);
  return rawToken;
}

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

  if (["complete", "published", "processing", "awaiting_review"].includes(job.status)) {
    return;
  }

  const { data: claimed } = await supabase
    .from("geo_audit_jobs")
    .update({ status: "processing", started_at: new Date().toISOString() })
    .eq("id", jobId)
    .in("status", ["queued", "submitted"])
    .select("*")
    .maybeSingle();

  if (!claimed) {
    console.log("[audit] Job already claimed or not queued:", jobId);
    return;
  }

  const { data: submission, error: subError } = await supabase
    .from("geo_submissions")
    .select("id, website_url, company_name, primary_service, service_area")
    .eq("id", job.submission_id)
    .single();

  if (subError || !submission) {
    console.error("[audit] Submission not found for job:", jobId, subError);
    return;
  }

  try {
    const result = await runAuditChecks(submission.website_url, submission.company_name, {
      primaryService: submission.primary_service,
      serviceArea: submission.service_area,
    });

    const reviewRequired = isAuditReviewRequired();
    const autoPublish = isAuditAutoPublish();
    const now = new Date().toISOString();

    const { data: auditResult, error: resultError } = await supabase
      .from("geo_audit_results")
      .insert({
        submission_id: submission.id,
        audit_job_id: jobId,
        summary: result.summary,
        executive_summary: result.executiveSummary,
        strengths_json: result.strengths,
        scorecard_json: result.scorecard,
        findings_json: result.findings,
        recommendations_json: result.recommendations,
        limitations_json: {
          notes: [
            "Automated audit uses sitemap discovery and sampled HTML—no headless browser.",
            "Client-rendered pages may require route/sitemap evidence.",
          ],
        },
        crawl_notes_json: {
          jsShell: result.findings.homepageIsJsShell,
          sitemapUrlCount: result.findings.sitemapUrlCount,
        },
        next_step_json: {
          suggestedTier: result.recommendations.suggestedTier,
          topFixes: result.recommendations.topFixes,
          topContentGaps: result.recommendations.topContentGaps,
          topOpportunities: topOpportunities(result.structuredFindings),
        },
      })
      .select("id")
      .single();

    if (resultError || !auditResult) throw resultError ?? new Error("Result insert failed");

    const previewStatus = autoPublish && !reviewRequired ? "published" : "draft";
    if (result.previews.length) {
      const { error: previewError } = await supabase.from("geo_fix_previews").insert(
        result.previews.map((p) => ({
          submission_id: submission.id,
          audit_job_id: jobId,
          type: p.type,
          title: p.title,
          issue_summary: p.issue_summary,
          why_it_matters: p.why_it_matters,
          before_text: p.before_text,
          after_text: p.after_text,
          html_preview: p.html_preview,
          evidence_urls: p.evidence_urls,
          priority: p.priority,
          implementation_effort: p.implementation_effort,
          status: previewStatus,
        })),
      );
      if (previewError) throw previewError;
    }

    await generateAndPersistInternalFixesForJob(submission.id, jobId, {
      companyName: submission.company_name,
      websiteUrl: submission.website_url,
      primaryService: submission.primary_service,
      serviceArea: submission.service_area,
      structuredFindings: result.structuredFindings,
      sitemapUrls: (result.findings.sitemapUrls as string[] | undefined) ?? [submission.website_url],
    });

    const finalStatus = reviewRequired ? "awaiting_review" : autoPublish ? "published" : "complete";

    await supabase
      .from("geo_audit_jobs")
      .update({
        status: finalStatus,
        completed_at: now,
        published_at: autoPublish && !reviewRequired ? now : null,
        review_required: reviewRequired,
        audit_version: AUDIT_VERSION,
        failure_reason: null,
      })
      .eq("id", jobId);

    await supabase
      .from("geo_submissions")
      .update({ status: "reviewing" })
      .eq("id", submission.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown audit failure";
    console.error("[audit] Job failed:", jobId, err);
    await supabase
      .from("geo_audit_jobs")
      .update({
        status: "failed",
        failure_reason: message,
        failed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);
  }
}

export async function publishAuditJob(jobId: string): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: job } = await supabase
    .from("geo_audit_jobs")
    .select("submission_id")
    .eq("id", jobId)
    .single();

  if (!job) throw new Error("Job not found");

  await supabase
    .from("geo_audit_jobs")
    .update({ status: "published", published_at: now })
    .eq("id", jobId);

  await supabase
    .from("geo_fix_previews")
    .update({ status: "published" })
    .eq("audit_job_id", jobId);
}

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
