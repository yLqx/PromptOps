import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Activity, Database } from "lucide-react";
import type { User } from "@shared/schema";

export default function AdminPage() {
  const { user } = useAuth();

  // Redirect if not admin
  if (user?.email !== "admin@promptops.com") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage users and monitor system performance</p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{systemStats?.totalUsers || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Subscriptions</p>
                    <p className="text-2xl font-bold">{systemStats?.activeSubscriptions || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-emerald-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${systemStats?.monthlyRevenue || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">API Calls</p>
                    <p className="text-2xl font-bold">{systemStats?.apiCalls || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Activity className="text-purple-400 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Monitor and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((userItem) => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {userItem.username.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{userItem.username}</p>
                          <p className="text-sm text-muted-foreground">{userItem.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={userItem.plan === "free" ? "secondary" : "default"}>
                          {userItem.plan}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {userItem.promptsUsed} prompts used
                        </div>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Monitor system performance and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Service Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">API Server</span>
                      <span className="text-emerald-400 font-medium">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Database</span>
                      <span className="text-emerald-400 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">AI Services</span>
                      <span className="text-emerald-400 font-medium">Available</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="text-emerald-400 font-medium">99.97%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Response Time</span>
                      <span className="text-emerald-400 font-medium">240ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className="text-emerald-400 font-medium">0.03%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
