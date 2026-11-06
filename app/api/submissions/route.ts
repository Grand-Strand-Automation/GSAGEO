import { after, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  classifySupabaseError,
  submissionSaveErrorMessage,
} from "@/lib/supabase/errors";
import {
  mapSubmissionToRow,
  submissionSchema,
} from "@/lib/validation/submission";
import { createResultsAccessToken, processAuditJob } from "@/lib/audit/processor";
import { AUDIT_VERSION } from "@/lib/audit/crawl-checks";
import { isAuditReviewRequired } from "@/lib/results/tokens";
import { handlePostSubmissionFollowUp } from "@/lib/follow-up/service";
import { persistSubmissionResultsToken } from "@/lib/follow-up/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: submissionSaveErrorMessage("not_configured"),
          code: "not_configured",
        },
        { status: 503 },
      );
    }

    const supabase = createAdminClient();
    const row = mapSubmissionToRow(parsed.data);

    const { data: submission, error: subError } = await supabase
      .from("geo_submissions")
      .insert(row)
      .select("id")
      .single();

    if (subError || !submission) {
      const kind = classifySupabaseError(subError);
      console.error("[submissions] Insert failed:", {
        kind,
        code: subError?.code,
        message: subError?.message,
        details: subError?.details,
        hint: subError?.hint,
      });
      return NextResponse.json(
        {
          ok: false,
          error: submissionSaveErrorMessage(kind),
          code: kind,
        },
        { status: kind === "schema_missing" || kind === "not_configured" ? 503 : 500 },
      );
    }

    const { data: job, error: jobError } = await supabase
      .from("geo_audit_jobs")
      .insert({
        submission_id: submission.id,
        status: "queued",
        audit_version: AUDIT_VERSION,
        review_required: isAuditReviewRequired(),
      })
      .select("id")
      .single();

    if (jobError || !job) {
      const kind = classifySupabaseError(jobError);
      console.error("[submissions] Job insert failed:", {
        kind,
        code: jobError?.code,
        message: jobError?.message,
        details: jobError?.details,
        hint: jobError?.hint,
      });
      return NextResponse.json(
        {
          ok: false,
          error:
            kind === "schema_missing"
              ? "Assessment job tables are missing. Run supabase/migrations 001–007 in Supabase, then try again."
              : "Failed to create assessment job",
          code: kind,
        },
        { status: kind === "schema_missing" ? 503 : 500 },
      );
    }

    const resultsToken = await createResultsAccessToken(submission.id, job.id);

    // Persist the raw results token immediately so report emails always have a link,
    // even if the background follow-up task is delayed or fails.
    try {
      await persistSubmissionResultsToken(submission.id, resultsToken);
    } catch (err) {
      console.error("[submissions] Failed to persist results token:", err);
    }

    after(async () => {
      try {
        await handlePostSubmissionFollowUp({
          submissionId: submission.id,
          auditJobId: job.id,
          resultsToken,
        });
      } catch (err) {
        console.error("[submissions] Post-submission follow-up failed:", err);
      }
      try {
        await processAuditJob(job.id);
      } catch (err) {
        console.error("[submissions] Background audit failed:", err);
      }
    });

    return NextResponse.json({
      ok: true,
      submissionId: submission.id,
      jobId: job.id,
      resultsToken,
    });
  } catch (err) {
    console.error("[submissions] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
