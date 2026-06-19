import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !(await isAdminAuthorized(user.email))) {
    redirect("/admin/login?error=unauthorized");
  }
  return user;
}
