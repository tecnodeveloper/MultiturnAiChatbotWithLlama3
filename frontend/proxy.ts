import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if it exists
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Proxy: path =", request.nextUrl.pathname, "user =", user?.email || "none");

  // Redirect to login if accessing dashboard without user
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Proxy: No user for dashboard, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing login/signup with user
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup" ||
      request.nextUrl.pathname === "/")
  ) {
    console.log("Proxy: User found for auth page, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
