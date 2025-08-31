import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import {
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Rocket,
  Brain,
  Code,
  Palette,
  ArrowRight,
  Heart,
  Coffee,
  Zap,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$150k - $200k",
      description: "Build the future of AI prompt management with React, Node.js, and cutting-edge AI technologies.",
      requirements: ["5+ years full-stack experience", "React/TypeScript expertise", "Node.js/Express", "AI/ML interest"],
      badge: "Hot"
    },
    {
      title: "AI/ML Engineer",
      department: "AI Research",
      location: "San Francisco, CA",
      type: "Full-time", 
      salary: "$160k - $220k",
      description: "Design and implement AI model integrations, prompt optimization algorithms, and ML infrastructure.",
      requirements: ["PhD/MS in AI/ML", "Python/PyTorch", "LLM experience", "Research background"],
      badge: "New"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k", 
      description: "Create beautiful, intuitive interfaces for complex AI workflows. Shape the future of AI UX.",
      requirements: ["5+ years product design", "Figma expertise", "B2B SaaS experience", "AI/tech interest"],
      badge: null
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$140k - $180k",
      description: "Scale our infrastructure to handle millions of AI requests. Build robust, secure systems.",
      requirements: ["AWS/GCP expertise", "Kubernetes", "CI/CD pipelines", "Security focus"],
      badge: null
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      salary: "$90k - $120k",
      description: "Help enterprise customers succeed with PromptOp. Drive adoption and growth.",
      requirements: ["3+ years customer success", "B2B SaaS experience", "Technical aptitude", "Communication skills"],
      badge: null
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "San Francisco, CA / Remote", 
      type: "Full-time",
      salary: "$100k - $130k",
      description: "Drive growth through content, campaigns, and community building in the AI space.",
      requirements: ["4+ years marketing", "Content creation", "AI/tech marketing", "Growth mindset"],
      badge: null
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-400" />,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance. Mental health support and wellness stipend."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-400" />,
      title: "Competitive Compensation",
      description: "Top-tier salaries, equity packages, and performance bonuses. We believe in rewarding great work."
    },
    {
      icon: <Coffee className="h-8 w-8 text-yellow-400" />,
      title: "Flexible Work",
      description: "Remote-first culture with flexible hours. Work from anywhere or join us in our SF office."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "Learning & Growth",
      description: "Conference budget, learning stipend, and mentorship programs. Grow your skills with us."
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-400" />,
      title: "Cutting-Edge Tech",
      description: "Work with the latest AI models and technologies. Shape the future of AI development."
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Amazing Team",
      description: "Join a diverse, talented team of AI researchers, engineers, and builders from top companies."
    }
  ];

  const values = [
    {
      icon: <Rocket className="h-6 w-6 text-emerald-400" />,
      title: "Innovation First",
      description: "We push boundaries and explore new possibilities in AI"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Team Success",
      description: "We win together and support each other's growth"
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      title: "Continuous Learning",
      description: "We're always learning and adapting in the fast-moving AI space"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-400" />,
      title: "User Obsession",
      description: "Everything we do is focused on creating value for our users"
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
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/jobs" className="text-slate-300 hover:text-white transition-colors">Jobs</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
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
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join the <span className="text-emerald-400">MONZED</span> Team
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Be part of the innovative team behind PromptOp and other cutting-edge AI solutions.
            Join MONZED and help shape the future of AI development tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              MONZED.com
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Growing Team
            </Badge>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              These principles guide how we work, build, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Work With Us</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We offer competitive benefits and a culture that supports your growth and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Open Positions</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join our growing team and help shape the future of AI development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {jobs.map((job, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-slate-400">{job.description}</CardDescription>
                    </div>
                    {job.badge && (
                      <Badge className={`ml-4 ${
                        job.badge === 'Hot' ? 'bg-red-600' : 'bg-emerald-600'
                      } text-white`}>
                        {job.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="h-4 w-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Requirements:</h4>
                    <ul className="text-slate-400 text-sm space-y-1">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
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
            Don't See Your Role?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            We're always looking for exceptional talent. Send us your resume and let's talk about how you can contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              Send Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                Contact Us
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
                MONZED builds innovative AI development tools including PromptOp. Join our team to create the future of AI workflows.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/monzed" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/monzed" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/monzed" className="text-slate-400 hover:text-emerald-400 transition-colors">
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
                <span className="text-slate-400">team@monzed.com</span>
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
                © 2025 MONZED. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <span className="text-slate-400 text-sm">Visit us at</span>
                <a
                  href="https://monzed.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  MONZED.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
