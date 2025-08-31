import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Brain, 
  Zap, 
  Users, 
  Shield,
  BarChart3,
  Code,
  Palette,
  Eye,
  Target,
  Rocket,
  Globe,
  CheckCircle,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="h-12 w-12 text-emerald-400" />,
      title: "20+ AI Models",
      description: "Access the latest AI models from OpenAI, Anthropic, Google, Meta, and more",
      details: [
        "GPT-5, Claude 4, Gemini Ultra",
        "DeepSeek, Llama, Mistral",
        "Real-time model comparison",
        "Automatic failover support"
      ]
    },
    {
      icon: <Zap className="h-12 w-12 text-purple-400" />,
      title: "AI-Powered Enhancement",
      description: "Intelligent prompt optimization with quality scoring and best practices",
      details: [
        "Automated prompt improvement",
        "Quality scoring (0-100)",
        "Best practice integration",
        "Context optimization"
      ]
    },
    {
      icon: <Users className="h-12 w-12 text-blue-400" />,
      title: "Team Collaboration",
      description: "Share prompts, collaborate with teams, and manage access controls",
      details: [
        "Shared prompt libraries",
        "Role-based permissions",
        "Team workspaces",
        "Collaborative editing"
      ]
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-yellow-400" />,
      title: "Advanced Analytics",
      description: "Track performance, costs, and usage patterns across all models",
      details: [
        "Performance dashboards",
        "Cost optimization insights",
        "Usage analytics",
        "Success rate tracking"
      ]
    },
    {
      icon: <Shield className="h-12 w-12 text-green-400" />,
      title: "Enterprise Security",
      description: "Bank-grade security with compliance and data protection",
      details: [
        "End-to-end encryption",
        "SOC 2 compliance",
        "GDPR compliant",
        "Private cloud options"
      ]
    },
    {
      icon: <Code className="h-12 w-12 text-red-400" />,
      title: "Developer APIs",
      description: "Comprehensive APIs for seamless integration into your workflows",
      details: [
        "RESTful APIs",
        "SDK libraries",
        "Webhook support",
        "Custom integrations"
      ]
    }
  ];

  const categories = [
    {
      icon: <Brain className="h-8 w-8 text-emerald-400" />,
      title: "General Purpose",
      description: "Versatile models for everyday AI tasks",
      models: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini Flash"]
    },
    {
      icon: <Code className="h-8 w-8 text-blue-400" />,
      title: "Code Generation",
      description: "Specialized models for programming tasks",
      models: ["DeepSeek Coder", "GPT-4o", "Claude 4 Opus"]
    },
    {
      icon: <Palette className="h-8 w-8 text-purple-400" />,
      title: "Creative Writing",
      description: "Models optimized for creative content",
      models: ["Claude 4 Opus", "GPT-5 Turbo", "Gemini Pro"]
    },
    {
      icon: <Target className="h-8 w-8 text-yellow-400" />,
      title: "Reasoning",
      description: "Advanced models for complex problem solving",
      models: ["OpenAI o1", "Claude 4 Enterprise", "DeepSeek V5"]
    },
    {
      icon: <Eye className="h-8 w-8 text-green-400" />,
      title: "Multimodal",
      description: "Models that understand text, images, and more",
      models: ["GPT-4o", "Gemini Ultra", "Claude 4 Opus"]
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
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful <span className="text-emerald-400">Features</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Everything you need to manage, optimize, and scale your AI prompt workflows. 
            From individual creators to enterprise teams.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Model Categories */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">AI Model Categories</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the right model for your specific use case. Each category is optimized for different types of tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-slate-400 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-400">Popular Models:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.models.map((model, modelIndex) => (
                        <Badge key={modelIndex} variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Start with our free plan and discover how PromptOp can transform your AI workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
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
                <span className="text-slate-400">hello@promptops.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">San Francisco, CA</span>
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
