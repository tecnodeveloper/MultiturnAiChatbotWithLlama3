import { createBrowserSupabaseClient } from "@/lib/supabase";

const supabase = createBrowserSupabaseClient();

export async function signInWithGoogle() {
  const response = await fetch("/api/auth/google", {
    method: "POST",
  });

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Failed to sign in with Google");
  }

  window.location.assign(data.url);
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Failed to sign in");
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to sign up");
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message || "Failed to sign out");
  }
}
