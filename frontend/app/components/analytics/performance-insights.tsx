import { FC, ReactNode } from "react";
import { CheckCircle, ThumbsUp, AlertCircle, Target, XCircle } from "lucide-react";
import { AnalyticsData } from "@/hooks/use-analytics";

interface InsightProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const InsightCard: FC<InsightProps> = ({ icon, title, description, bgColor, iconColor, borderColor }) => (
  <div className={`${bgColor} border ${borderColor} rounded-xl p-4 flex gap-3.5 items-start shadow-sm transition-colors`}>
    <div className={`${iconColor} mt-0.5 shrink-0`}>
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <h4 className="font-medium text-foreground text-[13.5px]">{title}</h4>
      <p className="text-[12.5px] font-normal text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

interface PerformanceInsightsProps {
  data: AnalyticsData | null;
}

export const PerformanceInsights: FC<PerformanceInsightsProps> = ({ data: analyticsData }) => {
  const totalFeedback = analyticsData?.summary.total_feedback || 0;
  const avgRating = analyticsData?.summary.average_rating || 0;
  const correctness = analyticsData?.stats.correctness || {};
  const accuracy = ((correctness.correct || 0) + (correctness.partial || 0)).toFixed(1);
  const helpfulPct = (correctness.correct || 0).toFixed(1);
  const negativeCount = Number(analyticsData?.stats.ratings["1"] || 0) + Number(analyticsData?.stats.ratings["2"] || 0);

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-6 h-full border border-border">
      <h3 className="text-[16px] font-medium text-foreground">Performance insights</h3>
      <div className="flex flex-col gap-3.5">
        <InsightCard
          icon={<CheckCircle className="h-4 w-4" />}
          title="Accuracy overview"
          description={`Your chatbot achieved ${accuracy}% accuracy overall. Consistently high quality responses across analyzed sessions.`}
          bgColor="bg-[#f5a623]/10"
          iconColor="text-[#f5a623]"
          borderColor="border-[#f5a623]/25"
        />
        <InsightCard
          icon={<ThumbsUp className="h-4 w-4" />}
          title="User satisfaction"
          description={`${helpfulPct}% of users marked responses as helpful. Average rating is ${avgRating}/4 stars.`}
          bgColor="bg-muted/20"
          iconColor="text-[#f5a623]"
          borderColor="border-border/60"
        />
        {parseFloat(accuracy) < 90 && (
          <InsightCard
            icon={<AlertCircle className="h-4 w-4" />}
            title="Improvement opportunity"
            description="Accuracy is below 90%. Review partially helpful feedback to identify areas for refinement."
            bgColor="bg-muted/20"
            iconColor="text-[#f5a623]/80"
            borderColor="border-border/60"
          />
        )}
        <InsightCard
          icon={<Target className="h-4 w-4" />}
          title="Data coverage"
          description={`${totalFeedback} total feedback points analyzed. Larger sample sizes will provide more robust topic clustering.`}
          bgColor="bg-muted/20"
          iconColor="text-muted-foreground"
          borderColor="border-border/60"
        />
        {negativeCount > 0 && (
          <InsightCard
            icon={<XCircle className="h-4 w-4" />}
            title="Negative feedback"
            description={`${negativeCount} responses received low ratings. Analyze these specific cases to improve model performance.`}
            bgColor="bg-muted/20"
            iconColor="text-muted-foreground"
            borderColor="border-border/60"
          />
        )}
      </div>
    </div>
  );
};
