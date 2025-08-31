import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Plug, 
  Code, 
  Zap, 
  Brain,
  Settings,
  Cloud,
  Shield,
  Users,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Rocket,
  Globe
} from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      icon: <Code className="h-12 w-12 text-blue-400" />,
      title: "Custom AI Models",
      description: "Integrate your own fine-tuned models and proprietary AI systems",
      features: [
        "Private model hosting",
        "Custom API endpoints",
        "Model versioning",
        "Performance monitoring"
      ],
      status: "Coming Soon",
      category: "AI Models"
    },
    {
      icon: <Cloud className="h-12 w-12 text-emerald-400" />,
      title: "Cloud Platforms",
      description: "Deploy and manage prompts across major cloud providers",
      features: [
        "AWS integration",
        "Google Cloud support",
        "Azure compatibility",
        "Multi-cloud deployment"
      ],
      status: "Available",
      category: "Infrastructure"
    },
    {
      icon: <Settings className="h-12 w-12 text-purple-400" />,
      title: "Development Tools",
      description: "Seamlessly integrate with your existing development workflow",
      features: [
        "VS Code extension",
        "GitHub Actions",
        "CI/CD pipelines",
        "Webhook support"
      ],
      status: "Beta",
      category: "Developer Tools"
    },
    {
      icon: <Users className="h-12 w-12 text-yellow-400" />,
      title: "Team Collaboration",
      description: "Connect with popular team communication and project management tools",
      features: [
        "Slack integration",
        "Discord webhooks",
        "Jira connectivity",
        "Notion sync"
      ],
      status: "Available",
      category: "Collaboration"
    },
    {
      icon: <Shield className="h-12 w-12 text-red-400" />,
      title: "Enterprise Security",
      description: "Advanced security integrations for enterprise environments",
      features: [
        "SSO providers",
        "LDAP integration",
        "Audit logging",
        "Compliance tools"
      ],
      status: "Enterprise",
      category: "Security"
    },
    {
      icon: <Brain className="h-12 w-12 text-green-400" />,
      title: "AI Orchestration",
      description: "Connect with AI workflow and orchestration platforms",
      features: [
        "LangChain support",
        "AutoGen integration",
        "Custom workflows",
        "Model chaining"
      ],
      status: "Coming Soon",
      category: "AI Platforms"
    }
  ];

  const customModelFeatures = [
    {
      title: "Bring Your Own Model",
      description: "Upload and deploy your custom-trained AI models",
      icon: <Rocket className="h-8 w-8 text-emerald-400" />
    },
    {
      title: "Team Model Sharing",
      description: "Share custom models securely within your organization",
      icon: <Users className="h-8 w-8 text-blue-400" />
    },
    {
      title: "Model Performance Analytics",
      description: "Monitor and optimize your custom model performance",
      icon: <Brain className="h-8 w-8 text-purple-400" />
    },
    {
      title: "Version Control",
      description: "Manage different versions of your models with ease",
      icon: <Code className="h-8 w-8 text-yellow-400" />
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
            <Plug className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful <span className="text-emerald-400">Integrations</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Connect PromptOp with your existing tools and workflows. Bring your own AI models, 
            integrate with your team's infrastructure, and scale your AI operations.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              50+ Integrations
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              Custom Models Support
            </Badge>
          </div>
        </div>
      </section>

      {/* Custom AI Models Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Bring Your Own <span className="text-emerald-400">AI Models</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              In the future, teams will be able to integrate their custom AI models directly into PromptOp. 
              Train your models, deploy them securely, and manage them alongside industry-standard models.
            </p>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
              Coming in 2025 • Contact team@monzed.com for early access
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {customModelFeatures.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-400 mb-6">
              Interested in custom model integration? Get in touch with our team.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Mail className="mr-2 h-4 w-4" />
              Contact team@monzed.com
            </Button>
          </div>
        </div>
      </section>

      {/* Available Integrations */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Available Integrations</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Connect PromptOp with your favorite tools and platforms to streamline your AI workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-4">{integration.icon}</div>
                      <CardTitle className="text-white text-xl mb-2">{integration.title}</CardTitle>
                      <CardDescription className="text-slate-400">{integration.description}</CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`ml-4 ${
                        integration.status === 'Available' ? 'border-emerald-500/30 text-emerald-400' :
                        integration.status === 'Beta' ? 'border-blue-500/30 text-blue-400' :
                        integration.status === 'Enterprise' ? 'border-purple-500/30 text-purple-400' :
                        'border-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-emerald-400">{integration.category}</p>
                    <ul className="space-y-1">
                      {integration.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-slate-300 text-sm">
                          <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant={integration.status === 'Available' ? 'default' : 'outline'}
                    className={`w-full ${
                      integration.status === 'Available' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                    disabled={integration.status === 'Coming Soon'}
                  >
                    {integration.status === 'Available' ? 'Connect Now' :
                     integration.status === 'Beta' ? 'Join Beta' :
                     integration.status === 'Enterprise' ? 'Contact Sales' :
                     'Coming Soon'}
                    {integration.status === 'Available' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
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
            Need a Custom Integration?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Our team can build custom integrations for your specific needs. Contact us to discuss your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact team@monzed.com
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                View Enterprise Plans
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
