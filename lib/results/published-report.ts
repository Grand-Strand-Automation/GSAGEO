import { createAdminClient } from "@/lib/supabase/admin";
import { isResultsVisible } from "@/lib/results/access";
import type {
  GeoAuditJob,
  GeoAuditResult,
  GeoFixPreview,
  GeoSubmission,
  ResultsBundle,
} from "@/lib/types/database";

export type PublishedReportResult =
  | { ok: true; bundle: ResultsBundle }
  | { ok: false; reason: "not_found" | "not_published" | "no_result" };

/**
 * Single source of truth for customer-safe published report data.
 * Used by customer page, share links, and PDF export.
 */
export async function loadPublishedReportBySubmissionId(
  submissionId: string,
): Promise<PublishedReportResult> {
  const supabase = createAdminClient();

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();

  if (!submission) return { ok: false, reason: "not_found" };

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false })
    .limit(1);

  const job = (jobs?.[0] ?? null) as GeoAuditJob | null;
  if (!job || !isResultsVisible(job)) {
    return { ok: false, reason: "not_published" };
  }

  const { data: results } = await supabase
    .from("geo_audit_results")
    .select("*")
    .eq("audit_job_id", job.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const result = (results?.[0] ?? null) as GeoAuditResult | null;
  if (!result) return { ok: false, reason: "no_result" };

  const { data: previews } = await supabase
    .from("geo_fix_previews")
    .select("*")
    .eq("audit_job_id", job.id)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  return {
    ok: true,
    bundle: {
      submission: submission as GeoSubmission,
      job,
      result,
      previews: (previews ?? []) as GeoFixPreview[],
    },
  };
}

export async function loadPublishedReportFromBundle(
  bundle: ResultsBundle,
): Promise<PublishedReportResult> {
  if (!isResultsVisible(bundle.job)) {
    return { ok: false, reason: "not_published" };
  }

  const publishedPreviews = bundle.previews.filter((p) => p.status === "published");

  return {
    ok: true,
    bundle: {
      ...bundle,
      previews: publishedPreviews,
    },
  };
}
