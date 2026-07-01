/** Lightweight conversion event hooks — extend with PostHog/gtag when configured. */

export type ConversionEventName =
  | "assessment_submitted"
  | "confirmation_email_sent"
  | "thank_you_book_review_clicked"
  | "report_email_sent"
  | "report_viewed"
  | "review_book_clicked"
  | "followup_email_sent_day_1"
  | "followup_email_sent_day_3"
  | "followup_email_sent_day_5"
  | "followup_email_sent_day_7"
  | "converted_to_paid"
  | "subscription_started"
  | "plan_viewed"
  | "comparison_table_viewed"
  | "downgrade_flow_started"
  | "downgrade_completed"
  | "pause_selected"
  | "cancel_flow_started"
  | "cancellation_reason_selected"
  | "save_offer_shown"
  | "save_offer_accepted"
  | "cancellation_completed"
  | "payment_failed"
  | "payment_recovered"
  | "plan_reactivated"
  | "winback_email_sent"
  | "subscription_restarted";

export function trackConversionEvent(
  name: ConversionEventName,
  properties?: Record<string, string | number | boolean | null>,
): void {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", name, properties ?? {});
  }
}

export function conversionDataAttribute(name: ConversionEventName): Record<string, string> {
  return { "data-conversion-event": name };
}
