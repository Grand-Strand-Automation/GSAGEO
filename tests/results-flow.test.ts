import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateFixPreviews } from "../lib/audit/preview-generator";
import { runDiscoveryFromFixtures } from "../lib/audit/discovery";
import { GSALLY_PAGE_SAMPLES, GSALLY_SITEMAP_URLS } from "./fixtures/gsally-sitemap-urls";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateResultsToken,
  hashResultsToken,
  isAuditAutoPublish,
} from "../lib/results/tokens";
import { buildStructuredFindings, topOpportunities } from "../lib/audit/report-builder";

const homepageShell = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "fixtures/gsally-homepage-shell.html"),
  "utf8",
);

describe("results flow helpers", () => {
  it("generates unique token hashes", () => {
    const a = hashResultsToken(generateResultsToken());
    const b = hashResultsToken(generateResultsToken());
    assert.notEqual(a, b);
    assert.equal(a.length, 64);
  });

  it("auto-publish defaults on when review not required", () => {
    const prev = process.env.AUDIT_REVIEW_REQUIRED;
    delete process.env.AUDIT_REVIEW_REQUIRED;
    assert.equal(isAuditAutoPublish(), true);
    process.env.AUDIT_REVIEW_REQUIRED = prev;
  });

  it("generates fix previews from gsally discovery", () => {
    const discovery = runDiscoveryFromFixtures({
      baseUrl: "https://gsally.com",
      companyName: "Grand Strand Ally",
      homepageHtml: homepageShell,
      sitemapUrls: GSALLY_SITEMAP_URLS,
      pageSamples: GSALLY_PAGE_SAMPLES,
    });
    const findings = buildStructuredFindings(discovery);
    const previews = generateFixPreviews(
      {
        companyName: "Grand Strand Ally",
        websiteUrl: "https://gsally.com",
        primaryService: "IT support",
        serviceArea: "Myrtle Beach",
        discovery,
      },
      topOpportunities(findings),
    );
    assert.ok(previews.length >= 5);
    assert.ok(previews.some((p) => p.type === "faq"));
    assert.ok(previews.every((p) => p.after_text.length > 20));
  });
});
