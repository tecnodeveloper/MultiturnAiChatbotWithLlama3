import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookieNames = request.cookies.getAll().map(c => c.name);
  
  // This will refresh the session if it exists and return the user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log(`Proxy: [${request.nextUrl.pathname}] Supabase URL: ${supabaseUrl}, Cookies: ${cookieNames.join(", ")}, User: ${user?.email || "none"}`);

  if (authError) {
    console.log("Proxy: Auth error:", authError.message);
  }

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup" ||
    request.nextUrl.pathname === "/reset" ||
    request.nextUrl.pathname === "/";

  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard") || 
                         request.nextUrl.pathname.startsWith("/account");

  // Redirect to login if accessing protected page without user
  if (!user && isDashboardPage) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    // Copy cookies from refreshed response to the redirect
    response.value.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // Redirect to dashboard if accessing auth page with user
  if (user && isAuthPage) {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    response.value.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response.value;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
