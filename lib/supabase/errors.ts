type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} | null;

export type DbFailureKind =
  | "not_configured"
  | "schema_missing"
  | "permission_denied"
  | "invalid_credentials"
  | "unknown";

export function classifySupabaseError(error: SupabaseLikeError): DbFailureKind {
  if (!error) return "unknown";

  const code = (error.code ?? "").toUpperCase();
  const message = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();

  if (
    code === "42P01" ||
    code === "PGRST205" ||
    message.includes("could not find the table") ||
    message.includes("does not exist") ||
    message.includes("schema cache")
  ) {
    return "schema_missing";
  }

  if (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied") ||
    message.includes("not allowed")
  ) {
    return "permission_denied";
  }

  if (
    code === "PGRST301" ||
    message.includes("jwt") ||
    message.includes("invalid api key") ||
    message.includes("invalid authentication credentials")
  ) {
    return "invalid_credentials";
  }

  return "unknown";
}

export function submissionSaveErrorMessage(kind: DbFailureKind): string {
  switch (kind) {
    case "schema_missing":
      return "Database tables are missing. In Supabase SQL Editor, run migrations 001–007 from supabase/migrations, then try again.";
    case "permission_denied":
      return "Database permission denied. In Vercel, set SUPABASE_SERVICE_ROLE_KEY to the service_role key (not the anon key), then redeploy.";
    case "invalid_credentials":
      return "Database credentials look invalid. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.";
    case "not_configured":
      return "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.";
    default:
      return "Failed to save submission. Check Supabase setup and Vercel env vars, then try again.";
  }
}
