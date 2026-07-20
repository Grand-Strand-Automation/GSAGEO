import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMockupPreviewEmailHtml,
  buildMockupPreviewUrl,
} from "../lib/mockup/preview-email";

describe("mockup preview email", () => {
  it("builds a preview URL for the mockup token", () => {
    const url = buildMockupPreviewUrl("abc123token");
    assert.match(url, /\/mockup\/abc123token$/);
  });

  it("renders branded HTML with preview and refresh CTAs", () => {
    const html = buildMockupPreviewEmailHtml({
      to: "owner@example.com",
      businessName: "Coastal Marine",
      token: "tokensecret",
      headline: "Marine service you can trust",
    });
    assert.match(html, /Coastal Marine/);
    assert.match(html, /Marine service you can trust/);
    assert.match(html, /View My Homepage Preview/);
    assert.match(html, /\$99 Website Refresh/);
    assert.match(html, /\/mockup\/tokensecret/);
  });
});
