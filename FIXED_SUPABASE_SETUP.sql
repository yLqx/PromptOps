-- ✅ FIXED PromptOps Supabase SQL Setup
-- Run these commands in your Supabase SQL Editor in order
-- This fixes all schema mismatches and ensures proper authentication

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create custom types (using proper enum syntax)
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

-- 3. Create teams table first (referenced by users)
CREATE TABLE IF NOT EXISTS public.teams (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name TEXT NOT NULL,
  owner_id VARCHAR NOT NULL,
  plan plan DEFAULT 'team' NOT NULL,
  max_members INTEGER DEFAULT 10 NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create users table (extends auth.users but with all required fields)
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

-- 5. Add foreign key constraint for teams.owner_id
ALTER TABLE public.teams 
ADD CONSTRAINT teams_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 6. Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  team_id VARCHAR NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 7. Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' NOT NULL,
  tags TEXT[] DEFAULT '{}' NOT NULL,
  visibility prompt_visibility DEFAULT 'private' NOT NULL,
  status status DEFAULT 'draft' NOT NULL,
  moderation_status moderation_status DEFAULT 'pending' NOT NULL,
  created_via_voice BOOLEAN DEFAULT false NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  shares_count INTEGER DEFAULT 0 NOT NULL,
  average_rating REAL DEFAULT 0 NOT NULL,
  ratings_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. Create prompt_runs table
CREATE TABLE IF NOT EXISTS public.prompt_runs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_id VARCHAR REFERENCES public.prompts(id) ON DELETE SET NULL,
  prompt_content TEXT NOT NULL,
  model TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 0 NOT NULL,
  cost REAL DEFAULT 0 NOT NULL,
  duration INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  user_id VARCHAR NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. Create categories table (for community features)
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 11. Insert default categories
INSERT INTO public.categories (name, description, color) VALUES
('general', 'General prompts and discussions', '#6366f1'),
('creative', 'Creative writing and content generation', '#ec4899'),
('business', 'Business and professional prompts', '#059669'),
('technical', 'Technical and programming prompts', '#dc2626'),
('education', 'Educational and learning prompts', '#7c3aed'),
('marketing', 'Marketing and advertising prompts', '#ea580c')
ON CONFLICT (name) DO NOTHING;

-- 12. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::VARCHAR = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid()::VARCHAR = id);

-- 14. Create RLS policies for prompts table
CREATE POLICY "Users can view public prompts" ON public.prompts
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid()::VARCHAR);

CREATE POLICY "Users can manage their own prompts" ON public.prompts
  FOR ALL USING (user_id = auth.uid()::VARCHAR);

-- 15. Create RLS policies for prompt_runs table
CREATE POLICY "Users can manage their own prompt runs" ON public.prompt_runs
  FOR ALL USING (user_id = auth.uid()::VARCHAR);

-- 16. Create RLS policies for support_tickets table
CREATE POLICY "Users can manage their own support tickets" ON public.support_tickets
  FOR ALL USING (user_id = auth.uid()::VARCHAR);

-- 17. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, full_name, avatar_url)
  VALUES (
    NEW.id::VARCHAR,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 19. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_visibility ON public.prompts(visibility);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON public.prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);

-- 20. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ✅ Setup complete! Your database is now properly configured for PromptOps.
