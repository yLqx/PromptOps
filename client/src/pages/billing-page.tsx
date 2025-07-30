import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import PricingCards from "@/components/billing/pricing-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, AlertTriangle } from "lucide-react";

export default function BillingPage() {
  const { user } = useAuth();

  const planLimits = {
    free: 5,
    pro: 100,
    team: "Unlimited",
  };

  const planNames = {
    free: "Free Plan",
    pro: "Pro Plan",
    team: "Team Plan",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Billing & Plans</h2>
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
                <div className="text-2xl font-bold">{planNames[user?.plan as keyof typeof planNames] || "Free Plan"}</div>
                <Badge className="mt-2" variant={user?.plan === "free" ? "secondary" : "default"}>
                  {user?.plan === "free" ? "Free" : "Paid"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.promptsUsed || 0} / {planLimits[user?.plan as keyof typeof planLimits] || 5}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prompts used this month
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
                  {user?.plan === "free" ? "N/A" : "Next Month"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {user?.plan === "free" ? "No billing cycle" : "Automatic renewal"}
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
                    <p className="text-lg font-semibold">{planNames[user.plan as keyof typeof planNames]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">
                      {user.plan === "pro" ? "$19/month" : "$49/month"}
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
          {user?.plan === "free" && user?.promptsUsed >= 4 && (
            <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200">Usage Warning</CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  You're approaching your free plan limit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 dark:text-amber-200 mb-4">
                  You've used {user.promptsUsed} out of 5 free prompts. Consider upgrading to continue using PromptOps without interruption.
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
