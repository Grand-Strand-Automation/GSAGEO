import { createAdminClient } from "@/lib/supabase/admin";
import { hashResultsToken } from "@/lib/results/tokens";
import type {
  GeoAuditJob,
  GeoAuditResult,
  GeoFixPreview,
  GeoSubmission,
  ResultsBundle,
} from "@/lib/types/database";

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

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", tokenRow.submission_id)
    .single();

  if (!submission) return { state: "pending", bundle: null };

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("submission_id", submission.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const job = (jobs?.[0] ?? null) as GeoAuditJob | null;
  const state = resolveCustomerState(job);

  if (!isResultsVisible(job)) {
    return { state, bundle: null };
  }

  if (!job) return { state, bundle: null };

  const { data: results } = await supabase
    .from("geo_audit_results")
    .select("*")
    .eq("audit_job_id", job.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const result = (results?.[0] ?? null) as GeoAuditResult | null;

  const { data: previews } = await supabase
    .from("geo_fix_previews")
    .select("*")
    .eq("audit_job_id", job.id)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  return {
    state: "ready",
    bundle: {
      submission: submission as GeoSubmission,
      job,
      result,
      previews: (previews ?? []) as GeoFixPreview[],
    },
  };
}
