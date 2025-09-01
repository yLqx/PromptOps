import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface SubscriptionData {
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: string;
  price_id: string;
}

export default function SubscriptionManager() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscription data
  const { data: subscription, isLoading: loadingSubscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/subscription");
      return res.json();
    },
    enabled: !!user && user.plan !== "free",
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/cancel-subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/usage"] });
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will remain active until the end of the current billing period.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/reactivate-subscription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast({
        title: "Subscription reactivated",
        description: "Your subscription will continue as normal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to reactivate subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sync subscription mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sync-subscription");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/usage"] });
      if (data.success) {
        toast({
          title: "Subscription synced!",
          description: data.message,
        });
      } else {
        toast({
          title: "No active subscription",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to sync subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleManageBilling = () => {
    setIsLoading(true);
    // Redirect to Stripe Customer Portal
    apiRequest("POST", "/api/create-portal-session")
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        }
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to open billing portal",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "canceled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case "past_due":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Past Due</Badge>;
      case "unpaid":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Unpaid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user || user.plan === "free") {
    return null;
  }

  if (loadingSubscription) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading subscription details...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription Management
        </CardTitle>
        <CardDescription>
          Manage your PromptOps subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription && (
          <>
            {/* Subscription Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                {getStatusBadge(subscription.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="text-lg font-semibold capitalize">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
            </div>

            {/* Cancellation Warning */}
            {subscription.cancel_at_period_end && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription is set to cancel on {formatDate(subscription.current_period_end)}.
                  You can reactivate it anytime before then.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleManageBilling}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {isLoading ? "Opening..." : "Manage Billing"}
              </Button>

              {subscription.cancel_at_period_end ? (
                <Button
                  variant="outline"
                  onClick={() => reactivateMutation.mutate()}
                  disabled={reactivateMutation.isPending}
                >
                  {reactivateMutation.isPending ? "Reactivating..." : "Reactivate Subscription"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                </Button>
              )}
            </div>
          </>
        )}

        {!subscription && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active subscription found</p>
            <p className="text-sm mt-2">Choose a plan below to get started</p>

            {/* Sync button for when user just paid but subscription isn't showing */}
            <div className="mt-4">
              <Button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                {syncMutation.isPending ? "Syncing..." : "Sync Subscription Status"}
              </Button>
              <p className="text-xs mt-2 text-muted-foreground">
                Just completed a payment? Click to sync your subscription status.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
