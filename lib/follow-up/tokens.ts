import { createAdminClient } from "@/lib/supabase/admin";
import { buildResultsUrl } from "@/lib/results/share";
import { appUrl } from "@/lib/utils";

export async function getSubmissionResultsUrl(submissionId: string): Promise<string | null> {
  const supabase = createAdminClient();

  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("results_token")
    .eq("id", submissionId)
    .maybeSingle();

  if (submission?.results_token) {
    return buildResultsUrl(submission.results_token);
  }

  return null;
}

export async function persistSubmissionResultsToken(
  submissionId: string,
  rawToken: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("geo_submissions")
    .update({ results_token: rawToken })
    .eq("id", submissionId);
}

export function buildThankYouUrl(rawToken: string): string {
  return appUrl(`/thank-you?t=${encodeURIComponent(rawToken)}`);
}
