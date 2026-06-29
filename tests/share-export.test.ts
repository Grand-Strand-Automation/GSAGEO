import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isResultsVisible } from "../lib/results/access";
import { buildPdfFilename } from "../lib/results/pdf/generate-pdf";
import { buildResultsUrl, buildPdfUrl } from "../lib/results/share";
import { loadPublishedReportFromBundle } from "../lib/results/published-report";
import type { GeoAuditJob, GeoFixPreview, GeoSubmission, ResultsBundle } from "../lib/types/database";

function mockJob(status: string, publishedAt?: string | null): GeoAuditJob {
  return {
    id: "job-1",
    submission_id: "sub-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status,
    started_at: null,
    completed_at: null,
    failed_at: null,
    failure_reason: null,
    audit_version: "2.0",
    published_at: publishedAt ?? null,
  };
}

function mockBundle(previews: Partial<GeoFixPreview>[]): ResultsBundle {
  return {
    submission: {
      id: "sub-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      full_name: "Test",
      work_email: "t@example.com",
      company_name: "Acme",
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
    } as GeoSubmission,
    job: mockJob("published", new Date().toISOString()),
    result: {
      id: "res-1",
      submission_id: "sub-1",
      audit_job_id: "job-1",
      created_at: new Date().toISOString(),
      summary: "summary",
      executive_summary: "exec",
      scorecard_json: { overall: 80, overallGrade: "B", categories: {} },
      findings_json: {},
      recommendations_json: {},
      next_step_json: {},
    },
    previews: previews as GeoFixPreview[],
  };
}

describe("share and export rules", () => {
  it("treats published jobs as visible", () => {
    assert.equal(isResultsVisible(mockJob("published")), true);
    assert.equal(isResultsVisible(mockJob("awaiting_review")), false);
    assert.equal(isResultsVisible(mockJob("complete", new Date().toISOString())), true);
  });

  it("filters unpublished previews from published bundle", async () => {
    const bundle = mockBundle([
      { id: "1", status: "published" } as GeoFixPreview,
      { id: "2", status: "draft" } as GeoFixPreview,
    ]);
    const result = await loadPublishedReportFromBundle(bundle);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.bundle.previews.length, 1);
      assert.equal(result.bundle.previews[0].status, "published");
    }
  });

  it("rejects draft-only bundle when job not published", async () => {
    const bundle = mockBundle([{ id: "1", status: "published" } as GeoFixPreview]);
    bundle.job = mockJob("awaiting_review");
    const result = await loadPublishedReportFromBundle(bundle);
    assert.equal(result.ok, false);
  });

  it("builds share and pdf urls", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://gsageo.vercel.app";
    assert.match(buildResultsUrl("abc"), /\/results\/abc$/);
    assert.match(buildPdfUrl("abc"), /\/api\/results\/abc\/pdf$/);
  });

  it("builds sensible pdf filenames", () => {
    assert.equal(buildPdfFilename("Acme.com", "2026-03-18T12:00:00Z"), "geo-report-acme.com-2026-03-18.pdf");
    assert.equal(
      buildPdfFilename("Acme.com", "2026-03-18T12:00:00Z", "technical"),
      "geo-report-technical-acme.com-2026-03-18.pdf",
    );
  });
});
