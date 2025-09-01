import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminQueryFn, adminApiRequestJson } from "@/lib/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Mail,
  RefreshCw,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  prompts_used: number;
  enhancements_used: number;
  api_calls_used: number;
  created_at: string;
  updated_at: string;
}

interface UserDetails extends User {
  stats: {
    promptsCount: number;
    postsCount: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search })
      });
      return adminQueryFn(`/api/admin/users?${params}`);
    },
  });

  const { data: userDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ["admin-user-details", selectedUser?.id],
    queryFn: () => {
      if (!selectedUser?.id) return null;
      return adminQueryFn(`/api/admin/users/${selectedUser.id}`);
    },
    enabled: !!selectedUser?.id,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      return adminApiRequestJson("PUT", `/api/admin/users/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return adminApiRequestJson("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User deleted successfully" });
      setShowUserDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete user", description: error.message, variant: "destructive" });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      return adminApiRequestJson("POST", `/api/admin/users/${userId}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      toast({ title: "Password reset successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to reset password", description: error.message, variant: "destructive" });
    },
  });

  const upgradePlanMutation = useMutation({
    mutationFn: async ({ userId, plan }: { userId: string; plan: string }) => {
      return adminApiRequestJson("POST", `/api/admin/users/${userId}/upgrade-plan`, { plan });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-details"] });
      toast({ title: "Plan upgraded successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to upgrade plan", description: error.message, variant: "destructive" });
    },
  });

  const resetUsageMutation = useMutation({
    mutationFn: async (userId: string) => {
      return adminApiRequestJson("POST", `/api/admin/users/${userId}/reset-usage`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-details"] });
      toast({ title: "Usage reset successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to reset usage", description: error.message, variant: "destructive" });
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async ({ userId, subject, message }: { userId: string; subject: string; message: string }) => {
      return adminApiRequestJson("POST", `/api/admin/users/${userId}/send-email`, { subject, message });
    },
    onSuccess: () => {
      toast({ title: "Email sent successfully" });
      setShowEmailDialog(false);
      setEmailSubject("");
      setEmailMessage("");
    },
    onError: (error: any) => {
      toast({ title: "Failed to send email", description: error.message, variant: "destructive" });
    },
  });

  const handleViewUser = async (user: User) => {
    setSelectedUser(user as UserDetails);
    setShowUserDialog(true);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'pro': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'team': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'enterprise': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">Manage user accounts and subscriptions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-emerald-500" />
          <span className="text-sm text-gray-400">
            {usersData?.pagination.total || 0} total users
          </span>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by email, username, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">User Accounts</CardTitle>
          <CardDescription className="text-gray-400">
            Click on a user to view details and manage their account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Plan</TableHead>
                  <TableHead className="text-gray-400">Usage</TableHead>
                  <TableHead className="text-gray-400">Joined</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.users.map((user: User) => (
                  <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{user.full_name || user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanBadgeColor(user.plan)}>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-white">{user.prompts_used} prompts</p>
                        <p className="text-gray-400">{user.enhancements_used} enhancements</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">User Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage user account and settings
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : userDetails && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white">{userDetails.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Username</label>
                      <p className="text-white">{userDetails.user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <p className="text-white">{userDetails.user.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Plan</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPlanBadgeColor(userDetails.user.plan)}>
                          {userDetails.user.plan.charAt(0).toUpperCase() + userDetails.user.plan.slice(1)}
                        </Badge>
                        <Select
                          value={userDetails.user.plan}
                          onValueChange={(plan) => upgradePlanMutation.mutate({ userId: userDetails.user.id, plan })}
                        >
                          <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Prompts Used</label>
                      <p className="text-white">{userDetails.user.prompts_used}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Enhancements Used</label>
                      <p className="text-white">{userDetails.user.enhancements_used}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">API Calls</label>
                      <p className="text-white">{userDetails.user.api_calls_used}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Total Prompts</label>
                      <p className="text-white">{userDetails.stats.promptsCount}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Community Posts</label>
                      <p className="text-white">{userDetails.stats.postsCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => resetUsageMutation.mutate(userDetails.user.id)}
                  disabled={resetUsageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Usage
                </Button>

                <Button
                  onClick={() => setShowEmailDialog(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>

                <Button
                  onClick={() => {
                    const newPassword = prompt("Enter new password:");
                    if (newPassword) {
                      resetPasswordMutation.mutate({ userId: userDetails.user.id, newPassword });
                    }
                  }}
                  disabled={resetPasswordMutation.isPending}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>

                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                      deleteUserMutation.mutate(userDetails.user.id);
                    }
                  }}
                  disabled={deleteUserMutation.isPending}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send an email to {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Subject</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Message</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Email message"
                rows={6}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedUser) {
                    sendEmailMutation.mutate({
                      userId: selectedUser.id,
                      subject: emailSubject,
                      message: emailMessage
                    });
                  }
                }}
                disabled={sendEmailMutation.isPending || !emailSubject || !emailMessage}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
