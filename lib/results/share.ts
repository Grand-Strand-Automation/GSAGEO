import { createAdminClient } from "@/lib/supabase/admin";
import { appUrl } from "@/lib/utils";
import {
  generateResultsToken,
  getResultsTokenExpiry,
  hashResultsToken,
} from "@/lib/results/tokens";
import { isResultsVisible } from "@/lib/results/access";
import { loadPublishedReportBySubmissionId } from "@/lib/results/published-report";

export function buildResultsUrl(rawToken: string): string {
  return appUrl(`/results/${encodeURIComponent(rawToken)}`);
}

export function buildPdfUrl(rawToken: string): string {
  return appUrl(`/api/results/${encodeURIComponent(rawToken)}/pdf`);
}

export type ShareStatus = {
  published: boolean;
  shareable: boolean;
  hasActiveToken: boolean;
  activeTokenCreatedAt: string | null;
  lastAccessedAt: string | null;
  message: string;
};

export async function getShareStatus(submissionId: string): Promise<ShareStatus> {
  const published = await loadPublishedReportBySubmissionId(submissionId);
  if (!published.ok) {
    return {
      published: false,
      shareable: false,
      hasActiveToken: false,
      activeTokenCreatedAt: null,
      lastAccessedAt: null,
      message:
        published.reason === "not_published"
          ? "Report must be published before sharing or PDF export."
          : "Report data is not available yet.",
    };
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: tokens } = await supabase
    .from("geo_result_access_tokens")
    .select("*")
    .eq("submission_id", submissionId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  const active = (tokens ?? []).find(
    (t) => !t.revoked_at && (!t.expires_at || t.expires_at > now),
  );

  return {
    published: true,
    shareable: true,
    hasActiveToken: Boolean(active),
    activeTokenCreatedAt: active?.created_at ?? null,
    lastAccessedAt: active?.last_accessed_at ?? null,
    message: active
      ? "An active share link exists. Generate a new link to copy the URL (previous links will stop working)."
      : "No active share link. Generate one to share this report.",
  };
}

export async function revokeShareTokens(submissionId: string): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  await supabase
    .from("geo_result_access_tokens")
    .update({ revoked_at: now })
    .eq("submission_id", submissionId)
    .is("revoked_at", null);
}

export async function regenerateShareToken(submissionId: string): Promise<{
  token: string;
  url: string;
}> {
  const published = await loadPublishedReportBySubmissionId(submissionId);
  if (!published.ok) {
    throw new Error("Report is not published and cannot be shared.");
  }

  const supabase = createAdminClient();
  await revokeShareTokens(submissionId);

  const rawToken = generateResultsToken();
  const expiresAt = getResultsTokenExpiry();

  const { error } = await supabase.from("geo_result_access_tokens").insert({
    submission_id: submissionId,
    audit_job_id: published.bundle.job.id,
    token_hash: hashResultsToken(rawToken),
    expires_at: expiresAt?.toISOString() ?? null,
  });

  if (error) throw new Error(`Failed to create share token: ${error.message}`);

  return {
    token: rawToken,
    url: buildResultsUrl(rawToken),
  };
}

export function isJobShareable(job: { status: string; published_at?: string | null }): boolean {
  return isResultsVisible(job as Parameters<typeof isResultsVisible>[0]);
}
