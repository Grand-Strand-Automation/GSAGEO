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
  | "converted_to_paid";

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
