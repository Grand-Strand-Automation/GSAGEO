import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  markFulfillmentOpsComplete,
  processQueuedFulfillmentCycles,
  startSubscriptionFulfillment,
} from "@/lib/subscriptions/fulfillment";
import { isSubscriptionPlanKey } from "@/lib/subscriptions/config";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;
  const supabase = createAdminClient();
  const { data: cycles, error } = await supabase
    .from("geo_fulfillment_cycles")
    .select("*")
    .eq("submission_id", submissionId)
    .order("cycle_number", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, cycles: cycles ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  if (!user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: submissionId } = await params;
  const body = (await request.json()) as {
    action?: string;
    cycleId?: string;
  };

  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("id, selected_plan, current_plan, subscription_status")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
  }

  try {
    switch (body.action) {
      case "mark_ops_complete": {
        if (!body.cycleId) {
          return NextResponse.json({ ok: false, error: "cycleId required" }, { status: 400 });
        }
        const cycle = await markFulfillmentOpsComplete({
          cycleId: body.cycleId,
          completedBy: user.email,
        });
        return NextResponse.json({
          ok: true,
          message: `Cycle #${cycle.cycle_number} marked delivered.`,
          cycle,
        });
      }

      case "start_or_retry": {
        const plan = isSubscriptionPlanKey(submission.current_plan)
          ? submission.current_plan
          : isSubscriptionPlanKey(submission.selected_plan)
            ? submission.selected_plan
            : "growth";
        const { cycle, nextBillingAt } = await startSubscriptionFulfillment({
          submissionId,
          plan,
          initiatedBy: "admin",
        });
        // Process immediately so kickoff does not wait for the next cron tick.
        const processed = await processQueuedFulfillmentCycles(1);
        return NextResponse.json({
          ok: true,
          message: `Fulfillment ready · cycle #${cycle.cycle_number} · next billing ${new Date(nextBillingAt).toLocaleDateString()}`,
          cycle,
          processed,
        });
      }

      case "retry_failed_cycle": {
        if (!body.cycleId) {
          return NextResponse.json({ ok: false, error: "cycleId required" }, { status: 400 });
        }
        const { data: cycle, error } = await supabase
          .from("geo_fulfillment_cycles")
          .update({
            status: "queued",
            error_message: null,
            audit_job_id: null,
            started_at: null,
          })
          .eq("id", body.cycleId)
          .eq("submission_id", submissionId)
          .eq("status", "failed")
          .select("*")
          .maybeSingle();

        if (error || !cycle) {
          return NextResponse.json(
            { ok: false, error: error?.message ?? "Failed cycle not found" },
            { status: 400 },
          );
        }

        const processed = await processQueuedFulfillmentCycles(1);
        return NextResponse.json({
          ok: true,
          message: `Cycle #${cycle.cycle_number} re-queued.`,
          cycle,
          processed,
        });
      }

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
