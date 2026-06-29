-- Post-assessment follow-up tracking and email event log

ALTER TABLE public.geo_submissions
  ADD COLUMN IF NOT EXISTS follow_up_status TEXT NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS recommended_offer TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS report_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_day_1_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_day_3_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_day_5_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_day_7_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booked_review_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_stopped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_notified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS results_token TEXT;

CREATE INDEX IF NOT EXISTS idx_geo_submissions_follow_up_status
  ON public.geo_submissions (follow_up_status);

CREATE TABLE IF NOT EXISTS public.geo_email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  audit_job_id UUID REFERENCES public.geo_audit_jobs(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'sent', 'failed', 'skipped')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geo_email_events_submission_id
  ON public.geo_email_events (submission_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_geo_email_events_event_type
  ON public.geo_email_events (event_type, status);
