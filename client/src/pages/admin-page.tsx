import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Reply,
  Sparkles
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  plan: "free" | "pro" | "team";
  promptsUsed: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: "urgent" | "medium" | "low";
  category: string;
  status: "open" | "in_progress" | "closed";
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: user?.email === "admin@promptops.com",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: user?.email === "admin@promptops.com",
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/admin/tickets"],
    enabled: user?.email === "admin@promptops.com",
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: string; status?: string; adminResponse?: string }) => {
      const response = await apiRequest("PUT", `/api/admin/tickets/${id}`, { status, adminResponse });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Ticket updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tickets"] });
      setSelectedTicket(null);
      setAdminResponse("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tickets/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Ticket deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tickets"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleTicketUpdate = (status: string, response?: string) => {
    if (selectedTicket) {
      updateTicketMutation.mutate({ 
        id: selectedTicket.id, 
        status, 
        adminResponse: response || adminResponse 
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500 text-white";
      case "in_progress": return "bg-yellow-500 text-white";
      case "closed": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (user?.email !== "admin@promptops.com") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-300">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400">PromptOps Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab("overview")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "tickets" ? "secondary" : "ghost"}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab("tickets")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Support Tickets
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">System Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 flex items-center">
                      <Users className="mr-2 h-4 w-4 text-emerald-400" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-emerald-400" />
                      Active Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-emerald-400" />
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats?.monthlyRevenue || 0}</div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-200 flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-emerald-400" />
                      API Calls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats?.apiCalls || 0}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">User Management</h2>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left text-slate-200 pb-3">User</th>
                          <th className="text-left text-slate-200 pb-3">Plan</th>
                          <th className="text-left text-slate-200 pb-3">Prompts Used</th>
                          <th className="text-left text-slate-200 pb-3">Joined</th>
                          <th className="text-left text-slate-200 pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user: User) => (
                          <tr key={user.id} className="border-b border-slate-700">
                            <td className="py-3">
                              <div>
                                <div className="text-white font-medium">{user.username}</div>
                                <div className="text-slate-400 text-sm">{user.email}</div>
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge className={`
                                ${user.plan === "free" ? "bg-slate-600" : ""}
                                ${user.plan === "pro" ? "bg-emerald-600" : ""}
                                ${user.plan === "team" ? "bg-blue-600" : ""}
                                text-white
                              `}>
                                {user.plan.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-3 text-white">{user.promptsUsed || 0}</td>
                            <td className="py-3 text-slate-300">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <Badge className={user.stripeSubscriptionId ? "bg-green-600" : "bg-gray-600"}>
                                {user.stripeSubscriptionId ? "Active" : "Free"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Support Tickets</h2>
              
              <div className="grid gap-4">
                {tickets.length === 0 ? (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-white font-medium mb-2">No support tickets</h3>
                      <p className="text-slate-400">No tickets have been created yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  tickets.map((ticket: SupportTicket) => (
                    <Card key={ticket.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-semibold">{ticket.subject}</h3>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Category: {ticket.category}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            {ticket.adminResponse && (
                              <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 mt-3">
                                <div className="text-emerald-400 text-sm font-medium mb-1">Admin Response:</div>
                                <p className="text-slate-200 text-sm">{ticket.adminResponse}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                  onClick={() => setSelectedTicket(ticket)}
                                >
                                  <Reply className="h-4 w-4 mr-1" />
                                  Respond
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Respond to Ticket</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-white font-medium mb-2">Subject: {selectedTicket?.subject}</h4>
                                    <p className="text-slate-300 text-sm">{selectedTicket?.description}</p>
                                  </div>
                                  <div>
                                    <label className="text-slate-200 text-sm">Admin Response</label>
                                    <Textarea
                                      placeholder="Type your response here..."
                                      className="bg-slate-700 border-slate-600 text-white"
                                      value={adminResponse}
                                      onChange={(e) => setAdminResponse(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleTicketUpdate("in_progress", adminResponse)}
                                      className="bg-emerald-500 hover:bg-emerald-600"
                                      disabled={updateTicketMutation.isPending}
                                    >
                                      Send Response
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleTicketUpdate("closed", adminResponse)}
                                      className="border-slate-600 text-slate-300"
                                      disabled={updateTicketMutation.isPending}
                                    >
                                      Close Ticket
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteTicketMutation.mutate(ticket.id)}
                              disabled={deleteTicketMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

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