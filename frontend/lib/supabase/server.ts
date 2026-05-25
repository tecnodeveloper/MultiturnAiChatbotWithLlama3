import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>,
        ) {
          try {
            console.log("Server Client: setAll called for", cookiesToSet.length, "cookies");
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log("  Setting cookie:", name);
              cookieStore.set(name, value, options);
            });
          } catch (err) {
            console.error("Server Client: Failed to set cookies", err);
            // Server components cannot always write cookies directly.
          }
        },
      },
    },
  );
}
