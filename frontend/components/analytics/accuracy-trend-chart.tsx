"use client";

import { FC, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsData } from "@/hooks/use-analytics";
import { useTheme } from "next-themes";
import { ANALYTICS_TOKENS } from "./tokens";

interface AccuracyTrendChartProps {
  data: AnalyticsData | null;
}

export const AccuracyTrendChart: FC<AccuracyTrendChartProps> = ({ data: analyticsData }) => {
  const [range, setRange] = useState("Week");
  const { theme } = useTheme();
  
  const chartData = analyticsData?.trends.map(t => ({
    day: t.day,
    val: t.accuracy
  })) || [];

  const isDark = theme === "dark";

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-6 w-full border border-border">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-medium text-foreground">Response accuracy trend</h3>
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
          {["Week", "Month", "Year"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1 text-[12px] rounded-md transition-all ${
                range === r
                  ? "bg-[#f5a623] text-[#0f1117] font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground font-normal"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ANALYTICS_TOKENS.accent} stopOpacity={0.15} />
                <stop offset="95%" stopColor={ANALYTICS_TOKENS.accent} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? ANALYTICS_TOKENS.neutral.gridDark : ANALYTICS_TOKENS.neutral.gridLight} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? ANALYTICS_TOKENS.text.mutedDark : ANALYTICS_TOKENS.text.mutedLight, fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? ANALYTICS_TOKENS.text.mutedDark : ANALYTICS_TOKENS.text.mutedLight, fontSize: 11 }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: isDark ? `1px solid ${ANALYTICS_TOKENS.neutral.darkest}` : `1px solid ${ANALYTICS_TOKENS.surface.borderLight}`, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                backgroundColor: isDark ? ANALYTICS_TOKENS.surface.cardDark : ANALYTICS_TOKENS.surface.cardLight,
                color: isDark ? ANALYTICS_TOKENS.text.primaryDark : ANALYTICS_TOKENS.text.primaryLight,
                fontSize: 12,
              }}
              formatter={(val: any) => [`${val}%`, "Accuracy"]}
            />
            <Area
              type="monotone"
              dataKey="val"
              stroke={ANALYTICS_TOKENS.accent}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAccuracy)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
