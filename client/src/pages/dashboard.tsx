import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Clock,
  Sparkles,
  MessageSquare,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: runs = [] } = useQuery({
    queryKey: ["/api/prompt-runs"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Manage your AI prompts and monitor usage</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-emerald-400" />
                  Total Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{prompts.length}</div>
                <p className="text-muted-foreground text-sm">
                  {user?.plan === "free" ? `${prompts.length}/5` : 
                   user?.plan === "pro" ? `${prompts.length}/100` : 
                   "Unlimited"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-emerald-400" />
                  Runs Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{runs.length}</div>
                <p className="text-muted-foreground text-sm">AI model executions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-emerald-400" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <p className="text-muted-foreground text-sm">Successful executions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-emerald-400" />
                  Avg Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">1.2s</div>
                <p className="text-muted-foreground text-sm">Average response time</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Test */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-emerald-400" />
                  Quick Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here..."
                  className="min-h-[120px]"
                />
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <Zap className="mr-2 h-4 w-4" />
                  Test Prompt
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">AI Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background border border-border rounded-lg p-4 h-32 overflow-auto">
                  <p className="text-muted-foreground italic">AI response will appear here after testing your prompt...</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-muted-foreground">Model: <span className="text-emerald-400">Gemini Pro</span></span>
                  <span className="text-muted-foreground">Response time: <span className="text-foreground">--</span></span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Prompts</CardTitle>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </CardHeader>
              <CardContent>
                {prompts.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-foreground font-medium mb-2">No prompts yet</h3>
                    <p className="text-muted-foreground">Create your first prompt to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prompts.slice(0, 5).map((prompt: any) => (
                      <div key={prompt.id} className="p-3 bg-muted rounded-lg">
                        <h4 className="text-foreground font-medium">{prompt.title}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{prompt.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs ${
                            prompt.status === "active" ? "bg-emerald-600" : "bg-muted"
                          }`}>
                            {prompt.status}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {new Date(prompt.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-foreground text-sm">Welcome to PromptOps!</p>
                      <p className="text-muted-foreground text-xs">Account created</p>
                    </div>
                  </div>
                  {runs.slice(0, 3).map((run: any, index: number) => (
                    <div key={run.id || index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-foreground text-sm">Prompt executed successfully</p>
                        <p className="text-muted-foreground text-xs">{new Date(run.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`text-sm mb-2 ${
                    user?.plan === "free" ? "bg-muted" : 
                    user?.plan === "pro" ? "bg-emerald-600" : 
                    "bg-blue-600"
                  }`}>
                    {user?.plan?.toUpperCase() || "FREE"}
                  </Badge>
                  <p className="text-muted-foreground">
                    {user?.plan === "free" ? "5 prompts included" :
                     user?.plan === "pro" ? "100 prompts for $19/month" :
                     "Unlimited prompts for $49/month"}
                  </p>
                </div>
                {user?.plan === "free" && (
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
}