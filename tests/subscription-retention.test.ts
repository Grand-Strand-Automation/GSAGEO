import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DOWNGRADE_PATHS,
  PAUSE_SUPPORT,
  PLAN_COMPARISON_ROWS,
  SAVE_OFFERS,
  SUBSCRIPTION_PLANS,
  getDowngradePath,
  getSaveOfferForReason,
} from "../lib/subscriptions/config";
import { calculateHealthStatus } from "../lib/subscriptions/health";

describe("subscription plan config", () => {
  it("defines Growth as the recommended hero plan", () => {
    assert.equal(SUBSCRIPTION_PLANS.growth.isRecommended, true);
    assert.equal(SUBSCRIPTION_PLANS.growth.tierOrder, 2);
    assert.equal(SUBSCRIPTION_PLANS.monitor.isDowngradeTarget, true);
    assert.equal(SUBSCRIPTION_PLANS.managed.tierOrder, 3);
  });

  it("defines required downgrade paths", () => {
    assert.ok(getDowngradePath("managed", "growth"));
    assert.ok(getDowngradePath("growth", "monitor"));
    assert.equal(getDowngradePath("monitor", "growth"), null);
    assert.equal(DOWNGRADE_PATHS.every((path) => path.effectiveTiming === "next_billing_cycle"), true);
  });

  it("compares the expected plan capabilities", () => {
    const guidance = PLAN_COMPARISON_ROWS.find((row) => row.key === "improvement_guidance");
    const support = PLAN_COMPARISON_ROWS.find((row) => row.key === "hands_on_support");
    assert.equal(guidance?.values.monitor, "No");
    assert.equal(guidance?.values.growth, "Yes");
    assert.equal(support?.values.growth, "Light");
    assert.equal(support?.values.managed, "Higher-touch");
  });
});

describe("save offer rules", () => {
  it("routes expensive and lighter-plan reasons to Monitor", () => {
    assert.equal(getSaveOfferForReason("too_expensive_right_now").primary.type, "downgrade_monitor");
    assert.equal(getSaveOfferForReason("need_lighter_plan").primary.type, "downgrade_monitor");
  });

  it("routes billing issues to billing help", () => {
    assert.equal(getSaveOfferForReason("billing_issue").primary.type, "billing_help");
  });

  it("does not promise pause when provider support is unavailable", () => {
    assert.equal(PAUSE_SUPPORT.supported, false);
    assert.equal(SAVE_OFFERS.pause_30_days.targetPlan, "monitor");
  });
});

describe("customer health scoring", () => {
  it("marks scheduled cancellations as at-risk", () => {
    const health = calculateHealthStatus({
      cancel_at_period_end: true,
      payment_issue_status: "failed",
    });
    assert.equal(health.healthStatus, "yellow");
    assert.equal(health.churnRiskLevel, "medium");
  });

  it("marks canceled accounts as high risk", () => {
    const health = calculateHealthStatus({ subscription_status: "canceled" });
    assert.equal(health.healthStatus, "red");
    assert.equal(health.churnRiskLevel, "high");
  });
});
