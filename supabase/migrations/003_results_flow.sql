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
