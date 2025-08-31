import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Sparkles,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: "urgent" | "medium" | "low";
  category: string;
  status: "open" | "in_progress" | "closed";
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium" as "urgent" | "medium" | "low",
    category: "general"
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/support-tickets"],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: typeof newTicket) => {
      const response = await apiRequest("POST", "/api/support/tickets", ticket);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Support ticket created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setNewTicket({ subject: "", description: "", priority: "medium", category: "general" });
      setShowCreateTicket(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createTicketMutation.mutate(newTicket);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "in_progress": return "bg-yellow-500";
      case "closed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-4 w-4" />;
      case "in_progress": return <AlertTriangle className="h-4 w-4" />;
      case "closed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PromptOp Support</h1>
                <p className="text-slate-400">Get help with your account and services</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!user ? (
          // Public support information
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">How can we help you?</h2>
              <p className="text-slate-300 text-lg">Get support for PromptOp services</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-emerald-400" />
                    Documentation
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Find answers in our comprehensive documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    Browse Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-emerald-400" />
                    Email Support
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Contact our support team via email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    support@promptops.com
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-emerald-400" />
                    Live Chat
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Chat with our support team in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-slate-400 mb-4">Have an account? Sign in to create support tickets</p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          // Authenticated user support dashboard
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Support Dashboard</h2>
                <p className="text-slate-300">Manage your support tickets</p>
              </div>
              <Button 
                onClick={() => setShowCreateTicket(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>

            {/* Create Ticket Form */}
            {showCreateTicket && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Create Support Ticket</CardTitle>
                  <CardDescription className="text-slate-300">
                    Describe your issue and we'll get back to you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                      <label className="text-slate-200 text-sm font-medium">Subject *</label>
                      <Input
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-200 text-sm font-medium">Priority</label>
                        <Select 
                          value={newTicket.priority} 
                          onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="low" className="text-white">Low</SelectItem>
                            <SelectItem value="medium" className="text-white">Medium</SelectItem>
                            <SelectItem value="urgent" className="text-white">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-slate-200 text-sm font-medium">Category</label>
                        <Select 
                          value={newTicket.category} 
                          onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="general" className="text-white">General</SelectItem>
                            <SelectItem value="technical" className="text-white">Technical</SelectItem>
                            <SelectItem value="billing" className="text-white">Billing</SelectItem>
                            <SelectItem value="account" className="text-white">Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-200 text-sm font-medium">Description *</label>
                      <Textarea
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide detailed information about your issue..."
                        className="bg-slate-700 border-slate-600 text-white h-32"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={createTicketMutation.isPending}
                      >
                        {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateTicket(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Existing Tickets */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Your Support Tickets</h3>
              
              {tickets?.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No support tickets yet</h3>
                    <p className="text-slate-400 mb-4">Create your first support ticket to get help</p>
                    <Button 
                      onClick={() => setShowCreateTicket(true)}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Create Ticket
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {tickets?.map((ticket: SupportTicket) => (
                    <Card key={ticket.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-semibold">{ticket.subject}</h3>
                              <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                                {ticket.priority.toUpperCase()}
                              </Badge>
                              <Badge className={`${getStatusColor(ticket.status)} text-white flex items-center gap-1`}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Category: {ticket.category}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {ticket.adminResponse && (
                          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-emerald-600 text-white">Admin Response</Badge>
                            </div>
                            <p className="text-slate-200 text-sm">{ticket.adminResponse}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 PromptOp. Powered by{" "}
            <a href="https://monzed.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Monzed.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}