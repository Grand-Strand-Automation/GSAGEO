import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mapSubmissionToRow,
  normalizeArrayField,
  submissionSchema,
} from "../lib/validation/submission.ts";

describe("submissionSchema", () => {
  it("rejects missing required fields", () => {
    const result = submissionSchema.safeParse({});
    assert.equal(result.success, false);
  });

  it("accepts a valid minimal submission", () => {
    const result = submissionSchema.safeParse({
      full_name: "Jane Doe",
      work_email: "jane@company.com",
      company_name: "Acme Co",
      website_url: "https://acme.com",
    });
    assert.equal(result.success, true);
  });

  it("rejects invalid email", () => {
    const result = submissionSchema.safeParse({
      full_name: "Jane Doe",
      work_email: "not-an-email",
      company_name: "Acme Co",
      website_url: "https://acme.com",
    });
    assert.equal(result.success, false);
  });
});

describe("mapSubmissionToRow", () => {
  it("normalizes array fields to comma-separated strings", () => {
    assert.equal(normalizeArrayField(["a", "b"]), "a, b");
    const row = mapSubmissionToRow({
      full_name: "Jane",
      work_email: "jane@test.com",
      company_name: "Test",
      website_url: "https://test.com",
      current_challenges: ["weak-local", "no-analytics"],
    });
    assert.equal(row.current_challenges, "weak-local, no-analytics");
    assert.equal(row.status, "submitted");
  });
});
