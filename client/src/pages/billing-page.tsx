import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserUsage } from "@/hooks/use-user-usage";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import PricingCards from "@/components/billing/pricing-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, AlertTriangle } from "lucide-react";

export default function BillingPage() {
  const { user } = useSupabaseAuth();
  const { plan, promptsUsed, promptsLimit } = useUserUsage();

  const planLimits = {
    free: "15 prompts, 5 enhancements",
    pro: "1000 prompts, 150 enhancements",
    team: "7500 prompts, 2000 enhancements",
    enterprise: "Unlimited prompts, unlimited enhancements",
  };

  const planNames = {
    free: "Free Plan",
    pro: "Pro Plan",
    team: "Team Plan",
    enterprise: "Enterprise Plan",
  };

  const planPrices = {
    free: "$0",
    pro: "$15",
    team: "$49",
    enterprise: "Custom",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Plans</h1>
            <p className="text-muted-foreground">Manage your subscription and billing information</p>
          </div>

          {/* Current Plan Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-['DM_Sans']">{planNames[plan as keyof typeof planNames] || "Free Plan"}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {planPrices[plan as keyof typeof planPrices] || "$0"}/month
                </p>
                <Badge className="mt-2" variant={plan === "free" ? "secondary" : "default"}>
                  {plan === "free" ? "Free" : "Paid"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  {promptsUsed} / {
                    promptsLimit === Infinity ? '∞' : promptsLimit
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prompt tests used this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plan === "free" ? "N/A" : "Next Month"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {plan === "free" ? "No billing cycle" : "Automatic renewal"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Subscription Details */}
          {user?.plan !== "free" && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Your current subscription information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="text-lg font-semibold">{planNames[user?.plan as keyof typeof planNames]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">
                      {user?.plan === "pro" ? "$19/month" : "$49/month"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge>Active</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Billing Cycle</p>
                    <p>Monthly</p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">Download Invoice</Button>
                  <Button variant="destructive">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Warning */}
          {user?.plan === "free" && user?.prompts_used >= 12 && (
            <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200">Usage Warning</CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  You're approaching your free plan limit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 dark:text-amber-200 mb-4">
                  You've used {user.prompts_used} out of 15 free prompt tests. Consider upgrading to continue using PromptOp without interruption.
                </p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Available Plans */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Available Plans</h3>
            <PricingCards />
          </div>

          {/* Billing History */}
          {user?.plan !== "free" && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Your recent billing transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No billing history available</p>
                  <p className="text-sm mt-2">Billing history will appear here after your first payment</p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
