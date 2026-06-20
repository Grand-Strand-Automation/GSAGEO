import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildReportViewModel } from "../lib/results/report-view-model";
import { scoreInterpretation, scoreTone } from "../lib/results/score-utils";
import { buildStructuredFindings, buildStrengths, buildExecutiveSummary } from "../lib/audit/report-builder";
import { generateScorecard, generateRecommendations } from "../lib/audit/scoring";
import { generateFixPreviews } from "../lib/audit/preview-generator";
import { runDiscoveryFromFixtures } from "../lib/audit/discovery";
import { GSALLY_PAGE_SAMPLES, GSALLY_SITEMAP_URLS } from "./fixtures/gsally-sitemap-urls";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const homepageShell = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "fixtures/gsally-homepage-shell.html"),
  "utf8",
);

describe("premium report view model", () => {
  it("builds score interpretation labels", () => {
    assert.equal(scoreInterpretation(90), "Strong foundation");
    assert.equal(scoreTone(40), "attention");
  });

  it("builds a report view model from fixture audit output", () => {
    const discovery = runDiscoveryFromFixtures({
      baseUrl: "https://gsally.com",
      companyName: "Grand Strand Ally",
      homepageHtml: homepageShell,
      sitemapUrls: GSALLY_SITEMAP_URLS,
      pageSamples: GSALLY_PAGE_SAMPLES,
    });

    const scorecard = generateScorecard(discovery);
    const recommendations = generateRecommendations(discovery, scorecard);
    const structuredFindings = buildStructuredFindings(discovery);
    const strengths = buildStrengths(discovery);
    const previews = generateFixPreviews(
      {
        companyName: "Grand Strand Ally",
        websiteUrl: "https://gsally.com",
        primaryService: "IT support",
        serviceArea: "Myrtle Beach",
        discovery,
      },
      structuredFindings.slice(0, 5),
    );

    const vm = buildReportViewModel({
      submission: {
        id: "sub-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: "Test User",
        work_email: "test@example.com",
        company_name: "Grand Strand Ally",
        website_url: "https://gsally.com",
        phone: null,
        primary_service: "IT support",
        service_area: "Myrtle Beach",
        industry: null,
        business_size: null,
        main_goal: null,
        competitors: null,
        cms_platform: null,
        current_challenges: null,
        access_available: null,
        selected_plan: "monitor",
        notes: null,
        status: "reviewing",
      },
      job: {
        id: "job-1",
        submission_id: "sub-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "published",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        failed_at: null,
        failure_reason: null,
        audit_version: "2.0",
        published_at: new Date().toISOString(),
      },
      result: {
        id: "res-1",
        submission_id: "sub-1",
        audit_job_id: "job-1",
        created_at: new Date().toISOString(),
        summary: `Overall GEO score: ${scorecard.overall}/100`,
        executive_summary: buildExecutiveSummary(
          "Grand Strand Ally",
          discovery,
          scorecard,
          recommendations,
        ),
        strengths_json: strengths,
        scorecard_json: scorecard,
        findings_json: {
          auditedAt: discovery.auditedAt,
          baseUrl: discovery.baseUrl,
          sitemapUrlCount: discovery.technical.sitemap_url_count,
          sitemapUrls: discovery.sitemapUrls,
          structuredFindings,
        },
        recommendations_json: recommendations,
        next_step_json: {
          suggestedTier: recommendations.suggestedTier,
          topOpportunities: structuredFindings.slice(0, 5),
        },
      },
      previews: previews.map((p, i) => ({
        id: `preview-${i}`,
        submission_id: "sub-1",
        audit_job_id: "job-1",
        created_at: new Date().toISOString(),
        type: p.type,
        title: p.title,
        issue_summary: p.issue_summary,
        why_it_matters: p.why_it_matters,
        before_text: p.before_text,
        after_text: p.after_text,
        html_preview: p.html_preview,
        evidence_urls: p.evidence_urls,
        priority: p.priority,
        implementation_effort: p.implementation_effort,
        status: "published",
      })),
    });

    assert.ok(vm.overallScore > 0);
    assert.ok(vm.categories.length >= 6);
    assert.ok(vm.quickStats.length === 4);
    assert.ok(vm.pageAnalysis.length > 0);
    assert.ok(vm.previews.length >= 5);
    assert.ok(Object.keys(vm.findingsByCategory).length > 0);
    assert.ok(vm.roadmap.length === 3);
  });
});
