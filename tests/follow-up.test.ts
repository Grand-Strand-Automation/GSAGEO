import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recommendBridgeOffer, getRecommendedOffer } from "../lib/follow-up/recommend";
import {
  isFollowUpStopped,
  nextCadenceDay,
} from "../lib/follow-up/status";
import { shouldSendCadenceDay } from "../lib/follow-up/processor";

describe("follow-up recommendation", () => {
  it("defaults to quick wins sprint for typical leads", () => {
    assert.equal(recommendBridgeOffer({ overallScore: 62, issueCount: 4 }), "quick-wins-sprint");
  });

  it("recommends visibility growth for growth tier", () => {
    assert.equal(recommendBridgeOffer({ suggestedTier: "growth" }), "visibility-growth");
  });

  it("recommends strategy session for strong scores with few issues", () => {
    assert.equal(
      recommendBridgeOffer({ overallScore: 82, issueCount: 1 }),
      "strategy-session",
    );
  });

  it("returns offer content for quick wins sprint", () => {
    const offer = getRecommendedOffer({ overallScore: 50, issueCount: 3 });
    assert.equal(offer.name, "GEO Quick Wins Sprint");
    assert.ok(offer.includes.length >= 3);
  });
});

describe("follow-up cadence", () => {
  it("stops when booked or converted", () => {
    assert.equal(isFollowUpStopped({ booked_review_at: new Date().toISOString() }), true);
    assert.equal(isFollowUpStopped({ converted_at: new Date().toISOString() }), true);
    assert.equal(isFollowUpStopped({ follow_up_status: "submitted" }), false);
  });

  it("picks the next unsent cadence day", () => {
    assert.equal(nextCadenceDay({}), 1);
    assert.equal(
      nextCadenceDay({ follow_up_day_1_sent_at: "2026-01-01T00:00:00Z" }),
      3,
    );
    assert.equal(
      nextCadenceDay({
        follow_up_day_1_sent_at: "x",
        follow_up_day_3_sent_at: "x",
        follow_up_day_5_sent_at: "x",
        follow_up_day_7_sent_at: "x",
      }),
      null,
    );
  });

  it("waits until enough days have passed since report email", () => {
    const recent = new Date().toISOString();
    assert.equal(shouldSendCadenceDay(recent, 1, {}), false);

    const old = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    assert.equal(shouldSendCadenceDay(old, 1, {}), true);
  });
});
