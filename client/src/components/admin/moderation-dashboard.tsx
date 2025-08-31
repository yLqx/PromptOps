import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Flag,
  Clock,
  User,
  MessageSquare,
  Star,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ModerationDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | ''>('');
  const [moderationReason, setModerationReason] = useState('');

  // Fetch moderation queue
  const { data: moderationQueue = [] } = useQuery({
    queryKey: ["/api/admin/moderation/queue"],
  });

  // Fetch moderation stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/moderation/stats"],
  });

  // Mock data for demonstration
  const mockQueue = [
    {
      id: "1",
      type: "prompt",
      title: "Advanced Marketing Strategy",
      content: "Create a comprehensive marketing strategy for...",
      author: { username: "marketer123", plan: "pro" },
      status: "pending",
      severity: "medium",
      reasons: ["Contains suspicious keywords: hack, exploit"],
      confidence: 0.6,
      createdAt: "2024-01-15T10:00:00Z",
      reportCount: 2
    },
    {
      id: "2",
      type: "comment",
      content: "This prompt is amazing! Really helped with my project.",
      author: { username: "developer456", plan: "free" },
      status: "flagged",
      severity: "low",
      reasons: ["User reported for spam"],
      confidence: 0.8,
      createdAt: "2024-01-14T15:30:00Z",
      reportCount: 1
    }
  ];

  const mockStats = {
    totalReviewed: 1247,
    pendingReview: 23,
    approvedToday: 45,
    rejectedToday: 8,
    averageReviewTime: "2.3 minutes",
    flaggedContent: 12
  };

  // Moderation action mutation
  const moderationMutation = useMutation({
    mutationFn: async (data: { itemId: string; action: string; reason?: string }) => {
      const res = await apiRequest("POST", "/api/admin/moderation/action", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/moderation/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/moderation/stats"] });
      setShowDetailModal(false);
      setSelectedItem(null);
      setModerationAction('');
      setModerationReason('');
      toast({ title: "Moderation action completed successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to complete moderation action", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleModerationAction = () => {
    if (!moderationAction) {
      toast({ title: "Please select an action", variant: "destructive" });
      return;
    }

    moderationMutation.mutate({
      itemId: selectedItem.id,
      action: moderationAction,
      reason: moderationReason.trim() || undefined
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      case "flagged": return <Flag className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Content Moderation
          </h2>
          <p className="text-muted-foreground">
            Review and moderate community content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.pendingReview}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.approvedToday}</p>
                <p className="text-xs text-muted-foreground">Approved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.rejectedToday}</p>
                <p className="text-xs text-muted-foreground">Rejected Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.flaggedContent}</p>
                <p className="text-xs text-muted-foreground">Flagged Content</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.totalReviewed}</p>
                <p className="text-xs text-muted-foreground">Total Reviewed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockStats.averageReviewTime}</p>
                <p className="text-xs text-muted-foreground">Avg Review Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          <TabsTrigger value="recent">Recent Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {mockQueue.filter(item => item.status === "pending").map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <span className="font-medium">{item.title || `${item.type} content`}</span>
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                      {item.reportCount > 0 && (
                        <Badge variant="outline">
                          <Flag className="h-3 w-3 mr-1" />
                          {item.reportCount} reports
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.author.username}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(item.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Confidence: {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-orange-600">
                        Reasons: {item.reasons.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetailModal(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          {mockQueue.filter(item => item.status === "flagged").map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <span className="font-medium">{item.title || `${item.type} content`}</span>
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity}
                      </Badge>
                      <Badge variant="destructive">
                        <Flag className="h-3 w-3 mr-1" />
                        {item.reportCount} reports
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.author.username}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(item.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-red-600">
                        Reasons: {item.reasons.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDetailModal(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Recent moderation actions will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Review</DialogTitle>
            <DialogDescription>
              Review and take action on this content
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Content</h4>
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  {selectedItem.content}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Author</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.author.username}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Severity</h4>
                  <Badge className={getSeverityColor(selectedItem.severity)}>
                    {selectedItem.severity}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Moderation Reasons</h4>
                <ul className="text-sm text-muted-foreground">
                  {selectedItem.reasons.map((reason: string, index: number) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Action</h4>
                <Select value={moderationAction} onValueChange={(value) => setModerationAction(value as 'approve' | 'reject' | '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="request_changes">Request Changes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reason (optional)</h4>
                <Textarea
                  placeholder="Provide a reason for your decision..."
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleModerationAction}
              disabled={moderationMutation.isPending || !moderationAction}
            >
              {moderationMutation.isPending ? "Processing..." : "Submit Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
