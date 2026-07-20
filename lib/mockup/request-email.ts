import { getFromAddress, getReplyToAddress, getResendClient, isEmailConfigured } from "@/lib/email/config";
import { renderBrandedEmail } from "@/lib/email/templates";
import { siteConfig } from "@/lib/brand/site";
import { absoluteUrl } from "@/lib/seo/site-url";
import {
  improveLabel,
  interestLabel,
  requestCategoryLabel,
  requestStyleLabel,
  type MockupLeadRequestInput,
} from "@/lib/validation/mockup-request";

export type MockupRequestEmailResult =
  | { ok: true; messageId: string | null; skipped: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildMockupRequestConfirmationHtml(input: {
  businessName: string;
  interest: string;
}): string {
  return renderBrandedEmail({
    headline: `We received your mockup request for ${input.businessName}`,
    preview: `Thanks — we'll review ${input.businessName} and follow up by email.`,
    bodyParagraphs: [
      `Thanks for requesting a homepage mockup for <strong>${escapeHtml(input.businessName)}</strong>.`,
      "Our team will review your website and details, then follow up by email with next steps — including whether a $99 homepage refresh or a full website redesign looks like the better fit.",
      `You noted interest in: <strong>${escapeHtml(interestLabel(input.interest))}</strong>.`,
      "This is not an instant automated preview. A custom concept is prepared after review.",
    ],
    primaryCta: {
      label: "Explore design options",
      href: absoluteUrl("/#pricing"),
    },
    secondaryCta: {
      label: "Learn about GEO next",
      href: absoluteUrl("/#geo"),
    },
    support: "Questions? Just reply to this email.",
  });
}

export function buildMockupRequestInternalHtml(input: MockupLeadRequestInput): string {
  const style =
    input.preferred_style && input.preferred_style.length > 0
      ? requestStyleLabel(input.preferred_style)
      : "(not specified)";

  return renderBrandedEmail({
    headline: `New mockup request: ${input.business_name}`,
    preview: `Mockup request from ${input.business_name}`,
    bodyParagraphs: [
      `<strong>Company:</strong> ${escapeHtml(input.business_name)}`,
      `<strong>Website:</strong> ${escapeHtml(input.website_url)}`,
      `<strong>Email:</strong> ${escapeHtml(input.email)}`,
      `<strong>Phone:</strong> ${escapeHtml(input.phone?.trim() || "(none)")}`,
      `<strong>Industry:</strong> ${escapeHtml(requestCategoryLabel(input.business_category))}`,
      `<strong>Improve:</strong> ${escapeHtml(improveLabel(input.improve_goal))}`,
      `<strong>Interest:</strong> ${escapeHtml(interestLabel(input.interest))}`,
      `<strong>Style:</strong> ${escapeHtml(style)}`,
      `<strong>Notes:</strong> ${escapeHtml(input.notes?.trim() || "(none)")}`,
    ],
    primaryCta: {
      label: "Open admin mockups",
      href: absoluteUrl("/admin/mockups"),
    },
  });
}

async function sendHtmlEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<MockupRequestEmailResult> {
  const to = params.to.trim().toLowerCase();
  if (!to || !to.includes("@")) {
    return { ok: false, error: "Invalid recipient email" };
  }

  if (!isEmailConfigured()) {
    console.warn("[mockup-request:email] Skipped — RESEND_API_KEY not configured");
    return { ok: true, skipped: true, reason: "email_not_configured" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: true, skipped: true, reason: "email_not_configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: [to],
      replyTo: getReplyToAddress(),
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[mockup-request:email] Send failed:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, messageId: data?.id ?? null, skipped: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    console.error("[mockup-request:email] Exception:", message);
    return { ok: false, error: message };
  }
}

export async function sendMockupRequestConfirmation(input: {
  to: string;
  businessName: string;
  interest: string;
}): Promise<MockupRequestEmailResult> {
  return sendHtmlEmail({
    to: input.to,
    subject: `We received your mockup request for ${input.businessName}`,
    html: buildMockupRequestConfirmationHtml(input),
  });
}

export async function sendMockupRequestInternalNotice(
  input: MockupLeadRequestInput,
): Promise<MockupRequestEmailResult> {
  return sendHtmlEmail({
    to: siteConfig.email,
    subject: `New mockup request: ${input.business_name}`,
    html: buildMockupRequestInternalHtml(input),
  });
}
