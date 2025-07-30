import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sparkles, 
  CheckCircle, 
  X,
  ArrowRight,
  Crown,
  Zap
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 prompts maximum",
        "Basic AI testing",
        "Dashboard analytics",
        "Community support"
      ],
      notIncluded: [
        "Advanced analytics",
        "Team collaboration",
        "Priority support",
        "Custom integrations"
      ],
      buttonText: "Get Started",
      popular: false,
      icon: <Zap className="h-6 w-6" />
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious prompt engineers",
      features: [
        "100 prompts per month",
        "Multi-model AI testing",
        "Advanced analytics",
        "Version control",
        "API access",
        "Priority support"
      ],
      notIncluded: [
        "Unlimited team members",
        "Custom integrations",
        "Dedicated support"
      ],
      buttonText: "Start Pro Trial",
      popular: true,
      icon: <Crown className="h-6 w-6" />
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Unlimited prompts",
        "Unlimited team members",
        "Advanced collaboration",
        "Custom integrations",
        "Dedicated support",
        "SSO integration",
        "Advanced security",
        "Custom reporting"
      ],
      notIncluded: [],
      buttonText: "Contact Sales",
      popular: false,
      icon: <Sparkles className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PromptOps</span>
              </div>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">Home</a>
              </Link>
              <Link href="/about">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">About</a>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-6">
              Simple, 
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Transparent Pricing
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Choose the perfect plan for your AI prompt engineering needs. 
              Start free, upgrade as you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-emerald-500/50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        plan.popular ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}>
                        <div className={plan.popular ? 'text-white' : 'text-emerald-400'}>
                          {plan.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-1">/{plan.period}</span>
                    </div>
                    <p className="text-slate-300">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center opacity-50">
                        <X className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/auth">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300">Everything you need to know about our pricing</p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h3>
                <p className="text-slate-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What happens to my data if I cancel?</h3>
                <p className="text-slate-300">Your data remains accessible for 30 days after cancellation, giving you time to export if needed.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Do you offer refunds?</h3>
                <p className="text-slate-300">We offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Is there a free trial?</h3>
                <p className="text-slate-300">Yes! All paid plans come with a 14-day free trial. No credit card required to start.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of developers optimizing their AI prompts</p>
          <Link href="/auth">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 PromptOps. Powered by{" "}
            <a href="https://monzed.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Monzed.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}