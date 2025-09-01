import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import {
  Brain,
  Rocket,
  Shield,
  Users,
  Target,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-founder",
      bio: "Former AI researcher at Google. Passionate about democratizing AI access.",
      avatar: "AC"
    },
    {
      name: "Sarah Johnson",
      role: "CTO & Co-founder",
      bio: "Ex-OpenAI engineer. Expert in large language models and AI infrastructure.",
      avatar: "SJ"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Product",
      bio: "Product leader with 10+ years building developer tools at Microsoft.",
      avatar: "MR"
    },
    {
      name: "Emily Zhang",
      role: "Head of Engineering",
      bio: "Full-stack architect specializing in scalable AI platforms.",
      avatar: "EZ"
    }
  ];

  const values = [
    {
      icon: <Brain className="h-8 w-8 text-emerald-400" />,
      title: "AI-First Innovation",
      description: "We believe AI should be accessible, powerful, and easy to use for everyone."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Community Driven",
      description: "Our platform grows stronger with every user, prompt, and piece of feedback."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "Trust & Security",
      description: "Enterprise-grade security and privacy protection for all user data."
    },
    {
      icon: <Globe className="h-8 w-8 text-yellow-400" />,
      title: "Global Impact",
      description: "Empowering developers worldwide to build the next generation of AI applications."
    }
  ];

  const milestones = [
    { year: "2024", event: "PromptOps founded", description: "Started with a vision to simplify AI prompt management" },
    { year: "2024", event: "First 1,000 users", description: "Reached our first milestone with early adopters" },
    { year: "2024", event: "Multi-model support", description: "Added support for 5+ AI models" },
    { year: "2025", event: "20+ AI models", description: "Expanded to support 20+ leading AI models" },
    { year: "2025", event: "Enterprise launch", description: "Launched enterprise features and team collaboration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo className="text-white" />
            </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">Home</a>
              </Link>
              <Link href="/pricing">
                <a className="text-slate-300 hover:text-emerald-400 transition-colors">Pricing</a>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-6">
              About 
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {" "}PromptOps
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              We're building the future of AI prompt engineering. Our mission is to make 
              AI more reliable, predictable, and powerful for developers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-300 text-lg">
                <p>
                  PromptOps was born from frustration. As AI developers, we were tired of 
                  manually testing prompts, losing track of what worked, and deploying 
                  changes blindly.
                </p>
                <p>
                  We realized that prompt engineering needed the same rigor as software 
                  engineering: version control, testing, analytics, and systematic deployment.
                </p>
                <p>
                  Today, PromptOps serves thousands of developers who trust us to make their 
                  AI applications more reliable and performant.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
              <Card className="relative bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">10K+</div>
                      <div className="text-slate-300">Developers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">1M+</div>
                      <div className="text-slate-300">Prompts Tested</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">99.9%</div>
                      <div className="text-slate-300">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">150+</div>
                      <div className="text-slate-300">Countries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-slate-300 text-lg">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              To democratize AI by making prompt engineering systematic, measurable, 
              and accessible to every developer. We believe the future of AI depends 
              on reliable, well-tested prompts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-200" />
                <span className="text-emerald-100">Reliable AI Systems</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-200" />
                <span className="text-emerald-100">Data-Driven Decisions</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-200" />
                <span className="text-emerald-100">Developer Productivity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to join us?</h2>
          <p className="text-xl text-slate-300 mb-8">Start building better AI applications today</p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 PromptOps. Powered by{" "}
            <a href="https://monzed.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Monzed.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}