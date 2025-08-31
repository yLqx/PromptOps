import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { 
  Code, 
  Terminal, 
  Zap, 
  Shield,
  Globe,
  Key,
  Book,
  Download,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Copy,
  ExternalLink
} from "lucide-react";

export default function APIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/prompts/test",
      description: "Test a prompt with specified AI model",
      example: `{
  "prompt": "Write a haiku about AI",
  "model": "gpt-4o",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 100
  }
}`
    },
    {
      method: "POST",
      path: "/api/v1/prompts/enhance",
      description: "Enhance a prompt using AI optimization",
      example: `{
  "prompt": "Write code",
  "enhancement_type": "clarity"
}`
    },
    {
      method: "GET",
      path: "/api/v1/prompts",
      description: "List all prompts in your workspace",
      example: `{
  "page": 1,
  "limit": 20,
  "filter": "active"
}`
    },
    {
      method: "POST",
      path: "/api/v1/prompts",
      description: "Create a new prompt",
      example: `{
  "title": "Code Generator",
  "content": "Generate Python code for...",
  "tags": ["python", "coding"]
}`
    }
  ];

  const sdks = [
    {
      language: "Python",
      icon: "🐍",
      install: "pip install promptops-python",
      example: `from promptop import PromptOp

client = PromptOp(api_key="your_api_key")
result = client.test_prompt(
    prompt="Write a haiku about AI",
    model="gpt-4o"
)`
    },
    {
      language: "JavaScript",
      icon: "⚡",
      install: "npm install promptops-js",
      example: `import { PromptOp } from 'promptop-js';

const client = new PromptOp('your_api_key');
const result = await client.testPrompt({
  prompt: 'Write a haiku about AI',
  model: 'gpt-4o'
});`
    },
    {
      language: "cURL",
      icon: "🌐",
      install: "Available by default",
      example: `curl -X POST https://api.promptops.com/v1/prompts/test \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Write a haiku about AI", "model": "gpt-4o"}'`
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-400" />,
      title: "Secure Authentication",
      description: "API keys with fine-grained permissions and rate limiting"
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-400" />,
      title: "High Performance",
      description: "Sub-second response times with global CDN and caching"
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-400" />,
      title: "Global Availability",
      description: "99.9% uptime SLA with multi-region deployment"
    },
    {
      icon: <Code className="h-8 w-8 text-yellow-400" />,
      title: "Developer Friendly",
      description: "RESTful design with comprehensive SDKs and documentation"
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
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Developer <span className="text-emerald-400">API</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Integrate PromptOp into your applications with our powerful REST API. 
            Test prompts, enhance content, and manage AI workflows programmatically.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
              <Terminal className="h-4 w-4 mr-2" />
              REST API v1
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
              <Key className="h-4 w-4 mr-2" />
              API Key Authentication
            </Badge>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">API Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built for developers, by developers. Our API is designed for performance, reliability, and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">API Endpoints</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Core endpoints to integrate PromptOp functionality into your applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`${
                        endpoint.method === 'GET' ? 'bg-blue-600' :
                        endpoint.method === 'POST' ? 'bg-emerald-600' :
                        'bg-purple-600'
                      } text-white`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-emerald-400 text-sm font-mono">{endpoint.path}</code>
                  </div>
                  <CardDescription className="text-slate-400">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400 font-medium">Example Request</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs text-slate-300 overflow-x-auto">
                      <code>{endpoint.example}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Official SDKs</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get started quickly with our official SDKs for popular programming languages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sdks.map((sdk, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <span className="text-2xl">{sdk.icon}</span>
                    {sdk.language}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Installation:</p>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <code className="text-emerald-400 text-sm">{sdk.install}</code>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Example Usage:</p>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <pre className="text-xs text-slate-300 overflow-x-auto">
                        <code>{sdk.example}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    <Download className="mr-2 h-4 w-4" />
                    Download SDK
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Complete Documentation
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Comprehensive guides, tutorials, and reference documentation to help you integrate quickly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Book className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                <p className="text-slate-400 text-sm mb-4">Complete endpoint documentation with examples</p>
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  View Docs
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
                <p className="text-slate-400 text-sm mb-4">Ready-to-use code snippets and tutorials</p>
                <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  Browse Examples
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Terminal className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Interactive Playground</h3>
                <p className="text-slate-400 text-sm mb-4">Test API calls directly in your browser</p>
                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                  Try Playground
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                Get API Key
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
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
