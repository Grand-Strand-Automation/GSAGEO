-- Subscription retention and churn-risk tracking.
-- This is provider-ready state for the GEO monthly model; actual billing provider sync
-- can populate billing_* fields once Stripe or another provider is wired.

ALTER TABLE public.geo_submissions
  ADD COLUMN IF NOT EXISTS current_plan TEXT,
  ADD COLUMN IF NOT EXISTS previous_plan TEXT,
  ADD COLUMN IF NOT EXISTS next_plan TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS billing_provider TEXT,
  ADD COLUMN IF NOT EXISTS billing_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS next_billing_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_reason_detail TEXT,
  ADD COLUMN IF NOT EXISTS downgrade_reason TEXT,
  ADD COLUMN IF NOT EXISTS pause_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS save_offer_shown TEXT,
  ADD COLUMN IF NOT EXISTS save_offer_accepted BOOLEAN,
  ADD COLUMN IF NOT EXISTS health_status TEXT NOT NULL DEFAULT 'green',
  ADD COLUMN IF NOT EXISTS churn_risk_level TEXT NOT NULL DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS payment_issue_status TEXT,
  ADD COLUMN IF NOT EXISTS last_report_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_summary_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_engagement_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retention_last_event_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS winback_eligible BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_geo_submissions_subscription_status
  ON public.geo_submissions (subscription_status);

CREATE INDEX IF NOT EXISTS idx_geo_submissions_churn_risk
  ON public.geo_submissions (churn_risk_level, health_status);

CREATE INDEX IF NOT EXISTS idx_geo_submissions_billing_subscription_id
  ON public.geo_submissions (billing_subscription_id);

CREATE TABLE IF NOT EXISTS public.geo_subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  old_plan TEXT,
  new_plan TEXT,
  cancellation_reason TEXT,
  save_offer_type TEXT,
  initiated_by TEXT NOT NULL DEFAULT 'user',
  effective_at TIMESTAMPTZ,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geo_subscription_events_submission_id
  ON public.geo_subscription_events (submission_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_geo_subscription_events_event_name
  ON public.geo_subscription_events (event_name, created_at DESC);
