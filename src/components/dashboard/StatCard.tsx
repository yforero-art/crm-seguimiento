import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type StatColor = "blue" | "green" | "red" | "gray";

const COLOR_STYLES: Record<StatColor, string> = {
  blue: "bg-primary/10 text-primary",
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  gray: "bg-muted text-muted-foreground",
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: number;
  color?: StatColor;
}

export function StatCard({ title, value, icon, trend, color = "blue" }: StatCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = hasTrend && trend >= 0;

  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
          {hasTrend && (
            <p className={cn("text-xs font-medium", isPositive ? "text-success" : "text-destructive")}>
              {isPositive ? "+" : ""}
              {trend}%<span className="ml-1 font-normal text-muted-foreground">vs. mes anterior</span>
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", COLOR_STYLES[color])}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
