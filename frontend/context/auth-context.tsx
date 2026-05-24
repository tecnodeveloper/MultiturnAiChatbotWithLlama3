"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Temporary: Mock email sign in
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split("@")[0],
      };
      setUser(mockUser);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Temporary: Mock email sign up
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
      };
      setUser(mockUser);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Temporary: Mock Google authentication
      // In production, this will call the real Google OAuth flow via Supabase
      const mockUser: AuthUser = {
        id: Math.random().toString(36).substring(7),
        email: `user_${Date.now()}@gmail.com`,
        name: "Google User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
      };
      setUser(mockUser);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("auth_user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
