import { getFromAddress, getReplyToAddress, getResendClient, isEmailConfigured } from "@/lib/email/config";
import { renderBrandedEmail } from "@/lib/email/templates";
import { absoluteUrl } from "@/lib/seo/site-url";

export type MockupPreviewEmailInput = {
  to: string;
  businessName: string;
  token: string;
  headline?: string;
};

export type MockupPreviewEmailResult =
  | { ok: true; messageId: string | null; skipped: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

export function buildMockupPreviewUrl(token: string): string {
  return absoluteUrl(`/mockup/${token}`);
}

export function buildMockupPreviewEmailHtml(input: MockupPreviewEmailInput): string {
  const previewUrl = buildMockupPreviewUrl(input.token);
  const startUrl = absoluteUrl(`/start?tier=monitor&mockup=${input.token}`);

  return renderBrandedEmail({
    headline: `Your homepage preview for ${input.businessName}`,
    preview: `Open your sample homepage concept for ${input.businessName}.`,
    bodyParagraphs: [
      `Thanks for requesting a homepage mockup for <strong>${escapeHtml(input.businessName)}</strong>.`,
      input.headline
        ? `Your sample concept leads with: “${escapeHtml(input.headline)}”`
        : "Your sample homepage concept is ready to review.",
      "This is a preview direction — not a finished website. You can open it anytime from the link below, or reply to this email if you have questions.",
    ],
    primaryCta: {
      label: "View My Homepage Preview",
      href: previewUrl,
    },
    secondaryCta: {
      label: "Start my $99 Website Refresh",
      href: startUrl,
    },
    support: "If the button does not work, copy and paste this link into your browser:",
    footer: `${previewUrl}`,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send the mockup preview link via Resend.
 * Does not depend on geo_email_events / geo_submissions — mockup leads are a separate table.
 */
export async function sendMockupPreviewEmail(
  input: MockupPreviewEmailInput,
): Promise<MockupPreviewEmailResult> {
  const to = input.to.trim().toLowerCase();
  if (!to || !to.includes("@")) {
    return { ok: false, error: "Invalid recipient email" };
  }

  if (!isEmailConfigured()) {
    console.warn("[mockup:email] Skipped — RESEND_API_KEY not configured");
    return { ok: true, skipped: true, reason: "email_not_configured" };
  }

  const resend = getResendClient();
  if (!resend) {
    return { ok: true, skipped: true, reason: "email_not_configured" };
  }

  const subject = `Your homepage preview for ${input.businessName}`;
  const html = buildMockupPreviewEmailHtml(input);

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to,
      replyTo: getReplyToAddress(),
      subject,
      html,
    });

    if (error) {
      console.error("[mockup:email] Send failed:", error.message);
      return { ok: false, error: error.message };
    }

    console.info("[mockup:email] Sent preview link", {
      toDomain: to.split("@")[1] ?? "unknown",
      messageId: data?.id ?? null,
      business: input.businessName,
    });
    return { ok: true, messageId: data?.id ?? null, skipped: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[mockup:email] Unexpected send error:", message);
    return { ok: false, error: message };
  }
}
