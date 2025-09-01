import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminQueryFn } from "@/lib/adminApi";
import {
  Users,
  MessageSquare,
  Bot,
  Activity,
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";

interface AdminStats {
  users: {
    free: number;
    pro: number;
    team: number;
    enterprise: number;
    total: number;
  };
  activity: {
    promptsToday: number;
    postsToday: number;
  };
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => adminQueryFn("/api/admin/stats"),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      description: "Registered users"
    },
    {
      title: "Pro Users",
      value: stats?.users.pro || 0,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      description: "Active subscriptions"
    },
    {
      title: "Prompts Today",
      value: stats?.activity.promptsToday || 0,
      icon: Bot,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      description: "Created today"
    },
    {
      title: "Posts Today",
      value: stats?.activity.postsToday || 0,
      icon: MessageSquare,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      description: "Community posts"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">System overview and key metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-500" />
              User Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">
              Users by subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { plan: "Free", count: stats?.users.free || 0, color: "bg-gray-500" },
                { plan: "Pro", count: stats?.users.pro || 0, color: "bg-emerald-500" },
                { plan: "Team", count: stats?.users.team || 0, color: "bg-blue-500" },
                { plan: "Enterprise", count: stats?.users.enterprise || 0, color: "bg-purple-500" }
              ].map((item) => (
                <div key={item.plan} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-white font-medium">{item.plan}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{item.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stats?.users.total ? Math.round((item.count / stats.users.total) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-emerald-500" />
              System Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-white">Database</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-white">API Services</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Operational
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-white">Email Service</span>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  Limited
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-white">Stripe Integration</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-emerald-500" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Activity logs will appear here</p>
            <p className="text-sm">Check the Logs section for detailed audit trail</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
