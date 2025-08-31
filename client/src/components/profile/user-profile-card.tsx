import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserUsage } from "@/hooks/use-user-usage";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Calendar, 
  Crown, 
  Star, 
  Heart, 
  MessageSquare, 
  Eye,
  Trophy,
  Target,
  Zap,
  Settings,
  Edit
} from "lucide-react";

interface UserProfileCardProps {
  showActions?: boolean;
  compact?: boolean;
}

export default function UserProfileCard({ showActions = true, compact = false }: UserProfileCardProps) {
  const { user } = useSupabaseAuth();

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  if (!user) return null;

  // Mock user stats for demonstration
  const mockStats = {
    promptsCreated: 23,
    promptsShared: 8,
    totalLikes: 156,
    totalComments: 42,
    totalViews: 1247,
    voicePromptsCreated: 5,
    joinDate: "2024-01-15T10:00:00Z",
    lastActive: "2024-01-20T15:30:00Z",
    achievements: [
      { name: "First Prompt", icon: "🎯", earned: true },
      { name: "Community Contributor", icon: "🤝", earned: true },
      { name: "Voice Pioneer", icon: "🎤", earned: true },
      { name: "Popular Creator", icon: "⭐", earned: false },
      { name: "AI Enhancer", icon: "🤖", earned: true }
    ]
  };

  const getPlanInfo = (plan: string) => {
    switch (plan) {
      case "pro":
        return {
          name: "Pro",
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <Star className="h-3 w-3" />,
          features: ["1000 prompt tests", "150 AI enhancements", "Pro models"]
        };
      case "team":
        return {
          name: "Team",
          color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
          icon: <Crown className="h-3 w-3" />,
          features: ["Unlimited tests", "Team collaboration", "All models"]
        };
      case "enterprise":
        return {
          name: "Enterprise",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: <Trophy className="h-3 w-3" />,
          features: ["Everything", "Custom integrations", "Priority support"]
        };
      default:
        return {
          name: "Free",
          color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          icon: <Target className="h-3 w-3" />,
          features: ["15 prompt tests", "5 AI enhancements", "Basic models"]
        };
    }
  };

  const planInfo = getPlanInfo(user.plan);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsageProgress = () => {
    // Use actual limits from useUserUsage hook instead of hardcoded values
    const { promptsLimit, enhancementsLimit, slotsLimit } = useUserUsage();

    const userLimits = {
      prompts: typeof promptsLimit === 'string' ? -1 : promptsLimit,
      enhancements: typeof enhancementsLimit === 'string' ? -1 : enhancementsLimit,
      slots: typeof slotsLimit === 'string' ? -1 : slotsLimit
    };
    
    return {
      prompts: {
        used: user.prompts_used || 0,
        limit: userLimits.prompts,
        percentage: userLimits.prompts === -1 ? 0 : ((user.prompts_used || 0) / userLimits.prompts) * 100
      },
      enhancements: {
        used: user.enhancements_used || 0,
        limit: userLimits.enhancements,
        percentage: userLimits.enhancements === -1 ? 0 : ((user.enhancements_used || 0) / userLimits.enhancements) * 100
      }
    };
  };

  const usage = getUsageProgress();

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{user.username}</h3>
                <Badge className={`text-xs ${planInfo.color}`}>
                  {planInfo.icon}
                  <span className="ml-1">{planInfo.name}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(mockStats.joinDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-xl">{user.username}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${planInfo.color}`}>
                  {planInfo.icon}
                  <span className="ml-1">{planInfo.name} Plan</span>
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Joined {formatDate(mockStats.joinDate)}
                </div>
              </div>
            </div>
          </div>
          {showActions && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Features */}
        <div>
          <h4 className="font-medium mb-2">Plan Features</h4>
          <div className="flex flex-wrap gap-2">
            {planInfo.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="space-y-4">
          <h4 className="font-medium">Usage This Month</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Prompt Tests</span>
                <span>
                  {usage.prompts.used} / {usage.prompts.limit === -1 ? "Unlimited" : usage.prompts.limit}
                </span>
              </div>
              {usage.prompts.limit !== -1 && (
                <Progress value={usage.prompts.percentage} className="h-2" />
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>AI Enhancements</span>
                <span>
                  {usage.enhancements.used} / {usage.enhancements.limit === -1 ? "Unlimited" : usage.enhancements.limit}
                </span>
              </div>
              {usage.enhancements.limit !== -1 && (
                <Progress value={usage.enhancements.percentage} className="h-2" />
              )}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div>
          <h4 className="font-medium mb-3">Community Activity</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Target className="h-3 w-3" />
                Prompts
              </div>
              <p className="text-2xl font-bold">{mockStats.promptsCreated}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Heart className="h-3 w-3" />
                Likes
              </div>
              <p className="text-2xl font-bold">{mockStats.totalLikes}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <MessageSquare className="h-3 w-3" />
                Comments
              </div>
              <p className="text-2xl font-bold">{mockStats.totalComments}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Eye className="h-3 w-3" />
                Views
              </div>
              <p className="text-2xl font-bold">{mockStats.totalViews}</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-medium mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {mockStats.achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                  achievement.earned
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                    : "bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-500"
                }`}
              >
                <span className={achievement.earned ? "" : "grayscale opacity-50"}>
                  {achievement.icon}
                </span>
                <span className={achievement.earned ? "font-medium" : ""}>
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Account Settings
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Upgrade Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
