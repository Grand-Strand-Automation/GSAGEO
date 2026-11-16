import { siteConfig } from "@/lib/brand/site";

export function getReviewBookingUrl(): string {
  return (
    process.env.REVIEW_BOOKING_URL?.trim() ||
    process.env.NEXT_PUBLIC_REVIEW_BOOKING_URL?.trim() ||
    "/audit"
  );
}

export function getAdminNotificationEmail(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || siteConfig.email;
}
