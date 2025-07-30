import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  console.log("Admin Page - User:", user);
  console.log("Admin Page - Is Loading:", isLoading);

  // Show loading while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Not Logged In</h1>
            <p className="text-slate-300">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.email !== "admin@promptops.com") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-300">You don't have permission to access the admin panel.</p>
            <p className="text-slate-400 text-sm mt-2">Current user: {user.email}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Simple admin panel that should definitely work
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Welcome {user.username}! ({user.email})</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Admin Panel Working!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">User Info</h3>
                <div className="text-slate-300 space-y-1">
                  <p>ID: {user.id}</p>
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Plan: {user.plan}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">System Status</h3>
                <div className="text-emerald-400">✓ Admin panel is working</div>
                <div className="text-emerald-400">✓ Authentication successful</div>
                <div className="text-emerald-400">✓ User data loaded</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-2">Next Steps</h3>
                <div className="text-slate-300">
                  <p>The admin panel is now loading correctly.</p>
                  <p className="mt-2">Ready to add full admin features.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 PromptOps. Powered by{" "}
            <a href="https://monzed.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Monzed.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}