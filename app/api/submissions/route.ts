import { after, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  mapSubmissionToRow,
  submissionSchema,
} from "@/lib/validation/submission";
import { createResultsAccessToken, processAuditJob } from "@/lib/audit/processor";
import { AUDIT_VERSION } from "@/lib/audit/crawl-checks";
import { isAuditReviewRequired } from "@/lib/results/tokens";
import { verifyWebsiteReachable } from "@/lib/validation/website-reachability";
import { handlePostSubmissionFollowUp } from "@/lib/follow-up/service";

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

    const websiteCheck = await verifyWebsiteReachable(parsed.data.website_url);
    if (!websiteCheck.ok) {
      return NextResponse.json(
        { ok: false, error: websiteCheck.error },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const row = mapSubmissionToRow({
      ...parsed.data,
      website_url: websiteCheck.url,
    });

    const { data: submission, error: subError } = await supabase
      .from("geo_submissions")
      .insert(row)
      .select("id")
      .single();

    if (subError || !submission) {
      console.error("[submissions] Insert failed:", subError);
      return NextResponse.json(
        { ok: false, error: "Failed to save submission" },
        { status: 500 },
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
      console.error("[submissions] Job insert failed:", jobError);
      return NextResponse.json(
        { ok: false, error: "Failed to create assessment job" },
        { status: 500 },
      );
    }

    const resultsToken = await createResultsAccessToken(submission.id, job.id);

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
