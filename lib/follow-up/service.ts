import {
  BRIDGE_OFFERS,
  EMAIL_COPY,
  type FollowUpEmailKey,
} from "@/lib/content/follow-up";
import { getReviewBookingUrl, getAdminNotificationEmail } from "@/lib/follow-up/config";
import { getRecommendedOffer } from "@/lib/follow-up/recommend";
import type { FollowUpStatus } from "@/lib/follow-up/status";
import { renderBrandedEmail } from "@/lib/email/templates";
import { sendTrackedEmail } from "@/lib/email/send";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildThankYouUrl, getSubmissionResultsUrl, persistSubmissionResultsToken } from "@/lib/follow-up/tokens";
import { trackConversionEvent } from "@/lib/analytics/events";
import { appUrl } from "@/lib/utils";
import type { GeoSubmission } from "@/lib/types/database";

type SubmissionRow = Pick<
  GeoSubmission,
  | "id"
  | "full_name"
  | "work_email"
  | "company_name"
  | "website_url"
  | "selected_plan"
  | "follow_up_status"
  | "recommended_offer"
  | "results_token"
  | "confirmation_email_sent_at"
  | "report_email_sent_at"
  | "admin_notified_at"
>;

type ReportContext = {
  headline?: string | null;
  summary?: string | null;
  overallScore?: number;
  issueCount?: number;
  suggestedTier?: string | null;
};

async function updateFollowUp(
  submissionId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("geo_submissions")
    .update({
      ...patch,
      last_contacted_at: patch.last_contacted_at ?? new Date().toISOString(),
    })
    .eq("id", submissionId);
}

function emailForKey(
  key: FollowUpEmailKey,
  ctx: {
    companyName: string;
    bookingUrl: string;
    reportUrl?: string | null;
    headlineFinding?: string | null;
    offerName?: string;
  },
): { subject: string; html: string } {
  const booking = ctx.bookingUrl;

  switch (key) {
    case "confirmation": {
      const copy = EMAIL_COPY.confirmation;
      return {
        subject: copy.subject,
        html: renderBrandedEmail({
          headline: copy.headline,
          preview: copy.preview,
          bodyParagraphs: copy.body,
          primaryCta: { label: copy.cta, href: booking },
          support: copy.support,
        }),
      };
    }
    case "reportReady": {
      const copy = EMAIL_COPY.reportReady;
      const paragraphs = [
        copy.intro,
        ctx.headlineFinding
          ? `One headline from your assessment: ${ctx.headlineFinding}`
          : copy.insideBlock,
        copy.closing,
      ];
      return {
        subject: copy.subject,
        html: renderBrandedEmail({
          headline: copy.headline,
          preview: copy.preview,
          bodyParagraphs: paragraphs,
          primaryCta: { label: copy.cta, href: booking },
          secondaryCta: ctx.reportUrl
            ? { label: copy.viewReportCta, href: ctx.reportUrl }
            : undefined,
        }),
      };
    }
    case "followUpDay1":
    case "followUpDay3":
    case "followUpDay5":
    case "followUpDay7": {
      const copy = EMAIL_COPY[key];
      const body =
        key === "followUpDay3" && ctx.offerName
          ? [
              copy.body[0],
              copy.body[1].replace("GEO Quick Wins Sprint", ctx.offerName),
            ]
          : copy.body;
      return {
        subject: copy.subject,
        html: renderBrandedEmail({
          headline: copy.headline,
          preview: copy.preview,
          bodyParagraphs: body,
          primaryCta: { label: copy.cta, href: booking },
        }),
      };
    }
    case "adminNewSubmission": {
      const copy = EMAIL_COPY.adminNewSubmission;
      return {
        subject: `${copy.subject} — ${ctx.companyName}`,
        html: renderBrandedEmail({
          headline: copy.headline,
          bodyParagraphs: [
            `Company: ${ctx.companyName}`,
            ctx.reportUrl ? `Results: ${ctx.reportUrl}` : "Assessment processing has started.",
          ],
          primaryCta: ctx.reportUrl
            ? { label: "Open admin", href: ctx.reportUrl }
            : undefined,
        }),
      };
    }
  }
}

export async function sendSubmissionConfirmation(input: {
  submissionId: string;
  auditJobId: string;
  resultsToken: string;
  submission: SubmissionRow;
  force?: boolean;
}): Promise<void> {
  if (!input.force && input.submission.confirmation_email_sent_at) return;

  const bookingUrl = getReviewBookingUrl();
  const { subject, html } = emailForKey("confirmation", {
    companyName: input.submission.company_name,
    bookingUrl,
  });

  const result = await sendTrackedEmail({
    submissionId: input.submissionId,
    auditJobId: input.auditJobId,
    eventType: "confirmation",
    to: input.submission.work_email,
    subject,
    html,
  });

  if (result.ok && !result.skipped) {
    await updateFollowUp(input.submissionId, {
      follow_up_status: "confirmation_sent" satisfies FollowUpStatus,
      confirmation_email_sent_at: new Date().toISOString(),
    });
    trackConversionEvent("confirmation_email_sent", { submissionId: input.submissionId });
  }
}

export async function sendAdminNewSubmissionNotification(input: {
  submissionId: string;
  auditJobId: string;
  submission: SubmissionRow;
  adminUrl: string;
}): Promise<void> {
  const { subject, html } = emailForKey("adminNewSubmission", {
    companyName: input.submission.company_name,
    bookingUrl: getReviewBookingUrl(),
    reportUrl: input.adminUrl,
  });

  const result = await sendTrackedEmail({
    submissionId: input.submissionId,
    auditJobId: input.auditJobId,
    eventType: "admin_new_submission",
    to: getAdminNotificationEmail(),
    subject,
    html,
  });

  if (result.ok && !result.skipped) {
    await updateFollowUp(input.submissionId, {
      admin_notified_at: new Date().toISOString(),
    });
  }
}

export async function sendReportDeliveryEmail(input: {
  submissionId: string;
  auditJobId: string;
  report: ReportContext;
}): Promise<void> {
  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", input.submissionId)
    .single();

  if (!submission) return;
  if (submission.report_email_sent_at) return;

  const offer = getRecommendedOffer({
    overallScore: input.report.overallScore,
    issueCount: input.report.issueCount,
    suggestedTier: input.report.suggestedTier,
    selectedPlan: submission.selected_plan,
  });

  const reportUrl = await getSubmissionResultsUrl(input.submissionId);
  const { subject, html } = emailForKey("reportReady", {
    companyName: submission.company_name,
    bookingUrl: getReviewBookingUrl(),
    reportUrl,
    headlineFinding: input.report.headline ?? input.report.summary,
    offerName: offer.name,
  });

  const result = await sendTrackedEmail({
    submissionId: input.submissionId,
    auditJobId: input.auditJobId,
    eventType: "report_ready",
    to: submission.work_email,
    subject,
    html,
  });

  if (result.ok && !result.skipped) {
    await updateFollowUp(input.submissionId, {
      follow_up_status: "report_sent" satisfies FollowUpStatus,
      report_email_sent_at: new Date().toISOString(),
      recommended_offer: offer.id,
    });
    trackConversionEvent("report_email_sent", { submissionId: input.submissionId });
  }
}

export async function sendCadenceFollowUpEmail(input: {
  submissionId: string;
  auditJobId: string | null;
  day: 1 | 3 | 5 | 7;
}): Promise<boolean> {
  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", input.submissionId)
    .single();

  if (!submission) return false;

  const keyMap = {
    1: "followUpDay1",
    3: "followUpDay3",
    5: "followUpDay5",
    7: "followUpDay7",
  } as const;

  const statusMap = {
    1: "followup_day_1_sent",
    3: "followup_day_3_sent",
    5: "followup_day_5_sent",
    7: "followup_day_7_sent",
  } as const;

  const timestampMap = {
    1: "follow_up_day_1_sent_at",
    3: "follow_up_day_3_sent_at",
    5: "follow_up_day_5_sent_at",
    7: "follow_up_day_7_sent_at",
  } as const;

  const offerId = submission.recommended_offer ?? "quick-wins-sprint";
  const offerName =
    BRIDGE_OFFERS[offerId as keyof typeof BRIDGE_OFFERS]?.name ?? BRIDGE_OFFERS["quick-wins-sprint"].name;

  const { subject, html } = emailForKey(keyMap[input.day], {
    companyName: submission.company_name,
    bookingUrl: getReviewBookingUrl(),
    offerName,
  });

  const result = await sendTrackedEmail({
    submissionId: input.submissionId,
    auditJobId: input.auditJobId,
    eventType: `follow_up_day_${input.day}`,
    to: submission.work_email,
    subject,
    html,
  });

  if (result.ok && !result.skipped) {
    await updateFollowUp(input.submissionId, {
      follow_up_status: statusMap[input.day],
      [timestampMap[input.day]]: new Date().toISOString(),
    });
    trackConversionEvent(`followup_email_sent_day_${input.day}`, {
      submissionId: input.submissionId,
    });
    return true;
  }

  return false;
}

export async function handlePostSubmissionFollowUp(input: {
  submissionId: string;
  auditJobId: string;
  resultsToken: string;
}): Promise<void> {
  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("geo_submissions")
    .select("*")
    .eq("id", input.submissionId)
    .single();

  if (!submission) return;

  await persistSubmissionResultsToken(input.submissionId, input.resultsToken);

  const adminUrl = appUrl(`/admin/submissions/${input.submissionId}`);

  await Promise.all([
    sendSubmissionConfirmation({
      submissionId: input.submissionId,
      auditJobId: input.auditJobId,
      resultsToken: input.resultsToken,
      submission,
    }),
    sendAdminNewSubmissionNotification({
      submissionId: input.submissionId,
      auditJobId: input.auditJobId,
      submission,
      adminUrl,
    }),
  ]);

  trackConversionEvent("assessment_submitted", { submissionId: input.submissionId });
}

export async function markFollowUpStatus(
  submissionId: string,
  status: FollowUpStatus,
  extra?: Record<string, unknown>,
): Promise<void> {
  await updateFollowUp(submissionId, {
    follow_up_status: status,
    ...extra,
  });
}

export async function stopFollowUp(submissionId: string, status: FollowUpStatus): Promise<void> {
  await updateFollowUp(submissionId, {
    follow_up_status: status,
    follow_up_stopped_at: new Date().toISOString(),
  });
}
