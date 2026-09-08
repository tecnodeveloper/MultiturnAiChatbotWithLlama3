"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const AccountHeader: FC = () => {
  return (
    <div className="relative flex items-center justify-between w-full py-4 sm:py-5">
      {/* Left: Beautiful Back to Dashboard Button matching theme */}
      <div className="flex items-center z-10">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border/80 bg-card/70 hover:bg-accent/80 hover:border-primary/40 text-foreground transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 text-muted-foreground group-hover:text-primary" />
          <span className="hidden sm:inline font-medium">Back to Dashboard</span>
          <span className="sm:hidden font-medium">Dashboard</span>
        </Link>
      </div>

      {/* Center: Account Settings Title & Subtitle */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">
          Manage your profile and preferences
        </p>
      </div>

      {/* Right spacer to balance layout */}
      <div className="w-[80px] sm:w-[150px] pointer-events-none" />
    </div>
  );
};
