import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_SITE_URL, getSiteUrl, absoluteUrl, PUBLIC_INDEX_ROUTES } from "../lib/seo/site-url";
import { HOME_METADATA, AUDIT_METADATA, THANK_YOU_METADATA } from "../lib/seo/metadata";

function metadataRobotsIndex(metadata: typeof AUDIT_METADATA): boolean | undefined {
  const robots = metadata.robots;
  if (typeof robots === "object" && robots && "index" in robots) {
    return robots.index;
  }
  return undefined;
}

describe("SEO site configuration", () => {
  it("defaults canonical URL to geo.gsally.com", () => {
    assert.equal(DEFAULT_SITE_URL, "https://geo.gsally.com");
  });

  it("builds absolute URLs from paths", () => {
    const previousAppUrl = process.env.APP_URL;
    const previousPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    process.env.APP_URL = "https://gsageo.vercel.app";
    delete process.env.NEXT_PUBLIC_APP_URL;
    assert.equal(absoluteUrl("/audit"), "https://gsageo.vercel.app/audit");
    assert.equal(getSiteUrl(), "https://gsageo.vercel.app");
    if (previousAppUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previousAppUrl;
    if (previousPublicAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousPublicAppUrl;
  });

  it("falls back to legacy NEXT_PUBLIC_APP_URL when APP_URL is unset", () => {
    const previousAppUrl = process.env.APP_URL;
    const previousPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://geo.gsally.com";
    assert.equal(getSiteUrl(), "https://geo.gsally.com");
    if (previousAppUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previousAppUrl;
    if (previousPublicAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousPublicAppUrl;
  });

  it("includes indexable public routes for sitemap", () => {
    const paths: string[] = PUBLIC_INDEX_ROUTES.map((r) => r.path);
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/audit"));
    assert.ok(!paths.includes("/thank-you"));
  });

  it("sets homepage metadata without React App defaults", () => {
    const title =
      typeof HOME_METADATA.title === "object" && HOME_METADATA.title && "absolute" in HOME_METADATA.title
        ? String(HOME_METADATA.title.absolute)
        : String(HOME_METADATA.title);
    assert.match(title, /Monthly AI Visibility Support/);
    assert.ok(String(HOME_METADATA.description).length > 50);
    assert.doesNotMatch(String(HOME_METADATA.description), /create-react-app/i);
  });

  it("indexes audit page and noindexes thank-you", () => {
    assert.equal(metadataRobotsIndex(AUDIT_METADATA), true);
    assert.equal(metadataRobotsIndex(THANK_YOU_METADATA), false);
  });
});
