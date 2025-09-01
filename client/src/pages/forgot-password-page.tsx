import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Reset Link Sent",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send reset email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <Logo className="h-12 w-12" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm">
                    If an account with <strong>{email}</strong> exists, you will receive a password reset link within a few minutes.
                  </p>
                </div>
                
                <div className="text-slate-400 text-sm space-y-2">
                  <p>Didn't receive the email?</p>
                  <ul className="text-xs space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure the email address is correct</li>
                    <li>• Wait a few minutes for delivery</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Try Different Email
                </Button>
                
                <div className="text-center">
                  <Link href="/login">
                    <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo className="h-12 w-12" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">Forgot Password</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Reset Link...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Remember your password?{" "}
                <Link href="/login">
                  <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium">
                    Sign in
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
