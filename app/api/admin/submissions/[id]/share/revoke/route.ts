import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { revokeShareTokens } from "@/lib/results/share";

export const dynamic = "force-dynamic";

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
    await revokeShareTokens(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not revoke link." },
      { status: 500 },
    );
  }
}
