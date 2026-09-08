"use client";

import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AnalyticsData } from "@/hooks/use-analytics";
import { useTheme } from "next-themes";
import { ANALYTICS_TOKENS } from "./tokens";

interface TopicAccuracyChartProps {
  data: AnalyticsData | null;
}

export const TopicAccuracyChart: FC<TopicAccuracyChartProps> = ({ data: analyticsData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const chartData = analyticsData?.topics.map(t => ({
    topic: t.name || t.keywords.join(", "),
    val: t.count
  })) || [];

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-6 h-full border border-border">
      <h3 className="text-[16px] font-medium text-foreground">Feedback volume by topic</h3>
      
      <div className="h-[300px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ left: 10, right: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? ANALYTICS_TOKENS.neutral.gridDark : ANALYTICS_TOKENS.neutral.gridLight} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="topic" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? ANALYTICS_TOKENS.text.secondaryDark : ANALYTICS_TOKENS.text.secondaryLight, fontSize: 11, fontWeight: 400 }}
                width={140}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '10px', 
                  border: isDark ? `1px solid ${ANALYTICS_TOKENS.neutral.darkest}` : `1px solid ${ANALYTICS_TOKENS.surface.borderLight}`, 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  backgroundColor: isDark ? ANALYTICS_TOKENS.surface.cardDark : ANALYTICS_TOKENS.surface.cardLight,
                  color: isDark ? ANALYTICS_TOKENS.text.primaryDark : ANALYTICS_TOKENS.text.primaryLight,
                  fontSize: 12
                }}
                formatter={(value: any) => [value, 'Feedback count']}
              />
              <Bar dataKey="val" fill={ANALYTICS_TOKENS.accent} radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList 
                  dataKey="val" 
                  position="right" 
                  style={{ fill: isDark ? ANALYTICS_TOKENS.text.mutedDark : ANALYTICS_TOKENS.text.mutedLight, fontSize: 11, fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[12px] font-normal text-muted-foreground">
            No feedback topic data available
          </div>
        )}
      </div>
    </div>
  );
};
