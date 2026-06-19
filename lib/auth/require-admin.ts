import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized, isSupabaseAuthConfigured } from "@/lib/auth/admin";

export async function requireAdminUser() {
  if (!isSupabaseAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/admin/login");
  }

  if (!(await isAdminAuthorized(user.email))) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}
