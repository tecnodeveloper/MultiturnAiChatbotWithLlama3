import { createBrowserSupabaseClient } from "@/lib/supabase";

const supabase = createBrowserSupabaseClient();

export async function signInWithGoogle() {
  const response = await fetch("/api/auth/google", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Failed to sign in with Google");
  }

  if (data.url) {
    window.location.href = data.url;
  }
}


export async function signInWithEmail(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to sign in");
  }

  if (data.session?.access_token && data.session?.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    if (error) {
      throw new Error(error.message || "Failed to sync session");
    }

    // Explicitly set cookies for the proxy and Next.js middleware/server components
    // This helps resolve race conditions where the client state is stale
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `sb-access-token=${data.session.access_token}; path=/; expires=${expires}; SameSite=Lax;`;
    document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; expires=${expires}; SameSite=Lax;`;
  }

  return data.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to sign up");
  }

  // We don't call setSession here because we want the user to login manually
  return data.user;
}

export async function signOut() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to sign out");
  }

  // Clear client-side manual cookies robustly
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("sb-")) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`; // Try without SameSite just in case
    }
  }
}
