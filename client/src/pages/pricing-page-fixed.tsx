import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { AnimatedNav } from "@/components/ui/animated-nav";
import { Footer } from "@/components/ui/footer";
import { Link } from "wouter";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
import {
  Check,
  X,
  Zap,
  Brain,
  Users,
  Shield,
  ArrowRight,
  Star,
  Crown,
  Rocket,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Wand2,
  Target,
  Sparkles,
  TrendingUp
} from "lucide-react";

export default function PricingPage() {
  useScrollAnimations();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      badge: null,
      features: [
        { name: "15 prompt tests per month", included: true },
        { name: "5 AI enhancements per month", included: true },
        { name: "Free AI models only", included: true },
        { name: "25 prompt slots", included: true },
        { name: "Basic analytics", included: true },
        { name: "Community support", included: true },
        { name: "Pro AI models", included: false },
        { name: "Team collaboration", included: false },
        { name: "Priority support", included: false },
        { name: "Custom integrations", included: false }
      ],
      cta: "Get Started Free",
      ctaVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For professionals and creators",
      badge: "Most Popular",
      features: [
        { name: "1000 prompt tests per month", included: true },
        { name: "150 AI enhancements per month", included: true },
        { name: "Pro AI models", included: true },
        { name: "500 prompt slots", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
        { name: "Export/Import prompts", included: true },
        { name: "Team collaboration", included: false },
        { name: "Enterprise models", included: false }
      ],
      cta: "Start Pro Trial",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "For teams and organizations",
      badge: "Add Members",
      features: [
        { name: "7500 prompt tests per month", included: true },
        { name: "2000 AI enhancements per month", included: true },
        { name: "Pro + Team AI models", included: true },
        { name: "Unlimited prompt slots", included: true },
        { name: "Team collaboration", included: true },
        { name: "Custom support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "API access", included: true },
        { name: "SSO integration", included: true },
        { name: "Add team members (+$25/slot, max 10)", included: true }
      ],
      cta: "Start Team Trial",
      ctaVariant: "default" as const,
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      badge: "Contact Sales",
      features: [
        { name: "Everything in Team", included: true },
        { name: "Unlimited team members", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated support manager", included: true },
        { name: "SLA & compliance", included: true },
        { name: "On-premise deployment", included: true },
        { name: "Custom training", included: true },
        { name: "White-label options", included: true },
        { name: "24/7 phone support", included: true },
        { name: "Custom contracts", included: true }
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false
    }
  ];

  const features = [
    {
      title: "Prompt Tests per Month",
      free: "15",
      pro: "1000",
      team: "7500",
      enterprise: "Unlimited",
      icon: <Target className="h-5 w-5 text-emerald-400" />
    },
    {
      title: "AI Enhancements",
      free: "5 per month",
      pro: "150 per month",
      team: "2000 per month",
      enterprise: "Unlimited",
      icon: <Wand2 className="h-5 w-5 text-purple-400" />
    },
    {
      title: "Prompt Slots",
      free: "25",
      pro: "500",
      team: "Unlimited",
      enterprise: "Unlimited",
      icon: <Sparkles className="h-5 w-5 text-blue-400" />
    },
    {
      title: "AI Models",
      free: "Free tier models (23 models)",
      pro: "Free + Pro tier models (48 models)",
      team: "All models (60 models)",
      enterprise: "All models (60 models)",
      icon: <Brain className="h-5 w-5 text-yellow-400" />
    },
    {
      title: "Team Collaboration",
      free: <X className="h-4 w-4 text-red-400 mx-auto" />,
      pro: <X className="h-4 w-4 text-red-400 mx-auto" />,
      team: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      enterprise: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      icon: <Users className="h-5 w-5 text-green-400" />
    },
    {
      title: "Priority Support",
      free: <X className="h-4 w-4 text-red-400 mx-auto" />,
      pro: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      team: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      enterprise: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      icon: <Shield className="h-5 w-5 text-red-400" />
    },
    {
      title: "API Access",
      free: <X className="h-4 w-4 text-red-400 mx-auto" />,
      pro: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      team: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      enterprise: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      icon: <Zap className="h-5 w-5 text-orange-400" />
    },
    {
      title: "Advanced Analytics",
      free: "Basic",
      pro: "Advanced",
      team: "Custom reporting",
      enterprise: "Enterprise dashboards",
      icon: <TrendingUp className="h-5 w-5 text-cyan-400" />
    },
    {
      title: "Custom Integrations",
      free: <X className="h-4 w-4 text-red-400 mx-auto" />,
      pro: <X className="h-4 w-4 text-red-400 mx-auto" />,
      team: <X className="h-4 w-4 text-red-400 mx-auto" />,
      enterprise: <Check className="h-4 w-4 text-emerald-400 mx-auto" />,
      icon: <Sparkles className="h-5 w-5 text-indigo-400" />
    }
  ];

  const faqs = [
    {
      question: "What are AI enhancements?",
      answer: "AI enhancements are intelligent improvements to your prompts including clarity optimization, context addition, format structuring, performance scoring, and advanced guidelines. Each enhancement makes your prompts more effective."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation, giving you time to export if needed. We never delete your work without warning."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. No questions asked - if you're not satisfied, we'll refund your money."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start, and you can cancel anytime during the trial."
    },
    {
      question: "How do AI model credits work?",
      answer: "Each plan includes credits for AI model usage. Free users get basic access, Pro users get priority access to all models, and Team users get dedicated capacity."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-morph-bg"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '4s'}}></div>
      </div>

      <AnimatedNav currentPage="pricing" />

      {/* Hero Section */}
      <section className="py-20 px-4 pt-32 relative z-10">
        <div className="container mx-auto">
          <div 
            className="text-center max-w-4xl mx-auto animate-staggered-fade-in"
            data-animate
            id="pricing-hero"
          >
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2 transform hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Including 5 AI Enhancements
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Simple,{" "}
              <span className="text-emerald-400 animate-text-shimmer">
                Transparent Pricing
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Choose the perfect plan for your AI prompt engineering needs. 
              Start free, upgrade as you grow. Every plan includes our powerful AI enhancements.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto animate-staggered-fade-in"
            data-animate
            id="pricing-cards"
          >
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-slate-800/50 border-emerald-500 scale-105 animate-glow-pulse'
                    : 'bg-slate-800/50 border-slate-700'
                } hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`px-3 py-1 ${
                      plan.popular 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-emerald-400">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <CardDescription className="text-slate-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-emerald-400 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-600 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${
                      plan.ctaVariant === 'default' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                    }`}
                    variant={plan.ctaVariant}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div 
            className="text-center mb-16 animate-fade-in-up"
            data-animate
            id="comparison-header"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Feature{" "}
              <span className="text-emerald-400 animate-text-shimmer">Comparison</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See exactly what's included in each plan and find the perfect fit for your needs.
            </p>
          </div>

          <div 
            className="max-w-5xl mx-auto animate-scale-in"
            data-animate
            id="comparison-table"
          >
            <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
              <CardContent className="p-0 bg-transparent">
                <div className="overflow-x-auto">
                  <table className="w-full bg-transparent">
                    <thead className="bg-transparent">
                      <tr className="border-b border-slate-700/50 bg-transparent">
                        <th className="text-left p-6 text-white font-semibold bg-transparent">Features</th>
                        <th className="text-center p-6 text-white font-semibold bg-transparent">Free</th>
                        <th className="text-center p-6 text-white font-semibold relative bg-transparent">
                          <div className="flex flex-col items-center">
                            <span>Pro</span>
                            <Badge className="mt-1 bg-emerald-500/20 text-emerald-300 text-xs">Popular</Badge>
                          </div>
                        </th>
                        <th className="text-center p-6 text-white font-semibold bg-transparent">Team</th>
                        <th className="text-center p-6 text-white font-semibold bg-transparent">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {features.map((feature, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          <td className="p-6 flex items-center bg-transparent">
                            {feature.icon}
                            <span className="text-white font-medium ml-3">{feature.title}</span>
                          </td>
                          <td className="p-6 text-center text-slate-300 bg-transparent">{feature.free}</td>
                          <td className="p-6 text-center text-emerald-400 font-semibold bg-transparent">{feature.pro}</td>
                          <td className="p-6 text-center text-purple-400 font-semibold bg-transparent">{feature.team}</td>
                          <td className="p-6 text-center text-blue-400 font-semibold bg-transparent">{feature.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Enhancements Highlight */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-emerald-900/30">
        <div className="container mx-auto">
          <div 
            className="text-center mb-16 animate-fade-in-up"
            data-animate
            id="ai-enhancements-header"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Wand2 className="h-4 w-4 mr-2" />
              Included in All Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              5 Powerful{" "}
              <span className="text-purple-400 animate-text-shimmer">
                AI Enhancements
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Every plan includes our AI-powered prompt optimization features. 
              Free users get 5 enhancements, paid users get unlimited access.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-staggered-fade-in"
            data-animate
            id="ai-enhancements-grid"
          >
            <Card className="bg-slate-800/50 border-emerald-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-emerald-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white mb-2">Clarity Enhancement</h3>
                <p className="text-slate-300">AI automatically improves prompt clarity and specificity</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white mb-2">Context Addition</h3>
                <p className="text-slate-300">Add relevant context and background information automatically</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white mb-2">Format Structure</h3>
                <p className="text-slate-300">Optimize prompt structure for better AI model understanding</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white mb-2">Performance Scoring</h3>
                <p className="text-slate-300">Get scores and suggestions for prompt effectiveness</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-red-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20" style={{animationDelay: '0.4s'}}>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-red-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Guidelines</h3>
                <p className="text-slate-300">Apply advanced prompting techniques and best practices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div 
            className="text-center mb-16 animate-fade-in-up"
            data-animate
            id="faq-header"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked{" "}
              <span className="text-emerald-400 animate-text-shimmer">Questions</span>
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about our pricing and features.
            </p>
          </div>

          <div 
            className="space-y-6 animate-staggered-fade-in"
            data-animate
            id="faq-items"
          >
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-emerald-500/50"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div 
            className="text-center max-w-4xl mx-auto animate-scale-in"
            data-animate
            id="cta-section"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to{" "}
              <span className="text-emerald-400 animate-text-shimmer">Get Started?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of AI professionals who trust PromptOp for their prompt engineering needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg transform transition-all duration-300 hover:scale-105"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
