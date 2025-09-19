import { useState } from "react";
import { Link } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
import { Eye, EyeOff, LogIn, ArrowLeft, Zap, Sparkles, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  useScrollAnimations();
  const { user, login, isLoading } = useSupabaseAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);
      if (result?.success) {
        // ensure session exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          // nothing else to do, redirect handled elsewhere
        }
      }
    } finally {
      // Always clear loading state
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-morph-bg"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Back to Home */}
          <div 
            className="animate-fade-in-up"
            data-animate
            id="back-button"
          >
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Logo */}
          <div 
            className="text-center animate-scale-in"
            data-animate
            id="logo"
            style={{animationDelay: '0.2s'}}
          >
            <Link href="/">
              <Logo className="text-white mx-auto transform transition-all duration-300 hover:scale-110" />
            </Link>
          </div>

          {/* Login Card */}
          <Card 
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm animate-slide-in-up transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
            data-animate
            id="login-card"
            style={{animationDelay: '0.4s'}}
          >
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-300">
                Sign in to continue your AI journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoginLoading || isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoginLoading || isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-400">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <Link 
                    href="/register" 
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>

              {/* Features Preview */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-white">What you get:</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Access to 20+ AI models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>AI-powered prompt optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Advanced analytics & insights</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div 
            className="text-center text-slate-400 text-xs animate-fade-in-up"
            data-animate
            id="footer"
            style={{animationDelay: '0.6s'}}
          >
            <p>© 2025 PromptOp. All rights reserved.</p>
            <p className="mt-1">
              Powered by{" "}
              <a 
                href="https://monzed.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                MONZED
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
