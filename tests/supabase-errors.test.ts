import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifySupabaseError,
  submissionSaveErrorMessage,
} from "../lib/supabase/errors";

describe("classifySupabaseError", () => {
  it("detects missing tables", () => {
    assert.equal(
      classifySupabaseError({
        code: "PGRST205",
        message: "Could not find the table 'public.geo_submissions' in the schema cache",
      }),
      "schema_missing",
    );
    assert.equal(
      classifySupabaseError({
        code: "42P01",
        message: 'relation "geo_submissions" does not exist',
      }),
      "schema_missing",
    );
  });

  it("detects permission and credential failures", () => {
    assert.equal(
      classifySupabaseError({
        message: "new row violates row-level security policy",
      }),
      "permission_denied",
    );
    assert.equal(
      classifySupabaseError({
        message: "Invalid API key",
      }),
      "invalid_credentials",
    );
  });
});

describe("submissionSaveErrorMessage", () => {
  it("returns actionable setup guidance", () => {
    assert.match(submissionSaveErrorMessage("schema_missing"), /migrations 001/);
    assert.match(submissionSaveErrorMessage("permission_denied"), /service_role/);
    assert.match(submissionSaveErrorMessage("not_configured"), /Vercel/);
  });
});
