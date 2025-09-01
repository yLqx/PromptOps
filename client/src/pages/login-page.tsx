import { useState } from "react";
import { Link } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Eye, EyeOff, LogIn, ArrowLeft, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Login Card */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo className="text-2xl font-bold text-white" size="md" clickable={false} />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to your PromptOp account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10 focus:border-emerald-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                disabled={isLoginLoading || isLoading}
              >
                {isLoginLoading || isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-slate-400">
                <Link href="/forgot-password">
                  <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium">
                    Forgot your password?
                  </span>
                </Link>
              </p>
              <p className="text-slate-400">
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  );
}
