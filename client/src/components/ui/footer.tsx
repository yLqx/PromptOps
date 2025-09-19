import { Link } from "wouter";
import { Logo } from "@/components/ui/logo";
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
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
        <div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 animate-staggered-fade-in"
          data-animate
          id="footer-links"
        >
          {/* Company Info */}
          <div className="space-y-4">
            <div className="transform hover:scale-105 transition-all duration-300">
              <Logo className="text-white" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The ultimate AI prompt management platform. Streamline your AI workflows with 20+ models and intelligent optimization.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/PromptOp" 
                className="text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.x.com/promptopnet" 
                className="text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/promptopnet/" 
                className="text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <div className="space-y-2">
              <Link href="/features" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Features</Link>
              <Link href="/pricing" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Pricing</Link>
              <Link href="/integrations" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Integrations</Link>
              <Link href="/api" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">API</Link>
              <Link href="/status" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Status</Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">About</Link>
              <Link href="/careers" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Careers</Link>
              <Link href="/jobs" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Jobs</Link>
              <Link href="/blog" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Blog</Link>
              <Link href="/contact" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Contact</Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal & Support</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Terms of Service</Link>
              <Link href="/privacy" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Privacy Policy</Link>
              <Link href="/support" className="block text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm transform hover:translate-x-2">Support</Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div 
          className="border-t border-slate-700/50 pt-8 mb-8 animate-staggered-fade-in"
          data-animate
          id="footer-contact"
          style={{animationDelay: '0.2s'}}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer hover:scale-105 transition-all duration-300">
              <Mail className="h-5 w-5 text-emerald-400 group-hover:animate-bounce" />
              <span className="text-slate-400 group-hover:text-emerald-300 transition-colors">support@promptop.net</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer hover:scale-105 transition-all duration-300">
              <Phone className="h-5 w-5 text-emerald-400 group-hover:animate-bounce" />
              <span className="text-slate-400 group-hover:text-emerald-300 transition-colors">+33775851544</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group cursor-pointer hover:scale-105 transition-all duration-300">
              <MapPin className="h-5 w-5 text-emerald-400 group-hover:animate-bounce" />
              <span className="text-slate-400 group-hover:text-emerald-300 transition-colors">Paris, FR</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t border-slate-700/50 pt-8 animate-staggered-fade-in"
          data-animate
          id="footer-bottom"
          style={{animationDelay: '0.4s'}}
        >
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
                className="text-emerald-400 hover:text-emerald-300 transition-all duration-300 font-semibold transform hover:scale-110 hover:-translate-y-1"
              >
                MONZED
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
