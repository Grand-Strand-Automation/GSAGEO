export type FollowUpStatus =
  | "submitted"
  | "confirmation_sent"
  | "report_ready"
  | "report_sent"
  | "booked_review"
  | "followup_day_1_sent"
  | "followup_day_3_sent"
  | "followup_day_5_sent"
  | "followup_day_7_sent"
  | "converted"
  | "closed_not_interested"
  | "not_a_fit";

export const TERMINAL_FOLLOW_UP_STATUSES: FollowUpStatus[] = [
  "booked_review",
  "converted",
  "closed_not_interested",
  "not_a_fit",
];

export const FOLLOW_UP_CADENCE_DAYS = [1, 3, 5, 7] as const;

export type FollowUpCadenceDay = (typeof FOLLOW_UP_CADENCE_DAYS)[number];

export function isFollowUpStopped(input: {
  follow_up_status?: string | null;
  follow_up_stopped_at?: string | null;
  booked_review_at?: string | null;
  converted_at?: string | null;
}): boolean {
  if (input.follow_up_stopped_at) return true;
  if (input.booked_review_at || input.converted_at) return true;
  const status = input.follow_up_status as FollowUpStatus | undefined;
  return Boolean(status && TERMINAL_FOLLOW_UP_STATUSES.includes(status));
}

export function followUpStatusForCadenceDay(day: FollowUpCadenceDay): FollowUpStatus {
  switch (day) {
    case 1:
      return "followup_day_1_sent";
    case 3:
      return "followup_day_3_sent";
    case 5:
      return "followup_day_5_sent";
    default:
      return "followup_day_7_sent";
  }
}

export function cadenceTimestampField(day: FollowUpCadenceDay): string {
  return `follow_up_day_${day}_sent_at`;
}

export function nextCadenceDay(sent: {
  follow_up_day_1_sent_at?: string | null;
  follow_up_day_3_sent_at?: string | null;
  follow_up_day_5_sent_at?: string | null;
  follow_up_day_7_sent_at?: string | null;
}): FollowUpCadenceDay | null {
  if (!sent.follow_up_day_1_sent_at) return 1;
  if (!sent.follow_up_day_3_sent_at) return 3;
  if (!sent.follow_up_day_5_sent_at) return 5;
  if (!sent.follow_up_day_7_sent_at) return 7;
  return null;
}
