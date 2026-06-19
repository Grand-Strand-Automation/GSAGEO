import { isAdminAuthorized } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !(await isAdminAuthorized(user.email))) {
    return null;
  }
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { submission_id, note } = body;

  if (!submission_id || !note?.trim()) {
    return NextResponse.json(
      { ok: false, error: "submission_id and note are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("geo_admin_notes")
      .insert({
        submission_id,
        author_email: user.email!,
        note: note.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: "Failed to save note" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, note: data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Database is not configured. Check Supabase environment variables." },
      { status: 503 },
    );
  }
}
