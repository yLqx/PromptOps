import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict validation
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Auth helper functions
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Use server API to get user data (this handles authentication properly)
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Include session cookies
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.log('❌ Server user fetch failed:', response.status);
      return null;
    }

    const userData = await response.json();
    console.log('✅ Server user data:', userData.email, 'Plan:', userData.plan);
    return userData;
  } catch (error) {
    console.error('Error getting current user from server:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(
        error.message.includes('Invalid login credentials')
          ? 'Invalid email or password. Please check your credentials and try again.'
          : error.message.includes('Email not confirmed')
          ? 'Please confirm your email address before logging in.'
          : error.message || 'Login failed. Please try again.'
      );
    }

    return data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, username: string, fullName?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName || ''
        }
      }
    });

    if (error) {
      throw new Error(
        error.message.includes('already registered')
          ? 'An account with this email already exists. Please try logging in instead.'
          : error.message.includes('Password should be')
          ? 'Password must be at least 6 characters long.'
          : error.message || 'Registration failed. Please try again.'
      );
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
    }
  } catch (error) {
    console.error('Signout error:', error);
  }
};

// Database types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  prompts_used: number;
  enhancements_used: number;
  api_calls_used: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  subscription_current_period_end?: string;
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isTeamOwner?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  content: string;
  description?: string;
  category?: string;
  category_id?: string;
  tags: string[];
  visibility: 'private' | 'public' | 'team';
  status?: 'draft' | 'active' | 'archived';
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_via_voice: boolean;
  likes_count: number;
  comments_count: number;
  views_count: number;
  shares_count: number;
  average_rating?: number;
  ratings_count?: number;
  is_anonymous?: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  categoryData?: Category;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: 'prompt' | 'discussion' | 'question' | 'showcase' | 'tutorial';
  prompt_id?: string;
  category_id?: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_pinned: boolean;
  is_anonymous?: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  created_at: string;
  updated_at: string;
  user?: User;
  categoryData?: Category;
  prompt?: Prompt;
}

export interface Comment {
  id: string;
  user_id: string;
  prompt_id?: string;
  post_id?: string;
  parent_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
}

export interface Like {
  id: string;
  user_id: string;
  prompt_id?: string;
  post_id?: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: User;
  following?: User;
}

// Note: Auth helper functions are defined earlier in this file

// Database helper functions
export const getPublicPrompts = async (limit = 20, offset = 0, filters?: {
  search?: string;
  category?: string;
  sortBy?: string;
  tags?: string[];
  minRating?: number;
  minLikes?: number;
  dateRange?: string;
  authorPlan?: string;
  voiceOnly?: boolean;
}) => {
  let query = supabase
    .from('prompts')
    .select('*')
    .eq('visibility', 'public')
    .eq('moderation_status', 'approved');

  // Apply filters
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.minRating && filters.minRating > 0) {
    query = query.gte('average_rating', filters.minRating);
  }

  if (filters?.minLikes && filters.minLikes > 0) {
    query = query.gte('likes_count', filters.minLikes);
  }

  if (filters?.voiceOnly) {
    query = query.eq('created_via_voice', true);
  }

  if (filters?.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let dateFilter = new Date();

    switch (filters.dateRange) {
      case 'today':
        dateFilter.setDate(now.getDate() - 1);
        break;
      case 'week':
        dateFilter.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        dateFilter.setFullYear(now.getFullYear() - 1);
        break;
    }

    if (filters.dateRange !== 'all') {
      query = query.gte('created_at', dateFilter.toISOString());
    }
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case 'trending':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'rating':
      query = query.order('average_rating', { ascending: false });
      break;
    case 'views':
      query = query.order('views_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Prompt[];
};

export const getUserPrompts = async (userId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Prompt[];
};

export const getCommunityPosts = async (limit = 20, offset = 0, filters?: {
  search?: string;
  type?: string;
  sortBy?: string;
  tags?: string[];
  dateRange?: string;
}) => {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('moderation_status', 'approved');

  // Apply filters
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters?.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let dateFilter = new Date();

    switch (filters.dateRange) {
      case 'today':
        dateFilter.setDate(now.getDate() - 1);
        break;
      case 'week':
        dateFilter.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        dateFilter.setFullYear(now.getFullYear() - 1);
        break;
    }

    if (filters.dateRange !== 'all') {
      query = query.gte('created_at', dateFilter.toISOString());
    }
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case 'trending':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'comments':
      query = query.order('comments_count', { ascending: false });
      break;
    case 'views':
      query = query.order('views_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Post[];
};

export const getUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
};

// Get single post by ID
export const getPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data as Post;
};

// Get single prompt by ID
export const getPrompt = async (promptId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single();

  if (error) throw error;
  return data as Prompt;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Category[];
};

// Get user data for community content
export const getUsersData = async (userIds: string[]) => {
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from('users')
    .select('id, username, plan, avatar_url')
    .in('id', userIds);

  if (error) {
    console.warn('Error fetching user data:', error);
    return [];
  }
  return data as User[];
};

// Get real comments for a post or prompt
export const getComments = async (targetId: string, targetType: 'prompt' | 'post') => {
  try {
    const response = await fetch(`/api/community/${targetType}/${targetId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Add a comment
export const addComment = async (targetId: string, targetType: 'prompt' | 'post', content: string) => {
  try {
    const response = await fetch(`/api/community/${targetType}/${targetId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content.trim() }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get trending tags
export const getTrendingTags = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .rpc('get_trending_tags', { tag_limit: limit });

    if (error) {
      console.warn('RPC function not available, falling back to manual query:', error);
      // Fallback: manually get trending tags
      return await getTrendingTagsFallback(limit);
    }
    return data as { tag: string; count: number }[];
  } catch (error) {
    console.warn('Error getting trending tags, using fallback:', error);
    return await getTrendingTagsFallback(limit);
  }
};

// Fallback function to get trending tags manually
const getTrendingTagsFallback = async (limit = 10) => {
  try {
    // Get tags from prompts
    const { data: promptTags } = await supabase
      .from('prompts')
      .select('tags')
      .eq('visibility', 'public')
      .eq('moderation_status', 'approved')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get tags from posts
    const { data: postTags } = await supabase
      .from('posts')
      .select('tags')
      .eq('moderation_status', 'approved')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Combine and count tags
    const tagCounts: Record<string, number> = {};

    [...(promptTags || []), ...(postTags || [])].forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag && tag.trim()) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    // Sort and limit
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in trending tags fallback:', error);
    return [];
  }
};

// Get community stats
export const getCommunityStats = async () => {
  const { data: promptStats, error: promptError } = await supabase
    .from('prompts')
    .select('id, user_id, likes_count, created_at')
    .eq('visibility', 'public')
    .eq('moderation_status', 'approved');

  const { data: postStats, error: postError } = await supabase
    .from('posts')
    .select('id, user_id, likes_count, created_at')
    .eq('moderation_status', 'approved');

  if (promptError || postError) throw promptError || postError;

  const totalPrompts = promptStats?.length || 0;
  const totalPosts = postStats?.length || 0;
  const totalContributors = new Set([
    ...(promptStats?.map(p => p.user_id) || []),
    ...(postStats?.map(p => p.user_id) || [])
  ]).size;
  const totalLikes = (promptStats?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0) +
                    (postStats?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyGrowth = [
    ...(promptStats?.filter(p => new Date(p.created_at) >= weekAgo) || []),
    ...(postStats?.filter(p => new Date(p.created_at) >= weekAgo) || [])
  ].length;

  return {
    totalPrompts,
    totalPosts,
    totalContent: totalPrompts + totalPosts,
    totalContributors,
    totalLikes,
    weeklyGrowth
  };
};

export const createPrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'views_count' | 'shares_count'>) => {
  const { data, error } = await supabase
    .from('prompts')
    .insert(prompt)
    .select()
    .single();

  if (error) throw error;
  return data as Prompt;
};

export const updatePromptDb = async (id: string, updates: Partial<Omit<Prompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('prompts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Prompt;
};

export const deletePromptDb = async (id: string) => {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'views_count' | 'is_pinned'>) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
};

export const toggleLike = async (targetId: string, targetType: 'prompt' | 'post') => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const column = targetType === 'prompt' ? 'prompt_id' : 'post_id';

  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq(column, targetId)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) throw error;

      // Update count in the target table
      const targetTable = targetType === 'prompt' ? 'prompts' : 'posts';
      await supabase.rpc('decrement_likes_count', {
        table_name: targetTable,
        row_id: targetId
      });

      return false;
    } else {
      // Like - insert with proper data types
      const insertData: any = {
        user_id: user.id
      };

      if (targetType === 'prompt') {
        insertData.prompt_id = targetId; // TEXT type
        insertData.post_id = null;
      } else {
        insertData.post_id = targetId; // UUID type
        insertData.prompt_id = null;
      }

      const { error } = await supabase
        .from('likes')
        .insert(insertData);

      if (error) throw error;

      // Update count in the target table
      const targetTable = targetType === 'prompt' ? 'prompts' : 'posts';
      await supabase.rpc('increment_likes_count', {
        table_name: targetTable,
        row_id: targetId
      });

      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};



// Connection test function
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Supabase connection...');

    // First check if we have the required environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return false;
    }

    // Test with a simple query that should work even with empty tables
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};
