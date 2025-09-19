import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UserUsage {
  prompts_per_month: number;
  ai_enhancements_per_month: number;
  prompts_slots: number;
  plan: string;
  prompts_used: number;
  enhancements_used: number;
  prompts_saved: number;
}

export function useUserUsage() {
  const { data: usage, refetch, isLoading } = useQuery({
    queryKey: ["/api/user/usage"],
    queryFn: async (): Promise<UserUsage> => {
      const res = await apiRequest("GET", "/api/user/usage");
      return res.json();
    },
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
    staleTime: 1000, // Consider data stale after 1 second
  });

  // Get usage data from database
  const promptsUsed = usage?.prompts_used || 0;
  const enhancementsUsed = usage?.enhancements_used || 0;
  const promptsSaved = usage?.prompts_saved || 0;
  const plan = usage?.plan || 'free';

  // Get limits from database - these should be actual numbers or -1 for unlimited
  const promptsPerMonth = usage?.prompts_per_month;
  const aiEnhancementsPerMonth = usage?.ai_enhancements_per_month;
  const promptsSlots = usage?.prompts_slots;



  // USE SUPABASE VALUES ONLY - No hardcoded limits
  const promptsLimit = promptsPerMonth === -1 ? "unlimited" : promptsPerMonth;
  const enhancementsLimit = aiEnhancementsPerMonth === -1 ? "unlimited" : aiEnhancementsPerMonth;
  const slotsLimit = promptsSlots === -1 ? "unlimited" : promptsSlots;

  console.log('✅ SUPABASE LIMITS USED:', {
    plan,
    supabase_limits: { promptsLimit, enhancementsLimit, slotsLimit },
    raw_api_response: { promptsPerMonth, aiEnhancementsPerMonth, promptsSlots }
  });

  // Helper function to calculate percentages
  const calculatePercentage = (used: number, limit: string | number | undefined): number => {
    if (!limit || limit === "unlimited" || typeof limit !== "number" || limit <= 0) return 0;
    return Math.min(100, (used / limit) * 100);
  };

  // Calculate percentages
  const promptsPercentage = calculatePercentage(promptsUsed, promptsLimit);
  const enhancementsPercentage = calculatePercentage(enhancementsUsed, enhancementsLimit);
  const slotsPercentage = calculatePercentage(promptsSaved, slotsLimit);

  // Helper function to check capabilities
  const canUse = (used: number, limit: string | number | undefined): boolean => {
    if (!limit || limit === "unlimited") return true;
    if (typeof limit !== "number" || limit <= 0) return false;
    return used < limit;
  };

  // Debug log for troubleshooting
  if (usage) {
    console.log('🔍 FRONTEND USAGE HOOK DEBUG:', {
      plan,
      raw_api_response: usage,
      raw_limits: { promptsPerMonth, aiEnhancementsPerMonth, promptsSlots },
      formatted_limits: { promptsLimit, enhancementsLimit, slotsLimit },
      usage_counts: { promptsUsed, enhancementsUsed, promptsSaved },
      percentages: { promptsPercentage, enhancementsPercentage, slotsPercentage }
    });
  }

  return {
    // Usage counts
    promptsUsed,
    enhancementsUsed,
    promptsSaved,

    // Limits (formatted for display)
    promptsLimit,
    enhancementsLimit,
    slotsLimit,

    // Raw limits (for calculations)
    promptsPerMonth,
    aiEnhancementsPerMonth,
    promptsSlots,

    // Percentages
    promptsPercentage,
    enhancementsPercentage,
    slotsPercentage,

    // Plan info
    plan,

    // Capabilities
    canUsePrompts: canUse(promptsUsed, promptsLimit),
    canUseEnhancements: canUse(enhancementsUsed, enhancementsLimit),
    canSavePrompts: canUse(promptsSaved, slotsLimit),

    // Utilities
    refetch,
    isLoading,
  };
}
