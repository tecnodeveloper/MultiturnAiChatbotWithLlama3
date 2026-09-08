"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Clock, RotateCw } from "lucide-react";

export const AnalyticsHeader: FC = () => {
  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="relative flex items-center justify-between px-4 sm:px-8 py-3.5 max-w-[1600px] mx-auto w-full min-h-[64px]">
        {/* Left Zone — Navigation */}
        <div className="flex items-center z-10 min-w-[100px] sm:min-w-[180px]">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-normal border border-border bg-background/50 hover:bg-muted/40 hover:border-border text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5 text-muted-foreground group-hover:text-foreground" />
            <span className="hidden sm:inline font-normal">Back to dashboard</span>
            <span className="sm:hidden font-normal">Dashboard</span>
          </Link>
        </div>

        {/* Center Zone — Page Identity */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center pointer-events-none max-w-[calc(100%-220px)] sm:max-w-md">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#f5a623]/10 text-[#f5a623] shrink-0">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="text-[18px] sm:text-[22px] font-medium text-foreground tracking-tight whitespace-nowrap">
              Response analytics
            </h1>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5a623] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f5a623]" />
            </span>
            <p className="text-[12px] font-normal text-muted-foreground hidden sm:block whitespace-nowrap">
              Live performance & user feedback insights
            </p>
            <p className="text-[11px] font-normal text-muted-foreground sm:hidden whitespace-nowrap">
              Live performance
            </p>
          </div>
        </div>

        {/* Right Zone — Balance */}
        <div className="flex items-center justify-end gap-2 z-10 min-w-[100px] sm:min-w-[180px]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-normal border border-border bg-background/50 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden md:inline font-normal">Updated just now</span>
            <span className="md:hidden font-normal">Live</span>
          </div>
          <button
            onClick={handleRefresh}
            title="Refresh analytics data"
            aria-label="Refresh analytics data"
            className="p-1.5 rounded-xl border border-border bg-background/50 hover:bg-muted/40 hover:text-foreground text-muted-foreground transition-all duration-150 active:scale-[0.98]"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
