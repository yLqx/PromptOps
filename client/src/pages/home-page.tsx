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
  Plus
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

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
            <h2 className="text-3xl font-bold text-foreground mb-2">Control Dashboard</h2>
            <p className="text-muted-foreground">Manage your AI prompts and monitor usage</p>
          </div>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <QuickTest />
            
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">AI Response</h3>
              <div id="ai-response" className="bg-background border border-border rounded-lg p-4 h-40 overflow-auto">
                <p className="text-muted-foreground italic">AI response will appear here after testing your prompt...</p>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-muted-foreground">Model: <span className="text-emerald-400" data-model>Gemini Pro</span></span>
                <span className="text-muted-foreground">Response time: <span className="text-foreground" data-time>--</span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentPrompts />
            <ActivityFeed />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Billing & Plans</h2>
            <PricingCards />
          </div>

          {/* Admin Section */}
          {(user?.email === "admin@promptops.com" || user?.email === "mourad@admin.com") && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">System Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">System Status</span>
                      <span className="text-emerald-400 font-medium">Operational</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">API Health</span>
                      <span className="text-emerald-400 font-medium">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Database</span>
                      <span className="text-emerald-400 font-medium">Connected</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Admin actions available in the Admin dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
