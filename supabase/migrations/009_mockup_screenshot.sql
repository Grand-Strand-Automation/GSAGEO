-- Screenshot capture fields for mockup leads

ALTER TABLE public.geo_mockup_leads
  ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
  ADD COLUMN IF NOT EXISTS screenshot_status TEXT
    CHECK (screenshot_status IS NULL OR screenshot_status IN ('ready', 'unavailable', 'pending'));

CREATE INDEX IF NOT EXISTS idx_geo_mockup_leads_screenshot_status
  ON public.geo_mockup_leads (screenshot_status);
