"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // While loading, show nothing (avoid flashing login page)
  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  // If no user after loading, don't render (redirect will happen in effect)
  if (!user) {
    return null;
  }

  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
