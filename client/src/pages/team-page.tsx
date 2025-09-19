import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Mail, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Clock,
  AlertCircle,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function TeamPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Redirect if not team plan
  if (user?.plan !== "team" && user?.plan !== "enterprise") {
    return (
      <div className="min-h-screen bg-black text-gray-100">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="text-center py-20">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Team Management</h1>
              <p className="text-gray-400 mb-6">
                Team management is only available for Team and Enterprise plans.
              </p>
              <Button onClick={() => window.location.href = "/billing"}>
                Upgrade to Team Plan
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fetch team data
  const { data: teamData } = useQuery({
    queryKey: ["/api/team"],
    enabled: user?.plan === "team" || user?.plan === "enterprise"
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["/api/team/members"],
    enabled: user?.plan === "team" || user?.plan === "enterprise"
  });

  const { data: pendingInvitations = [] } = useQuery({
    queryKey: ["/api/team/invitations"],
    enabled: user?.plan === "team" || user?.plan === "enterprise"
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/team/invite", { email });
      return res.json();
    },
    onSuccess: () => {
      setInviteEmail("");
      setIsInviteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/team/invitations"] });
      toast({ title: "Invitation sent successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to send invitation", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await apiRequest("DELETE", `/api/team/members/${memberId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      toast({ title: "Member removed successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to remove member", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const res = await apiRequest("DELETE", `/api/team/invitations/${invitationId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/invitations"] });
      toast({ title: "Invitation cancelled!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to cancel invitation", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Please enter an email address", variant: "destructive" });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    inviteMemberMutation.mutate(inviteEmail);
  };

  const maxMembers = user?.plan === "enterprise" ? "Unlimited" : 10;
  const currentMembers = (teamMembers as any[]).length;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Management</h1>
            <p className="text-gray-400">Manage your team members and invitations</p>
          </div>

          {/* Team Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMembers} / {maxMembers}</div>
                <p className="text-xs text-gray-400 mt-2">
                  Active team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                <Mail className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(pendingInvitations as any[]).length}</div>
                <p className="text-xs text-gray-400 mt-2">
                  Awaiting response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan</CardTitle>
                <Crown className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user?.plan}</div>
                <p className="text-xs text-gray-400 mt-2">
                  Current subscription
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invite New Member */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>
                Send an invitation to add a new member to your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleInviteMember()}
                  />
                </div>
                <Button 
                  onClick={handleInviteMember}
                  disabled={inviteMemberMutation.isPending || (user?.plan === "team" && currentMembers >= 10)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {inviteMemberMutation.isPending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              {user?.plan === "team" && currentMembers >= 10 && (
                <p className="text-sm text-amber-600 mt-2">
                  You've reached the maximum number of team members for your plan. Upgrade to Enterprise for unlimited members.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Current Team Members */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Team Members ({currentMembers})</CardTitle>
              <CardDescription>
                Manage your current team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(teamMembers as any[]).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No team members yet. Invite someone to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(teamMembers as any[]).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {member.username?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.username || member.email}</p>
                          <p className="text-sm text-gray-400">{member.email}</p>
                        </div>
                        {member.isTeamOwner && (
                          <Badge variant="secondary">
                            <Crown className="h-3 w-3 mr-1" />
                            Owner
                          </Badge>
                        )}
                      </div>
                      {!member.isTeamOwner && user?.isTeamOwner && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMemberMutation.mutate(member.id)}
                          disabled={removeMemberMutation.isPending}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {(pendingInvitations as any[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations ({(pendingInvitations as any[]).length})</CardTitle>
                <CardDescription>
                  Invitations waiting for response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pendingInvitations as any[]).map((invitation: any) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-gray-400">
                            Invited {new Date(invitation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelInvitationMutation.mutate(invitation.id)}
                        disabled={cancelInvitationMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
