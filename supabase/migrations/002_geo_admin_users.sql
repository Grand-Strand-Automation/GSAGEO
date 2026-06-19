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
