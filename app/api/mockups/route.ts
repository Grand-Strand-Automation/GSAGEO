import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Live OpenAI mockup generation is disabled.
 * Public intake now uses POST /api/mockup-requests (request-led follow-up).
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Instant mockup generation is no longer available. Please request a homepage mockup at /#mockup.",
      code: "live_generation_disabled",
      redirectTo: "/#mockup",
    },
    { status: 410 },
  );
}
