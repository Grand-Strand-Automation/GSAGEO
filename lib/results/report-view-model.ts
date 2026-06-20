import type { StructuredFinding } from "@/lib/audit/report-builder";
import type { GeoAuditJob, GeoAuditResult, GeoFixPreview, GeoSubmission } from "@/lib/types/database";
import { buildPageAnalysis } from "./page-analysis";
import { scoreInterpretation } from "./score-utils";

export type ScoreCategory = {
  key: string;
  label: string;
  score: number;
  grade: string;
  interpretation: string;
};

export type QuickStat = {
  label: string;
  value: string;
  hint?: string;
};

export type RoadmapBucket = {
  title: string;
  subtitle: string;
  items: {
    title: string;
    summary: string;
    impact: string;
    effort: string;
    pages: string[];
  }[];
};

export type ReportViewModel = {
  companyName: string;
  websiteUrl: string;
  domain: string;
  preparedFor: string;
  auditedAt: string | null;
  publishedAt: string | null;
  auditStatus: string;
  overallScore: number;
  overallGrade: string;
  overallInterpretation: string;
  executiveSummary: string;
  quickStats: QuickStat[];
  categories: ScoreCategory[];
  strongestCategory: ScoreCategory | null;
  weakestCategory: ScoreCategory | null;
  strengths: { title: string; summary: string; evidence_urls?: string[] }[];
  opportunities: StructuredFinding[];
  allFindings: StructuredFinding[];
  findingsByCategory: Record<string, StructuredFinding[]>;
  strengthFindings: StructuredFinding[];
  cautionFindings: StructuredFinding[];
  pageAnalysis: ReturnType<typeof buildPageAnalysis>;
  previews: GeoFixPreview[];
  roadmap: RoadmapBucket[];
  topOpportunityLabel: string | null;
  suggestedTier: string | null;
  pagesReviewed: number;
  sitemapUrlCount: number;
};

type ScorecardJson = {
  overall?: number;
  overallGrade?: string;
  categories?: Record<string, { score: number; grade: string; label: string }>;
};

type FindingsJson = {
  auditedAt?: string;
  baseUrl?: string;
  sitemapUrlCount?: number;
  sitemapUrls?: string[];
  structuredFindings?: StructuredFinding[];
};

type NextStepJson = {
  suggestedTier?: string;
  topOpportunities?: StructuredFinding[];
};

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function groupFindingsByCategory(findings: StructuredFinding[]): Record<string, StructuredFinding[]> {
  return findings.reduce<Record<string, StructuredFinding[]>>((acc, f) => {
    const key = f.category || "general";
    acc[key] = acc[key] ?? [];
    acc[key].push(f);
    return acc;
  }, {});
}

function buildRoadmap(
  findings: StructuredFinding[],
  previews: GeoFixPreview[],
): RoadmapBucket[] {
  const buckets: { key: StructuredFinding["priority"]; title: string; subtitle: string }[] = [
    { key: "fix_first", title: "Fix first", subtitle: "Highest-impact actions to address soon" },
    { key: "improve_next", title: "Improve next", subtitle: "Meaningful gains after foundational fixes" },
    { key: "nice_to_add", title: "Nice to add", subtitle: "Polish and expansion opportunities" },
  ];

  return buckets.map(({ key, title, subtitle }) => {
    const findingItems = findings
      .filter((f) => f.priority === key && f.status !== "Present" && f.status !== "Likely present")
      .slice(0, 4)
      .map((f) => ({
        title: f.label,
        summary: f.recommendation,
        impact: f.impact,
        effort:
          previews.find((p) => p.issue_summary.includes(f.label.slice(0, 8)))?.implementation_effort ??
          (key === "fix_first" ? "medium" : key === "improve_next" ? "light" : "light"),
        pages: f.evidence_urls.slice(0, 2).map((u) => {
          try {
            return new URL(u).pathname || u;
          } catch {
            return u;
          }
        }),
      }));

    return { title, subtitle, items: findingItems };
  });
}

export function buildReportViewModel(input: {
  submission: GeoSubmission;
  job: GeoAuditJob;
  result: GeoAuditResult | null;
  previews: GeoFixPreview[];
}): ReportViewModel {
  const { submission, job, result, previews } = input;
  const scorecard = (result?.scorecard_json ?? {}) as ScorecardJson;
  const findingsJson = (result?.findings_json ?? {}) as FindingsJson;
  const nextSteps = (result?.next_step_json ?? {}) as NextStepJson;

  const overallScore = scorecard.overall ?? 0;
  const categories: ScoreCategory[] = Object.entries(scorecard.categories ?? {}).map(
    ([key, cat]) => ({
      key,
      label: cat.label,
      score: cat.score,
      grade: cat.grade,
      interpretation: scoreInterpretation(cat.score),
    }),
  );

  const sortedCats = [...categories].sort((a, b) => b.score - a.score);
  const allFindings = (findingsJson.structuredFindings ??
    nextSteps.topOpportunities ??
    []) as StructuredFinding[];

  const opportunities = (nextSteps.topOpportunities ??
    allFindings
      .filter((f) => f.status === "Absent" || f.status === "Not confirmed" || f.priority === "fix_first")
      .slice(0, 5)) as StructuredFinding[];

  const strengths = (result?.strengths_json ?? []) as ReportViewModel["strengths"];
  const strengthFindings = allFindings.filter(
    (f) => f.status === "Present" || f.status === "Likely present",
  );
  const cautionFindings = allFindings.filter(
    (f) => f.status === "Not confirmed" || f.status === "Absent",
  );

  const sitemapUrlCount = findingsJson.sitemapUrlCount ?? 0;
  const pagesReviewed = Math.min(14, (findingsJson.sitemapUrls?.length ?? 0) + 1);

  return {
    companyName: submission.company_name,
    websiteUrl: submission.website_url,
    domain: extractDomain(submission.website_url),
    preparedFor: submission.full_name,
    auditedAt: findingsJson.auditedAt ?? job.completed_at ?? result?.created_at ?? null,
    publishedAt: job.published_at ?? job.completed_at ?? null,
    auditStatus: job.status,
    overallScore,
    overallGrade: scorecard.overallGrade ?? "—",
    overallInterpretation: scoreInterpretation(overallScore),
    executiveSummary:
      result?.executive_summary ?? result?.summary ?? "Your audit results are being prepared.",
    quickStats: [
      {
        label: "Readiness score",
        value: `${overallScore}`,
        hint: `/100 · Grade ${scorecard.overallGrade ?? "—"}`,
      },
      {
        label: "Strengths detected",
        value: `${strengths.length}`,
        hint: "Existing assets working for you",
      },
      {
        label: "Priority fixes",
        value: `${opportunities.length}`,
        hint: "High-value opportunities",
      },
      {
        label: "Pages reviewed",
        value: `${pagesReviewed}`,
        hint: `${sitemapUrlCount} URLs in sitemap`,
      },
    ],
    categories,
    strongestCategory: sortedCats[0] ?? null,
    weakestCategory: sortedCats[sortedCats.length - 1] ?? null,
    strengths,
    opportunities,
    allFindings,
    findingsByCategory: groupFindingsByCategory(allFindings),
    strengthFindings,
    cautionFindings,
    pageAnalysis: buildPageAnalysis(
      findingsJson.sitemapUrls,
      findingsJson.baseUrl ?? submission.website_url,
      allFindings,
    ),
    previews,
    roadmap: buildRoadmap(allFindings, previews),
    topOpportunityLabel: opportunities[0]?.label ?? null,
    suggestedTier: nextSteps.suggestedTier ?? null,
    pagesReviewed,
    sitemapUrlCount,
  };
}
