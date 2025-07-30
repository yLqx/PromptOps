import { useQuery } from "@tanstack/react-query";
import { Play, Edit, Crown, Check } from "lucide-react";
import type { PromptRun } from "@shared/schema";

export default function ActivityFeed() {
  const { data: runs = [] } = useQuery<PromptRun[]>({
    queryKey: ["/api/prompt-runs"],
  });

  const recentRuns = runs.slice(0, 4);

  const getActivityIcon = (run: PromptRun) => {
    if (run.success) {
      return { icon: Play, color: "text-emerald-400", bg: "bg-emerald-500 bg-opacity-20" };
    } else {
      return { icon: Edit, color: "text-red-400", bg: "bg-red-500 bg-opacity-20" };
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const runDate = new Date(date);
    const diffMs = now.getTime() - runDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h3>
      
      {recentRuns.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No activity yet</p>
          <p className="text-sm mt-2">Test a prompt to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentRuns.map((run) => {
            const { icon: Icon, color, bg } = getActivityIcon(run);
            return (
              <div key={run.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`${color} h-4 w-4`} />
                </div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">
                    {run.success ? "Successfully tested" : "Failed to test"} prompt with{" "}
                    <span className="text-emerald-400">{run.model}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatTimeAgo(run.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
