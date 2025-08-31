import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Globe, Calendar, Heart, MessageSquare, Star, Eye } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  plan: string;
  prompts_used: number;
  created_at: string;
}

interface UserPrompt {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  visibility: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  average_rating: number;
  created_at: string;
  created_via_voice: boolean;
}

export default function UserProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("prompts");

  const { data: userProfile, isLoading: loadingProfile } = useQuery<UserProfile>({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!username
  });

  const { data: userPrompts = [], isLoading: loadingPrompts } = useQuery<UserPrompt[]>({
    queryKey: ["user-prompts", userProfile?.id],
    queryFn: async () => {
      if (!userProfile) return [];
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'team': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'enterprise': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <p>Loading user profile...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
                <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  const totalLikes = userPrompts.reduce((sum, prompt) => sum + prompt.likes_count, 0);
  const totalViews = userPrompts.reduce((sum, prompt) => sum + prompt.views_count, 0);
  const avgRating = userPrompts.length > 0 
    ? userPrompts.reduce((sum, prompt) => sum + prompt.average_rating, 0) / userPrompts.length 
    : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userProfile.avatar_url} alt={userProfile.username} />
                      <AvatarFallback className="text-2xl">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{userProfile.full_name || userProfile.username}</h1>
                        <Badge className={getPlanBadgeColor(userProfile.plan)}>
                          {userProfile.plan.charAt(0).toUpperCase() + userProfile.plan.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xl text-muted-foreground">@{userProfile.username}</p>
                    </div>

                    {userProfile.bio && (
                      <p className="text-foreground">{userProfile.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {userProfile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {userProfile.location}
                        </div>
                      )}
                      {userProfile.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={userProfile.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {userProfile.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {formatTimeAgo(userProfile.created_at)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{userPrompts.length}</p>
                        <p className="text-sm text-muted-foreground">Prompts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{totalLikes}</p>
                        <p className="text-sm text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{totalViews}</p>
                        <p className="text-sm text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompts">Public Prompts ({userPrompts.length})</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="prompts" className="space-y-4">
                {loadingPrompts ? (
                  <div className="text-center py-8">
                    <p>Loading prompts...</p>
                  </div>
                ) : userPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No public prompts yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userPrompts.map((prompt) => (
                      <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                              {prompt.description && (
                                <CardDescription className="mt-1 line-clamp-2">
                                  {prompt.description}
                                </CardDescription>
                              )}
                            </div>
                            {prompt.created_via_voice && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                🎤 Professional
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-muted-foreground capitalize">{prompt.category}</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {prompt.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {prompt.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {prompt.likes_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {prompt.comments_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {prompt.average_rating}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {prompt.views_count}
                              </div>
                            </div>
                            <div className="text-xs">
                              {formatTimeAgo(prompt.created_at)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Activity feed coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
