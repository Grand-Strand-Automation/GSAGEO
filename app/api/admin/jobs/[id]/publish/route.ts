import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { publishAuditJob } from "@/lib/audit/processor";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await publishAuditJob(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 },
    );
  }
}
