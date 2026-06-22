import { NextResponse } from "next/server";
import { loadResultsByToken } from "@/lib/results/access";
import { generatePublishedReportPdf } from "@/lib/results/pdf/generate-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const { state, bundle } = await loadResultsByToken(token);

    if (state !== "ready" || !bundle) {
      const messages: Record<string, string> = {
        pending: "This report is not available for PDF export yet.",
        processing: "This report is still being prepared.",
        awaiting_review: "This report is awaiting review before export.",
        failed: "This report could not be completed.",
        expired: "This results link has expired.",
        revoked: "This results link is no longer valid.",
      };
      return NextResponse.json(
        { ok: false, error: messages[state] ?? "Report not available." },
        { status: state === "revoked" || state === "expired" ? 403 : 404 },
      );
    }

    const { buffer, filename } = await generatePublishedReportPdf(bundle);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[pdf] Export failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't generate the PDF right now. Please try again." },
      { status: 500 },
    );
  }
}
