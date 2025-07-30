import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function HomePage() {
  const { user } = useAuth();

  // This is now the home route that redirects authenticated users to dashboard
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  // For unauthenticated users, redirect to landing page
  return <Redirect to="/" />;
}
