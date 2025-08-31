import { useEffect, useState } from "react";
import { testConnection } from "../lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle, Database, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface SupabaseConnectionGuardProps {
  children: React.ReactNode;
}

export function SupabaseConnectionGuard({ children }: SupabaseConnectionGuardProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setError(null);

    try {
      // Add timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000)
      );

      const connected = await Promise.race([
        testConnection(),
        timeoutPromise
      ]) as boolean;

      setIsConnected(connected);

      if (!connected) {
        setError("Failed to connect to Supabase database");
      }
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || "Connection timeout - please check your Supabase configuration");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Show loading state while checking connection
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              PromptOps Loading...
            </CardTitle>
            <CardDescription>
              Connecting to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
              <span className="text-sm text-muted-foreground">Initializing your workspace</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground">This should only take a few seconds...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if connection failed
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-600 dark:text-red-400">Database Connection Failed</CardTitle>
            <CardDescription>
              PromptOps requires a Supabase database connection to function properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Setup Instructions:</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Create a Supabase Project</p>
                    <p className="text-muted-foreground">Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-1" /></a> and create a new project</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Run the SQL Setup</p>
                    <p className="text-muted-foreground">Copy and run the SQL commands from <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">SQLSUPABASE.sql</code> in your Supabase SQL Editor</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Configure Environment Variables</p>
                    <p className="text-muted-foreground">Update your <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env</code> file with your Supabase credentials:</p>
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                      <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                      <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Restart the Application</p>
                    <p className="text-muted-foreground">Restart your development server after updating the environment variables</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button onClick={checkConnection} disabled={isChecking}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                Retry Connection
              </Button>
              <Button variant="outline" asChild>
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase
                </a>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsConnected(true)}
                className="text-xs"
              >
                Skip Check (Dev Mode)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success state and render children if connected
  return (
    <div>
      {children}
    </div>
  );
}
