import { useUserUsage } from "@/hooks/use-user-usage";

export function NavbarUsage() {
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
      <div className="space-y-4 px-3 py-2">
        <div className="text-sm text-gray-400">Loading usage...</div>
      </div>
    );
  }

  // Helper function to format the usage display
  const formatUsageDisplay = (used: number, limit: string | number | undefined): string => {
    if (limit === "unlimited" || limit === Infinity) return `${used}/∞`;
    return `${used}/${limit || 0}`;
  };

  return (
    <div className="space-y-4 px-3 py-3 bg-gray-800/30 rounded-lg border border-gray-700/30 m-3">
      {/* Plan Display */}
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">Current Plan</div>
        <div className={`text-sm font-semibold px-2 py-1 rounded-md font-['DM_Sans'] ${
          plan === 'free' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
          plan === 'pro' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40' :
          plan === 'team' ? 'bg-emerald-600/25 text-emerald-200 border border-emerald-400/50' :
          'bg-emerald-700/25 text-emerald-100 border border-emerald-300/50'
        }`}>
          {plan === 'free' && 'FREE PLAN'}
          {plan === 'pro' && 'PRO PLAN'}
          {plan === 'team' && 'TEAM PLAN'}
          {plan === 'enterprise' && 'ENTERPRISE PLAN'}
        </div>
      </div>

      {/* Prompts Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Prompts</span>
          <span className="text-sm font-semibold text-emerald-300">
            {formatUsageDisplay(promptsUsed, promptsLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: promptsLimit === "unlimited" ? '20%' : `${Math.min(promptsPercentage, 100)}%` }}
          />
        </div>
        {promptsLimit !== "unlimited" && promptsPercentage >= 80 && (
          <p className="text-xs text-amber-300 font-medium">
            {promptsPercentage >= 100 ? "🚫 Limit reached!" : "⚠️ Approaching limit"}
          </p>
        )}
        {promptsLimit === "unlimited" && (
          <p className="text-xs text-emerald-300 font-medium">
            ✨ Unlimited usage
          </p>
        )}
      </div>

      {/* AI Enhancements Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">AI Enhancements</span>
          <span className="text-sm font-semibold text-emerald-300">
            {formatUsageDisplay(enhancementsUsed, enhancementsLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: enhancementsLimit === "unlimited" ? '20%' : `${Math.min(enhancementsPercentage, 100)}%` }}
          />
        </div>
        {enhancementsLimit !== "unlimited" && enhancementsPercentage >= 80 && (
          <p className="text-xs text-amber-300 font-medium">
            {enhancementsPercentage >= 100 ? "🚫 Limit reached!" : "⚠️ Approaching limit"}
          </p>
        )}
        {enhancementsLimit === "unlimited" && (
          <p className="text-xs text-emerald-300 font-medium">
            ✨ Unlimited usage
          </p>
        )}
      </div>

      {/* Upgrade prompt for free users */}
      {plan === 'free' && (promptsPercentage >= 80 || enhancementsPercentage >= 80) && (
        <div className="text-xs text-amber-200 bg-amber-500/10 px-3 py-2 rounded-md border border-amber-500/30 text-center">
          <span className="font-medium">💡 Consider upgrading</span>
          <br />
          <span className="text-amber-300">for higher limits</span>
        </div>
      )}
    </div>
  );
}
