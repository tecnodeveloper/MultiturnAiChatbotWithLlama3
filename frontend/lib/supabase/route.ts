import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

export function createRouteClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
          console.log("setAll called with:", cookiesToSet.length, "cookies");
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log("Setting cookie:", name);
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    },
  );
}
