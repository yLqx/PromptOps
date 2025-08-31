import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike, addComment } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  MessageSquare, 
  Star, 
  Share2, 
  Send,
  Reply,
  Flag,
  MoreHorizontal,
  Copy,
  Link,
  Twitter,
  Facebook
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface PromptInteractionsProps {
  promptId: string;
  initialLikes: number;
  initialComments: number;
  initialRating: number;
  initialRatingsCount: number;
  userHasLiked?: boolean;
  userRating?: number;
  comments?: any[];
}

export default function PromptInteractions({
  promptId,
  initialLikes,
  initialComments,
  initialRating,
  initialRatingsCount,
  userHasLiked = false,
  userRating = 0,
  comments = []
}: PromptInteractionsProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [rating, setRating] = useState(userRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(userRating);
  const [review, setReview] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Comments will be fetched from the database via the comments prop

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const nowLiked = await toggleLike(promptId, 'prompt');
      return nowLiked;
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      toast({ 
        title: isLiked ? "Removed like" : "Liked prompt!",
        description: isLiked ? "You unliked this prompt" : "Thanks for your feedback!"
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update like", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const _comment = await addComment(content, promptId, 'prompt' as 'prompt' | 'post');
      return _comment;
    },
    onSuccess: () => {
      setNewComment("");
      setCommentsCount(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: [`/api/community/prompts/${promptId}/comments`] });
      toast({ title: "Comment added successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to add comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (data: { rating: number; review?: string }) => {
      const res = await apiRequest("POST", `/api/community/prompts/${promptId}/ratings`, data);
      return res.json();
    },
    onSuccess: () => {
      setRating(newRating);
      setShowRatingDialog(false);
      setReview("");
      queryClient.invalidateQueries({ queryKey: [`/api/community/prompts/${promptId}`] });
      toast({ title: "Rating submitted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to submit rating", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      toast({ title: "Please sign in to like prompts", variant: "destructive" });
      return;
    }
    likeMutation.mutate();
  };

  const handleComment = () => {
    if (!user) {
      toast({ title: "Please sign in to comment", variant: "destructive" });
      return;
    }
    if (!newComment.trim()) {
      toast({ title: "Please enter a comment", variant: "destructive" });
      return;
    }
    commentMutation.mutate(newComment.trim());
  };

  const handleRating = () => {
    if (!user) {
      toast({ title: "Please sign in to rate prompts", variant: "destructive" });
      return;
    }
    if (newRating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    ratingMutation.mutate({ rating: newRating, review: review.trim() || undefined });
  };

  const handleShare = (platform?: string) => {
    const url = `${window.location.origin}/community/prompts/${promptId}`;
    const text = "Check out this amazing prompt on PromptOps!";

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard!" });
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied to clipboard!" });
    }
    setShowShareDialog(false);
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

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "team": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "enterprise": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Interaction Buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-white" : ""}`} />
          {likesCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          {commentsCount}
        </Button>

        <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Star className={`h-4 w-4 mr-1 ${rating > 0 ? "fill-yellow-400 text-yellow-400" : ""}`} />
              {rating > 0 ? rating : "Rate"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate this Prompt</DialogTitle>
              <DialogDescription>
                Share your experience with this prompt to help others
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= (hoverRating || newRating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review">Review (optional)</Label>
                <Textarea
                  id="review"
                  placeholder="Share your thoughts about this prompt..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRating} disabled={ratingMutation.isPending}>
                {ratingMutation.isPending ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this Prompt</DialogTitle>
              <DialogDescription>
                Help others discover this amazing prompt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleShare("copy")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4 mr-2" />
                Share on Facebook
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comments Section */}
      {showComments && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comments ({commentsCount})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            {user && (
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    placeholder="Add a comment... 😊"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="pr-12"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setNewComment(prev => prev + "😊")}
                    >
                      😊
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setNewComment(prev => prev + "👍")}
                    >
                      👍
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setNewComment(prev => prev + "❤️")}
                    >
                      ❤️
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {["🔥", "💯", "🎉", "🤔", "😍", "👏"].map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setNewComment(prev => prev + emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleComment}
                    disabled={commentMutation.isPending || !newComment.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {commentMutation.isPending ? "Posting..." : "Post Comment 🚀"}
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {(comments || []).map((comment: any) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                        {(comment.user?.username || 'Anonymous').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user?.username || 'Anonymous'}</span>
                        <Badge className={`text-xs ${getPlanBadgeColor(comment.user?.plan || 'free')}`}>
                          {comment.user?.plan || 'free'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likesCount}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-11 flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 text-xs font-semibold">
                          {reply.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.user.username}</span>
                          <Badge className={`text-xs ${getPlanBadgeColor(reply.user.plan)}`}>
                            {reply.user.plan}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          {reply.likesCount}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {(!comments || comments.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
