import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAuditTier } from "../lib/brand/plans";

describe("normalizeAuditTier", () => {
  it("maps legacy audit alias to monitor", () => {
    assert.equal(normalizeAuditTier("audit"), "monitor");
    assert.equal(normalizeAuditTier("AUDIT"), "monitor");
  });

  it("maps legacy foundation alias to managed", () => {
    assert.equal(normalizeAuditTier("foundation"), "managed");
  });

  it("passes through current SMB tier ids", () => {
    assert.equal(normalizeAuditTier("monitor"), "monitor");
    assert.equal(normalizeAuditTier("growth"), "growth");
    assert.equal(normalizeAuditTier("managed"), "managed");
    assert.equal(normalizeAuditTier("custom"), "custom");
  });

  it("returns empty string for unknown tiers", () => {
    assert.equal(normalizeAuditTier(""), "");
    assert.equal(normalizeAuditTier(null), "");
    assert.equal(normalizeAuditTier("invalid"), "");
  });
});
