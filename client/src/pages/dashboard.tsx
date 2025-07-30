import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import PromptTester from "@/components/prompt-tester";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Play, Check, Crown, TrendingUp, Users, Activity, Database } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: recentRuns = [] } = useQuery({
    queryKey: ["/api/prompt-runs"],
  });

  const recentPrompts = prompts.slice(0, 3);
  const recentActivities = recentRuns.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Dashboard Overview */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Control Dashboard</h2>
            <p className="text-muted-foreground">Manage your AI prompts and monitor usage</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Prompts</p>
                    <p className="text-2xl font-bold">{(stats as any)?.totalPrompts || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Edit className="text-emerald-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Runs Today</p>
                    <p className="text-2xl font-bold">{(stats as any)?.runsToday || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Play className="text-blue-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Success Rate</p>
                    <p className="text-2xl font-bold">{(stats as any)?.successRate || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Check className="text-green-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Current Plan</p>
                    <p className="text-2xl font-bold">{user?.plan || 'Free'}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Crown className="text-purple-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Tester */}
          <div className="mb-8">
            <PromptTester />
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                {recentPrompts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No prompts yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentPrompts.map((prompt: any) => (
                      <div key={prompt.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div>
                          <h4 className="font-medium">{prompt.title}</h4>
                          <p className="text-sm text-muted-foreground">{prompt.description}</p>
                        </div>
                        <Badge variant={prompt.status === "active" ? "default" : "secondary"}>
                          {prompt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link href="/prompts">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Prompts
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((run: any) => (
                      <div key={run.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center">
                          <Activity className="text-emerald-400 h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">Tested prompt with {run.model}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(run.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}