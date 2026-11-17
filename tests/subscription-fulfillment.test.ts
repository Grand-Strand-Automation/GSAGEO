import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addBillingMonths,
  isBillingPeriodDue,
  nextBillingAtIso,
} from "../lib/subscriptions/period";
import {
  normalizeSubscriptionPlan,
  requiresOpsFollowThrough,
} from "../lib/subscriptions/fulfillment";

describe("subscription billing periods", () => {
  it("adds one billing month without day overflow", () => {
    const from = new Date(Date.UTC(2026, 0, 31, 12, 0, 0));
    const next = addBillingMonths(from, 1);
    assert.equal(next.getUTCFullYear(), 2026);
    assert.equal(next.getUTCMonth(), 1);
    assert.equal(next.getUTCDate(), 28);
  });

  it("builds ISO next billing timestamps", () => {
    const from = new Date("2026-03-15T10:00:00.000Z");
    const iso = nextBillingAtIso(from, 1);
    assert.match(iso, /^2026-04-15T10:00:00/);
  });

  it("detects due billing periods", () => {
    assert.equal(isBillingPeriodDue("2020-01-01T00:00:00.000Z"), true);
    assert.equal(isBillingPeriodDue("2099-01-01T00:00:00.000Z"), false);
    assert.equal(isBillingPeriodDue(null), false);
  });
});

describe("subscription fulfillment rules", () => {
  it("defaults unknown plans to growth", () => {
    assert.equal(normalizeSubscriptionPlan("custom"), "growth");
    assert.equal(normalizeSubscriptionPlan("monitor"), "monitor");
    assert.equal(normalizeSubscriptionPlan(null), "growth");
  });

  it("requires ops follow-through only for Growth and Managed", () => {
    assert.equal(requiresOpsFollowThrough("monitor"), false);
    assert.equal(requiresOpsFollowThrough("growth"), true);
    assert.equal(requiresOpsFollowThrough("managed"), true);
  });
});
