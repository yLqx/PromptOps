import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  /** Tailwind class for icon colour, e.g. 'text-emerald-400'  */
  iconColor?: string;
  /** Tailwind classes for icon background (subtle). Defaults to muted cosmic accent */
  bgColor?: string;
  className?: string;
}

/**
 * Glass-style statistics card with minimal motion.
 * Designed for the cosmic PromptOps dashboard overhaul.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-emerald-400",
  bgColor = "bg-emerald-500/15",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 backdrop-blur-sm bg-card/60 hover:bg-card/70 transition-colors",
        "glass-effect group card-hover",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              bgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
