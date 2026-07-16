-- Homepage mockup leads for redesign + hosting funnel

CREATE TABLE IF NOT EXISTS public.geo_mockup_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  website_url TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  preferred_style TEXT NOT NULL,
  homepage_goal TEXT NOT NULL,
  notes TEXT,
  email TEXT,
  lead_source TEXT NOT NULL DEFAULT 'homepage_mockup',
  concept_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  signals_json JSONB,
  access_token_hash TEXT NOT NULL UNIQUE,
  result_viewed_at TIMESTAMPTZ,
  subscription_cta_clicked_at TIMESTAMPTZ,
  selected_plan_intent TEXT,
  status TEXT NOT NULL DEFAULT 'previewed'
    CHECK (status IN ('previewed', 'cta_clicked', 'contacted', 'converted', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_geo_mockup_leads_created_at ON public.geo_mockup_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_geo_mockup_leads_token_hash ON public.geo_mockup_leads (access_token_hash);
CREATE INDEX IF NOT EXISTS idx_geo_mockup_leads_status ON public.geo_mockup_leads (status);
CREATE INDEX IF NOT EXISTS idx_geo_mockup_leads_email ON public.geo_mockup_leads (email);

DROP TRIGGER IF EXISTS trg_geo_mockup_leads_updated_at ON public.geo_mockup_leads;
CREATE TRIGGER trg_geo_mockup_leads_updated_at
  BEFORE UPDATE ON public.geo_mockup_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.geo_mockup_leads ENABLE ROW LEVEL SECURITY;
