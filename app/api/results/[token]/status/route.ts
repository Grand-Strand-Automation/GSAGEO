import { NextResponse } from "next/server";
import { getCustomerReportStatusByToken } from "@/lib/results/customer-report";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const status = await getCustomerReportStatusByToken(token);
    return NextResponse.json({ ok: true, ...status });
  } catch (err) {
    console.error("[results status]", err);
    return NextResponse.json(
      { ok: false, error: "Could not load report status." },
      { status: 500 },
    );
  }
}
