import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Optional right-side actions (e.g., buttons). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable section header for dashboard areas.
 */
export default function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground leading-tight mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
