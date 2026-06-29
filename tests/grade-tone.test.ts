import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gradeTone } from "../lib/results/score-utils";

describe("gradeTone", () => {
  it("maps A variants to green", () => {
    assert.equal(gradeTone("A"), "green");
    assert.equal(gradeTone("A+"), "green");
    assert.equal(gradeTone("A-"), "green");
  });

  it("maps B and C variants to yellow", () => {
    assert.equal(gradeTone("B"), "yellow");
    assert.equal(gradeTone("B+"), "yellow");
    assert.equal(gradeTone("C-"), "yellow");
  });

  it("maps D and F to red", () => {
    assert.equal(gradeTone("D"), "red");
    assert.equal(gradeTone("D+"), "red");
    assert.equal(gradeTone("F"), "red");
  });
});
