-- ✅ PromptOps Complete Supabase SQL Setup
-- Run these commands in your Supabase SQL Editor in order
-- This creates a secure, production-ready database with RLS policies

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create custom types (enums)
DO $$ BEGIN
    CREATE TYPE plan AS ENUM ('free', 'pro', 'team', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prompt_visibility AS ENUM ('private', 'public', 'team');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM ('spam', 'inappropriate', 'copyright', 'harassment', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan plan DEFAULT 'free' NOT NULL,
  prompts_used INTEGER DEFAULT 0 NOT NULL,
  enhancements_used INTEGER DEFAULT 0 NOT NULL,
  bio TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan plan DEFAULT 'team' NOT NULL,
  max_members INTEGER DEFAULT 10 NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Create prompt_categories table
CREATE TABLE IF NOT EXISTS public.prompt_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6B7280' NOT NULL,
  icon TEXT,
  prompts_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' NOT NULL,
  tags TEXT[] DEFAULT '{}',
  visibility prompt_visibility DEFAULT 'private' NOT NULL,
  status status DEFAULT 'draft' NOT NULL,
  moderation_status moderation_status DEFAULT 'pending' NOT NULL,
  created_via_voice BOOLEAN DEFAULT false NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Create prompt_runs table
CREATE TABLE IF NOT EXISTS public.prompt_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR REFERENCES public.prompts(id) ON DELETE SET NULL,
  prompt_content TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  response_time INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Create prompt_likes table
CREATE TABLE IF NOT EXISTS public.prompt_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- 10. Create prompt_comments table
CREATE TABLE IF NOT EXISTS public.prompt_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.prompt_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 11. Create prompt_views table
CREATE TABLE IF NOT EXISTS public.prompt_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 12. Create prompt_reports table
CREATE TABLE IF NOT EXISTS public.prompt_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  description TEXT,
  status moderation_status DEFAULT 'pending' NOT NULL,
  reviewed_by VARCHAR REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 13. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority priority_level DEFAULT 'medium' NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  category TEXT DEFAULT 'general' NOT NULL,
  assigned_to VARCHAR REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 14. Insert default categories
INSERT INTO public.prompt_categories (name, description, color, icon) VALUES
('General', 'General purpose prompts', '#6B7280', '💬'),
('Writing', 'Creative and technical writing', '#10B981', '✍️'),
('Coding', 'Programming and development', '#3B82F6', '💻'),
('Marketing', 'Marketing and advertising', '#F59E0B', '📈'),
('Education', 'Learning and teaching', '#8B5CF6', '🎓'),
('Business', 'Business and productivity', '#EF4444', '💼'),
('Creative', 'Art and creative projects', '#EC4899', '🎨'),
('Research', 'Research and analysis', '#F97316', '🔬')
ON CONFLICT (name) DO NOTHING;

-- 15. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_visibility ON public.prompts(visibility);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON public.prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON public.prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_created_at ON public.prompt_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_prompt ON public.prompt_likes(user_id, prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_prompt_id ON public.prompt_comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_views_prompt_id ON public.prompt_views(prompt_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- 16. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 17. Create helper functions for RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()::VARCHAR
        AND (email LIKE '%@promptops.com' OR email = 'admin@promptops.com')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Create RLS Policies

-- Users policies
CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::VARCHAR = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::VARCHAR = id);

-- Prompts policies
CREATE POLICY "Users can view public prompts" ON public.prompts
  FOR SELECT USING (
    visibility = 'public'
    OR user_id = auth.uid()::VARCHAR
    OR is_admin()
  );

CREATE POLICY "Users can create prompts" ON public.prompts
  FOR INSERT WITH CHECK (user_id = auth.uid()::VARCHAR);

CREATE POLICY "Users can update own prompts" ON public.prompts
  FOR UPDATE USING (user_id = auth.uid()::VARCHAR OR is_admin());

CREATE POLICY "Users can delete own prompts" ON public.prompts
  FOR DELETE USING (user_id = auth.uid()::VARCHAR OR is_admin());

-- Prompt runs policies
CREATE POLICY "Users can view own prompt runs" ON public.prompt_runs
  FOR SELECT USING (user_id = auth.uid()::VARCHAR OR is_admin());

CREATE POLICY "Users can create prompt runs" ON public.prompt_runs
  FOR INSERT WITH CHECK (user_id = auth.uid()::VARCHAR);

-- Prompt likes policies
CREATE POLICY "Users can view all likes" ON public.prompt_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.prompt_likes
  FOR ALL USING (user_id = auth.uid()::VARCHAR);

-- Prompt comments policies
CREATE POLICY "Users can view comments on public prompts" ON public.prompt_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE id = prompt_id
      AND (visibility = 'public' OR user_id = auth.uid()::VARCHAR)
    )
  );

CREATE POLICY "Users can create comments" ON public.prompt_comments
  FOR INSERT WITH CHECK (user_id = auth.uid()::VARCHAR);

CREATE POLICY "Users can update own comments" ON public.prompt_comments
  FOR UPDATE USING (user_id = auth.uid()::VARCHAR OR is_admin());

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (user_id = auth.uid()::VARCHAR OR is_admin());

CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid()::VARCHAR);

-- 19. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON public.prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 20. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 21. Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 22. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ✅ Setup Complete!
-- Your Supabase database is now ready for production!
