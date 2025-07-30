import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Zap, 
  Brain, 
  Rocket, 
  Shield, 
  Users, 
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Wand2,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-emerald-400" />,
      title: "AI-Powered Testing",
      description: "Test your prompts with multiple AI models including GPT-4o and Gemini",
      color: "from-emerald-500/20 to-emerald-600/20"
    },
    {
      icon: <Wand2 className="h-8 w-8 text-purple-400" />,
      title: "5 AI Enhancements",
      description: "Get 5 powerful AI-driven prompt improvements and optimizations",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Get instant responses and optimize your prompts in real-time",
      color: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: "Analytics Dashboard",
      description: "Track performance, success rates, and usage patterns",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Enterprise Security",
      description: "Your prompts and data are secure with enterprise-grade encryption",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: <Rocket className="h-8 w-8 text-red-400" />,
      title: "Production Ready",
      description: "Deploy your tested prompts directly to production environments",
      color: "from-red-500/20 to-red-600/20"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Engineer at TechCorp",
      content: "PromptOps transformed how we test and deploy AI prompts. The analytics are incredible!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Johnson", 
      role: "Product Manager at StartupXYZ",
      content: "Finally, a platform that makes prompt engineering systematic and data-driven.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Elena Rodriguez",
      role: "ML Researcher",
      content: "The multi-model testing capabilities saved us weeks of manual testing.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { label: "Prompts Tested", value: "10,000+", icon: <Target className="h-5 w-5" /> },
    { label: "Response Time", value: "< 2s", icon: <Clock className="h-5 w-5" /> },
    { label: "Success Rate", value: "99.9%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "AI Models", value: "3+", icon: <Brain className="h-5 w-5" /> }
  ];

  const enhancements = [
    {
      title: "Clarity Enhancement",
      description: "AI automatically improves prompt clarity and specificity",
      icon: <Sparkles className="h-6 w-6 text-emerald-400" />
    },
    {
      title: "Context Optimization",
      description: "Adds relevant context for better AI understanding",
      icon: <Brain className="h-6 w-6 text-blue-400" />
    },
    {
      title: "Format Structuring",
      description: "Optimizes prompt structure for maximum effectiveness",
      icon: <Target className="h-6 w-6 text-purple-400" />
    },
    {
      title: "Performance Scoring",
      description: "Real-time quality scores from 1-100 for your prompts",
      icon: <BarChart3 className="h-6 w-6 text-yellow-400" />
    },
    {
      title: "Advanced Guidelines",
      description: "Intelligent constraint and guideline suggestions",
      icon: <Shield className="h-6 w-6 text-green-400" />
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
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        {/* Floating bubbles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400/20 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/20 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-purple-400/20 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-yellow-400/20 rounded-full animate-float opacity-50" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-emerald-500/30 rounded-full animate-float opacity-70" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-blue-500/25 rounded-full animate-float opacity-45" style={{animationDelay: '5s'}}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Now with 5 AI Enhancements
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of{" "}
              <span className="gradient-text text-drop-shadow-emerald">
                AI Prompt Testing
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build, test, and optimize AI prompts with confidence. Get real-time analytics, 
              multi-model testing, and 5 powerful AI-driven enhancements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
                Watch Demo
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-center mb-2 text-emerald-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white text-drop-shadow-emerald">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Enhancements Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Wand2 className="h-4 w-4 mr-2" />
              AI-Powered Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              5 Powerful{" "}
              <span className="gradient-text text-drop-shadow-purple">
                AI Enhancements
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our AI analyzes and improves your prompts automatically, giving you 
              professional-grade optimization in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {enhancements.map((enhancement, index) => (
              <Card 
                key={index} 
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 card-hover animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mr-4">
                      {enhancement.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{enhancement.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{enhancement.description}</p>
                </CardContent>
              </Card>
            ))}
            
            {/* CTA Card */}
            <Card className="glass-effect border-emerald-500/50 card-hover animate-fade-in-up bg-gradient-to-br from-emerald-900/20 to-emerald-800/20" style={{animationDelay: '0.5s'}}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <ChevronRight className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Try All 5 Now</h3>
                <p className="text-slate-300 mb-4">Experience the power of AI-enhanced prompts</p>
                <Link href="/auth">
                  <Button className="btn-shadow bg-emerald-600 hover:bg-emerald-700 w-full">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for{" "}
              <span className="gradient-text">Prompt Excellence</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional tools and insights to make your AI prompts more effective and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 card-hover animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 animate-float`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by{" "}
              <span className="gradient-text text-drop-shadow-blue">Developers</span>
            </h2>
            <p className="text-xl text-slate-300">See what our users are saying about PromptOps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 card-hover animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed">"{testimonial.content}"</p>
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
              <span className="gradient-text text-drop-shadow">
                Transform Your Prompts?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using PromptOps to build better AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
                >
                  View Pricing
                </Button>
              </Link>
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