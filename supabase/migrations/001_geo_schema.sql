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
