import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorized } from "@/lib/auth/admin";
import {
  createRouteHandlerClient,
  jsonWithSupabaseCookies,
} from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Email and password are required" },
      { status: 400 },
    );
  }

  if (!(await isAdminAuthorized(email))) {
    return NextResponse.json(
      { ok: false, error: "This account is not authorized for admin access" },
      { status: 403 },
    );
  }

  try {
    const { supabase, response } = await createRouteHandlerClient(request);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    return jsonWithSupabaseCookies({ ok: true }, response);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Auth is not configured. Check Supabase environment variables." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { supabase, response } = await createRouteHandlerClient(request);
    await supabase.auth.signOut();
    return jsonWithSupabaseCookies({ ok: true }, response);
  } catch {
    return NextResponse.json({ ok: true });
  }
}
