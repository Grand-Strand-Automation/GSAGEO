import { createAdminClient } from "@/lib/supabase/admin";
import { hashResultsToken } from "@/lib/results/tokens";
import {
  isResultsVisible,
  resolveCustomerState,
  type CustomerResultsState,
} from "@/lib/results/customer-state";
import { loadPublishedReportBySubmissionId } from "@/lib/results/published-report";
import type { ResultsBundle } from "@/lib/types/database";

export type CustomerReportStatus = {
  state: CustomerResultsState;
  ready: boolean;
  companyName: string | null;
  websiteUrl: string | null;
  updatedAt: string | null;
};

async function resolveTokenContext(rawToken: string): Promise<
  | { ok: false; state: CustomerResultsState }
  | { ok: true; submissionId: string; state: CustomerResultsState; companyName: string; websiteUrl: string; updatedAt: string | null }
> {
  const supabase = createAdminClient();
  const tokenHash = hashResultsToken(rawToken);

  const { data: tokenRow } = await supabase
    .from("geo_result_access_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!tokenRow) return { ok: false, state: "pending" };
  if (tokenRow.revoked_at) return { ok: false, state: "revoked" };
  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
    return { ok: false, state: "expired" };
  }

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("company_name, website_url")
    .eq("id", tokenRow.submission_id)
    .maybeSingle();

  const { data: jobs } = await supabase
    .from("geo_audit_jobs")
    .select("*")
    .eq("submission_id", tokenRow.submission_id)
    .order("created_at", { ascending: false })
    .limit(1);

  const job = jobs?.[0] ?? null;
  const state = resolveCustomerState(job);
  const ready = isResultsVisible(job);

  return {
    ok: true,
    submissionId: tokenRow.submission_id,
    state: ready ? "ready" : state,
    companyName: submission?.company_name ?? "Your audit",
    websiteUrl: submission?.website_url ?? null,
    updatedAt: job?.updated_at ?? job?.completed_at ?? null,
  };
}

/** Lightweight status for thank-you polling and status API. */
export async function getCustomerReportStatusByToken(
  rawToken: string,
): Promise<CustomerReportStatus> {
  const ctx = await resolveTokenContext(rawToken);
  if (!ctx.ok) {
    return {
      state: ctx.state,
      ready: false,
      companyName: null,
      websiteUrl: null,
      updatedAt: null,
    };
  }

  return {
    state: ctx.state,
    ready: ctx.state === "ready",
    companyName: ctx.companyName,
    websiteUrl: ctx.websiteUrl,
    updatedAt: ctx.updatedAt,
  };
}

/** Full customer-safe published report payload by token. */
export async function getCustomerReportByToken(rawToken: string): Promise<{
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

  const job = jobs?.[0] ?? null;
  const state = resolveCustomerState(job);

  if (!isResultsVisible(job)) {
    return { state, bundle: null };
  }

  const published = await loadPublishedReportBySubmissionId(tokenRow.submission_id);
  if (!published.ok) {
    return { state, bundle: null };
  }

  return { state: "ready", bundle: published.bundle };
}
