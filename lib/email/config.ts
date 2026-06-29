import { Resend } from "resend";
import { siteConfig } from "@/lib/brand/site";

let resendClient: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendClient(): Resend | null {
  if (!isEmailConfigured()) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY!.trim());
  }
  return resendClient;
}

export function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `GEO <onboarding@resend.dev>`
  );
}

export function getReplyToAddress(): string {
  return process.env.RESEND_REPLY_TO?.trim() || siteConfig.email;
}
