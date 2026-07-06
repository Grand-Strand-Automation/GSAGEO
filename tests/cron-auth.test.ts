import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import { verifyCronRequest } from "../lib/cron/auth";

describe("verifyCronRequest", () => {
  const originalSecret = process.env.CRON_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalSecret;
    }
  });

  it("returns 503 when CRON_SECRET is not configured", () => {
    delete process.env.CRON_SECRET;
    const response = verifyCronRequest(new Request("http://localhost/api/cron/test"));
    assert.ok(response);
    assert.equal(response.status, 503);
  });

  it("returns 401 when authorization header is missing or wrong", () => {
    process.env.CRON_SECRET = "test-secret";
    const missing = verifyCronRequest(new Request("http://localhost/api/cron/test"));
    assert.ok(missing);
    assert.equal(missing.status, 401);

    const wrong = verifyCronRequest(
      new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer wrong" },
      }),
    );
    assert.ok(wrong);
    assert.equal(wrong.status, 401);
  });

  it("returns null when authorization matches CRON_SECRET", () => {
    process.env.CRON_SECRET = "test-secret";
    const ok = verifyCronRequest(
      new Request("http://localhost/api/cron/test", {
        headers: { authorization: "Bearer test-secret" },
      }),
    );
    assert.equal(ok, null);
  });
});
