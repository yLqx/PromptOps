import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Rss,
  Bell,
  Zap
} from "lucide-react";

export default function BlogPage() {
  const upcomingTopics = [
    {
      title: "The Future of AI Prompt Engineering",
      description: "Exploring trends and best practices in prompt optimization",
      category: "AI Insights",
      estimatedDate: "Coming Soon"
    },
    {
      title: "Building Scalable AI Workflows",
      description: "How enterprises can implement AI at scale with PromptOp",
      category: "Enterprise",
      estimatedDate: "Coming Soon"
    },
    {
      title: "20+ AI Models: A Comprehensive Guide",
      description: "Deep dive into our supported AI models and their use cases",
      category: "Technical",
      estimatedDate: "Coming Soon"
    },
    {
      title: "MONZED's Journey: Building the Future",
      description: "Behind the scenes of building innovative AI development tools",
      category: "Company",
      estimatedDate: "Coming Soon"
    }
  ];

  const categories = [
    {
      name: "AI Insights",
      description: "Latest trends and insights in AI development",
      count: "Coming Soon"
    },
    {
      name: "Technical Guides",
      description: "In-depth tutorials and technical documentation",
      count: "Coming Soon"
    },
    {
      name: "Product Updates",
      description: "New features and product announcements",
      count: "Coming Soon"
    },
    {
      name: "Company News",
      description: "Updates from the MONZED team",
      count: "Coming Soon"
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
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
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
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            PromptOp <span className="text-emerald-400">Blog</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Our blog is currently under development. We're preparing amazing content about AI, 
            prompt engineering, and the future of AI development tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Quality Content
            </Badge>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">What's Coming</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We're working on high-quality content that will help you master AI prompt engineering and get the most out of PromptOp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {upcomingTopics.map((topic, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{topic.title}</CardTitle>
                      <CardDescription className="text-slate-400">{topic.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4 border-emerald-500/30 text-emerald-400">
                      {topic.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{topic.estimatedDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Content Categories</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We'll be covering a wide range of topics to help you succeed with AI and PromptOp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                  <Badge variant="outline" className="border-slate-500/30 text-slate-400">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay in the Loop
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Be the first to know when we publish new content. Subscribe to our newsletter for updates on blog posts, product news, and AI insights.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700 px-6">
                <Bell className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            We'll only send you quality content. No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Alternative Resources */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            In the Meantime
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            While we're preparing our blog, check out these resources to get started with PromptOp and AI prompt engineering.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
                <p className="text-slate-400 text-sm mb-4">Comprehensive guides and API documentation</p>
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  Read Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Get Started</h3>
                <p className="text-slate-400 text-sm mb-4">Try PromptOp with our free plan</p>
                <Link href="/auth">
                  <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                <p className="text-slate-400 text-sm mb-4">Have questions? We're here to help</p>
                <Link href="/contact">
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
