import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApiUser } from "@/lib/auth/require-admin-api";
import { promoteInternalFixToCustomerPreview } from "@/lib/internal-fixes/promote";
import type { GeoInternalFix } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ fixId: string }> },
) {
  const user = await requireAdminApiUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { fixId } = await params;

  try {
    const supabase = createAdminClient();
    const { data: fix } = await supabase
      .from("geo_internal_fixes")
      .select("*")
      .eq("id", fixId)
      .single();

    if (!fix) {
      return NextResponse.json({ ok: false, error: "Fix not found" }, { status: 404 });
    }

    if (fix.internal_only !== true || fix.customer_visible === true) {
      return NextResponse.json({ ok: false, error: "Invalid fix state" }, { status: 400 });
    }

    const { previewId } = await promoteInternalFixToCustomerPreview(fix as GeoInternalFix);

    return NextResponse.json({
      ok: true,
      previewId,
      message: "Customer-safe draft preview created. Publish the job when ready for customer visibility.",
    });
  } catch (err) {
    console.error("[internal-fix promote]", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Promotion failed" },
      { status: 500 },
    );
  }
}
