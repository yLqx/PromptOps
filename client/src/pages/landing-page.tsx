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
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-emerald-500" />,
      title: "AI-Powered Testing",
      description: "Test your prompts with multiple AI models including GPT-4o and Gemini"
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-500" />,
      title: "Lightning Fast",
      description: "Get instant responses and optimize your prompts in real-time"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
      title: "Analytics Dashboard",
      description: "Track performance, success rates, and usage patterns"
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-500" />,
      title: "Enterprise Security",
      description: "Your prompts and data are secure with enterprise-grade encryption"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: "Team Collaboration",
      description: "Share prompts and collaborate with your team members"
    },
    {
      icon: <Rocket className="h-8 w-8 text-emerald-500" />,
      title: "Production Ready",
      description: "Deploy your tested prompts directly to production environments"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Engineer at TechCorp",
      content: "PromptOps transformed how we test and deploy AI prompts. The analytics are incredible!",
      rating: 5
    },
    {
      name: "Marcus Johnson", 
      role: "Product Manager at StartupXYZ",
      content: "Finally, a platform that makes prompt engineering systematic and data-driven.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "ML Researcher",
      content: "The multi-model testing capabilities saved us weeks of manual testing.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PromptOps</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">About</a>
              </Link>
              <Link href="/pricing">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">Pricing</a>
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              🚀 Next-Generation AI Prompt Management
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Test, Optimize & Deploy
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {" "}AI Prompts
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The most advanced platform for AI prompt engineering. Test across multiple models, 
              analyze performance, and deploy with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need for AI prompt engineering
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Professional tools and insights to build better AI applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by AI teams worldwide</h2>
            <p className="text-xl text-slate-300">See what our customers are saying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to optimize your AI prompts?</h2>
          <p className="text-xl text-emerald-100 mb-8">Join thousands of developers building better AI applications</p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PromptOps</span>
              </div>
              <p className="text-slate-400">
                The future of AI prompt engineering and optimization.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/pricing"><a className="hover:text-emerald-400 transition-colors">Pricing</a></Link></li>
                <li><Link href="/about"><a className="hover:text-emerald-400 transition-colors">About</a></Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/support"><a className="hover:text-emerald-400 transition-colors">Contact</a></Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/terms"><a className="hover:text-emerald-400 transition-colors">Terms of Service</a></Link></li>
                <li><Link href="/privacy"><a className="hover:text-emerald-400 transition-colors">Privacy Policy</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 PromptOps. Powered by{" "}
              <a href="https://monzed.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Monzed.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}