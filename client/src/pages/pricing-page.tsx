import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
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
      free: "Free models only",
      pro: "Pro models",
      team: "All models",
      enterprise: "All models + priority",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo className="text-white" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 pt-32">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Including 5 AI Enhancements
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Simple,{" "}
              <span className="text-emerald-400">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? 'bg-slate-800/50 border-emerald-500 scale-105'
                    : 'bg-slate-800/50 border-slate-700'
                } hover:border-emerald-500/50 transition-colors`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`px-3 py-1 ${
                      plan.popular
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <CardDescription className="text-slate-400 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      plan.ctaVariant === 'default'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                    variant={plan.ctaVariant}
                  >
                    {plan.cta}
                    {plan.ctaVariant === 'default' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Feature{" "}
              <span className="text-emerald-400">Comparison</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See exactly what's included in each plan and find the perfect fit for your needs.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
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
                          className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors"
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
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Wand2 className="h-4 w-4 mr-2" />
              Included in All Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              5 Powerful{" "}
              <span className="text-purple-400">
                AI Enhancements
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Every plan includes our AI-powered prompt optimization features. 
              Free users get 5 enhancements, paid users get unlimited access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-slate-800/50 border-emerald-500/30">
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
              Join thousands of developers who are already using PromptOp to build better AI applications 
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
      <footer className="relative bg-slate-900 border-t border-slate-700/50 py-16 overflow-hidden">
        {/* MONZED Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute text-[20rem] font-bold text-slate-800/10 select-none animate-pulse">
            <div className="absolute top-10 -left-20 transform -rotate-12 animate-bounce" style={{animationDelay: '0s', animationDuration: '8s'}}>
              MONZED
            </div>
            <div className="absolute top-40 right-10 transform rotate-12 animate-bounce" style={{animationDelay: '2s', animationDuration: '10s'}}>
              MONZED
            </div>
            <div className="absolute bottom-20 left-1/3 transform -rotate-6 animate-bounce" style={{animationDelay: '4s', animationDuration: '12s'}}>
              MONZED
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <Logo className="text-white" />
              <p className="text-slate-400 text-sm leading-relaxed">
                The ultimate AI prompt management platform. Streamline your AI workflows with 20+ models and intelligent optimization.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/promptops" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/promptops" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/promptops" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <div className="space-y-2">
                <Link href="/features" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Features</Link>
                <Link href="/pricing" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Pricing</Link>
                <Link href="/integrations" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Integrations</Link>
                <Link href="/api" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">API</Link>
                <Link href="/roadmap" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Roadmap</Link>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">About</Link>
                <Link href="/careers" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Careers</Link>
                <Link href="/jobs" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Jobs</Link>
                <Link href="/blog" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Blog</Link>
                <Link href="/contact" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Contact</Link>
              </div>
            </div>

            {/* Legal & Support */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Legal & Support</h3>
              <div className="space-y-2">
                <Link href="/terms" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Terms of Service</Link>
                <Link href="/privacy" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Privacy Policy</Link>

                <Link href="/status" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Status</Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-slate-700/50 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">support@promptop.net</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">+33 775851544</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">PARIS, FR</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-slate-400 text-sm">
                © 2025 PromptOp. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <span className="text-slate-400 text-sm">Powered by</span>
                <a
                  href="https://monzed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  MONZED
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}