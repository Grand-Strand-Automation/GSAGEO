import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractOverallScore } from "../lib/results/customer-report";

describe("extractOverallScore", () => {
  it("reads a finite overall score from the scorecard", () => {
    assert.equal(extractOverallScore({ overall: 58, overallGrade: "C" }), 58);
  });

  it("rounds and clamps scores", () => {
    assert.equal(extractOverallScore({ overall: 58.6 }), 59);
    assert.equal(extractOverallScore({ overall: -4 }), 0);
    assert.equal(extractOverallScore({ overall: 140 }), 100);
  });

  it("returns null for missing or invalid values", () => {
    assert.equal(extractOverallScore(null), null);
    assert.equal(extractOverallScore({}), null);
    assert.equal(extractOverallScore({ overall: "58" }), null);
    assert.equal(extractOverallScore({ overall: Number.NaN }), null);
  });
});
