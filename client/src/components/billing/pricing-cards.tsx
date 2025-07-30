import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function PricingCards() {
  const { user } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 5 saved prompts",
        "Basic AI testing",
        "Community support",
      ],
      current: user?.plan === "free",
      buttonText: "Current Plan",
      buttonDisabled: true,
    },
    {
      name: "Pro",
      price: "$19",
      description: "For professionals and growing teams",
      features: [
        "Up to 100 saved prompts",
        "Advanced AI models",
        "Priority support",
        "Export capabilities",
      ],
      popular: true,
      current: user?.plan === "pro",
      buttonText: user?.plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonDisabled: user?.plan === "pro",
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams and organizations",
      features: [
        "Unlimited prompts",
        "Team collaboration",
        "Admin dashboard",
        "Advanced analytics",
      ],
      current: user?.plan === "team",
      buttonText: user?.plan === "team" ? "Current Plan" : "Upgrade to Team",
      buttonDisabled: user?.plan === "team",
    },
  ];

  const handleUpgrade = (planName: string) => {
    // TODO: Implement Stripe checkout
    console.log(`Upgrading to ${planName} plan`);
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
                plan.popular 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" 
                  : plan.name === "Team" 
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    : ""
              }`}
              variant={plan.buttonDisabled ? "secondary" : "default"}
              disabled={plan.buttonDisabled}
              onClick={() => !plan.buttonDisabled && handleUpgrade(plan.name)}
            >
              {plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
