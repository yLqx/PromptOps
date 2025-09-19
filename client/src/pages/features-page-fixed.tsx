import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { AnimatedNav } from "@/components/ui/animated-nav";
import { Footer } from "@/components/ui/footer";
import { Link } from "wouter";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
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
  useScrollAnimations();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-morph-bg"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '4s'}}></div>
      </div>

      <AnimatedNav currentPage="features" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div 
            className="animate-fade-in-up"
            data-animate
            id="features-hero"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful <span className="text-emerald-400 animate-text-shimmer">Features</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Everything you need to manage, optimize, and scale your AI prompt workflows. 
              From individual creators to enterprise teams.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-staggered-fade-in"
            data-animate
            id="features-grid"
          >
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardHeader className="text-center">
                  <div className="mb-4 animate-pulse">{feature.icon}</div>
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
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div 
            className="text-center mb-16 animate-fade-in-up"
            data-animate
            id="categories-header"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              AI Model <span className="text-emerald-400 animate-text-shimmer">Categories</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the right model for your specific use case. Each category is optimized for different types of tasks.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-staggered-fade-in"
            data-animate
            id="categories-grid"
          >
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                style={{
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 animate-pulse">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-slate-400 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-400">Popular Models:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.models.map((model, modelIndex) => (
                        <Badge 
                          key={modelIndex} 
                          variant="outline" 
                          className="border-emerald-500/30 text-emerald-400 text-xs transform transition-all duration-300 hover:scale-110 hover:bg-emerald-500/10"
                        >
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
          <div 
            className="animate-scale-in"
            data-animate
            id="features-cta"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience These <span className="text-emerald-400 animate-text-shimmer">Features?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Start with our free plan and discover how PromptOp can transform your AI workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg transform transition-all duration-300 hover:scale-105"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
