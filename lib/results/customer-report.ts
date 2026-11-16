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
  /** Present when the published scorecard is available (customer can see score without email). */
  overallScore: number | null;
};

export function extractOverallScore(
  scorecard: Record<string, unknown> | null | undefined,
): number | null {
  if (!scorecard) return null;
  const overall = scorecard.overall;
  if (typeof overall !== "number" || !Number.isFinite(overall)) return null;
  return Math.max(0, Math.min(100, Math.round(overall)));
}

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

  if (!tokenRow) return { ok: false, state: "not_found" };
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
    companyName: submission?.company_name ?? "Your assessment",
    websiteUrl: submission?.website_url ?? null,
    updatedAt: job?.updated_at ?? job?.completed_at ?? null,
  };
}

async function loadOverallScoreForSubmission(
  submissionId: string,
): Promise<number | null> {
  const published = await loadPublishedReportBySubmissionId(submissionId);
  if (!published.ok || !published.bundle.result) return null;
  const scorecard = (published.bundle.result.scorecard_json ?? {}) as Record<
    string,
    unknown
  >;
  return extractOverallScore(scorecard);
}

const EMPTY_STATUS: CustomerReportStatus = {
  state: "not_found",
  ready: false,
  companyName: null,
  websiteUrl: null,
  updatedAt: null,
  overallScore: null,
};

/** Lightweight status for thank-you polling and status API. */
export async function getCustomerReportStatusByToken(
  rawToken: string,
): Promise<CustomerReportStatus> {
  try {
    const ctx = await resolveTokenContext(rawToken);
    if (!ctx.ok) {
      return {
        state: ctx.state,
        ready: false,
        companyName: null,
        websiteUrl: null,
        updatedAt: null,
        overallScore: null,
      };
    }

    const ready = ctx.state === "ready";
    const overallScore = ready
      ? await loadOverallScoreForSubmission(ctx.submissionId)
      : null;

    return {
      state: ctx.state,
      ready,
      companyName: ctx.companyName,
      websiteUrl: ctx.websiteUrl,
      updatedAt: ctx.updatedAt,
      overallScore,
    };
  } catch {
    return EMPTY_STATUS;
  }
}

/** Full customer-safe published report payload by token. */
export async function getCustomerReportByToken(rawToken: string): Promise<{
  state: CustomerResultsState;
  bundle: ResultsBundle | null;
}> {
  try {
    const supabase = createAdminClient();
    const tokenHash = hashResultsToken(rawToken);

    const { data: tokenRow } = await supabase
      .from("geo_result_access_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (!tokenRow) return { state: "not_found", bundle: null };
    if (tokenRow.revoked_at) return { state: "revoked", bundle: null };
    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
      return { state: "expired", bundle: null };
    }

    await supabase
      .from("geo_result_access_tokens")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("id", tokenRow.id);

    await supabase
      .from("geo_submissions")
      .update({
        last_report_viewed_at: new Date().toISOString(),
        last_summary_viewed_at: new Date().toISOString(),
        last_engagement_at: new Date().toISOString(),
      })
      .eq("id", tokenRow.submission_id);

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
  } catch {
    return { state: "not_found", bundle: null };
  }
}
