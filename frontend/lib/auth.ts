import { createClient } from "@/lib/supabase";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const redirectURL = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectURL,
    },
  });

  if (data.url) {
    return { url: data.url };
  }

  return { error: error?.message || "Failed to sign in with Google" };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message };
}
