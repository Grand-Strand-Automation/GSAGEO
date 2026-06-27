import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_SITE_URL, getSiteUrl, absoluteUrl, PUBLIC_INDEX_ROUTES } from "../lib/seo/site-url";
import { HOME_METADATA, AUDIT_METADATA, THANK_YOU_METADATA } from "../lib/seo/metadata";

describe("SEO site configuration", () => {
  it("defaults canonical URL to geo.vercel.app", () => {
    assert.equal(DEFAULT_SITE_URL, "https://geo.vercel.app");
  });

  it("builds absolute URLs from paths", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://geo.vercel.app";
    assert.equal(absoluteUrl("/audit"), "https://geo.vercel.app/audit");
    assert.equal(getSiteUrl(), "https://geo.vercel.app");
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it("includes indexable public routes for sitemap", () => {
    const paths = PUBLIC_INDEX_ROUTES.map((r) => r.path);
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/audit"));
    assert.ok(!paths.includes("/thank-you"));
  });

  it("sets homepage metadata without React App defaults", () => {
    const title =
      typeof HOME_METADATA.title === "object" && HOME_METADATA.title && "absolute" in HOME_METADATA.title
        ? String(HOME_METADATA.title.absolute)
        : String(HOME_METADATA.title);
    assert.match(title, /AI Visibility Assessments/);
    assert.ok(String(HOME_METADATA.description).length > 50);
    assert.doesNotMatch(String(HOME_METADATA.description), /create-react-app/i);
  });

  it("indexes audit page and noindexes thank-you", () => {
    assert.equal(AUDIT_METADATA.robots?.index, true);
    assert.equal(THANK_YOU_METADATA.robots?.index, false);
  });
});
