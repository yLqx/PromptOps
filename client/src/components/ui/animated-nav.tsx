import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";

interface AnimatedNavProps {
  currentPage?: string;
  showAuthButtons?: boolean;
}

export function AnimatedNav({ currentPage = "", showAuthButtons = true }: AnimatedNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 animate-slide-in-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-2">
            <Link href="/">
              <Logo className="text-white text-sm md:text-base flex-shrink-0" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link 
              href="/about" 
              className={`text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group ${
                currentPage === 'about' ? 'text-emerald-400' : ''
              }`}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/features" 
              className={`text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group ${
                currentPage === 'features' ? 'text-emerald-400' : ''
              }`}
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/pricing" 
              className={`text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group ${
                currentPage === 'pricing' ? 'text-emerald-400' : ''
              }`}
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className={`text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium relative group ${
                currentPage === 'contact' ? 'text-emerald-400' : ''
              }`}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {showAuthButtons && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white text-sm px-3 sm:px-4 transform hover:scale-105 transition-all duration-300">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-shadow bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 sm:px-4 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
