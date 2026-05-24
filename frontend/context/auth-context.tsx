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
          const parsedUser = JSON.parse(storedUser);
          // Validate user still exists (in production, verify session token with backend)
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("auth_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In production, call backend to verify credentials
      // For now, simulate validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Check if user "exists" in our temporary storage
      const storedUsers = JSON.parse(localStorage.getItem("app_users") || "{}");
      const existingUser = Object.values(storedUsers).find(
        (u: any) => u.email === email
      );

      if (!existingUser) {
        throw new Error("Invalid email or password");
      }

      const tempUser = existingUser as AuthUser;
      setUser(tempUser);
      localStorage.setItem("auth_user", JSON.stringify(tempUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem("app_users") || "{}");
      if (Object.values(storedUsers).some((u: any) => u.email === email)) {
        throw new Error("User already exists");
      }

      // Create new user
      const newUser: AuthUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
      };

      // Store in temporary app users
      storedUsers[newUser.id] = newUser;
      localStorage.setItem("app_users", JSON.stringify(storedUsers));

      // Set authenticated user
      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Temporary: Mock Google authentication
      // In production, this will call real Supabase OAuth
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
