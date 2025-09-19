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
import { Eye, EyeOff, UserPlus, ArrowLeft, Sparkles, Lock, Mail, User, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  useScrollAnimations();
  const { user, register, isLoading } = useSupabaseAuth();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.email || !registerData.password || !confirmPassword || !registerData.fullName || !registerData.username) {
      return; // Form validation will handle this
    }

    if (registerData.password !== confirmPassword) {
      return; // Form validation will handle this
    }

    if (registerData.password.length < 6) {
      return; // Form validation will handle this
    }

    setIsRegisterLoading(true);
    // No try/catch needed - errors are handled gracefully in register function
    await register(registerData.email, registerData.password, registerData.username, registerData.fullName);
    setIsRegisterLoading(false);
  };

  const passwordsMatch = registerData.password && confirmPassword && registerData.password === confirmPassword;
  const passwordLength = registerData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-morph-bg"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-morph-bg" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
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

          {/* Register Card */}
          <Card 
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm animate-slide-in-up transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
            data-animate
            id="register-card"
            style={{animationDelay: '0.4s'}}
          >
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Join PromptOp
              </CardTitle>
              <CardDescription className="text-slate-300">
                Start your AI journey today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-slate-300">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={registerData.username}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                        required
                        className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
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
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
                  {/* Password requirements */}
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className={`w-3 h-3 ${passwordLength ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={passwordLength ? 'text-emerald-400' : 'text-slate-500'}>
                      At least 6 characters
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className={`w-3 h-3 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className={passwordsMatch ? 'text-emerald-400' : 'text-red-400'}>
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isRegisterLoading || isLoading || !passwordsMatch || !passwordLength}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isRegisterLoading || isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
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

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Features Preview */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-white">You'll get instant access to:</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Free tier with 15 prompt tests/month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>5 AI enhancements per month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Access to free AI models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    <span>25 prompt slots & basic analytics</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="text-center text-xs text-slate-400">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </Link>
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
