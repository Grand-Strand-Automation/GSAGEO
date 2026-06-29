import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  markFollowUpStatus,
  sendSubmissionConfirmation,
  stopFollowUp,
} from "@/lib/follow-up/service";
import { deliverReportEmailForJob } from "@/lib/follow-up/report-delivery";
import { trackConversionEvent } from "@/lib/analytics/events";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;
  const body = (await request.json()) as { action?: string };
  const action = body.action;

  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
  }

  const { data: job } = await supabase
    .from("geo_audit_jobs")
    .select("id")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  try {
    switch (action) {
      case "mark_booked":
        await markFollowUpStatus(submissionId, "booked_review", {
          booked_review_at: new Date().toISOString(),
        });
        return NextResponse.json({ ok: true, message: "Marked as review booked." });

      case "mark_converted":
        await markFollowUpStatus(submissionId, "converted", {
          converted_at: new Date().toISOString(),
          follow_up_stopped_at: new Date().toISOString(),
        });
        trackConversionEvent("converted_to_paid", { submissionId });
        return NextResponse.json({ ok: true, message: "Marked as converted." });

      case "stop_follow_up":
        await stopFollowUp(submissionId, "closed_not_interested");
        return NextResponse.json({ ok: true, message: "Follow-up stopped." });

      case "mark_not_a_fit":
        await stopFollowUp(submissionId, "not_a_fit");
        return NextResponse.json({ ok: true, message: "Marked as not a fit." });

      case "resend_confirmation":
        if (!job?.id) {
          return NextResponse.json({ ok: false, error: "No assessment job" }, { status: 400 });
        }
        await supabase
          .from("geo_submissions")
          .update({ confirmation_email_sent_at: null })
          .eq("id", submissionId);
        await sendSubmissionConfirmation({
          submissionId,
          auditJobId: job.id,
          resultsToken: submission.results_token ?? "",
          submission,
          force: true,
        });
        return NextResponse.json({ ok: true, message: "Confirmation email queued." });

      case "resend_report":
        if (!job?.id) {
          return NextResponse.json({ ok: false, error: "No assessment job" }, { status: 400 });
        }
        await supabase
          .from("geo_submissions")
          .update({ report_email_sent_at: null })
          .eq("id", submissionId);
        await deliverReportEmailForJob(job.id);
        return NextResponse.json({ ok: true, message: "Report email queued." });

      default:
        return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Action failed" },
      { status: 500 },
    );
  }
}
