import { useUserUsage } from "@/hooks/use-user-usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Sparkles } from "lucide-react";

export function UsageDisplay() {
  const {
    promptsUsed,
    enhancementsUsed,
    promptsLimit,
    enhancementsLimit,
    promptsPercentage,
    enhancementsPercentage,
    plan,
    isLoading
  } = useUserUsage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to format the usage display
  const formatUsageDisplay = (used: number, limit: string | number | undefined): string => {
    if (!limit || limit === "unlimited") return `${used}/unlimited`;
    return `${used}/${limit}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* Prompts Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prompts</span>
            <span className="text-sm text-muted-foreground">
              {formatUsageDisplay(promptsUsed, promptsLimit)}
            </span>
          </div>
          <Progress value={promptsPercentage} className="h-2" />
          {promptsLimit !== "unlimited" && promptsPercentage >= 80 && (
            <p className="text-xs text-amber-600">
              {promptsPercentage >= 100 ? "Limit reached!" : "Approaching limit"}
            </p>
          )}
          {promptsLimit === "unlimited" && (
            <p className="text-xs text-emerald-600">
              Unlimited prompts available
            </p>
          )}
        </div>

        {/* Enhancements Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Enhancements</span>
            <span className="text-sm text-muted-foreground">
              {formatUsageDisplay(enhancementsUsed, enhancementsLimit)}
            </span>
          </div>
          <Progress value={enhancementsPercentage} className="h-2" />
          {enhancementsLimit !== "unlimited" && enhancementsPercentage >= 80 && (
            <p className="text-xs text-amber-600">
              {enhancementsPercentage >= 100 ? "Limit reached!" : "Approaching limit"}
            </p>
          )}
          {enhancementsLimit === "unlimited" && (
            <p className="text-xs text-emerald-600">
              Unlimited enhancements available
            </p>
          )}
        </div>

        {/* Plan Info */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Current Plan</span>
            <span className="text-xs font-medium capitalize">{plan}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
