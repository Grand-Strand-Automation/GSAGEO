import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAdminAllowlist, isAdminEmail } from "../lib/auth/admin";

describe("admin authorization helpers", () => {
  const original = process.env.ADMIN_EMAIL_ALLOWLIST;

  it("parses comma-separated allowlist", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = " Admin@Example.com , ops@example.com ";
    assert.deepEqual(getAdminAllowlist(), ["admin@example.com", "ops@example.com"]);
  });

  it("isAdminEmail is case-insensitive", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "shawnjl@outlook.com";
    assert.equal(isAdminEmail("Shawnjl@Outlook.com"), true);
    assert.equal(isAdminEmail("other@example.com"), false);
  });

  it("rejects empty allowlist", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "";
    assert.equal(isAdminEmail("shawnjl@outlook.com"), false);
  });

  it("rejects null email", () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = "shawnjl@outlook.com";
    assert.equal(isAdminEmail(null), false);
  });

  process.env.ADMIN_EMAIL_ALLOWLIST = original;
});
