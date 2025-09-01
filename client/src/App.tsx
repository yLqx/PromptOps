import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
// Removed AuthProvider (local auth) in favor of SupabaseAuthProvider
import { ProtectedRoute } from "@/lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard";
import LandingPage from "@/pages/landing-page";
import AboutPage from "@/pages/about-page";
import PricingPage from "@/pages/pricing-page";
import FeaturesPage from "@/pages/features-page";
import ContactPage from "@/pages/contact-page";
import CareersPage from "@/pages/careers-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import SupportPage from "@/pages/support-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import PromptsPage from "@/pages/prompts-page";
import BillingPage from "@/pages/billing-page";
import AdminPage from "@/pages/admin-page";
import AIEnhancerPage from "@/pages/ai-enhancer-page";
import TeamPage from "@/pages/team-page";
import ProfessionalPromptCreatorPage from "@/pages/professional-prompt-creator-page";
import CommunityHub from "@/pages/community-hub";
import CreateCommunityPost from "@/pages/create-community-post";
import CommunityPostDetail from "@/pages/community-post-detail";
import TestPlanPage from "@/pages/test-plan-page";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAIModels from "@/pages/admin/AdminAIModels";

import ProfilePage from "@/pages/profile-page";
import UserProfilePage from "@/pages/user-profile-page";
import NotFound from "@/pages/404";

import { SupabaseAuthProvider } from "@/hooks/use-supabase-auth";

// Component to handle scroll restoration
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/home" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/prompts" component={PromptsPage} />
      <ProtectedRoute path="/professional-prompt-creator" component={ProfessionalPromptCreatorPage} />
      <ProtectedRoute path="/community" component={CommunityHub} />
      <ProtectedRoute path="/community/create" component={CreateCommunityPost} />
      <ProtectedRoute path="/community/post/:id" component={CommunityPostDetail} />
      <ProtectedRoute path="/ai-enhancer" component={AIEnhancerPage} />
      <ProtectedRoute path="/billing" component={BillingPage} />
      <ProtectedRoute path="/team" component={TeamPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/user/:username" component={UserProfilePage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/test-plan" component={TestPlanPage} />

      {/* Admin Panel Routes */}
      <Route path="/admin-pl/login" component={AdminLogin} />
      <Route path="/admin-pl">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin-pl/users">
        {() => (
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin-pl/ai-models">
        {() => (
          <AdminLayout>
            <AdminAIModels />
          </AdminLayout>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <Router />
        <Toaster />
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
