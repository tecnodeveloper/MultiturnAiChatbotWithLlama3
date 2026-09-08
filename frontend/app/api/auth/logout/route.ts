import { createRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  const supabase = createRouteClient(request, response);
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Explicitly clear the manual cookies we set during OAuth/Email login
  // We must match the path and sameSite options used when they were created
  response.cookies.set("sb-access-token", "", { path: "/", maxAge: 0, sameSite: "lax" });
  response.cookies.set("sb-refresh-token", "", { path: "/", maxAge: 0, sameSite: "lax" });

  return response;
}
