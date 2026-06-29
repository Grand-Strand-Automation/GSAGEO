import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import { loadPublishedReportBySubmissionId } from "@/lib/results/published-report";
import {
  generatePublishedReportPdf,
  generateTechnicalReportPdf,
} from "@/lib/results/pdf/generate-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !(await isAdminAuthorized(user.email))) return null;
  return user;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const variant = new URL(request.url).searchParams.get("variant");

  try {
    const published = await loadPublishedReportBySubmissionId(id);
    if (!published.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "PDF export is only available once the final report is published.",
        },
        { status: 404 },
      );
    }

    const { buffer, filename } =
      variant === "technical"
        ? await generateTechnicalReportPdf(published.bundle)
        : await generatePublishedReportPdf(published.bundle);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[admin pdf] Export failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't generate the PDF right now. Please try again." },
      { status: 500 },
    );
  }
}
