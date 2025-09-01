import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (!tokenParam) {
      setIsValidToken(false);
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or missing.",
        variant: "destructive",
      });
    } else {
      setToken(tokenParam);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Password Required",
        description: "Please enter and confirm your new password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully.",
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation("/login");
        }, 3000);
      } else {
        if (response.status === 400 && data.message.includes("Invalid or expired")) {
          setIsValidToken(false);
        }
        toast({
          title: "Reset Failed",
          description: data.message || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
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
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  Invalid Reset Link
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  This password reset link is invalid or has expired.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-slate-300 text-sm">
                    The reset link may have expired or been used already. Please request a new password reset.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/forgot-password">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Request New Reset Link
                  </Button>
                </Link>
                
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

  if (isSuccess) {
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
                  Password Reset Complete
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Your password has been successfully reset.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-slate-300 text-sm">
                    You can now sign in with your new password. You'll be redirected to the login page in a few seconds.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/login">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Continue to Login
                  </Button>
                </Link>
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
              <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your new password below.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-300">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && newPassword.length < 6 && (
                  <p className="text-red-400 text-sm">Password must be at least 6 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-sm">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login">
                <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
