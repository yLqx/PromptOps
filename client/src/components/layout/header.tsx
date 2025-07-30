import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold">PromptOps</h1>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Dashboard</span>
            </Link>
            <Link href="/prompts">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Prompts</span>
            </Link>
            <Link href="/billing">
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Billing</span>
            </Link>

          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center space-x-2 bg-background px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <Badge variant={user.plan === "free" ? "secondary" : "default"}>
                    {user.plan} Plan
                  </Badge>
                </div>
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
