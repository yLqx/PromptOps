import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import AboutPage from "@/pages/about-page";
import PricingPage from "@/pages/pricing-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import SupportPage from "@/pages/support-page";
import AuthPage from "@/pages/auth-page";
import PromptsPage from "@/pages/prompts-page";
import BillingPage from "@/pages/billing-page";
import AdminPage from "@/pages/admin-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/prompts" component={PromptsPage} />
      <ProtectedRoute path="/billing" component={BillingPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
