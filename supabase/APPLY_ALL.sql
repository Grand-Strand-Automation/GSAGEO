-- GSAGEO one-shot schema apply
-- Run this entire file once in Supabase → SQL Editor
-- Safe to re-run: migrations use IF NOT EXISTS / IF EXISTS guards where possible


-- ============================================================================
-- 001_geo_schema.sql
-- ============================================================================

-- GEO / AI Visibility schema for Supabase Postgres
-- Apply via Supabase SQL editor or: supabase db push

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- geo_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geo_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  phone TEXT,
  primary_service TEXT,
  service_area TEXT,
  industry TEXT,
  business_size TEXT,
  main_goal TEXT,
  competitors TEXT,
  cms_platform TEXT,
  current_challenges TEXT,
  access_available TEXT,
  selected_plan TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'reviewing', 'contacted', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_geo_submissions_created_at ON public.geo_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_geo_submissions_work_email ON public.geo_submissions (work_email);
CREATE INDEX IF NOT EXISTS idx_geo_submissions_status ON public.geo_submissions (status);

DROP TRIGGER IF EXISTS trg_geo_submissions_updated_at ON public.geo_submissions;
CREATE TRIGGER trg_geo_submissions_updated_at
  BEFORE UPDATE ON public.geo_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- geo_audit_jobs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geo_audit_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('submitted', 'queued', 'processing', 'complete', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failure_reason TEXT,
  audit_version TEXT NOT NULL DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_geo_audit_jobs_submission_id ON public.geo_audit_jobs (submission_id);
CREATE INDEX IF NOT EXISTS idx_geo_audit_jobs_status ON public.geo_audit_jobs (status);
CREATE INDEX IF NOT EXISTS idx_geo_audit_jobs_created_at ON public.geo_audit_jobs (created_at DESC);

DROP TRIGGER IF EXISTS trg_geo_audit_jobs_updated_at ON public.geo_audit_jobs;
CREATE TRIGGER trg_geo_audit_jobs_updated_at
  BEFORE UPDATE ON public.geo_audit_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- geo_audit_results
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geo_audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  audit_job_id UUID NOT NULL REFERENCES public.geo_audit_jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  summary TEXT,
  scorecard_json JSONB,
  findings_json JSONB,
  recommendations_json JSONB,
  next_step_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_geo_audit_results_submission_id ON public.geo_audit_results (submission_id);
CREATE INDEX IF NOT EXISTS idx_geo_audit_results_audit_job_id ON public.geo_audit_results (audit_job_id);

-- ---------------------------------------------------------------------------
-- geo_admin_notes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geo_admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_geo_admin_notes_submission_id ON public.geo_admin_notes (submission_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Server-side API uses service role; no public read/write policies.
-- ---------------------------------------------------------------------------
ALTER TABLE public.geo_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_audit_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_admin_notes ENABLE ROW LEVEL SECURITY;

-- Authenticated admins may read submissions (optional; server routes prefer service role)
CREATE POLICY "admins_read_submissions" ON public.geo_submissions
  FOR SELECT TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );

-- Note: app.admin_emails is not set by default. Admin UI uses service role via API routes.
-- Revoke direct anon access explicitly (Supabase defaults may vary by project).


-- ============================================================================
-- 002_geo_admin_users.sql
-- ============================================================================

-- Admin authorization table (optional complement to ADMIN_EMAIL_ALLOWLIST env var)
-- Server routes check env allowlist first, then this table via service role.

CREATE TABLE IF NOT EXISTS public.geo_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geo_admin_users_email ON public.geo_admin_users (lower(email));

ALTER TABLE public.geo_admin_users ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies — admin UI uses service role after session check.
-- Example: INSERT INTO public.geo_admin_users (email) VALUES ('admin@example.com');


-- ============================================================================
-- 003_results_flow.sql
-- ============================================================================

-- Post-submission results flow: tokens, fix previews, extended job/result fields

-- Extend geo_audit_jobs status model
ALTER TABLE public.geo_audit_jobs DROP CONSTRAINT IF EXISTS geo_audit_jobs_status_check;
ALTER TABLE public.geo_audit_jobs
  ADD CONSTRAINT geo_audit_jobs_status_check
  CHECK (status IN (
    'submitted', 'queued', 'processing', 'awaiting_review', 'published', 'complete', 'failed'
  ));

ALTER TABLE public.geo_audit_jobs
  ADD COLUMN IF NOT EXISTS review_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ;

-- Extend geo_audit_results
ALTER TABLE public.geo_audit_results
  ADD COLUMN IF NOT EXISTS executive_summary TEXT,
  ADD COLUMN IF NOT EXISTS strengths_json JSONB,
  ADD COLUMN IF NOT EXISTS limitations_json JSONB,
  ADD COLUMN IF NOT EXISTS crawl_notes_json JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_geo_audit_results_updated_at ON public.geo_audit_results;
CREATE TRIGGER trg_geo_audit_results_updated_at
  BEFORE UPDATE ON public.geo_audit_results
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Fix previews shown to customers
CREATE TABLE IF NOT EXISTS public.geo_fix_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  audit_job_id UUID NOT NULL REFERENCES public.geo_audit_jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN (
    'faq', 'service_page', 'cta', 'internal_linking', 'schema', 'trust', 'messaging'
  )),
  title TEXT NOT NULL,
  issue_summary TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  before_text TEXT,
  after_text TEXT NOT NULL,
  html_preview TEXT,
  evidence_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority TEXT NOT NULL DEFAULT 'improve_next'
    CHECK (priority IN ('fix_first', 'improve_next', 'nice_to_add')),
  implementation_effort TEXT NOT NULL DEFAULT 'medium'
    CHECK (implementation_effort IN ('light', 'medium', 'larger')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

CREATE INDEX IF NOT EXISTS idx_geo_fix_previews_submission_id ON public.geo_fix_previews (submission_id);
CREATE INDEX IF NOT EXISTS idx_geo_fix_previews_audit_job_id ON public.geo_fix_previews (audit_job_id);

-- Private customer results access
CREATE TABLE IF NOT EXISTS public.geo_result_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  audit_job_id UUID REFERENCES public.geo_audit_jobs(id) ON DELETE SET NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_geo_result_tokens_submission ON public.geo_result_access_tokens (submission_id);
CREATE INDEX IF NOT EXISTS idx_geo_result_tokens_hash ON public.geo_result_access_tokens (token_hash);

ALTER TABLE public.geo_fix_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_result_access_tokens ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 004_geo_internal_fixes.sql
-- ============================================================================

-- Internal-only fix drafts for employee implementation (never exposed to customers by default)

CREATE TABLE IF NOT EXISTS public.geo_internal_fixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.geo_submissions(id) ON DELETE CASCADE,
  audit_job_id UUID NOT NULL REFERENCES public.geo_audit_jobs(id) ON DELETE CASCADE,
  related_finding_label TEXT,
  related_finding_category TEXT,
  type TEXT NOT NULL CHECK (type IN (
    'faq_fix',
    'service_page_fix',
    'cta_fix',
    'internal_link_fix',
    'schema_fix',
    'trust_content_fix',
    'process_fix',
    'educational_content_fix',
    'about_copy_fix',
    'page_quick_fix'
  )),
  title TEXT NOT NULL,
  issue_summary TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  affected_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_html TEXT,
  generated_json JSONB,
  implementation_notes TEXT,
  implementation_effort TEXT NOT NULL DEFAULT 'medium'
    CHECK (implementation_effort IN ('light', 'medium', 'larger')),
  priority TEXT NOT NULL DEFAULT 'improve_next'
    CHECK (priority IN ('fix_first', 'improve_next', 'nice_to_add')),
  confidence TEXT NOT NULL DEFAULT 'medium'
    CHECK (confidence IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'generated'
    CHECK (status IN (
      'generated',
      'needs_review',
      'approved_internal',
      'edited_internal',
      'hidden',
      'rejected',
      'archived'
    )),
  internal_only BOOLEAN NOT NULL DEFAULT true,
  customer_visible BOOLEAN NOT NULL DEFAULT false,
  created_by_system BOOLEAN NOT NULL DEFAULT true,
  internal_note TEXT,
  promoted_preview_id UUID REFERENCES public.geo_fix_previews(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geo_internal_fixes_submission_id
  ON public.geo_internal_fixes (submission_id);
CREATE INDEX IF NOT EXISTS idx_geo_internal_fixes_audit_job_id
  ON public.geo_internal_fixes (audit_job_id);
CREATE INDEX IF NOT EXISTS idx_geo_internal_fixes_status
  ON public.geo_internal_fixes (status);

DROP TRIGGER IF EXISTS trg_geo_internal_fixes_updated_at ON public.geo_internal_fixes;
CREATE TRIGGER trg_geo_internal_fixes_updated_at
  BEFORE UPDATE ON public.geo_internal_fixes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.geo_internal_fixes ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 005_customer_executive_summary.sql
-- ============================================================================

-- Plain-English customer summary generated at audit time (separate from technical executive_summary).

ALTER TABLE geo_audit_results
  ADD COLUMN IF NOT EXISTS customer_headline TEXT,
  ADD COLUMN IF NOT EXISTS customer_executive_summary TEXT;

COMMENT ON COLUMN geo_audit_results.customer_headline IS
  'Plain-English headline for the customer-facing report, generated at audit time.';
COMMENT ON COLUMN geo_audit_results.customer_executive_summary IS
  'Plain-English executive summary for the customer-facing report, generated at audit time.';


-- ============================================================================
-- 006_geo_follow_up.sql
-- ============================================================================

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


-- ============================================================================
-- 007_subscription_retention.sql
-- ============================================================================

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

