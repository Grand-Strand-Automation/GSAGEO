import { createAdminClient } from "@/lib/supabase/admin";
import {
  cadenceTimestampField,
  followUpStatusForCadenceDay,
  isFollowUpStopped,
  nextCadenceDay,
  type FollowUpCadenceDay,
} from "@/lib/follow-up/status";
import { sendCadenceFollowUpEmail } from "@/lib/follow-up/service";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / MS_PER_DAY;
}

export async function processFollowUpCadence(limit = 25): Promise<number> {
  const supabase = createAdminClient();
  const { data: submissions } = await supabase
    .from("geo_submissions")
    .select(
      "id, follow_up_status, report_email_sent_at, follow_up_stopped_at, booked_review_at, converted_at, follow_up_day_1_sent_at, follow_up_day_3_sent_at, follow_up_day_5_sent_at, follow_up_day_7_sent_at",
    )
    .not("report_email_sent_at", "is", null)
    .is("follow_up_stopped_at", null)
    .is("booked_review_at", null)
    .is("converted_at", null)
    .order("report_email_sent_at", { ascending: true })
    .limit(limit);

  if (!submissions?.length) return 0;

  let sent = 0;

  for (const submission of submissions) {
    if (isFollowUpStopped(submission)) continue;
    if (!submission.report_email_sent_at) continue;

    const day = nextCadenceDay(submission);
    if (!day) continue;

    const elapsed = daysSince(submission.report_email_sent_at);
    if (elapsed < day) continue;

    const { data: job } = await supabase
      .from("geo_audit_jobs")
      .select("id")
      .eq("submission_id", submission.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const ok = await sendCadenceFollowUpEmail({
      submissionId: submission.id,
      auditJobId: job?.id ?? null,
      day,
    });

    if (ok) sent += 1;
  }

  return sent;
}

export function shouldSendCadenceDay(
  reportEmailSentAt: string,
  day: FollowUpCadenceDay,
  sent: Record<string, string | null | undefined>,
): boolean {
  const field = cadenceTimestampField(day);
  if (sent[field]) return false;
  return daysSince(reportEmailSentAt) >= day;
}

export { followUpStatusForCadenceDay };
