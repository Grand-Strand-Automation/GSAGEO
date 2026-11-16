import { OPS_CONTACT_EMAIL } from "@/lib/brand/ops-contact";

/** Server/email booking link. Falls back to /audit when no calendar URL is configured. */
export function getReviewBookingUrl(): string {
  return (
    process.env.REVIEW_BOOKING_URL?.trim() ||
    process.env.NEXT_PUBLIC_REVIEW_BOOKING_URL?.trim() ||
    "/audit"
  );
}

export function getAdminNotificationEmail(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || OPS_CONTACT_EMAIL;
}
