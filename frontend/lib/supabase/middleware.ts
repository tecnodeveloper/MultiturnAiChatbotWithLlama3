import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function createClient(request: NextRequest) {
  let response = {
    value: NextResponse.next({
      request: {
        headers: request.headers,
      },
    }),
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  console.log("Middleware Helper: Using Supabase URL:", supabaseUrl);

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>,
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response.value = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.value.cookies.set({
              name,
              value,
              ...options,
              path: "/",
              secure: false,
              sameSite: "lax",
            }),
          );
        },
      },
    },
  );

  return { supabase, response };
}
