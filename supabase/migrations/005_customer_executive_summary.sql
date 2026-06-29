-- Plain-English customer summary generated at audit time (separate from technical executive_summary).

ALTER TABLE geo_audit_results
  ADD COLUMN IF NOT EXISTS customer_headline TEXT,
  ADD COLUMN IF NOT EXISTS customer_executive_summary TEXT;

COMMENT ON COLUMN geo_audit_results.customer_headline IS
  'Plain-English headline for the customer-facing report, generated at audit time.';
COMMENT ON COLUMN geo_audit_results.customer_executive_summary IS
  'Plain-English executive summary for the customer-facing report, generated at audit time.';
