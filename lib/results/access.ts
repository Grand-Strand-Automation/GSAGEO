import { createAdminClient } from "@/lib/supabase/admin";
import { hashResultsToken } from "@/lib/results/tokens";
import { loadPublishedReportBySubmissionId } from "@/lib/results/published-report";
import type { GeoAuditJob, ResultsBundle } from "@/lib/types/database";

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

export async function loadResultsByToken(rawToken: string): Promise<{
  state: CustomerResultsState;
  bundle: ResultsBundle | null;
}> {
  const supabase = createAdminClient();
  const tokenHash = hashResultsToken(rawToken);

  const { data: tokenRow } = await supabase
    .from("geo_result_access_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!tokenRow) return { state: "pending", bundle: null };
  if (tokenRow.revoked_at) return { state: "revoked", bundle: null };
  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
    return { state: "expired", bundle: null };
  }

  await supabase
    .from("geo_result_access_tokens")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("id", tokenRow.id);

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("submission_id", tokenRow.submission_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const job = (jobs?.[0] ?? null) as GeoAuditJob | null;
  const state = resolveCustomerState(job);

  if (!isResultsVisible(job)) {
    return { state, bundle: null };
  }

  const published = await loadPublishedReportBySubmissionId(tokenRow.submission_id);
  if (!published.ok) {
    return { state, bundle: null };
  }

  return {
    state: "ready",
    bundle: published.bundle,
  };
}
