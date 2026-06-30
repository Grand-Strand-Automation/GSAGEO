import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mapSubmissionToRow,
  normalizeArrayField,
  normalizeWebsiteUrl,
  submissionSchema,
} from "../lib/validation/submission";
import { verifyWebsiteReachable } from "../lib/validation/website-reachability";

describe("submissionSchema", () => {
  it("rejects missing required fields", () => {
    const result = submissionSchema.safeParse({});
    assert.equal(result.success, false);
  });

  it("accepts a valid minimal submission", () => {
    const result = submissionSchema.safeParse({
      full_name: "Jane Doe",
      work_email: "jane@company.com",
      company_name: "Acme Co",
      website_url: "https://acme.com",
    });
    assert.equal(result.success, true);
  });

  it("normalizes a bare company domain", () => {
    const result = submissionSchema.safeParse({
      full_name: "Jane Doe",
      work_email: "jane@company.com",
      company_name: "Acme Co",
      website_url: "acme.com",
    });
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.website_url, "https://acme.com");
    }
  });

  it("rejects invalid email", () => {
    const result = submissionSchema.safeParse({
      full_name: "Jane Doe",
      work_email: "not-an-email",
      company_name: "Acme Co",
      website_url: "https://acme.com",
    });
    assert.equal(result.success, false);
  });

  it("rejects malformed or unsafe website URLs", () => {
    for (const websiteUrl of ["not-a-site", "ftp://example.com", "https://localhost", "http://192.168.1.10"]) {
      const result = submissionSchema.safeParse({
        full_name: "Jane Doe",
        work_email: "jane@company.com",
        company_name: "Acme Co",
        website_url: websiteUrl,
      });
      assert.equal(result.success, false, websiteUrl);
    }
  });
});

describe("mapSubmissionToRow", () => {
  it("normalizes array fields to comma-separated strings", () => {
    assert.equal(normalizeArrayField(["a", "b"]), "a, b");
    const row = mapSubmissionToRow({
      full_name: "Jane",
      work_email: "jane@test.com",
      company_name: "Test",
      website_url: "https://test.com",
      current_challenges: ["weak-local", "no-analytics"],
    });
    assert.equal(row.current_challenges, "weak-local, no-analytics");
    assert.equal(row.status, "submitted");
  });
});

describe("normalizeWebsiteUrl", () => {
  it("normalizes supported public URLs", () => {
    assert.equal(normalizeWebsiteUrl("Example.com/"), "https://example.com");
    assert.equal(normalizeWebsiteUrl("http://example.com/about/"), "http://example.com/about");
  });
});

describe("verifyWebsiteReachable", () => {
  it("accepts a reachable company website", async () => {
    const result = await verifyWebsiteReachable("https://example.com", {
      fetcher: async () => new Response("<html />", { status: 200 }),
    });

    assert.deepEqual(result, { ok: true, url: "https://example.com", status: 200 });
  });

  it("falls back to http when a bare domain has no reachable https site", async () => {
    const calls: string[] = [];
    const result = await verifyWebsiteReachable("example.com", {
      fetcher: async (url) => {
        calls.push(String(url));
        if (String(url).startsWith("https://")) {
          throw new Error("TLS failure");
        }
        return new Response("<html />", { status: 200 });
      },
    });

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.url, "http://example.com");
    }
    assert.deepEqual(calls, ["https://example.com", "http://example.com"]);
  });

  it("rejects missing websites before an audit is queued", async () => {
    const result = await verifyWebsiteReachable("https://example.com", {
      fetcher: async () => new Response("Not found", { status: 404 }),
    });

    assert.equal(result.ok, false);
  });
});
