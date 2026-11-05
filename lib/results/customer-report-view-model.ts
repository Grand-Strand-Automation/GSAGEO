import type { ResultsBundle } from "@/lib/types/database";
import { buildReportViewModel } from "./report-view-model";
import {
  buildCustomerHeadline,
  buildCustomerScorecard,
  buildCustomerSummary,
  buildNextBestStep,
  buildSearchIndexingActions,
  buildWhatThisMayAffect,
  overallStatusLabel,
  simplifyFindingBullet,
  simplifyFixPreview,
  simplifyPriority,
  simplifyStrengthTitle,
  type CustomerSimpleStatus,
  type RecommendationFix,
} from "./plain-language";
import { scoreInterpretation, scoreTone, type ScoreTone } from "./score-utils";
import { getRecommendedOffer } from "@/lib/follow-up/recommend";
import type { BridgeOfferId } from "@/lib/content/follow-up";

export type CustomerScoreRow = {
  key: string;
  label: string;
  score: number;
  grade: string;
  status: CustomerSimpleStatus;
  statusLabel: string;
};

export type CustomerPriority = {
  title: string;
  summary: string;
  whyItMatters: string;
  whatToDoNext: string;
};

export type CustomerFixExample = {
  title: string;
  suggestion: string;
  explanation: string;
};

export type CustomerQuickStat = {
  label: string;
  value: string;
  hint?: string;
};

export type CustomerReportViewModel = {
  companyName: string;
  domain: string;
  websiteUrl: string;
  preparedFor: string;
  publishedAt: string | null;
  auditedAt: string | null;
  headline: string;
  summary: string;
  overallScore: number;
  overallGrade: string;
  overallInterpretation: string;
  overallStatus: string;
  overallStatusTone: ScoreTone;
  whatLooksGood: string[];
  whatNeedsImprovement: string[];
  whatThisMayAffect: string;
  quickStats: CustomerQuickStat[];
  strengthCount: number;
  opportunityCount: number;
  cautionCount: number;
  sitemapUrlCount: number;
  scorecard: CustomerScoreRow[];
  topPriorities: CustomerPriority[];
  searchIndexingActions: CustomerPriority[];
  nextBestStep: string;
  fixExamples: CustomerFixExample[];
  suggestedTier: string | null;
  recommendedOfferId: BridgeOfferId;
};

function uniqueNonEmpty(items: string[], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= limit) break;
  }
  return out;
}

function extractTopFixes(bundle: ResultsBundle): RecommendationFix[] {
  const recommendations = (bundle.result?.recommendations_json ?? {}) as {
    topFixes?: RecommendationFix[];
    allFixes?: RecommendationFix[];
  };
  const nextStep = (bundle.result?.next_step_json ?? {}) as {
    topFixes?: RecommendationFix[];
  };

  const fixes = [
    ...(Array.isArray(nextStep.topFixes) ? nextStep.topFixes : []),
    ...(Array.isArray(recommendations.topFixes) ? recommendations.topFixes : []),
    ...(Array.isArray(recommendations.allFixes) ? recommendations.allFixes : []),
  ];

  const seen = new Set<string>();
  const unique: RecommendationFix[] = [];
  for (const fix of fixes) {
    if (!fix?.title || seen.has(fix.title)) continue;
    seen.add(fix.title);
    unique.push(fix);
  }
  return unique;
}

export function buildCustomerReportViewModel(bundle: ResultsBundle): CustomerReportViewModel {
  const report = buildReportViewModel({
    submission: bundle.submission,
    job: bundle.job,
    result: bundle.result,
    previews: bundle.previews,
  });

  const improvementSource =
    report.cautionFindings.length > 0
      ? report.cautionFindings
      : report.opportunities;

  const whatLooksGood = uniqueNonEmpty(
    [
      ...report.strengths.map((s) => simplifyStrengthTitle(s.title)),
      ...report.strengthFindings.slice(0, 3).map((f) => simplifyFindingBullet(f).split(":")[0] ?? ""),
    ],
    5,
  );

  if (whatLooksGood.length === 0) {
    whatLooksGood.push(
      "Your business is visible online",
      "Your site has a clear general direction",
      "There is a foundation to build on",
    );
  }

  const whatNeedsImprovement = uniqueNonEmpty(
    improvementSource.map((f) => simplifyFindingBullet(f)),
    5,
  );

  if (whatNeedsImprovement.length === 0) {
    whatNeedsImprovement.push(
      "A few pages could explain your services more clearly",
      "Supporting trust content could be easier to find",
    );
  }

  const scorecard = buildCustomerScorecard(report.categories);
  const weakLabels = scorecard
    .filter((row) => row.status !== "good")
    .map((row) => row.label);

  const contentPriorities = report.opportunities.slice(0, 3).map(simplifyPriority);
  const searchIndexingActions = buildSearchIndexingActions(extractTopFixes(bundle));

  // Prefer Search Console / technical fixes first when present, then content priorities.
  const topPriorities = uniquePriorities(
    [...searchIndexingActions.slice(0, 2), ...contentPriorities],
    4,
  );

  const fixExamples = report.previews.slice(0, 2).map(simplifyFixPreview);

  const storedHeadline = bundle.result?.customer_headline?.trim();
  const storedSummary = bundle.result?.customer_executive_summary?.trim();

  const recommended = getRecommendedOffer({
    overallScore: report.overallScore,
    issueCount: whatNeedsImprovement.length,
    suggestedTier: report.suggestedTier,
    selectedPlan: bundle.submission.selected_plan,
  });

  return {
    companyName: report.companyName,
    domain: report.domain,
    websiteUrl: report.websiteUrl,
    preparedFor: report.preparedFor,
    publishedAt: report.publishedAt,
    auditedAt: report.auditedAt,
    headline:
      storedHeadline ||
      buildCustomerHeadline(report.overallScore, whatNeedsImprovement.length),
    summary:
      storedSummary ||
      buildCustomerSummary(
        report.companyName,
        report.overallScore,
        report.strengths.length + report.strengthFindings.length,
        whatNeedsImprovement.length,
      ),
    overallScore: report.overallScore,
    overallGrade: report.overallGrade,
    overallInterpretation: scoreInterpretation(report.overallScore),
    overallStatus: overallStatusLabel(report.overallScore),
    overallStatusTone: scoreTone(report.overallScore),
    whatLooksGood,
    whatNeedsImprovement,
    whatThisMayAffect: buildWhatThisMayAffect(weakLabels),
    quickStats: report.quickStats,
    strengthCount: report.strengths.length,
    opportunityCount: report.opportunities.length,
    cautionCount: report.cautionFindings.length,
    sitemapUrlCount: report.sitemapUrlCount,
    scorecard,
    topPriorities,
    searchIndexingActions,
    nextBestStep: buildNextBestStep(
      topPriorities[0]?.title ?? null,
      report.suggestedTier,
    ),
    fixExamples,
    suggestedTier: report.suggestedTier,
    recommendedOfferId: recommended.id,
  };
}

function uniquePriorities(items: CustomerPriority[], limit: number): CustomerPriority[] {
  const seen = new Set<string>();
  const out: CustomerPriority[] = [];
  for (const item of items) {
    const key = item.title.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}
