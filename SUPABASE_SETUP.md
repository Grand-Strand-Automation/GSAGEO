# Supabase setup

## 1. Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. New project → choose org, name (e.g. `gsageo-prod`), region, strong DB password
3. Wait for project to finish provisioning

## 2. Apply migrations

**Option A — SQL Editor (simplest)**

1. Open SQL Editor
2. Paste and run `supabase/migrations/001_geo_schema.sql`
3. Paste and run `supabase/migrations/002_geo_admin_users.sql`

**Option B — Supabase CLI**

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 3. Tables created

| Table | Purpose |
|-------|---------|
| `geo_submissions` | Intake form data |
| `geo_audit_jobs` | Audit job queue / status |
| `geo_audit_results` | Structured audit output |
| `geo_admin_notes` | Internal admin notes |
| `geo_admin_users` | Optional DB allowlist of admin emails |

All tables have RLS enabled. The Next.js app uses the **service role key** server-side for inserts/reads — no public anon policies for writes.

## 4. Auth configuration

1. **Disable public signup:** Authentication → Providers → Email → turn off **Enable sign ups**
2. **Create admin user:** Authentication → Users → Add user → set email + password
3. **Authorize the email** using one or both:
   - Set `ADMIN_EMAIL_ALLOWLIST` in Vercel (comma-separated) — **required**
   - Optional: `INSERT INTO geo_admin_users (email) VALUES ('admin@example.com');`

Both checks are case-insensitive. Env allowlist is evaluated first; DB table is a fallback for server-side authorization.

## 5. API keys

Project Settings → API:

| Key | Env var | Usage |
|-----|---------|-------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Client + server |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client auth |
| service_role | `SUPABASE_SERVICE_ROLE_KEY` | Server only — **never expose to browser** |

See [ENV_SETUP.md](./ENV_SETUP.md) for the full env var list.

## 6. RLS assumptions

- Public users do **not** read submissions via anon key
- Form POST goes to `/api/submissions` which uses service role
- Admin UI pages use service role after Supabase session + admin authorization check
- `geo_admin_users` and submission tables have RLS enabled with no anon policies
- Optional `admins_read_submissions` policy in migration 001 is unused; server routes prefer service role

## 7. Testing admin login locally

1. Copy `.env.example` → `.env.local` and fill Supabase keys
2. Set `ADMIN_EMAIL_ALLOWLIST` to your admin user's email
3. `pnpm dev` → open `http://localhost:3000/admin/login`
4. Sign in → should land on `/admin/submissions`

## 8. Optional: Storage

Not required for v1. If you add file uploads later, create a private bucket and server-side upload routes.
