import { Link } from "wouter";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PromptOps</span>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
              <p className="text-slate-400 mb-8">Last updated: January 2024</p>

              <div className="space-y-8 text-slate-300">
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed">
                    By accessing and using PromptOps ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                  <p className="leading-relaxed mb-4">
                    PromptOps is a web-based platform that provides AI prompt testing, optimization, and management tools. The service includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI prompt testing with multiple models</li>
                    <li>Analytics and performance tracking</li>
                    <li>Team collaboration features</li>
                    <li>API access for integrations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                  <p className="leading-relaxed mb-4">
                    To access certain features of the Service, you must register for an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Notify us immediately of any unauthorized use</li>
                    <li>Be responsible for all activity under your account</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                  <p className="leading-relaxed mb-4">
                    You agree not to use the Service to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful or malicious content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the service for competing commercial purposes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Payment and Billing</h2>
                  <p className="leading-relaxed mb-4">
                    For paid services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fees are charged in advance on a monthly basis</li>
                    <li>All fees are non-refundable unless otherwise stated</li>
                    <li>You authorize us to charge your payment method</li>
                    <li>Price changes will be communicated 30 days in advance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Data and Privacy</h2>
                  <p className="leading-relaxed">
                    Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as outlined in our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
                  <p className="leading-relaxed">
                    The Service and its original content, features, and functionality are owned by PromptOps and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
                  <p className="leading-relaxed">
                    We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including, without limitation, a breach of the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                  <p className="leading-relaxed">
                    In no event shall PromptOps, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
                  <p className="leading-relaxed">
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms, please contact us at legal@promptops.com
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 PromptOps. Powered by{" "}
            <a href="https://monzed.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Monzed.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}