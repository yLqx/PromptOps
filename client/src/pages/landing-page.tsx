import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Rocket,
  Shield,
  Users,
  BarChart3,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Wand2,
  ChevronRight,
  Code,
  Palette,
  Eye,
  Mail,
  Phone,
  MapPin,
  Check,
  Send,
  MessageCircle,
  Bot,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { AI_MODELS } from "@shared/ai-models";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [chatInput, setChatInput] = useState("");
  const [visibleElements, setVisibleElements] = useState(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(Array.from(prev).concat(entry.target.id)));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setLocation("/login");
    }
  };



  const stats = [
    { label: "Prompts Tested", value: "100,000+", icon: <Target className="h-5 w-5" /> },
    { label: "Response Time", value: "< 2s", icon: <Clock className="h-5 w-5" /> },
    { label: "Success Rate", value: "99.9%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "AI Models", value: "25+", icon: <Brain className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-emerald-400" />,
      title: "25+ AI Models",
      description: "Access GPT-5, Claude 4, Gemini Ultra, DeepSeek, Llama, Mistral, and more",
      color: "from-emerald-500/20 to-emerald-600/20"
    },
    {
      icon: <Wand2 className="h-8 w-8 text-purple-400" />,
      title: "AI-Powered Enhancement",
      description: "Intelligent prompt optimization with quality scoring and best practices",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Team Collaboration",
      description: "Share prompts, collaborate with teams, and manage access controls",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
      title: "Advanced Analytics",
      description: "Track performance, costs, and usage patterns across all models",
      color: "from-yellow-500/20 to-yellow-600/20"
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
      content: "PromptOp transformed how we test and deploy AI prompts. The analytics are incredible!",
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 animate-slide-in-down">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-2">
              <Logo className="text-white text-sm md:text-base flex-shrink-0" />
            </div>

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link href="/about" className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/terms" className="text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group">
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white text-sm px-3 sm:px-4 transform hover:scale-105 transition-all duration-300">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 sm:px-4 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-20 pt-20 sm:pt-24 md:pt-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto relative z-10 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div 
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8 animate-fade-in-up transform hover:scale-105 transition-transform duration-300"
              data-animate
              id="hero-badge"
            >
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">AI-Powered Prompt Engineering</span>
            </div>

            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 sm:mb-10 leading-tight px-2 animate-fade-in-up"
              data-animate
              id="hero-title"
              style={{animationDelay: '0.2s'}}
            >
              Perfect Your{" "}
              <span className="gradient-text text-drop-shadow-emerald animate-text-shimmer">
                AI Prompts
              </span>
            </h1>
            <p 
              className="text-xl sm:text-2xl md:text-3xl text-slate-300 leading-relaxed max-w-4xl mx-auto px-4 mb-12 animate-fade-in-up"
              data-animate
              id="hero-subtitle"
              style={{animationDelay: '0.4s'}}
            >
              Test, enhance, and optimize your AI prompts with professional tools.
              Get better results from ChatGPT, Claude, and other AI models with our advanced platform.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up"
              data-animate
              id="hero-features"
              style={{animationDelay: '0.6s'}}
            >
              <div className="flex items-center gap-3 text-slate-300 transform hover:scale-105 transition-transform duration-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 transform hover:scale-105 transition-transform duration-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 transform hover:scale-105 transition-transform duration-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span>Enterprise ready</span>
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16 animate-fade-in-up"
            data-animate
            id="chat-interface"
            style={{animationDelay: '0.8s'}}
          >
            {/* Model Selection Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="glass-effect border-slate-700/50 h-full transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Bot className="h-5 w-5 text-emerald-400 animate-pulse" />
                    AI Models
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Choose from {AI_MODELS.length}+ models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                  {AI_MODELS.slice(0, 8).map((model, index) => (
                    <div
                      key={model.id}
                      onClick={() => setLocation("/login")}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-slate-700/30 hover:border-emerald-500/50 group animate-fade-in-up"
                      style={{animationDelay: `${1.0 + index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                          model.tier === 'free' ? 'bg-emerald-600 group-hover:bg-emerald-500' :
                          model.tier === 'pro' ? 'bg-blue-600 group-hover:bg-blue-500' : 'bg-purple-600 group-hover:bg-purple-500'
                        }`}>
                          {model.category === 'general' && <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {model.category === 'coding' && <Code className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {model.category === 'reasoning' && <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {model.category === 'multimodal' && <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {model.category === 'image' && <Palette className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {model.category === 'audio' && <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                          {!['general', 'coding', 'reasoning', 'multimodal', 'image', 'audio'].includes(model.category) && <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-white font-medium text-xs sm:text-sm truncate group-hover:text-emerald-300 transition-colors">{model.name}</h3>
                          <p className="text-slate-400 text-xs truncate group-hover:text-slate-300 transition-colors">{model.provider}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs flex-shrink-0 ml-2 transition-all duration-300 ${
                          model.tier === 'free' ? 'border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 group-hover:bg-emerald-500/10' :
                          model.tier === 'pro' ? 'border-blue-500/30 text-blue-400 group-hover:border-blue-400 group-hover:bg-blue-500/10' :
                          'border-purple-500/30 text-purple-400 group-hover:border-purple-400 group-hover:bg-purple-500/10'
                        }`}
                      >
                        {model.tier}
                      </Badge>
                    </div>
                  ))}
                  <div
                    onClick={() => setLocation("/login")}
                    className="text-center p-3 text-emerald-400 hover:text-emerald-300 cursor-pointer text-sm transition-all duration-300 hover:scale-105"
                  >
                    View all {AI_MODELS.length} models →
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Card className="glass-effect border-slate-700/50 h-full transform hover:scale-[1.01] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-emerald-400 animate-pulse" />
                    Chat Interface
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Try our AI models with your prompts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Output Area */}
                  <div
                    onClick={() => setLocation("/login")}
                    className="min-h-48 sm:min-h-56 lg:min-h-64 bg-slate-800/30 rounded-lg p-3 sm:p-4 border border-slate-700/30 hover:border-emerald-500/50 cursor-pointer transition-all duration-500 group hover:shadow-inner hover:shadow-emerald-500/10"
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {/* Sample conversation with animations */}
                      <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-xs sm:text-sm font-semibold">U</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-slate-700/50 rounded-lg p-2.5 sm:p-3 group-hover:bg-slate-700/70 transition-colors duration-300">
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                              Write a creative story about AI and humans working together
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in-up" style={{animationDelay: '1.4s'}}>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-2.5 sm:p-3 group-hover:border-emerald-500/40 transition-colors duration-300">
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                              In the year 2045, Maya discovered that her AI assistant wasn't just processing data—it was dreaming. Together, they embarked on a journey to bridge the gap between artificial intelligence and human creativity...
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-500/20">
                              <span className="text-emerald-400 text-xs">GPT-4 Turbo</span>
                              <span className="text-slate-400 text-xs">2.3s response</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input Area */}
                  <div className="space-y-3">
                    <form onSubmit={handleChatSubmit} className="relative group">
                      <textarea
                        placeholder="Type your message here... Press Enter to get started"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleChatSubmit(e);
                          }
                        }}
                        className="w-full bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 p-3 sm:p-4 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 resize-none h-20 sm:h-24 text-sm sm:text-base transition-all duration-300 group-hover:bg-slate-800/70"
                      />
                      <Button
                        type="submit"
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-emerald-600 hover:bg-emerald-700 p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </form>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-slate-400">Selected:</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs animate-pulse">
                          GPT-4 Turbo
                        </Badge>
                      </div>
                      <div className="text-slate-400">
                        Press Enter or click Send to start
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Stats Row */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4 animate-fade-in-up"
            data-animate
            id="stats-section"
            style={{animationDelay: '1.6s'}}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-500"
                style={{animationDelay: `${1.8 + index * 0.1}s`}}
              >
                <div className="flex items-center justify-center mb-2 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
                  <div className="group-hover:animate-bounce">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm group-hover:text-slate-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* AI Enhancements Section */}
      <section className="py-20 px-4 bg-slate-900/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-morph-bg"></div>
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div 
            className="text-center mb-16 animate-staggered-fade-in"
            data-animate
            id="ai-enhancements-header"
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 transform hover:scale-105 transition-transform duration-300">
              <Wand2 className="h-4 w-4 mr-2 animate-pulse" />
              AI-Powered Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              5 Powerful{" "}
              <span className="gradient-text text-drop-shadow-purple animate-text-shimmer">
                AI Enhancements
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our AI analyzes and improves your prompts automatically, giving you
              professional-grade optimization in seconds.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            data-animate
            id="enhancements-grid"
          >
            {enhancements.map((enhancement, index) => (
              <Card
                key={index}
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 group cursor-pointer animate-staggered-fade-in"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                  transform: 'translateY(20px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) rotateX(5deg) rotateY(2deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mr-4 group-hover:bg-slate-700/50 transition-all duration-500 group-hover:scale-110 group-hover:animate-glow-pulse">
                      <div className="group-hover:animate-icon-bounce">
                        {enhancement.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">{enhancement.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-100 transition-colors duration-300">{enhancement.description}</p>
                </CardContent>
              </Card>
            ))}

            {/* CTA Card with enhanced animations */}
            <Card 
              className="glass-effect border-emerald-500/50 group cursor-pointer bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 animate-staggered-fade-in transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/30" 
              style={{
                animationDelay: '0.7s',
                transform: 'translateY(20px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.05) rotateX(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0)';
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 transition-all duration-500 group-hover:animate-glow-pulse">
                  <ChevronRight className="h-6 w-6 text-white group-hover:animate-icon-bounce" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">Try All 5 Now</h3>
                <p className="text-slate-300 mb-4 group-hover:text-slate-100 transition-colors duration-300">Experience the power of AI-enhanced prompts</p>
                <Link href="/register">
                  <Button className="btn-shadow bg-emerald-600 hover:bg-emerald-700 w-full transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div 
            className="text-center mb-16 animate-staggered-fade-in"
            data-animate
            id="features-header"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for{" "}
              <span className="gradient-text animate-text-shimmer">Prompt Excellence</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional tools and insights to make your AI prompts more effective and reliable.
            </p>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            data-animate
            id="features-grid"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-effect border-slate-700/50 hover:border-emerald-500/50 group cursor-pointer animate-staggered-fade-in"
                style={{
                  animationDelay: `${0.1 + index * 0.15}s`,
                  transform: 'translateY(30px)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(16, 185, 129, 0.15), 0 0 30px rgba(16, 185, 129, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 animate-card-float`}
                       style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="group-hover:animate-icon-bounce">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-100 transition-colors duration-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-32 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by{" "}
              <span className="gradient-text text-drop-shadow-blue">Companies & Creators</span>
            </h2>
            <p className="text-xl text-slate-300 mb-16">Trusted by professionals across industries</p>

            {/* Company Logos */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center max-w-4xl mx-auto mb-20">
              {/* YouTube */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-red-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-600/30 transition-colors">
                  <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-red-400 transition-colors">Creators</span>
              </div>

              {/* Shopify */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-600/30 transition-colors">
                  <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.337 2.368c-.332-.066-.66-.066-.99 0-2.64.528-4.62 2.508-5.148 5.148-.066.33-.066.658 0 .99.528 2.64 2.508 4.62 5.148 5.148.33.066.658.066.99 0 2.64-.528 4.62-2.508 5.148-5.148.066-.332.066-.66 0-.99-.528-2.64-2.508-4.62-5.148-5.148zm-1.65 6.6c-.66 0-1.32-.264-1.782-.726s-.726-1.122-.726-1.782.264-1.32.726-1.782 1.122-.726 1.782-.726 1.32.264 1.782.726.726 1.122.726 1.782-.264 1.32-.726 1.782-1.122.726-1.782.726z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors">E-commerce</span>
              </div>

              {/* Notion */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-slate-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-600/30 transition-colors">
                  <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Productivity</span>
              </div>

              {/* WordPress */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600/30 transition-colors">
                  <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.03-.661.854-.075.899 0 0 .554.075 1.139.105l1.708 4.684-2.406 7.219-4.018-11.903c.644-.03 1.229-.105 1.229-.105.582-.075.516-.93-.065-.899 0 0-1.756.135-2.88.135-.202 0-.44-.006-.69-.015C3.566 2.52 7.536.825 11.998.825c3.293 0 6.291 1.262 8.54 3.33-.054-.003-.105-.009-.162-.009-1.064 0-1.818.93-1.818 1.93 0 .898.52 1.658 1.073 2.558.416.72.899 1.64.899 2.97 0 .927-.357 2.003-.821 3.498l-1.075 3.585-3.9-11.61L12.017 6.93z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">Bloggers</span>
              </div>

              {/* Figma */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600/30 transition-colors">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-purple-400 transition-colors">Designers</span>
              </div>
            </div>
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

      {/* AI Models Showcase */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              25+ <span className="text-emerald-400">AI Models</span> at Your Fingertips
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Access the latest and most powerful AI models from leading providers. Compare results, optimize costs, and find the perfect model for your use case.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {AI_MODELS.map((model) => (
              <Card
                key={model.id}
                onClick={() => setLocation("/login")}
                className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer transform hover:scale-105"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    {model.category === 'general' && <Brain className="h-4 w-4 text-white" />}
                    {model.category === 'coding' && <Code className="h-4 w-4 text-white" />}
                    {model.category === 'image' && <Palette className="h-4 w-4 text-white" />}
                    {model.category === 'reasoning' && <Target className="h-4 w-4 text-white" />}
                    {model.category === 'multimodal' && <Eye className="h-4 w-4 text-white" />}
                    {model.category === 'audio' && <Bot className="h-4 w-4 text-white" />}
                    {!['general', 'coding', 'image', 'reasoning', 'multimodal', 'audio'].includes(model.category) && <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{model.name}</h3>
                  <p className="text-xs text-slate-400">{model.provider}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs mt-2 ${
                      model.tier === 'free' ? 'border-emerald-500/30 text-emerald-400' :
                      model.tier === 'pro' ? 'border-blue-500/30 text-blue-400' :
                      'border-purple-500/30 text-purple-400'
                    }`}
                  >
                    {model.tier}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-400 mb-4">And many more models coming soon...</p>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              {AI_MODELS.length} Total Models Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, <span className="text-emerald-400">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/50 border-slate-700 relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mt-2">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">15 prompt tests/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">5 AI enhancements/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">25 prompt slots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Free AI models only</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-6">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-slate-800/50 border-emerald-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600 text-white px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mt-2">For professionals and creators</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">1000 prompt tests/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">150 AI enhancements/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Pro AI models</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Unlimited prompt slots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Priority support</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-6">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="bg-slate-800/50 border-slate-700 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">Add Members</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">Team</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$49</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mt-2">For teams and organizations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">7500 prompt tests/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">2000 AI enhancements/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Pro + Team AI models</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Team collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Add team members</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-6">
                  Start Team Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-800/50 border-slate-700 relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-white">Custom</span>
                </div>
                <p className="text-slate-400 mt-2">For large organizations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Everything in Team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Unlimited team members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">Dedicated support manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 text-sm">SLA & compliance</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 mt-6">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
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
              Join thousands of developers who are already using PromptOp to build better AI applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
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
                <a href="https://github.com/PromptOp" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.x.com/promptopnet" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/company/promptopnet/" className="text-slate-400 hover:text-emerald-400 transition-colors">
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
                <Link href="/security" className="block text-slate-400 hover:text-emerald-400 transition-colors text-sm">Security</Link>

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
                <span className="text-slate-400">+33775851544</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">Paris, FR</span>
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