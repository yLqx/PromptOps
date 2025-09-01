import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PricingCards() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  // Get current user plan
  const currentPlan = user?.plan || 'free';

  // Determine which plans can be upgraded to
  const canUpgradeTo = (planName: string) => {
    const plan = planName.toLowerCase();

    if (currentPlan === 'free') {
      return plan === 'pro' || plan === 'team'; // Free can upgrade to Pro or Team
    } else if (currentPlan === 'pro') {
      return plan === 'team'; // Pro can only upgrade to Team
    } else if (currentPlan === 'team') {
      return false; // Team can't upgrade (highest plan)
    }
    return false;
  };

  const getButtonText = (planName: string) => {
    const plan = planName.toLowerCase();

    if (currentPlan === plan) {
      return 'Current Plan';
    } else if (canUpgradeTo(planName)) {
      return 'Upgrade';
    } else {
      return 'Not Available';
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "15 prompt tests per month",
        "5 AI enhancements per month",
        "25 prompt slots",
        "Free models only",
        "Community access",
      ],
      current: currentPlan === "free",
      buttonText: "Current Plan",
      buttonDisabled: true,
    },
    {
      name: "Pro",
      price: "$19",
      description: "For professionals and creators",
      features: [
        "1000 prompt tests/month",
        "150 AI enhancements/month",
        "500 prompt slots",
        "All AI models",
        "Priority support",
        "API access",
      ],
      popular: true,
      current: currentPlan === "pro",
      buttonText: getButtonText("Pro"),
      buttonDisabled: !canUpgradeTo("Pro") && currentPlan !== "pro",
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams and organizations",
      features: [
        "7500 prompt tests/month",
        "2000 AI enhancements/month",
        "Unlimited prompt slots",
        "All AI models",
        "Team collaboration",
        "Add team members",
        "Custom support",
      ],
      current: currentPlan === "team",
      buttonText: getButtonText("Team"),
      buttonDisabled: !canUpgradeTo("Team") && currentPlan !== "team",
    },
  ];

  const handleUpgrade = async (planName: string) => {
    try {
      const plan = planName.toLowerCase();

      // Check if upgrade is allowed
      if (!canUpgradeTo(planName)) {
        toast({
          title: "Upgrade not available",
          description: `You cannot upgrade to ${planName} from your current ${currentPlan} plan.`,
          variant: "destructive"
        });
        return;
      }

      const res = await apiRequest("POST", "/api/create-checkout-session", { plan });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error creating checkout session",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to start upgrade process",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.name} 
          className={`relative ${plan.popular ? "border-2 border-emerald-500" : "border border-border"}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-500 text-white">Most Popular</Badge>
            </div>
          )}
          
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="text-3xl font-bold text-foreground mb-1">{plan.price}</div>
            <CardDescription>per month</CardDescription>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="text-emerald-400 mr-3 h-4 w-4" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              className={`w-full ${
                plan.popular && canUpgradeTo(plan.name)
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                  : plan.name === "Team" && canUpgradeTo(plan.name)
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    : ""
              }`}
              variant={plan.buttonDisabled || !canUpgradeTo(plan.name) ? "secondary" : "default"}
              disabled={plan.buttonDisabled || (currentPlan !== plan.name.toLowerCase() && !canUpgradeTo(plan.name))}
              onClick={() => canUpgradeTo(plan.name) && handleUpgrade(plan.name)}
            >
              {plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
