import { createAdminClient } from "@/lib/supabase/admin";

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Sync check against env allowlist — safe for Edge middleware. */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowlist = getAdminAllowlist();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

/** Full authorization: env allowlist, then geo_admin_users table (server only). */
export async function isAdminAuthorized(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  if (isAdminEmail(email)) return true;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("geo_admin_users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .eq("active", true)
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}
