import { createAdminClient } from "@/lib/supabase/admin";
import { getFromAddress, getReplyToAddress, getResendClient, isEmailConfigured } from "./config";

export type SendEmailInput = {
  submissionId: string;
  auditJobId?: string | null;
  eventType: string;
  to: string;
  subject: string;
  html: string;
};

export type SendEmailResult =
  | { ok: true; messageId: string | null; skipped: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

export async function sendTrackedEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const supabase = createAdminClient();
  const resend = getResendClient();

  const { data: eventRow, error: insertError } = await supabase
    .from("geo_email_events")
    .insert({
      submission_id: input.submissionId,
      audit_job_id: input.auditJobId ?? null,
      event_type: input.eventType,
      recipient_email: input.to,
      subject: input.subject,
      status: "queued",
    })
    .select("id")
    .single();

  if (insertError || !eventRow) {
    console.error("[email] Failed to log email event:", insertError);
    return { ok: false, error: insertError?.message ?? "Failed to log email event" };
  }

  if (!isEmailConfigured() || !resend) {
    await supabase
      .from("geo_email_events")
      .update({
        status: "skipped",
        error_message: "RESEND_API_KEY not configured",
        sent_at: new Date().toISOString(),
      })
      .eq("id", eventRow.id);

    console.warn("[email] Skipped send — RESEND_API_KEY not configured:", input.eventType);
    return { ok: true, skipped: true, reason: "email_not_configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: input.to,
      replyTo: getReplyToAddress(),
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      await supabase
        .from("geo_email_events")
        .update({
          status: "failed",
          error_message: error.message,
        })
        .eq("id", eventRow.id);
      console.error("[email] Send failed:", input.eventType, error.message);
      return { ok: false, error: error.message };
    }

    await supabase
      .from("geo_email_events")
      .update({
        status: "sent",
        provider_message_id: data?.id ?? null,
        sent_at: new Date().toISOString(),
      })
      .eq("id", eventRow.id);

    return { ok: true, messageId: data?.id ?? null, skipped: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    await supabase
      .from("geo_email_events")
      .update({
        status: "failed",
        error_message: message,
      })
      .eq("id", eventRow.id);
    console.error("[email] Unexpected send error:", input.eventType, err);
    return { ok: false, error: message };
  }
}
