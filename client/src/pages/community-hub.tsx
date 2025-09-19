import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Eye,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Users,
  Lightbulb,
  Bot,
  Newspaper,
  HelpCircle,
  Star,
  BookOpen,
  Zap,
  Filter,
  User
} from "lucide-react";

interface CommunityPost {
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
}

const categoryConfig = {
  prompt_engineering: {
    label: "Prompt Engineering",
    icon: Lightbulb,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Tips, tricks, and best practices for crafting effective prompts"
  },
  ai_models: {
    label: "AI Models",
    icon: Bot,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Discussions about different AI models and their capabilities"
  },
  ai_news: {
    label: "AI News",
    icon: Newspaper,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "Latest news and updates from the AI world"
  },
  help_support: {
    label: "Help & Support",
    icon: HelpCircle,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    description: "Get help with your AI projects and questions"
  },
  showcase: {
    label: "Showcase",
    icon: Star,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: "Show off your amazing AI-powered projects"
  },
  discussion: {
    label: "Discussion",
    icon: Users,
    color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    description: "General discussions about AI and technology"
  },
  tutorials: {
    label: "Tutorials",
    icon: BookOpen,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    description: "Step-by-step guides and learning resources"
  },
  resources: {
    label: "Resources",
    icon: Zap,
    color: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    description: "Useful tools, links, and resources for AI enthusiasts"
  }
};

export default function CommunityHub() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Fetch community posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community-posts', selectedCategory, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sort', sortBy);
      params.append('limit', '50');

      const res = await apiRequest("GET", `/api/community/posts?${params.toString()}`);
      return res.json();
    }
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to like posts');

      const res = await apiRequest("POST", `/api/community/posts/${postId}/like`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like post",
        variant: "destructive",
      });
    }
  });

  const handleLike = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate(postId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
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

  const filteredPosts = posts.filter((post: any) =>
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some((tag: any) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  AI Community Hub
                </h1>
                <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                  Connect, learn, and share with fellow AI enthusiasts. From prompt engineering to the latest AI news.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/community/create">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Users className="h-5 w-5 mr-2" />
                    Join Community
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search posts, tags, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Liked</option>
                    <option value="trending">Most Viewed</option>
                    <option value="discussed">Most Discussed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
              <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-1 bg-slate-800/50 p-1">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{config.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Posts Grid */}
            <div className="grid gap-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading amazing posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No posts found</h3>
                  <p className="text-slate-400 mb-6">Be the first to start a conversation!</p>
                  <Link href="/community/create">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredPosts.map((post: any) => {
                  const categoryInfo = categoryConfig[post.category as keyof typeof categoryConfig];
                  const CategoryIcon = categoryInfo?.icon || Users;
                  const displayName = getUserDisplayName(post.user, post.is_anonymous);
                  
                  return (
                    <Card key={post.id} className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                              {getUserAvatar(post.user, displayName, post.is_anonymous)}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-200">{displayName}</span>
                                {!post.is_anonymous && post.user.plan !== 'free' && (
                                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                                    {post.user.plan.toUpperCase()}
                                  </Badge>
                                )}
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-400 text-sm">{formatTimeAgo(post.created_at)}</span>
                              </div>
                              <Link href={`/community/post/${post.id}`}>
                                <h3 className="text-lg font-semibold text-slate-100 hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2">
                                  {post.title}
                                </h3>
                              </Link>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${categoryInfo?.color} flex items-center gap-1`}>
                            <CategoryIcon className="h-3 w-3" />
                            {categoryInfo?.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-slate-300 mb-4 line-clamp-3">
                          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                        </p>
                        
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 4).map((tag: any, index: any) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                                +{post.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes_count}
                            </Button>
                            <Link href={`/community/post/${post.id}`}>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {post.comments_count}
                              </Button>
                            </Link>
                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                              <Eye className="h-4 w-4" />
                              {post.views_count}
                            </div>
                          </div>
                          <Link href={`/community/post/${post.id}`}>
                            <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
