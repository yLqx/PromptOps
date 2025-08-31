import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Eye,
  ArrowLeft,
  Send,
  User,
  Calendar,
  Tag,
  Lightbulb,
  Bot,
  Newspaper,
  HelpCircle,
  Star,
  Users,
  BookOpen,
  Zap
} from "lucide-react";

const categoryConfig = {
  prompt_engineering: { label: "Prompt Engineering", icon: Lightbulb, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  ai_models: { label: "AI Models", icon: Bot, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  ai_news: { label: "AI News", icon: Newspaper, color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  help_support: { label: "Help & Support", icon: HelpCircle, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  showcase: { label: "Showcase", icon: Star, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  discussion: { label: "Discussion", icon: Users, color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
  tutorials: { label: "Tutorials", icon: BookOpen, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  resources: { label: "Resources", icon: Zap, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" }
};

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    plan: string;
  };
  user_has_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    plan: string;
  };
}

export default function CommunityPostDetail() {
  const { id } = useParams();
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch post details
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['community-post', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');

      const res = await apiRequest("GET", `/api/community/posts/${id}`);
      return res.json();
    },
    enabled: !!id
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['community-comments', id],
    queryFn: async () => {
      if (!id) return [];

      const res = await apiRequest("GET", `/api/community/posts/${id}/comments`);
      return res.json();
    },
    enabled: !!id
  });

  // Track view when component mounts
  useEffect(() => {
    if (id && user) {
      apiRequest("POST", `/api/community/posts/${id}/view`)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['community-post', id] });
        })
        .catch(console.error);
    }
  }, [id, user, queryClient]);

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error('Must be logged in to like posts');

      const res = await apiRequest("POST", `/api/community/posts/${id}/like`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-post', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    }
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !id) throw new Error('Must be logged in to comment');

      const res = await apiRequest("POST", `/api/community/posts/${id}/comments`, {
        content: content.trim()
      });
      return res.json();
    },
    onSuccess: () => {
      setNewComment("");
      setIsSubmittingComment(false);
      queryClient.invalidateQueries({ queryKey: ['community-comments', id] });
      queryClient.invalidateQueries({ queryKey: ['community-post', id] });
      toast({
        title: "Comment Added! 💬",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error: any) => {
      setIsSubmittingComment(false);
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  });

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    commentMutation.mutate(newComment);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = (user: any, isAnonymous: boolean) => {
    if (isAnonymous) return "Anonymous";
    return user?.full_name || user?.email?.split('@')[0] || "Unknown User";
  };

  const getUserAvatar = (user: any, displayName: string, isAnonymous: boolean) => {
    if (isAnonymous) {
      return (
        <div className="w-full h-full bg-slate-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-slate-300" />
        </div>
      );
    }

    if (user?.avatar_url) {
      return <AvatarImage src={user.avatar_url} alt={displayName} />;
    }
    
    return (
      <AvatarFallback className="bg-emerald-600 text-white">
        {displayName.charAt(0).toUpperCase()}
      </AvatarFallback>
    );
  };

  const renderFormattedContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-emerald-300 italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-emerald-300 px-1 py-0.5 rounded text-sm">$1</code>')
      .split('\n')
      .map((line, index) => (
        <p key={index} className="mb-3 last:mb-0" dangerouslySetInnerHTML={{ __html: line || '<br>' }} />
      ));
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-8 w-32" />
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <div className="flex h-screen pt-16">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setLocation('/community')}
                className="mb-4 text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-2 text-white">Post Not Found</h2>
                  <p className="text-slate-400">The post you're looking for doesn't exist or has been removed.</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(post.user, post.is_anonymous);
  const categoryInfo = categoryConfig[post.category as keyof typeof categoryConfig];
  const CategoryIcon = categoryInfo?.icon || Users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => setLocation('/community')}
              className="mb-4 text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>

            {/* Post Content */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {getUserAvatar(post.user, displayName, post.is_anonymous)}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{displayName}</span>
                        {!post.is_anonymous && post.user.plan !== 'free' && (
                          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                            {post.user.plan.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${categoryInfo?.color} flex items-center gap-1`}>
                    <CategoryIcon className="h-3 w-3" />
                    {categoryInfo?.label}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">{post.title}</h1>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-slate prose-invert max-w-none text-slate-300 leading-relaxed">
                  {renderFormattedContent(post.content)}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={likeMutation.isPending}
                      className={`flex items-center gap-2 transition-colors ${
                        post.user_has_liked 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
                      {post.likes_count}
                    </Button>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MessageSquare className="h-4 w-4" />
                      {post.comments_count}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Eye className="h-4 w-4" />
                      {post.views_count}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleComment} className="space-y-3">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isSubmittingComment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Post Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 border border-slate-700/50 rounded-lg bg-slate-700/20">
                    <p className="text-slate-400 mb-3">Please log in to join the conversation</p>
                    <Button
                      onClick={() => setLocation('/login')}
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Log In
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment: Comment) => {
                      const commentDisplayName = getUserDisplayName(comment.user, false);
                      return (
                        <div key={comment.id} className="flex space-x-3 p-4 bg-slate-700/30 rounded-lg">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            {getUserAvatar(comment.user, commentDisplayName, false)}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-slate-200">{commentDisplayName}</span>
                              {comment.user.plan !== 'free' && (
                                <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                                  {comment.user.plan.toUpperCase()}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-400">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <div className="prose prose-slate prose-invert prose-sm max-w-none text-slate-300">
                              {renderFormattedContent(comment.content)}
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-red-400 h-auto p-1"
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                {comment.likes_count}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
