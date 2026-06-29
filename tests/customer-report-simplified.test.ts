import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCustomerReportViewModel } from "../lib/results/customer-report-view-model";
import {
  buildCustomerHeadline,
  buildCustomerScorecard,
  simplifyFindingLabel,
  simplifyText,
} from "../lib/results/plain-language";
import { buildReportViewModel } from "../lib/results/report-view-model";
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

describe("customer-facing simplified report", () => {
  it("translates jargon into plain language", () => {
    assert.match(
      simplifyText("Entity clarity and structured data affect AI retrieval systems."),
      /clear business information/i,
    );
    assert.match(simplifyFindingLabel("FAQ schema"), /FAQ details/i);
    assert.doesNotMatch(simplifyText("GEO audit crawlability"), /GEO/i);
  });

  it("builds a compact customer scorecard with six broad categories", () => {
    const rows = buildCustomerScorecard([
      { key: "crawlability", label: "Crawlability", score: 80, grade: "B", interpretation: "Good" },
      { key: "entityClarity", label: "Entity", score: 40, grade: "D", interpretation: "Weak" },
      { key: "servicePageDepth", label: "Services", score: 55, grade: "C", interpretation: "Moderate" },
      { key: "trustContent", label: "Trust", score: 70, grade: "B", interpretation: "Good" },
      { key: "conversionReadiness", label: "CTA", score: 30, grade: "D", interpretation: "Weak" },
      { key: "answerEngineCoverage", label: "AEC", score: 50, grade: "C", interpretation: "Moderate" },
      { key: "technicalReadiness", label: "Tech", score: 75, grade: "B", interpretation: "Good" },
      { key: "internalStructure", label: "Structure", score: 60, grade: "C", interpretation: "Moderate" },
    ]);
    assert.equal(rows.length, 6);
    assert.ok(rows.every((r) => ["Good", "Needs attention", "Weak"].includes(r.statusLabel)));
  });

  it("builds a simplified customer report view model with limited depth", () => {
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

    const bundle = {
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
        selected_plan: null,
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
        summary: `Overall score: ${scorecard.overall}/100`,
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
    };

    const full = buildReportViewModel(bundle);
    const customer = buildCustomerReportViewModel(bundle);

    assert.ok(customer.headline.length > 10);
    assert.ok(customer.summary.length > 20);
    assert.ok(customer.whatLooksGood.length <= 5);
    assert.ok(customer.whatNeedsImprovement.length <= 5);
    assert.equal(customer.scorecard.length, 6);
    assert.ok(customer.topPriorities.length <= 3);
    assert.ok(customer.fixExamples.length <= 2);
    assert.ok(customer.nextBestStep.length > 10);

    assert.ok(full.allFindings.length > customer.topPriorities.length);
    assert.ok(full.pageAnalysis.length > 0);
    assert.doesNotMatch(customer.summary.toLowerCase(), /json-ld/);
    assert.doesNotMatch(customer.summary.toLowerCase(), /schema/);
  });

  it("uses approachable headlines based on score", () => {
    assert.match(buildCustomerHeadline(80, 2), /good shape/i);
    assert.match(buildCustomerHeadline(60, 4), /promise/i);
    assert.match(buildCustomerHeadline(40, 5), /solid start/i);
  });
});
