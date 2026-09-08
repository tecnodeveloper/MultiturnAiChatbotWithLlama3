"use client";

import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AnalyticsData } from "@/hooks/use-analytics";
import { useTheme } from "next-themes";
import { ANALYTICS_TOKENS } from "./tokens";

interface FeedbackDistributionChartProps {
  data: AnalyticsData | null;
}

export const FeedbackDistributionChart: FC<FeedbackDistributionChartProps> = ({
  data: analyticsData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const correctness = analyticsData?.stats.correctness || {};

  const chartData = [
    {
      name: "Helpful",
      value: correctness.correct || 0,
      color: ANALYTICS_TOKENS.accent,
    },
    {
      name: "Partially helpful",
      value: correctness.partial || 0,
      color: isDark ? "rgba(245, 166, 35, 0.55)" : "rgba(245, 166, 35, 0.65)",
    },
    {
      name: "Not helpful",
      value: correctness.incorrect || 0,
      color: isDark ? "#71717a" : "#9ca3af",
    },
    {
      name: "No feedback",
      value: correctness.none || 0,
      color: isDark ? "#27272a" : "#e2e8f0",
    },
  ].filter((item) => item.value > 0);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="#0f1117"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-6 h-full border border-border">
      <h3 className="text-[16px] font-medium text-foreground">
        User feedback distribution
      </h3>

      <div className="h-[250px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? ANALYTICS_TOKENS.surface.cardDark : ANALYTICS_TOKENS.surface.cardLight} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: isDark ? `1px solid ${ANALYTICS_TOKENS.neutral.darkest}` : `1px solid ${ANALYTICS_TOKENS.surface.borderLight}`,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  backgroundColor: isDark ? ANALYTICS_TOKENS.surface.cardDark : ANALYTICS_TOKENS.surface.cardLight,
                  color: isDark ? ANALYTICS_TOKENS.text.primaryDark : ANALYTICS_TOKENS.text.primaryLight,
                  fontSize: 12,
                }}
                formatter={(value: any) => [`${value}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[12px] font-normal text-muted-foreground italic">
            No feedback data available
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col">
              <span className="text-[12px] font-normal text-muted-foreground">{item.name}</span>
              <span className="text-[13px] font-medium text-foreground">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
