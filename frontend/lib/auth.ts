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

export async function signOut() {
  const { createBrowserSupabaseClient } = await import("@/lib/supabase");
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
