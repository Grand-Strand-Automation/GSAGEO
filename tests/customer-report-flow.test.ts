import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CUSTOMER_STATUS_COPY,
  isResultsVisible,
  resolveCustomerState,
} from "../lib/results/customer-state";

describe("customer-facing report flow copy", () => {
  it("maps job statuses to customer-visible states", () => {
    assert.equal(resolveCustomerState({ status: "queued" } as never), "pending");
    assert.equal(resolveCustomerState({ status: "processing" } as never), "processing");
    assert.equal(resolveCustomerState({ status: "awaiting_review" } as never), "awaiting_review");
    assert.equal(resolveCustomerState({ status: "published" } as never), "ready");
    assert.equal(resolveCustomerState({ status: "failed" } as never), "failed");
  });

  it("only treats published jobs as customer-visible", () => {
    assert.equal(isResultsVisible({ status: "published", published_at: null } as never), true);
    assert.equal(isResultsVisible({ status: "awaiting_review" } as never), false);
    assert.equal(
      isResultsVisible({ status: "complete", published_at: "2026-01-01T00:00:00Z" } as never),
      true,
    );
  });

  it("provides calm customer copy for every state", () => {
    for (const key of Object.keys(CUSTOMER_STATUS_COPY)) {
      const copy = CUSTOMER_STATUS_COPY[key as keyof typeof CUSTOMER_STATUS_COPY];
      assert.ok(copy.title.length > 5);
      assert.ok(copy.body.length > 10);
      assert.ok(copy.ctaLabel.length > 3);
      assert.ok(!copy.body.toLowerCase().includes("review_required"));
    }
  });
});
