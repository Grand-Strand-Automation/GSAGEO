import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAdminAllowlist, isAdminEmail } from "../lib/auth/admin";

describe("admin authorization helpers", () => {
  const original = process.env.ADMIN_EMAIL_ALLOWLIST;

  it("parses comma-separated allowlist", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = " Admin@Example.com , ops@gsally.com ";
    assert.deepEqual(getAdminAllowlist(), ["admin@example.com", "ops@gsally.com"]);
  });

  it("isAdminEmail is case-insensitive", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "shawn@gsally.com";
    assert.equal(isAdminEmail("Shawn@Gsally.com"), true);
    assert.equal(isAdminEmail("other@example.com"), false);
  });

  it("rejects empty allowlist", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "";
    assert.equal(isAdminEmail("shawn@gsally.com"), false);
  });

  it("rejects null email", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "shawn@gsally.com";
    assert.equal(isAdminEmail(null), false);
  });

  process.env.ADMIN_EMAIL_ALLOWLIST = original;
});
