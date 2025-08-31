import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery } from "@tanstack/react-query";
import { getPost, getPrompt, getComments, addComment, toggleLike } from "@/lib/supabase";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Star,
  Share2,
  Eye,
  ArrowLeft,
  Send,
  User,
  Smile,
  Reply
} from "lucide-react";
import { Link } from "wouter";

export default function PostDetailPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const params = useParams();
  const [, setLocation] = useLocation();
  
  const { type, id } = params as { type: 'post' | 'prompt'; id: string };
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Popular emojis for quick access
  const popularEmojis = ['😊', '👍', '❤️', '🔥', '💯', '🎉', '🤔', '😍', '👏', '🚀'];

  // Helper functions
  const getUserDisplayName = (user: any, isAnonymous: boolean = false) => {
    if (isAnonymous) return 'Anonymous';
    if (user?.full_name && user.full_name.trim() !== '' && user.full_name !== 'User') {
      return user.full_name;
    }
    if (user?.username && user.username.trim() !== '') {
      return user.username;
    }
    if (user?.email && user.email.trim() !== '') {
      return user.email.split('@')[0];
    }
    return 'Community Member';
  };

  const getUserAvatar = (user: any, displayName: string) => {
    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
        {displayName.charAt(0).toUpperCase()}
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  // Fetch the post or prompt
  const { data: content, isLoading: loadingContent, error: contentError } = useQuery({
    queryKey: [type, id],
    queryFn: () => type === 'post' ? getPost(id) : getPrompt(id),
    enabled: !!id && !!user,
  });

  // Fetch comments
  const { data: comments = [], isLoading: loadingComments, refetch: refetchComments } = useQuery({
    queryKey: ['comments', type, id],
    queryFn: () => getComments(id, type),
    enabled: !!id && !!user,
  });

  const handleEmojiClick = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleLike = async () => {
    if (!user || !content) return;

    try {
      // Update local state immediately for better UX
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

      const liked = await toggleLike(content.id, type);
      toast({
        title: liked ? "Liked!" : "Unliked",
        description: liked ? "Added to your liked content" : "Removed from your liked content",
      });
    } catch (error) {
      // Revert local state on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);

      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !content) return;

    setIsSubmittingComment(true);
    try {
      await addComment(content.id, type, newComment);
      setNewComment("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
      refetchComments();
      toast({
        title: "Comment added!",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loadingContent) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (contentError || !content) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The {type} you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/community">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Community
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-4 text-emerald-400 hover:text-emerald-300">
              <Link href="/community">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Link>
            </Button>

            {/* Forum-style Main Post */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {getUserAvatar(content.user, getUserDisplayName(content.user, content.is_anonymous))}
                  </div>

                  {/* Post Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-100">
                        {content.title}
                      </h1>
                      <Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400">
                        {type === 'post' ? content.type || 'Post' : 'Prompt'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-emerald-400">
                          {getUserDisplayName(content.user, content.is_anonymous)}
                        </span>
                        <Badge variant="secondary" className="text-xs bg-emerald-900 text-emerald-300">
                          {content.user?.plan || 'free'}
                        </Badge>
                      </div>
                      <span>•</span>
                      <span>{formatTimeAgo(content.created_at)}</span>
                      {content.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{content.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100">
                  <p className="whitespace-pre-wrap leading-relaxed">{content.content}</p>
                </div>

                {/* Tags */}
                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {content.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Forum-style Actions Bar */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 transition-colors ${
                        isLiked
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                      <span className="font-medium">{likeCount || content.likes_count || 0}</span>
                    </button>

                    {/* Comments Count */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">{comments.length}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">{content.views_count || 0}</span>
                    </div>

                    {/* Rating for prompts */}
                    {type === 'prompt' && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{content.average_rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    )}
                  </div>

                  {/* Share Button */}
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-gray-100">
                  Comments ({comments.length})
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Add Comment Form */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {getUserAvatar(user, getUserDisplayName(user))}
                    </div>

                    {/* Comment Input */}
                    <div className="flex-1 space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="min-h-[100px] resize-none"
                        maxLength={1000}
                      />

                      {/* Comment Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Emoji Picker */}
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <Smile className="h-4 w-4" />
                            </Button>

                            {showEmojiPicker && (
                              <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <div className="grid grid-cols-5 gap-2">
                                  {popularEmojis.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleEmojiClick(emoji)}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <span className="text-xs text-gray-500">
                            {newComment.length}/1000
                          </span>
                        </div>

                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isSubmittingComment}
                          size="sm"
                        >
                          {isSubmittingComment ? (
                            "Posting..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Post Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                  {loadingComments ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse flex gap-4">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                      <p>Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          {/* Comment Avatar */}
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {getUserAvatar(comment.user, getUserDisplayName(comment.user, comment.is_anonymous))}
                          </div>

                          {/* Comment Content */}
                          <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              {/* Comment Header */}
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  {getUserDisplayName(comment.user, comment.is_anonymous)}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {comment.user?.plan || 'free'}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimeAgo(comment.created_at)}
                                </span>
                              </div>

                              {/* Comment Text */}
                              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 mt-2 ml-4">
                              <button
                                onClick={() => setReplyingTo(comment.id)}
                                className="text-xs text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              >
                                <Reply className="h-3 w-3 inline mr-1" />
                                Reply
                              </button>
                              <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                                <Heart className="h-3 w-3 inline mr-1" />
                                Like
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
