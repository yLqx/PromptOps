import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserUsage } from "@/hooks/use-user-usage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { LogOut, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { user, logout } = useSupabaseAuth();
  const { plan } = useUserUsage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 border-b border-gray-700/50 shadow-lg shadow-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Logo className="flex-shrink-0" />

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/dashboard">
              <span className="text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/prompts">
              <span className="text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer text-sm font-medium">My Prompts</span>
            </Link>
            <Link href="/ai-enhancer">
              <span className="text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer text-sm font-medium">AI Enhancer</span>
            </Link>
            <Link href="/billing">
              <span className="text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer text-sm font-medium">Billing</span>
            </Link>
            {(user?.email === "admin@promptops.com" || user?.email === "mourad@admin.com") && (
              <Link href="/admin">
                <span className="text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer text-sm font-medium">Admin</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {user && (
              <>
                <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 px-2 sm:px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <Badge variant="outline" className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-['DM_Sans'] font-semibold">
                    {plan === 'free' && 'FREE'}
                    {plan === 'pro' && 'PRO'}
                    {plan === 'team' && 'TEAM'}
                    {plan === 'enterprise' && 'ENTERPRISE'}
                    {!plan && 'FREE'}
                  </Badge>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="hover:bg-red-500/10 hover:text-red-400 p-1.5 sm:p-2 hidden lg:flex text-gray-400"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                {/* Mobile Menu */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden p-1.5 sm:p-2 text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 sm:w-80 bg-gray-900 border-gray-700/50">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <Logo />
                        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <nav className="flex-1">
                        <div className="space-y-2">
                          <Link href="/dashboard">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Dashboard
                            </div>
                          </Link>
                          <Link href="/prompts">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              My Prompts
                            </div>
                          </Link>
                          <Link href="/professional-prompt-creator">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Professional Prompt Creator
                            </div>
                          </Link>
                          <Link href="/community">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Community
                            </div>
                          </Link>
                          <Link href="/ai-enhancer">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              AI Enhancer
                            </div>
                          </Link>
                          <Link href="/billing">
                            <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                              Billing
                            </div>
                          </Link>
                          {(user?.email === "admin@promptops.com" || user?.email === "mourad@admin.com") && (
                            <Link href="/admin">
                              <div className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                Admin
                              </div>
                            </Link>
                          )}
                        </div>
                      </nav>

                      <div className="border-t border-gray-700/50 pt-4">
                        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/30 mb-4">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <Badge variant={user.plan === "free" ? "secondary" : "default"} className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                            {user.plan} Plan
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full justify-start hover:bg-red-500/10 hover:text-red-400 text-gray-400"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
