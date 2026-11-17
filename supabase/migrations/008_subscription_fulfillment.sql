-- Monthly subscription fulfillment cycles.
-- Automates visibility refresh + summary email per active plan.
-- Growth/Managed cycles may land in awaiting_ops for human follow-through.

CREATE TABLE IF NOT EXISTS public.geo_fulfillment_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  cycle_number INTEGER NOT NULL DEFAULT 1,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN (
      'queued',
      'processing',
      'awaiting_ops',
      'delivered',
      'failed',
      'skipped'
    )),
  audit_job_id UUID REFERENCES public.geo_audit_jobs(id) ON DELETE SET NULL,
  overall_score INTEGER,
  summary_email_sent_at TIMESTAMPTZ,
  ops_completed_at TIMESTAMPTZ,
  ops_completed_by TEXT,
  error_message TEXT,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  UNIQUE (submission_id, cycle_number)
);

CREATE INDEX IF NOT EXISTS idx_geo_fulfillment_cycles_status
  ON public.geo_fulfillment_cycles (status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_geo_fulfillment_cycles_submission
  ON public.geo_fulfillment_cycles (submission_id, cycle_number DESC);

CREATE INDEX IF NOT EXISTS idx_geo_fulfillment_cycles_audit_job
  ON public.geo_fulfillment_cycles (audit_job_id)
  WHERE audit_job_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_geo_submissions_next_billing_at
  ON public.geo_submissions (next_billing_at)
  WHERE next_billing_at IS NOT NULL;

ALTER TABLE public.geo_submissions
  ADD COLUMN IF NOT EXISTS last_fulfillment_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_fulfillment_cycle_id UUID;

DROP TRIGGER IF EXISTS trg_geo_fulfillment_cycles_updated_at ON public.geo_fulfillment_cycles;
CREATE TRIGGER trg_geo_fulfillment_cycles_updated_at
  BEFORE UPDATE ON public.geo_fulfillment_cycles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
