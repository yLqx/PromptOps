import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Zap, 
  Crown, 
  Users, 
  CheckCircle,
  X,
  ArrowRight,
  Sparkles,
  Wand2,
  Star,
  Shield,
  TrendingUp,
  Rocket,
  Target
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
        "5 AI enhancements included",
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
      icon: <Zap className="h-6 w-6" />,
      color: "from-slate-600 to-slate-700",
      borderColor: "border-slate-600/50",
      glowColor: "slate"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious prompt engineers",
      features: [
        "100 prompts per month",
        "Unlimited AI enhancements",
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
      icon: <Crown className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-500/50",
      glowColor: "emerald"
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Unlimited prompts",
        "Unlimited AI enhancements",
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
      icon: <Users className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/50",
      glowColor: "purple"
    }
  ];

  const features = [
    {
      title: "AI Enhancement Limits",
      free: "5 enhancements",
      pro: "Unlimited",
      team: "Unlimited",
      icon: <Wand2 className="h-5 w-5 text-purple-400" />
    },
    {
      title: "Prompt Storage",
      free: "5 prompts",
      pro: "100 prompts",
      team: "Unlimited",
      icon: <Target className="h-5 w-5 text-emerald-400" />
    },
    {
      title: "AI Models",
      free: "Basic models",
      pro: "All models",
      team: "All models + priority",
      icon: <Sparkles className="h-5 w-5 text-blue-400" />
    },
    {
      title: "Team Collaboration",
      free: "Personal only",
      pro: "Up to 5 members",
      team: "Unlimited members",
      icon: <Users className="h-5 w-5 text-green-400" />
    },
    {
      title: "Analytics",
      free: "Basic metrics",
      pro: "Advanced analytics",
      team: "Custom reporting",
      icon: <TrendingUp className="h-5 w-5 text-yellow-400" />
    },
    {
      title: "Support",
      free: "Community",
      pro: "Email support",
      team: "Dedicated support",
      icon: <Shield className="h-5 w-5 text-red-400" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PromptOps</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
              </Link>
              <Link href="/auth">
                <Button className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 pt-32">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Including 5 AI Enhancements
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Simple,{" "}
              <span className="gradient-text text-drop-shadow-emerald">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative glass-effect ${plan.borderColor} hover:border-emerald-500/50 transition-all duration-500 card-hover animate-fade-in-up ${
                  plan.popular ? 'ring-2 ring-emerald-500/50 scale-105' : ''
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center animate-float`}>
                        <div className="text-white">
                          {plan.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 ml-2">{plan.period}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">{plan.description}</p>
                    
                    <Link href="/auth">
                      <Button 
                        className={`w-full btn-shadow mb-6 ${
                          plan.popular 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        } text-white`}
                      >
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                      Included Features
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded.length > 0 && (
                      <>
                        <h4 className="font-semibold text-white flex items-center mt-6">
                          <X className="h-4 w-4 text-slate-500 mr-2" />
                          Not Included
                        </h4>
                        <ul className="space-y-3">
                          {plan.notIncluded.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <X className="h-4 w-4 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-500">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Feature{" "}
              <span className="gradient-text">Comparison</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See exactly what's included in each plan and find the perfect fit for your needs.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="glass-effect border-slate-700/50 overflow-hidden bg-transparent">
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
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {features.map((feature, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors animate-fade-in-up bg-transparent"
                          style={{animationDelay: `${index * 0.05}s`}}
                        >
                          <td className="p-6 flex items-center bg-transparent">
                            {feature.icon}
                            <span className="text-white font-medium ml-3">{feature.title}</span>
                          </td>
                          <td className="p-6 text-center text-slate-300 bg-transparent">{feature.free}</td>
                          <td className="p-6 text-center text-emerald-400 font-semibold bg-transparent">{feature.pro}</td>
                          <td className="p-6 text-center text-purple-400 font-semibold bg-transparent">{feature.team}</td>
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
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Wand2 className="h-4 w-4 mr-2" />
              Included in All Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              5 Powerful{" "}
              <span className="gradient-text text-glow-purple">
                AI Enhancements
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Every plan includes our AI-powered prompt optimization features. 
              Free users get 5 enhancements, paid users get unlimited access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-effect border-emerald-500/30 card-hover animate-fade-in-up">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Clarity Enhancement</h3>
                <p className="text-slate-300">AI automatically improves prompt clarity and specificity</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-blue-500/30 card-hover animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Context Optimization</h3>
                <p className="text-slate-300">Adds relevant context for better AI understanding</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/30 card-hover animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Performance Scoring</h3>
                <p className="text-slate-300">Real-time quality scores from 1-100 for your prompts</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth">
              <Button size="lg" className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                Try AI Enhancements Free
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-slate-300">Everything you need to know about our pricing and features</p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 card-hover animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to{" "}
              <span className="gradient-text animate-glow">
                Get Started?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using PromptOps to build better AI applications 
              with our powerful enhancement features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              © 2025 PromptOps. All rights reserved. | Powered by{" "}
              <a 
                href="https://monzed.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                monzed.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}