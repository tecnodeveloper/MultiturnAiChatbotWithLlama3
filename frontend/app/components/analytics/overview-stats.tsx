import { FC } from "react";
import { Target, MessageCircle, ThumbsUp, Award } from "lucide-react";
import { StatCard } from "./stat-card";
import { AnalyticsData } from "@/hooks/use-analytics";

interface OverviewStatsProps {
  data: AnalyticsData | null;
}

export const OverviewStats: FC<OverviewStatsProps> = ({ data }) => {
  const totalFeedback = data?.summary.total_feedback || 0;
  const avgRating = data?.summary.average_rating || 0;
  
  // Calculate accuracy from correctness stats (correct + partial)
  const correctness = data?.stats.correctness || {};
  const accuracyRate = ((correctness.correct || 0) + (correctness.partial || 0)).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Accuracy rate"
        value={`${accuracyRate}%`}
        subtitle="Correct + partial"
        icon={<Target className="h-6 w-6" />}
      />
      <StatCard
        title="Total feedback"
        value={totalFeedback.toLocaleString()}
        subtitle="Across all chats"
        icon={<MessageCircle className="h-6 w-6" />}
      />
      <StatCard
        title="Average rating"
        value={avgRating.toFixed(1)}
        subtitle="Out of 5 stars"
        icon={<ThumbsUp className="h-6 w-6" />}
      />
      <StatCard
        title="Responses found"
        value={data?.raw_data_count?.toString() || "0"}
        subtitle="Analyzed data points"
        icon={<Award className="h-6 w-6" />}
      />
    </div>
  );
};
