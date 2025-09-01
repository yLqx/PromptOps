import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Activity,
  Server,
  Zap,
  Globe,
  Shield,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  RefreshCw
} from "lucide-react";

export default function StatusPage() {
  const services = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.98%",
      responseTime: "45ms",
      description: "Core API infrastructure"
    },
    {
      name: "Authentication",
      status: "operational", 
      uptime: "99.99%",
      responseTime: "12ms",
      description: "User authentication and authorization"
    },
    {
      name: "Dashboard",
      status: "operational",
      uptime: "99.97%",
      responseTime: "120ms",
      description: "Web application interface"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      responseTime: "8ms",
      description: "Primary data storage"
    }
  ];

  const aiModels = [
    {
      name: "GPT-4o",
      provider: "OpenAI",
      status: "operational",
      responseTime: "1.2s",
      tier: "Free"
    },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      status: "operational",
      responseTime: "0.8s",
      tier: "Free"
    },
    {
      name: "Gemini Flash",
      provider: "Google",
      status: "operational",
      responseTime: "0.9s",
      tier: "Free"
    },
    {
      name: "DeepSeek V3 Pro",
      provider: "DeepSeek",
      status: "operational",
      responseTime: "1.1s",
      tier: "Free"
    },
    {
      name: "GPT-4o Mini",
      provider: "OpenAI",
      status: "operational",
      responseTime: "0.7s",
      tier: "Free"
    },
    {
      name: "GPT-5 Turbo",
      provider: "OpenAI",
      status: "operational",
      responseTime: "1.5s",
      tier: "Pro"
    },
    {
      name: "Claude 4 Opus",
      provider: "Anthropic",
      status: "operational",
      responseTime: "1.3s",
      tier: "Pro"
    },
    {
      name: "Gemini 2.5 Pro",
      provider: "Google",
      status: "operational",
      responseTime: "1.4s",
      tier: "Pro"
    },
    {
      name: "DeepSeek V4 Coder",
      provider: "DeepSeek",
      status: "operational",
      responseTime: "1.2s",
      tier: "Pro"
    },
    {
      name: "Llama 3.2 405B",
      provider: "Meta",
      status: "operational",
      responseTime: "1.8s",
      tier: "Pro"
    },
    {
      name: "Mistral Large 2",
      provider: "Mistral",
      status: "operational",
      responseTime: "1.1s",
      tier: "Pro"
    },
    {
      name: "Command R+",
      provider: "Cohere",
      status: "operational",
      responseTime: "1.3s",
      tier: "Pro"
    },
    {
      name: "Sonar Large",
      provider: "Perplexity",
      status: "operational",
      responseTime: "1.6s",
      tier: "Pro"
    },
    {
      name: "GPT-5 Enterprise",
      provider: "OpenAI",
      status: "operational",
      responseTime: "1.7s",
      tier: "Enterprise"
    },
    {
      name: "Claude 4 Enterprise",
      provider: "Anthropic",
      status: "operational",
      responseTime: "1.5s",
      tier: "Enterprise"
    },
    {
      name: "Gemini Ultra 2.5",
      provider: "Google",
      status: "operational",
      responseTime: "1.8s",
      tier: "Enterprise"
    },
    {
      name: "DeepSeek V5 Enterprise",
      provider: "DeepSeek",
      status: "operational",
      responseTime: "1.6s",
      tier: "Enterprise"
    },
    {
      name: "Llama 4 Enterprise",
      provider: "Meta",
      status: "operational",
      responseTime: "2.1s",
      tier: "Enterprise"
    },
    {
      name: "Constitutional AI Pro",
      provider: "Anthropic",
      status: "operational",
      responseTime: "1.9s",
      tier: "Enterprise"
    },
    {
      name: "OpenAI o1 Enterprise",
      provider: "OpenAI",
      status: "operational",
      responseTime: "3.2s",
      tier: "Enterprise"
    }
  ];

  const incidents = [
    {
      date: "2025-01-25",
      title: "Scheduled Maintenance",
      description: "Routine database maintenance completed successfully",
      status: "resolved",
      duration: "15 minutes"
    },
    {
      date: "2025-01-20",
      title: "API Rate Limiting Issue",
      description: "Temporary rate limiting issues affecting some users",
      status: "resolved",
      duration: "45 minutes"
    },
    {
      date: "2025-01-15",
      title: "Claude Model Timeout",
      description: "Increased response times for Claude models",
      status: "resolved",
      duration: "2 hours"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Free':
        return 'bg-slate-600 text-white';
      case 'Pro':
        return 'bg-emerald-600 text-white';
      case 'Enterprise':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

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
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            System <span className="text-emerald-400">Status</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Real-time status of PromptOp services and AI models. All systems are currently operational.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              All Systems Operational
            </Badge>
            <Button variant="outline" className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Core Services</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Status of our core infrastructure and platform services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    {getStatusIcon(service.status)}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={getStatusColor(service.status)}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uptime:</span>
                      <span className="text-emerald-400">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response:</span>
                      <span className="text-blue-400">{service.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Status */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">AI Models Status</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Real-time status of all 20+ AI models across different tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {aiModels.map((model, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(model.status)}
                      <h3 className="text-sm font-semibold text-white">{model.name}</h3>
                    </div>
                    <Badge className={`text-xs ${getTierColor(model.tier)}`}>
                      {model.tier}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Provider:</span>
                      <span className="text-slate-300">{model.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Response:</span>
                      <span className="text-blue-400">{model.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Recent Incidents</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              History of recent incidents and maintenance activities.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {incidents.map((incident, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-3">{incident.description}</p>
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <span>Date: {incident.date}</span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Subscribe to status updates and get notified about incidents and maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700 px-6">
              Subscribe
            </Button>
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
