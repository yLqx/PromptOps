import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Users } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Company Logo/Brand */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-3xl font-bold text-emerald-500">PromptOps</h1>
          </div>
          
          <div className="text-8xl font-bold text-emerald-500 mb-4">404</div>
          <h2 className="text-4xl font-bold mb-4">Oops! Missed Something?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-500" />
                Go Home
              </CardTitle>
              <CardDescription>
                Return to the main dashboard and explore our features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Community
              </CardTitle>
              <CardDescription>
                Join our community and discover amazing prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/community">
                  <Users className="h-4 w-4 mr-2" />
                  Explore Community
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <p className="text-muted-foreground">Or try one of these popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/prompts">
                <Search className="h-4 w-4 mr-2" />
                Create Prompts
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/community">
                <Users className="h-4 w-4 mr-2" />
                Community Hub
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/pricing">
                💎 Pricing
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team or check our documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
