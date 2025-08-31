import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery } from "@tanstack/react-query";
import { getPublicPrompts, getCategories, getUserPosts, getCommunityPosts, getCommunityStats, getTrendingTags, getUsersData, toggleLike } from "@/lib/supabase";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import PromptDetailModal from "@/components/community/prompt-detail-modal";
import UserProfileCard from "@/components/profile/user-profile-card";
import AdvancedFilters from "@/components/community/advanced-filters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Heart,
  MessageSquare,
  Star,
  Share2,
  Eye,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  Grid3X3,
  List,
  Plus,
  Flame,
  Award,
  BookOpen,
  RefreshCw,
  User
} from "lucide-react";
import { CreatePostDialog } from "@/components/community/create-post-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CommunityPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [showPromptDetail, setShowPromptDetail] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [activeTab, setActiveTab] = useState("all");
  const [contentType, setContentType] = useState<"all" | "prompts" | "posts">("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            handleRefresh();
            break;
          case 'f':
            e.preventDefault();
            (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Create filters object for queries
  const filters = {
    search: searchQuery,
    category: selectedCategory,
    sortBy,
    ...advancedFilters
  };

  // Fetch real community prompts from Supabase with filters
  const { data: communityPrompts = [], isLoading: loadingPrompts, error: promptsError } = useQuery({
    queryKey: ["community-prompts", filters, currentPage, refreshKey],
    queryFn: () => getPublicPrompts(itemsPerPage, (currentPage - 1) * itemsPerPage, filters),
    staleTime: 300000, // 5 minutes - longer cache for better performance
  });

  // Fetch real categories from Supabase
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 600000, // 10 minutes
  });

  // Fetch community posts with filters
  const { data: communityPosts = [], isLoading: loadingCommunityPosts, error: postsError } = useQuery({
    queryKey: ["community-posts", filters, currentPage, refreshKey],
    queryFn: () => getCommunityPosts(itemsPerPage, (currentPage - 1) * itemsPerPage, {
      search: searchQuery,
      type: contentType === "all" || contentType === "prompts" ? undefined : contentType,
      sortBy,
      ...advancedFilters
    }),
    staleTime: 300000, // 5 minutes
  });

  // Fetch user's own posts
  const { data: userPosts = [], isLoading: loadingUserPosts } = useQuery({
    queryKey: ["user-posts", user?.id, refreshKey],
    queryFn: () => user ? getUserPosts(user.id) : [],
    enabled: !!user && activeTab === "my-posts",
    staleTime: 30000,
  });

  // Fetch community stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["community-stats", refreshKey],
    queryFn: getCommunityStats,
    staleTime: 60000, // 1 minute
  });

  // Fetch trending tags
  const { data: trendingTags = [], isLoading: loadingTags } = useQuery({
    queryKey: ["trending-tags"],
    queryFn: () => getTrendingTags(10),
    staleTime: 300000, // 5 minutes
  });

  // Combine prompts and posts for display with fallback user data
  const displayContent = [
    // Map prompts with fallback user data (only show if contentType is "all" or "prompts")
    ...(contentType === "all" || contentType === "prompts" ? communityPrompts.map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      description: p.description || p.title,
      category: p.category || 'general',
      tags: p.tags || [],
      user: {
        id: p.user_id,
        username: p.user?.username || p.users?.username || 'Anonymous',
        plan: p.user?.plan || p.users?.plan || 'free',
        avatar_url: p.user?.avatar_url || p.users?.avatar_url || null,
        full_name: p.user?.full_name || p.users?.full_name || null,
        email: p.user?.email || p.users?.email || null
      },
      likesCount: p.likes_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      viewsCount: p.views_count ?? 0,
      averageRating: p.average_rating ?? 0,
      ratingsCount: p.ratings_count ?? 0,
      createdAt: p.created_at,
      createdViaVoice: p.created_via_voice ?? false,
      type: 'prompt',
      visibility: p.visibility,
      status: p.status
    })) : []),
    // Map posts with fallback user data (filter by contentType)
    ...(contentType === "prompts" ? [] : communityPosts
      .filter((p: any) => contentType === "all" || p.type === contentType)
      .map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      description: p.content.length > 100 ? p.content.substring(0, 100) + '...' : p.content,
      category: 'discussion',
      tags: p.tags || [],
      user: {
        id: p.user_id,
        username: p.is_anonymous ? 'Anonymous' : (p.user?.username || p.users?.username || 'Community Member'),
        plan: p.user?.plan || p.users?.plan || 'free',
        avatar_url: p.user?.avatar_url || p.users?.avatar_url || null,
        full_name: p.user?.full_name || p.users?.full_name || null,
        email: p.user?.email || p.users?.email || null
      },
      likesCount: p.likes_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      viewsCount: p.views_count ?? 0,
      averageRating: 0,
      ratingsCount: 0,
      createdAt: p.created_at,
      createdViaVoice: false,
      type: 'post',
      postType: p.type
    })))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Map data to UI-friendly shape with real counts
  const displayCategories = [
    { name: 'all', count: displayContent.length, color: '#6B7280' },
    ...categories.map(c => ({
      name: c.name,
      count: displayContent.filter(p => p.category === c.name).length,
      color: c.color || '#6B7280'
    }))
  ];

  // Use real stats from API or calculate from current data as fallback
  const displayStats = stats || {
    totalPrompts: communityPrompts.length,
    totalPosts: communityPosts.length,
    totalContent: communityPrompts.length + communityPosts.length,
    totalContributors: new Set([
      ...communityPrompts.map(p => p.user?.id).filter(Boolean),
      ...communityPosts.map(p => p.user?.id).filter(Boolean)
    ]).size,
    totalLikes: [...communityPrompts, ...communityPosts].reduce((sum, p) => sum + (p.likes_count || 0), 0),
    weeklyGrowth: [...communityPrompts, ...communityPosts].filter(p => {
      const createdDate = new Date(p.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length
  };

  // Apply additional client-side filtering for advanced filters
  const filteredContent = displayContent.filter(item => {
    // Basic filters are already applied in the API calls
    // Apply any additional client-side filters here if needed
    if (advancedFilters.tags && advancedFilters.tags.length > 0) {
      const hasMatchingTag = advancedFilters.tags.some(tag =>
        item.tags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) return false;
    }

    if (advancedFilters.authorPlan && advancedFilters.authorPlan !== 'all') {
      if (item.user.plan !== advancedFilters.authorPlan) return false;
    }

    if (advancedFilters.voiceOnly && !item.createdViaVoice) {
      return false;
    }

    return true;
  });

  // Content is already sorted by the API, but we can apply additional sorting if needed
  const sortedContent = [...filteredContent];

  // Utility functions
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays}d ago`;
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "team": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "enterprise": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getTypeIcon = (type: string, postType?: string) => {
    if (type === 'prompt') return "🎯";
    switch (postType) {
      case 'question': return "❓";
      case 'showcase': return "🎨";
      case 'discussion': return "💬";
      default: return "📝";
    }
  };

  const getTypeBadgeColor = (type: string, postType?: string) => {
    if (type === 'prompt') return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    switch (postType) {
      case 'question': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'showcase': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'discussion': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'general': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'tutorial': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'best_practices': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  // Event handlers
  const handleItemClick = (item: any) => {
    handleViewPost(item);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentPage(1); // Reset to first page
    toast({
      title: "Refreshing content...",
      description: "Getting the latest community updates",
    });
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleShare = async (item: any) => {
    const url = `${window.location.origin}/community/${item.type}/${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
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

  const handleTagClick = (tag: string) => {
    setSearchQuery(`#${tag}`);
    toast({
      title: "Filter applied",
      description: `Showing content tagged with #${tag}`,
    });
  };

  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set());

  // Helper function to get display name for user
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

  // Helper function to get user avatar
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
      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        {displayName.charAt(0).toUpperCase()}
      </span>
    );
  };

  const handleLike = async (item: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = likedItems.has(item.id);
      const newLikedItems = new Set(likedItems);
      const newLikeCounts = { ...likeCounts };

      if (isLiked) {
        newLikedItems.delete(item.id);
        newLikeCounts[item.id] = Math.max(0, (newLikeCounts[item.id] || item.likesCount || 0) - 1);
      } else {
        newLikedItems.add(item.id);
        newLikeCounts[item.id] = (newLikeCounts[item.id] || item.likesCount || 0) + 1;
      }

      setLikedItems(newLikedItems);
      setLikeCounts(newLikeCounts);

      await toggleLike(item.id, item.type);
      toast({
        title: isLiked ? "Unliked" : "Liked! ❤️",
        description: isLiked ? "Removed from your liked content" : "Added to your liked content",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedItems(likedItems);
      setLikeCounts(likeCounts);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewPost = async (item: any) => {
    try {
      // Only track view if not already viewed
      if (!viewedItems.has(item.id)) {
        // Update local state immediately for better UX
        const newViewCounts = { ...viewCounts };
        newViewCounts[item.id] = (newViewCounts[item.id] || item.viewsCount || 0) + 1;
        setViewCounts(newViewCounts);
        setViewedItems(new Set([...viewedItems, item.id]));

        // Track view on server
        await fetch(`/api/community/${item.type}s/${item.id}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Navigate to post detail
      if (item.type === 'post') {
        window.location.href = `/community/post/${item.id}`;
      } else {
        setSelectedPrompt(item);
        setShowPromptDetail(true);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
      // Still navigate even if view tracking fails
      if (item.type === 'post') {
        window.location.href = `/community/post/${item.id}`;
      } else {
        setSelectedPrompt(item);
        setShowPromptDetail(true);
      }
    }
  };

  const isLoading = loadingPrompts || loadingCommunityPosts || loadingStats;
  const hasError = promptsError || postsError;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex h-screen pt-16">
        <Sidebar />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />
                  Community Hub
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Discover, share, and collaborate on amazing prompts and discussions
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  💡 Tip: Press Ctrl+R to refresh content, Ctrl+F to focus search
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-700/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="question">Questions</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="best_practices">Best Practices</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <CreatePostDialog>
                    <Button className="flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="text-sm">Create Post</span>
                    </Button>
                  </CreatePostDialog>

                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-2 sm:px-3"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-2 sm:px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {hasError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load community content. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="my-posts" disabled={!user}>My Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        <div>
                          {loadingStats ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{displayStats.totalContent}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Total Content</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-500" />
                        <div>
                          {loadingStats ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{displayStats.totalPrompts}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Prompts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <div>
                          {loadingStats ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{displayStats.totalContributors}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Contributors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div>
                          {loadingStats ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{displayStats.totalLikes}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Total Likes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <div>
                          {loadingStats ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">+{displayStats.weeklyGrowth}</p>
                          )}
                          <p className="text-sm text-muted-foreground">This Week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <div>
                          {loadingTags ? (
                            <Skeleton className="h-6 w-12" />
                          ) : (
                            <p className="text-2xl font-bold">{trendingTags.length}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Hot Tags</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trending Tags */}
                {!loadingTags && trendingTags.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Trending Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {trendingTags.slice(0, 10).map((tag) => (
                          <Badge
                            key={tag.tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => handleTagClick(tag.tag)}
                          >
                            #{tag.tag} ({tag.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Advanced Filters */}
                <AdvancedFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={displayCategories}
                  onApplyFilters={setAdvancedFilters}
                />

                {/* Loading State */}
                {isLoading && (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Content Grid/List */}
                {!isLoading && (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {sortedContent.map((item) => (
                      <Link key={item.id} href={`/community/post/${item.id}`}>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg hover:shadow-lg hover:border-emerald-500/50 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]">
                        {/* Forum-style header */}
                        <div className="p-4 border-b border-slate-700/50">
                          <div className="flex items-start gap-3">
                            {/* User Avatar */}
                            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              {getUserAvatar(item.user, getUserDisplayName(item.user, item.is_anonymous))}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title and Type */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-emerald-500/30 text-emerald-400"
                                  >
                                    {getTypeIcon(item.type, item.type)} {item.type === 'prompt' ? 'Prompt' : item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Post'}
                                  </Badge>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                                {item.description}
                              </p>

                              {/* User info and metadata */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium text-emerald-400">
                                      {getUserDisplayName(item.user, item.is_anonymous)}
                                    </span>
                                    {!item.is_anonymous && item.user.plan !== 'free' && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-emerald-500/30 text-emerald-400"
                                      >
                                        {item.user.plan.toUpperCase()}
                                      </Badge>
                                    )}
                                  </div>
                                  <span>•</span>
                                  <span>{formatTimeAgo(item.createdAt)}</span>
                                  {item.category && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="capitalize">{item.category}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Forum-style footer with stats and tags */}
                        <div className="px-4 pb-4">
                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900 dark:hover:text-emerald-300 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTagClick(tag);
                                  }}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Forum-style stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              {/* Like Button */}
                              <button
                                className={`flex items-center gap-1 transition-colors ${
                                  likedItems.has(item.id)
                                    ? 'text-red-400 hover:text-red-300'
                                    : 'hover:text-red-400'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(item);
                                }}
                              >
                                <Heart className={`h-4 w-4 ${
                                  likedItems.has(item.id) ? 'fill-red-400 text-red-400' : ''
                                }`} />
                                <span>{likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likesCount || 0}</span>
                              </button>

                              {/* Comments */}
                              <div className="flex items-center gap-1 text-slate-400">
                                <MessageSquare className="h-4 w-4" />
                                <span>{item.commentsCount || 0}</span>
                              </div>

                              {/* Views */}
                              <div className="flex items-center gap-1 text-slate-400">
                                <Eye className="h-4 w-4" />
                                <span>{viewCounts[item.id] !== undefined ? viewCounts[item.id] : item.viewsCount || 0}</span>
                              </div>

                              {/* Rating for prompts */}
                              {item.type === 'prompt' && (
                                <div className="flex items-center gap-1 text-emerald-400">
                                  <Star className="h-4 w-4 fill-emerald-400" />
                                  <span>{item.averageRating?.toFixed(1) || '0.0'}</span>
                                </div>
                              )}
                            </div>

                            {/* Last activity indicator */}
                            <div className="text-xs text-emerald-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {!isLoading && sortedContent.length > 0 && sortedContent.length >= itemsPerPage && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="min-w-32"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Load More
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && sortedContent.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setAdvancedFilters({});
                      }}>
                        Clear Filters
                      </Button>
                      <CreatePostDialog>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Post
                        </Button>
                      </CreatePostDialog>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                {/* Trending Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Trending Posts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Hot This Week
                      </CardTitle>
                      <CardDescription>
                        Most liked and commented content from the past 7 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sortedContent
                            .filter(item => {
                              const weekAgo = new Date();
                              weekAgo.setDate(weekAgo.getDate() - 7);
                              return new Date(item.createdAt) >= weekAgo;
                            })
                            .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
                            .slice(0, 5)
                            .map((item, index) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                onClick={() => handleItemClick(item)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.likesCount} likes • {item.commentsCount} comments
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeIcon(item.type, item.type)}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Contributors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Top Contributors
                      </CardTitle>
                      <CardDescription>
                        Most active community members this month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(
                            sortedContent.reduce((acc, item) => {
                              const userId = item.user.id;
                              if (!acc[userId]) {
                                acc[userId] = {
                                  user: item.user,
                                  posts: 0,
                                  likes: 0
                                };
                              }
                              acc[userId].posts++;
                              acc[userId].likes += item.likesCount;
                              return acc;
                            }, {} as Record<string, any>)
                          )
                            .sort(([,a], [,b]) => (b.posts + b.likes) - (a.posts + a.likes))
                            .slice(0, 5)
                            .map(([userId, data], index) => (
                              <div key={userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center overflow-hidden">
                                  {data.user.avatar_url ? (
                                    <img
                                      src={data.user.avatar_url}
                                      alt={data.user.username}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                      {data.user.username.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{data.user.username}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {data.posts} posts • {data.likes} likes received
                                  </p>
                                </div>
                                <Badge className={getPlanBadgeColor(data.user.plan)}>
                                  {data.user.plan}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="my-posts" className="space-y-6">
                {!user ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sign in to view your posts</h3>
                    <p className="text-muted-foreground mb-4">
                      Create an account to start sharing your prompts with the community!
                    </p>
                    <Button asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* My Posts Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">My Posts</h2>
                        <p className="text-muted-foreground">Manage your posts and prompts</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreatePostDialog>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                          </Button>
                        </CreatePostDialog>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-emerald-500" />
                            <div>
                              <p className="text-2xl font-bold">{userPosts.length}</p>
                              <p className="text-sm text-muted-foreground">Total Posts</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="text-2xl font-bold">
                                {userPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
                              </p>
                              <p className="text-sm text-muted-foreground">Total Likes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-2xl font-bold">
                                {userPosts.reduce((sum, post) => sum + (post.comments_count || 0), 0)}
                              </p>
                              <p className="text-sm text-muted-foreground">Total Comments</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-2xl font-bold">
                                {userPosts.reduce((sum, post) => sum + (post.views_count || 0), 0)}
                              </p>
                              <p className="text-sm text-muted-foreground">Total Views</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* My Posts Grid */}
                    {loadingUserPosts ? (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-20 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : userPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start sharing your prompts with the community!
                        </p>
                        <CreatePostDialog>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Post
                          </Button>
                        </CreatePostDialog>
                      </div>
                    ) : (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {userPosts.map((post) => (
                          <Card
                            key={post.id}
                            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                            onClick={() => {
                              window.location.href = `/community/post/${post.id}`;
                            }}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                                    <span className="text-lg">{getTypeIcon('post', post.type)}</span>
                                    {post.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1 line-clamp-2">
                                    {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                                  </CardDescription>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`ml-2 text-xs ${getTypeBadgeColor('post', post.type)}`}
                                >
                                  {post.type}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    {post.likes_count || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    {post.comments_count || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {post.views_count || 0}
                                  </span>
                                </div>
                                <span>{formatTimeAgo(post.created_at)}</span>
                              </div>

                              {/* Tags */}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {post.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{post.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={selectedPrompt}
        isOpen={showPromptDetail}
        onClose={() => setShowPromptDetail(false)}
      />
    </div>
  );
}
