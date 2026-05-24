"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase";
import {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from "@/lib/auth";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createBrowserSupabaseClient();

function mapUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? "",
    name:
      (metadata.name as string | undefined) ||
      (metadata.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "MultiTurn User",
    avatar:
      (metadata.avatar_url as string | undefined) ||
      (metadata.picture as string | undefined) ||
      undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(data.session);
      setUser(mapUser(data.session?.user ?? null));
      setIsLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(mapUser(nextSession?.user ?? null));
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmail(email, password);
    // Let the onAuthStateChange subscription handle session updates
    // Add a small delay to allow cookies to be fully set
    await new Promise(resolve => setTimeout(resolve, 100));
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(mapUser(data.session?.user ?? null));
  };

  const signUp = async (email: string, password: string, name: string) => {
    await signUpWithEmail(email, password, name);
    // Let the onAuthStateChange subscription handle session updates
    // Add a small delay to allow cookies to be fully set
    await new Promise(resolve => setTimeout(resolve, 100));
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(mapUser(data.session?.user ?? null));
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOut();
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!session,
      signIn,
      signUp,
      signInWithGoogle: handleGoogleSignIn,
      logout: handleLogout,
    }),
    [user, session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
