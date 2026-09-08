import { FC, ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  icon: ReactNode;
  iconBgColor?: string;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-4 border border-border">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-[#f5a623]/10 text-[#f5a623]">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[12px] font-normal text-muted-foreground">
            {trend.isUp ? <TrendingUp className="h-4 w-4 text-[#f5a623]" /> : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-[12.5px] font-normal text-muted-foreground">{title}</p>
        <h3 className="text-[28px] font-medium text-foreground mt-1 leading-tight tracking-tight">{value}</h3>
        {subtitle && <p className="text-[11px] font-normal mt-1 text-muted-foreground/75">{subtitle}</p>}
      </div>
    </div>
  );
};
