import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCustomerExecutiveContent } from "../lib/audit/customer-summary";
import { buildStructuredFindings, buildStrengths } from "../lib/audit/report-builder";
import { generateScorecard } from "../lib/audit/scoring";
import { runDiscoveryFromFixtures } from "../lib/audit/discovery";
import { buildCustomerReportViewModel } from "../lib/results/customer-report-view-model";
import { GSALLY_PAGE_SAMPLES, GSALLY_SITEMAP_URLS } from "./fixtures/gsally-sitemap-urls";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const homepageShell = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "fixtures/gsally-homepage-shell.html"),
  "utf8",
);

describe("audit-time customer executive summary", () => {
  it("generates plain-English headline and summary without technical jargon", () => {
    const discovery = runDiscoveryFromFixtures({
      baseUrl: "https://gsally.com",
      companyName: "Grand Strand Ally",
      homepageHtml: homepageShell,
      sitemapUrls: GSALLY_SITEMAP_URLS,
      pageSamples: GSALLY_PAGE_SAMPLES,
    });

    const scorecard = generateScorecard(discovery);
    const structuredFindings = buildStructuredFindings(discovery);
    const strengths = buildStrengths(discovery);

    const content = buildCustomerExecutiveContent({
      companyName: "Grand Strand Ally",
      scorecard,
      strengths,
      structuredFindings,
    });

    assert.ok(content.customerHeadline.length > 10);
    assert.ok(content.customerExecutiveSummary.length > 30);
    assert.doesNotMatch(content.customerExecutiveSummary.toLowerCase(), /json-ld/);
    assert.doesNotMatch(content.customerExecutiveSummary.toLowerCase(), /\/100/);
    assert.doesNotMatch(content.customerHeadline.toLowerCase(), /geo/);
  });

  it("prefers stored customer summary fields in the customer report view model", () => {
    const vm = buildCustomerReportViewModel({
      submission: {
        id: "sub-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: "Test User",
        work_email: "test@example.com",
        company_name: "Acme Co",
        website_url: "https://acme.com",
        phone: null,
        primary_service: null,
        service_area: null,
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
        started_at: null,
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
        summary: "technical summary",
        executive_summary: "Technical executive summary with GEO score 72/100.",
        customer_headline: "Stored customer headline for Acme Co",
        customer_executive_summary:
          "Stored plain-English summary that should appear on the customer report.",
        scorecard_json: {
          overall: 72,
          overallGrade: "C",
          categories: {
            entityClarity: { score: 40, grade: "D", label: "Entity Clarity" },
            servicePageDepth: { score: 80, grade: "B", label: "Service-Page Depth" },
            trustContent: { score: 70, grade: "B", label: "Trust and Proof Content" },
            conversionReadiness: { score: 55, grade: "C", label: "Conversion Readiness" },
            answerEngineCoverage: { score: 50, grade: "C", label: "Answer-Engine Coverage" },
            crawlability: { score: 75, grade: "B", label: "Crawlability" },
            technicalReadiness: { score: 65, grade: "C", label: "Technical Readiness" },
            internalStructure: { score: 60, grade: "C", label: "Internal Structure" },
          },
        },
        findings_json: { structuredFindings: [] },
        next_step_json: {},
      },
      previews: [],
    });

    assert.equal(vm.headline, "Stored customer headline for Acme Co");
    assert.equal(
      vm.summary,
      "Stored plain-English summary that should appear on the customer report.",
    );
  });
});
