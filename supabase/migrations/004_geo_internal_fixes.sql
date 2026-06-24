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
