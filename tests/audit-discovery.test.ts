import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { isAssetPresent } from "../lib/audit/asset-detection";
import { runDiscoveryFromFixtures } from "../lib/audit/discovery";
import { isJsAppShell } from "../lib/audit/js-shell";
import { parseRobotsTxt, parseSitemapXml } from "../lib/audit/crawl-checks";
import { generateRecommendations, generateScorecard } from "../lib/audit/scoring";
import { GSALLY_PAGE_SAMPLES, GSALLY_SITEMAP_URLS } from "./fixtures/gsally-sitemap-urls";

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const homepageShell = readFileSync(join(fixtureDir, "gsally-homepage-shell.html"), "utf8");

function gsallyDiscovery() {
  return runDiscoveryFromFixtures({
    baseUrl: "https://gsally.com",
    companyName: "Grand Strand Ally",
    homepageHtml: homepageShell,
    sitemapUrls: GSALLY_SITEMAP_URLS,
    robotsOk: true,
    robotsUrl: "https://gsally.com/robots.txt",
    sitemapEvidenceUrls: ["https://gsally.com/sitemap.xml"],
    pageSamples: GSALLY_PAGE_SAMPLES,
  });
}

describe("GEO audit discovery — gsally.com regression", () => {
  const discovery = gsallyDiscovery();

  it("detects JS app shell on homepage", () => {
    assert.equal(isJsAppShell(homepageShell), true);
    assert.equal(discovery.homepageIsJsShell, true);
  });

  it("marks robots.txt and sitemap as present", () => {
    assert.equal(discovery.technical.robots_txt.status, "present");
    assert.equal(discovery.technical.sitemap_xml.status, "present");
    assert.ok(discovery.technical.sitemap_url_count >= 10);
  });

  it("detects organization and service schema in raw HTML", () => {
    assert.equal(discovery.schema.organization_schema.status, "present");
    assert.equal(discovery.schema.service_schema.status, "present");
  });

  it("does not false-negative core content pages", () => {
    const { assets } = discovery;
    assert.ok(isAssetPresent(assets.faq_content_presence), "FAQ");
    assert.ok(isAssetPresent(assets.process_page), "process");
    assert.ok(isAssetPresent(assets.case_studies), "case studies");
    assert.ok(isAssetPresent(assets.contact_page), "contact");
    assert.ok(isAssetPresent(assets.about_page), "about");
    assert.ok(isAssetPresent(assets.conversion_page), "conversion");
    assert.ok(isAssetPresent(assets.service_pages), "service pages");
    assert.ok(isAssetPresent(assets.educational_content), "educational");
  });

  it("includes evidence URLs for FAQ and service pages", () => {
    assert.ok(discovery.assets.faq_content_presence.evidence_urls.some((u) => u.includes("/faq")));
    assert.ok((discovery.assets.service_pages.count ?? 0) >= 5);
    assert.ok(discovery.assets.service_pages.evidence_urls.length >= 5);
  });

  it("does not recommend missing FAQ when FAQ is present", () => {
    const scorecard = generateScorecard(discovery);
    const recs = generateRecommendations(discovery, scorecard);
    const missingFaq = recs.allContentGaps.some((g) => /FAQ Content Not Confirmed/i.test(g.title));
    assert.equal(missingFaq, false);
    const faqSchemaGap = recs.allContentGaps.some((g) => /FAQ Schema/i.test(g.title));
    assert.equal(faqSchemaGap, true);
  });

  it("never marks discovered sitemap assets as absent", () => {
    for (const finding of Object.values(discovery.assets)) {
      assert.notEqual(finding.status, "absent");
    }
  });
});

describe("sitemap and robots parsing", () => {
  it("parses robots sitemap directive", () => {
    const parsed = parseRobotsTxt("User-agent: *\nSitemap: https://gsally.com/sitemap.xml", "https://gsally.com");
    assert.equal(parsed.present, true);
    assert.deepEqual(parsed.sitemapUrls, ["https://gsally.com/sitemap.xml"]);
  });

  it("parses sitemap loc entries", () => {
    const xml = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://gsally.com/faq</loc></url></urlset>`;
    const parsed = parseSitemapXml(xml, "https://gsally.com");
    assert.deepEqual(parsed.urls, ["https://gsally.com/faq"]);
  });
});
