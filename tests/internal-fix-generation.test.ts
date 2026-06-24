import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StructuredFinding } from "../lib/audit/report-builder";
import { generateInternalFixDrafts } from "../lib/internal-fixes/generator";
import { mapFindingsToFixes, resolveGenerationMode } from "../lib/internal-fixes/mapping";
import { buildInternalFixContext } from "../lib/internal-fixes/persist";

function finding(overrides: Partial<StructuredFinding>): StructuredFinding {
  return {
    label: "FAQ content",
    category: "content",
    status: "Absent",
    confidence: "high",
    summary: "FAQ page not confirmed.",
    reason: "No FAQ route found.",
    evidence_urls: ["https://example.com"],
    recommendation: "Add FAQ page.",
    priority: "fix_first",
    impact: "high",
    ...overrides,
  };
}

describe("internal fix generation", () => {
  const ctx = buildInternalFixContext({
    companyName: "Acme Co",
    websiteUrl: "https://acme.com",
    primaryService: "Consulting",
    serviceArea: "Myrtle Beach",
    sitemapUrls: ["https://acme.com", "https://acme.com/services"],
  });

  it("skips present findings", () => {
    assert.equal(resolveGenerationMode(finding({ status: "Present" })), "skip");
  });

  it("uses cautious mode for low-confidence not-confirmed issues", () => {
    assert.equal(
      resolveGenerationMode(
        finding({ status: "Not confirmed", confidence: "low", impact: "medium" }),
      ),
      "cautious",
    );
  });

  it("maps FAQ finding to faq_fix", () => {
    const mappings = mapFindingsToFixes([finding({ label: "FAQ content" })]);
    assert.ok(mappings.some((m) => m.fixTypes.includes("faq_fix")));
  });

  it("maps service pages to service_page_fix", () => {
    const mappings = mapFindingsToFixes([
      finding({ label: "Dedicated service pages", category: "services" }),
    ]);
    assert.ok(mappings.some((m) => m.fixTypes.includes("service_page_fix")));
  });

  it("generates internal drafts with employee-only fields", () => {
    const mappings = mapFindingsToFixes([
      finding({ label: "FAQ content" }),
      finding({ label: "Case studies / proof content", category: "trust" }),
    ]);
    const drafts = generateInternalFixDrafts(mappings, ctx);
    assert.ok(drafts.length >= 2);
    for (const d of drafts) {
      assert.ok(d.title.length > 5);
      assert.ok(d.implementation_notes.length > 5);
      assert.ok(Object.keys(d.generated_content).length > 0);
    }
  });

  it("includes caution for cautious generation mode", () => {
    const mappings = mapFindingsToFixes([
      finding({ status: "Not confirmed", confidence: "low", impact: "medium" }),
    ]);
    const drafts = generateInternalFixDrafts(mappings, ctx);
    assert.ok(drafts.some((d) => d.generated_content.caution?.includes("Cautious draft")));
  });
});

describe("customer route isolation", () => {
  it("published-report loader does not reference internal fixes table", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../lib/results/published-report.ts", import.meta.url), "utf8"),
    );
    assert.equal(source.includes("geo_internal_fixes"), false);
  });

  it("customer report loader does not reference internal fixes table", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../lib/results/customer-report.ts", import.meta.url), "utf8"),
    );
    assert.equal(source.includes("geo_internal_fixes"), false);
  });
});
