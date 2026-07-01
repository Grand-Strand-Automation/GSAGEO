import { appUrl } from "@/lib/utils";
import { renderBrandedEmail } from "@/lib/email/templates";
import { sendTrackedEmail } from "@/lib/email/send";
import { getSubscriptionPlan, type SubscriptionPlanKey } from "@/lib/subscriptions/config";

type SubscriptionEmailInput = {
  submissionId: string;
  to: string;
  companyName: string;
  token?: string;
};

export async function sendDowngradeConfirmationEmail({
  submissionId,
  to,
  companyName,
  token,
  newPlan,
  effectiveDate,
}: SubscriptionEmailInput & {
  newPlan: SubscriptionPlanKey;
  effectiveDate: string | null;
}) {
  const plan = getSubscriptionPlan(newPlan);
  const dateCopy = effectiveDate
    ? new Date(effectiveDate).toLocaleDateString()
    : "your next billing date";

  return sendTrackedEmail({
    submissionId,
    eventType: "subscription_downgrade_confirmation",
    to,
    subject: `Your plan is switching to ${plan.displayName}`,
    html: renderBrandedEmail({
      headline: `Your plan is switching to ${plan.displayName}`,
      preview: `${companyName} will move to ${plan.displayName} on ${dateCopy}.`,
      bodyParagraphs: [
        `We received your request to switch ${companyName} to ${plan.displayName}.`,
        `This change is scheduled for ${dateCopy}. ${plan.shortSummary}`,
        "You can continue using your current plan through the end of the current billing period.",
      ],
      primaryCta: token
        ? { label: "View subscription settings", href: appUrl(`/results/${token}#subscription`) }
        : undefined,
      support: "Questions? Reply to this email and we will help.",
    }),
  });
}

export async function sendCancellationScheduledEmail({
  submissionId,
  to,
  companyName,
  token,
  effectiveDate,
}: SubscriptionEmailInput & {
  effectiveDate: string | null;
}) {
  const dateCopy = effectiveDate
    ? new Date(effectiveDate).toLocaleDateString()
    : "the end of your current billing period";

  return sendTrackedEmail({
    submissionId,
    eventType: "subscription_cancellation_scheduled",
    to,
    subject: "Your subscription is scheduled to end",
    html: renderBrandedEmail({
      headline: "Your subscription is scheduled to end",
      preview: `${companyName}'s subscription is scheduled to end on ${dateCopy}.`,
      bodyParagraphs: [
        `We received your cancellation request for ${companyName}.`,
        `Your subscription is scheduled to end on ${dateCopy}. Access and support continue through the current billing period.`,
        "You can restart later if monthly AI visibility support makes sense again.",
      ],
      primaryCta: token
        ? { label: "View subscription settings", href: appUrl(`/results/${token}#subscription`) }
        : undefined,
      support: "This is a cancel-anytime subscription. No pressure, no long-term commitment.",
    }),
  });
}

export async function sendRetentionHelpEmail({
  submissionId,
  to,
  companyName,
  token,
  subject,
  headline,
  body,
}: SubscriptionEmailInput & {
  subject: string;
  headline: string;
  body: string;
}) {
  return sendTrackedEmail({
    submissionId,
    eventType: "subscription_retention_help",
    to,
    subject,
    html: renderBrandedEmail({
      headline,
      preview: body,
      bodyParagraphs: [
        body,
        `We will review the best fit for ${companyName} and follow up with a practical next step.`,
      ],
      primaryCta: token
        ? { label: "View subscription settings", href: appUrl(`/results/${token}#subscription`) }
        : undefined,
      support: "You can still cancel anytime.",
    }),
  });
}
