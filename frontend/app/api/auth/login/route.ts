import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Login API: POST request received");
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login API: Auth error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Force a session refresh/sync to ensure cookies are set
  await supabase.auth.getUser();

  console.log("Login API: Login successful for", data.user?.email);

  return NextResponse.json({ user: data.user }, { status: 200 });
}
