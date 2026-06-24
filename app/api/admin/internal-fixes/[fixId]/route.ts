import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import { INTERNAL_FIX_STATUSES } from "@/lib/internal-fixes/types";

export const dynamic = "force-dynamic";

const PATCHABLE_STATUSES = new Set(INTERNAL_FIX_STATUSES);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ fixId: string }> },
) {
  const user = await requireAdminApiUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { fixId } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};

  if (body.status && PATCHABLE_STATUSES.has(body.status)) {
    updates.status = body.status;
  }
  if (typeof body.internal_note === "string") {
    updates.internal_note = body.internal_note;
  }
  if (typeof body.implementation_notes === "string") {
    updates.implementation_notes = body.implementation_notes;
    updates.status = body.status ?? "edited_internal";
    updates.created_by_system = false;
  }
  if (body.generated_content && typeof body.generated_content === "object") {
    updates.generated_content = body.generated_content;
    updates.status = body.status ?? "edited_internal";
    updates.created_by_system = false;
  }
  if (body.priority) updates.priority = body.priority;
  if (body.implementation_effort) updates.implementation_effort = body.implementation_effort;

  if (!Object.keys(updates).length) {
    return NextResponse.json({ ok: false, error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("geo_internal_fixes")
      .update(updates)
      .eq("id", fixId)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Fix not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, fix: data });
  } catch (err) {
    console.error("[internal-fix patch]", err);
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}
