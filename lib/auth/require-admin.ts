import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized, isSupabaseAuthConfigured } from "@/lib/auth/admin";

function adminLoginUrl(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `/admin/login?${query.toString()}`;
}

export async function requireAdminUser(returnTo = "/admin/submissions") {
  if (!isSupabaseAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(adminLoginUrl({ next: returnTo }));
  }

  if (!(await isAdminAuthorized(user.email))) {
    redirect(adminLoginUrl({ error: "unauthorized", next: returnTo }));
  }

  return user;
}
