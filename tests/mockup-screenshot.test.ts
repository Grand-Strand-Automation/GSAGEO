import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { captureHomepageScreenshot } from "../lib/mockup/screenshot";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("captureHomepageScreenshot", () => {
  it("returns image URL from Microlink JSON response", async () => {
    globalThis.fetch = mock.fn(async () =>
      new Response(
        JSON.stringify({
          status: "success",
          data: {
            title: "Coastal Marine | Boat Service",
            description: "Local marine service",
            screenshot: { url: "https://cdn.microlink.io/shot.jpg" },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    ) as unknown as typeof fetch;

    const result = await captureHomepageScreenshot("https://example.com");
    assert.equal(result.ok, true);
    assert.equal(result.imageUrl, "https://cdn.microlink.io/shot.jpg");
    assert.equal(result.isChallengePage, false);
    assert.equal(result.provider, "microlink");
  });

  it("rejects Cloudflare challenge screenshots", async () => {
    globalThis.fetch = mock.fn(async () =>
      new Response(
        JSON.stringify({
          status: "success",
          data: {
            title: "www.coastalmarinemb.com",
            description: "Performing security verification",
            screenshot: { url: "https://cdn.microlink.io/challenge.jpg" },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    ) as unknown as typeof fetch;

    const result = await captureHomepageScreenshot("https://coastalmarinemb.com");
    assert.equal(result.ok, false);
    assert.equal(result.imageUrl, null);
    assert.equal(result.isChallengePage, true);
  });

  it("returns ok:false without throwing when Microlink fails", async () => {
    globalThis.fetch = mock.fn(async () =>
      new Response("rate limited", { status: 429 }),
    ) as unknown as typeof fetch;

    const result = await captureHomepageScreenshot("https://example.com");
    assert.equal(result.ok, false);
    assert.equal(result.imageUrl, null);
    assert.match(result.error ?? "", /429/);
  });

  it("returns ok:false on network abort/error", async () => {
    globalThis.fetch = mock.fn(async () => {
      throw new Error("aborted");
    }) as unknown as typeof fetch;

    const result = await captureHomepageScreenshot("https://example.com");
    assert.equal(result.ok, false);
    assert.equal(result.imageUrl, null);
    assert.match(result.error ?? "", /aborted/i);
  });
});
