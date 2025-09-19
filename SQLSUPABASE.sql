-- PromptOps Complete Supabase SQL Setup
-- Run these commands in your Supabase SQL Editor in order

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create custom types
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'team', 'enterprise');
CREATE TYPE prompt_visibility AS ENUM ('private', 'public', 'team');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE post_type AS ENUM ('prompt', 'discussion', 'question', 'showcase', 'tutorial', 'best_practices', 'general');

-- 3. Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan plan_type DEFAULT 'free' NOT NULL,
  prompts_used INTEGER DEFAULT 0 NOT NULL,
  enhancements_used INTEGER DEFAULT 0 NOT NULL,
  api_calls_used INTEGER DEFAULT 0 NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_current_period_end TIMESTAMP WITH TIME ZONE,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan plan_type DEFAULT 'team' NOT NULL,
  max_members INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- 6. Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7280' NOT NULL,
  icon TEXT DEFAULT '📝',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. Create prompts table
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  tags TEXT[] DEFAULT '{}',
  visibility prompt_visibility DEFAULT 'private' NOT NULL,
  moderation_status moderation_status DEFAULT 'approved' NOT NULL,
  created_via_voice BOOLEAN DEFAULT false NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  shares_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Create community posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type post_type DEFAULT 'discussion' NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  is_pinned BOOLEAN DEFAULT false NOT NULL,
  is_anonymous BOOLEAN DEFAULT false NOT NULL,
  moderation_status moderation_status DEFAULT 'approved' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Create prompt runs table (for testing history)
CREATE TABLE public.prompt_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
  prompt_content TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  response_time INTEGER NOT NULL,
  success BOOLEAN DEFAULT true NOT NULL,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 11. Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT likes_target_check CHECK (
    (prompt_id IS NOT NULL AND post_id IS NULL) OR 
    (prompt_id IS NULL AND post_id IS NOT NULL)
  ),
  UNIQUE(user_id, prompt_id),
  UNIQUE(user_id, post_id)
);

-- 12. Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT comments_target_check CHECK (
    (prompt_id IS NOT NULL AND post_id IS NULL) OR 
    (prompt_id IS NULL AND post_id IS NOT NULL)
  )
);

-- 11. Create views table (for analytics)
CREATE TABLE public.views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT views_target_check CHECK (
    (prompt_id IS NOT NULL AND post_id IS NULL) OR 
    (prompt_id IS NULL AND post_id IS NOT NULL)
  )
);

-- 12. Create follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- 13. Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_visibility ON public.prompts(visibility);
CREATE INDEX idx_prompts_category ON public.prompts(category_id);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_prompt_id ON public.likes(prompt_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_comments_prompt_id ON public.comments(prompt_id);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_views_prompt_id ON public.views(prompt_id);
CREATE INDEX idx_views_post_id ON public.views(post_id);

-- 14. Insert default categories
INSERT INTO public.categories (name, description, color, icon) VALUES
('General', 'General discussions and topics', '#10B981', '💬'),
('AI Models', 'Discussions about AI models and their capabilities', '#10B981', '🤖'),
('Best Practices', 'Share and learn best practices', '#10B981', '⭐'),
('Questions', 'Ask questions and get help from the community', '#10B981', '❓'),
('Showcase', 'Show off your projects and achievements', '#10B981', '🎯'),
('Tutorial', 'Step-by-step guides and tutorials', '#10B981', '📚'),
('Research', 'Research and analysis', '#F97316', '🔬');

-- 15. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 16. Create RLS Policies

-- Users policies
CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Anyone can view teams" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Team owners can update teams" ON public.teams
  FOR UPDATE USING (auth.uid() = owner_id);

-- Team members policies
CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Team owners can manage members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

-- Categories policies (read-only for users)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Prompts policies
CREATE POLICY "Anyone can view public prompts" ON public.prompts
  FOR SELECT USING (visibility = 'public' AND moderation_status = 'approved');

CREATE POLICY "Users can view own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team members can view team prompts" ON public.prompts
  FOR SELECT USING (
    visibility = 'team' 
    AND moderation_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM public.team_members tm1, public.team_members tm2
      WHERE tm1.user_id = auth.uid() 
      AND tm2.user_id = prompts.user_id
      AND tm1.team_id = tm2.team_id
    )
  );

CREATE POLICY "Users can create prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Anyone can view approved posts" ON public.posts
  FOR SELECT USING (moderation_status = 'approved');

CREATE POLICY "Users can view own posts" ON public.posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.likes
  FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Views policies
CREATE POLICY "Users can create views" ON public.views
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON public.follows
  FOR ALL USING (auth.uid() = follower_id);

-- 17. Create functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 19. Create functions for updating counts
CREATE OR REPLACE FUNCTION public.update_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  IF TG_TABLE_NAME = 'likes' THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.prompt_id IS NOT NULL THEN
        UPDATE public.prompts SET likes_count = likes_count + 1 WHERE id = NEW.prompt_id;
      END IF;
      IF NEW.post_id IS NOT NULL THEN
        UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
      END IF;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.prompt_id IS NOT NULL THEN
        UPDATE public.prompts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.prompt_id;
      END IF;
      IF OLD.post_id IS NOT NULL THEN
        UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
      END IF;
      RETURN OLD;
    END IF;
  END IF;

  -- Update comments count
  IF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.prompt_id IS NOT NULL THEN
        UPDATE public.prompts SET comments_count = comments_count + 1 WHERE id = NEW.prompt_id;
      END IF;
      IF NEW.post_id IS NOT NULL THEN
        UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
      END IF;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.prompt_id IS NOT NULL THEN
        UPDATE public.prompts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.prompt_id;
      END IF;
      IF OLD.post_id IS NOT NULL THEN
        UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
      END IF;
      RETURN OLD;
    END IF;
  END IF;

  -- Update views count
  IF TG_TABLE_NAME = 'views' AND TG_OP = 'INSERT' THEN
    IF NEW.prompt_id IS NOT NULL THEN
      UPDATE public.prompts SET views_count = views_count + 1 WHERE id = NEW.prompt_id;
    END IF;
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. Create triggers for count updates
CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_counts();

CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_counts();

CREATE TRIGGER update_views_count
  AFTER INSERT ON public.views
  FOR EACH ROW EXECUTE FUNCTION public.update_counts();

-- 21. Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add Stripe billing columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS api_calls_used INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- ================================
-- SUBSCRIPTION LIMITS TABLE
-- ================================
-- This table defines the limits for each subscription tier
CREATE TABLE IF NOT EXISTS public.subscription_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier plan_type NOT NULL UNIQUE,
  prompts_per_month INTEGER NOT NULL,
  ai_enhancements_per_month INTEGER NOT NULL,
  prompt_slots INTEGER NOT NULL, -- -1 means unlimited
  api_calls_per_month INTEGER DEFAULT -1, -- -1 means unlimited
  max_team_members INTEGER DEFAULT 1,
  priority_support BOOLEAN DEFAULT false,
  custom_integrations BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insert default subscription limits
INSERT INTO public.subscription_limits (tier, prompts_per_month, ai_enhancements_per_month, prompt_slots, api_calls_per_month, max_team_members, priority_support, custom_integrations) VALUES
('free', 15, 5, 25, 50, 1, false, false),
('pro', 1000, 150, 500, 2000, 1, true, false),
('team', 7500, 2000, -1, -1, 10, true, true)
ON CONFLICT (tier) DO UPDATE SET
  prompts_per_month = EXCLUDED.prompts_per_month,
  ai_enhancements_per_month = EXCLUDED.ai_enhancements_per_month,
  prompt_slots = EXCLUDED.prompt_slots,
  api_calls_per_month = EXCLUDED.api_calls_per_month,
  max_team_members = EXCLUDED.max_team_members,
  priority_support = EXCLUDED.priority_support,
  custom_integrations = EXCLUDED.custom_integrations,
  updated_at = NOW();

-- ================================
-- PASSWORD RESET TOKENS TABLE
-- ================================

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for password reset tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires);

-- ================================
-- ADMIN AUTHENTICATION SYSTEM
-- ================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '["users", "content", "analytics"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_logs(created_at);

-- Setup complete! Your Supabase database is ready for PromptOps.
