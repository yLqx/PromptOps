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
  Phone,
  Search,
  Filter,
  Briefcase
} from "lucide-react";

export default function JobsPage() {
  const futureJobs = [
    {
      title: "Senior AI Research Scientist",
      department: "AI Research",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$180k - $250k",
      description: "Lead research initiatives in prompt optimization and AI model integration. Shape the future of AI prompt engineering.",
      requirements: ["PhD in AI/ML/CS", "5+ years research experience", "Published papers in top venues", "LLM expertise"],
      status: "Future Opening"
    },
    {
      title: "Principal Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$170k - $220k",
      description: "Architect and build the next generation of AI development tools. Lead frontend engineering initiatives.",
      requirements: ["8+ years frontend experience", "React/TypeScript mastery", "Design system experience", "Team leadership"],
      status: "Future Opening"
    },
    {
      title: "Head of Product",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$200k - $280k",
      description: "Define product strategy and roadmap for PromptOp and future MONZED products. Lead product organization.",
      requirements: ["10+ years product experience", "B2B SaaS background", "AI/ML product experience", "Team leadership"],
      status: "Future Opening"
    },
    {
      title: "DevRel Engineer",
      department: "Developer Relations",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Build relationships with developer community. Create content, demos, and drive adoption of our platform.",
      requirements: ["5+ years developer experience", "Technical writing skills", "Community building", "Public speaking"],
      status: "Future Opening"
    },
    {
      title: "Sales Engineer",
      department: "Sales",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$140k - $180k + commission",
      description: "Drive enterprise sales through technical expertise. Help customers understand and implement our solutions.",
      requirements: ["3+ years sales engineering", "Technical background", "B2B sales experience", "AI/ML knowledge"],
      status: "Future Opening"
    },
    {
      title: "Data Scientist",
      department: "Data Science",
      location: "Remote",
      type: "Full-time",
      salary: "$150k - $200k",
      description: "Analyze user behavior, model performance, and business metrics to drive product decisions.",
      requirements: ["MS/PhD in quantitative field", "Python/R expertise", "ML/statistics background", "Business acumen"],
      status: "Future Opening"
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
              <Link href="/careers" className="text-slate-300 hover:text-white transition-colors">Careers</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link>
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
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Future <span className="text-emerald-400">Opportunities</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            We're building the future of AI development tools at MONZED. These are the roles we'll be looking for 
            as we grow and expand our impact in the AI space.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
              <Rocket className="h-4 w-4 mr-2" />
              Growing Team
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Remote-First
            </Badge>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            We're <span className="text-emerald-400">Building</span> Our Team
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            While we don't have open positions right now, we're actively planning our growth. 
            If you're passionate about AI and want to be part of something special, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Contact team@monzed.com
            </Button>
            <Link href="/careers">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                Learn About Our Culture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Future Positions */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Future Positions</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              These are the types of roles we anticipate opening as we scale our team and expand our product offerings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {futureJobs.map((job, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-slate-400">{job.description}</CardDescription>
                    </div>
                    <Badge className="ml-4 bg-yellow-600 text-white">
                      {job.status}
                    </Badge>
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
                    <h4 className="text-white font-medium mb-2">Likely Requirements:</h4>
                    <ul className="text-slate-400 text-sm space-y-1">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                    disabled
                  >
                    Express Interest
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Notified */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay in the Loop
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Want to be the first to know when we start hiring? Send us your information and we'll reach out 
            when positions that match your skills become available.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700 px-6">
                Notify Me
              </Button>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            We'll only contact you about relevant job opportunities. No spam, ever.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Even if you don't see a perfect match above, we're always interested in talking to exceptional people. 
            Reach out and let's explore how you can contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Email team@monzed.com
            </Button>
            <Link href="/careers">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg"
              >
                Learn About MONZED
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
                <span className="text-slate-400">support@promptop.net</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">+33775851544</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">Paris , FR</span>
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
