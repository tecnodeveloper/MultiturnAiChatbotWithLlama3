"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // While loading, don't show auth pages
  if (isLoading) {
    return <div className="min-h-screen" />;
  }

  // If user exists, don't render auth page (redirect will happen in effect)
  if (user) {
    return null;
  }

  return <>{children}</>;
}
