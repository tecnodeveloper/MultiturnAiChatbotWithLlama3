import { createRouteClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const response = new NextResponse(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  const supabase = createRouteClient(request, response);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Return the user data with the cookies set in the response headers
  return new NextResponse(JSON.stringify({ user: data.user }), {
    status: 200,
    headers: response.headers,
  });
}
