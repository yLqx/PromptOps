import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ModerationDashboard from "@/components/admin/moderation-dashboard";
import { 
  Users, 
  Ticket, 
  DollarSign, 
  Activity, 
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Crown,
  Settings,
  BarChart3,
  FileText
} from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useSupabaseAuth();
  const { toast } = useToast();
  
  // State for ticket management
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [ticketStatus, setTicketStatus] = useState("open");

  // Data queries
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/admin/tickets"],
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: string; status: string; adminResponse: string }) => {
      const res = await apiRequest("PUT", `/api/admin/tickets/${id}`, { status, adminResponse });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setSelectedTicket(null);
      setAdminResponse("");
      toast({ title: "Ticket updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update ticket", description: error.message, variant: "destructive" });
    },
  });

  // Delete ticket mutation
  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/tickets/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Ticket deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete ticket", description: error.message, variant: "destructive" });
    },
  });

  // Show loading while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading admin panel...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Not Logged In</h1>
            <p className="text-muted-foreground">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.email !== "admin@promptops.com" && user.email !== "mourad@admin.com") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
            <p className="text-muted-foreground text-sm mt-2">Current user: {user.email}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateTicket = () => {
    if (!selectedTicket) return;
    updateTicketMutation.mutate({
      id: selectedTicket.id,
      status: ticketStatus,
      adminResponse
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Welcome {user.username}! Managing PromptOp platform.</p>
          </div>

          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4 text-emerald-400" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {statsLoading ? "..." : adminStats?.totalUsers || 0}
                </div>
                <p className="text-muted-foreground text-sm">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-emerald-400" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {statsLoading ? "..." : adminStats?.activeSubscriptions || 0}
                </div>
                <p className="text-muted-foreground text-sm">Paid subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-emerald-400" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${statsLoading ? "..." : adminStats?.monthlyRevenue || 0}
                </div>
                <p className="text-muted-foreground text-sm">Estimated monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center">
                  <Ticket className="mr-2 h-4 w-4 text-emerald-400" />
                  Open Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {statsLoading ? "..." : adminStats?.openTickets || 0}
                </div>
                <p className="text-muted-foreground text-sm">Pending support</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
                      Platform Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Users:</span>
                        <span className="font-semibold text-foreground">{adminStats?.totalUsers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Active Subscriptions:</span>
                        <span className="font-semibold text-foreground">{adminStats?.activeSubscriptions || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Tickets:</span>
                        <span className="font-semibold text-foreground">{adminStats?.totalTickets || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Monthly Revenue:</span>
                        <span className="font-semibold text-emerald-400">${adminStats?.monthlyRevenue || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-emerald-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">System running smoothly</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">Users active on platform</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">Support tickets pending</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <ModerationDashboard />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Users className="mr-2 h-5 w-5 text-emerald-400" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">Loading users...</div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Prompts Used</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.plan === "free" ? "secondary" : "default"}>
                                {user.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.promptsUsed || 0}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-emerald-400">
                                Active
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-emerald-400" />
                    Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">Loading tickets...</div>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-foreground font-medium mb-2">No tickets yet</h3>
                      <p className="text-muted-foreground">All support tickets will appear here.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets.map((ticket: any) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                            <TableCell>{ticket.userEmail}</TableCell>
                            <TableCell>
                              <Badge variant={
                                ticket.priority === "urgent" ? "destructive" :
                                ticket.priority === "high" ? "default" : "secondary"
                              }>
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setTicketStatus(ticket.status);
                                        setAdminResponse(ticket.adminResponse || "");
                                      }}
                                    >
                                      Manage
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Manage Support Ticket</DialogTitle>
                                      <DialogDescription>
                                        Update ticket status and provide admin response.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label>Subject</Label>
                                        <p className="text-sm font-medium">{selectedTicket?.subject}</p>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <p className="text-sm text-muted-foreground">{selectedTicket?.description}</p>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={ticketStatus} onValueChange={setTicketStatus}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="adminResponse">Admin Response</Label>
                                        <Textarea
                                          id="adminResponse"
                                          value={adminResponse}
                                          onChange={(e) => setAdminResponse(e.target.value)}
                                          placeholder="Enter your response to the user"
                                          className="min-h-[100px]"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => deleteTicketMutation.mutate(selectedTicket?.id)}
                                        disabled={deleteTicketMutation.isPending}
                                      >
                                        Delete
                                      </Button>
                                      <Button 
                                        onClick={handleUpdateTicket}
                                        disabled={updateTicketMutation.isPending}
                                      >
                                        {updateTicketMutation.isPending ? "Updating..." : "Update Ticket"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-emerald-400" />
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-foreground font-medium">User Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Free Plan:</span>
                          <span className="text-foreground font-medium">
                            {users.filter((u: any) => u.plan === "free").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pro Plan:</span>
                          <span className="text-foreground font-medium">
                            {users.filter((u: any) => u.plan === "pro").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Team Plan:</span>
                          <span className="text-foreground font-medium">
                            {users.filter((u: any) => u.plan === "team").length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-foreground font-medium">Support Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Open Tickets:</span>
                          <span className="text-foreground font-medium">
                            {tickets.filter((t: any) => t.status === "open").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolved Tickets:</span>
                          <span className="text-foreground font-medium">
                            {tickets.filter((t: any) => t.status === "resolved").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Tickets:</span>
                          <span className="text-foreground font-medium">{tickets.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}