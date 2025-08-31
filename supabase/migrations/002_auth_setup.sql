-- Authentication setup and user management
-- This sets up Supabase Auth integration

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, password)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    'auth_managed' -- Password is managed by Supabase Auth
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create a function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Create function to get current user
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS public.users AS $$
BEGIN
  RETURN (
    SELECT users.*
    FROM public.users
    WHERE users.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = user_id
    AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is team owner
CREATE OR REPLACE FUNCTION public.is_team_owner(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = user_id
    AND users.is_team_owner = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's team members
CREATE OR REPLACE FUNCTION public.get_team_members(user_id UUID DEFAULT auth.uid())
RETURNS SETOF public.users AS $$
DECLARE
  user_team_id UUID;
BEGIN
  SELECT team_id INTO user_team_id
  FROM public.users
  WHERE id = user_id;
  
  IF user_team_id IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT users.*
  FROM public.users
  WHERE users.team_id = user_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(user_id UUID, target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_team_id UUID;
  target_team_id UUID;
BEGIN
  SELECT team_id INTO user_team_id FROM public.users WHERE id = user_id;
  SELECT team_id INTO target_team_id FROM public.users WHERE id = target_user_id;
  
  RETURN user_team_id IS NOT NULL 
    AND target_team_id IS NOT NULL 
    AND user_team_id = target_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user plan
CREATE OR REPLACE FUNCTION public.update_user_plan(
  user_id UUID,
  new_plan plan_type,
  stripe_customer_id TEXT DEFAULT NULL,
  stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET
    plan = new_plan,
    stripe_customer_id = COALESCE(update_user_plan.stripe_customer_id, users.stripe_customer_id),
    stripe_subscription_id = COALESCE(update_user_plan.stripe_subscription_id, users.stripe_subscription_id),
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment usage counters
CREATE OR REPLACE FUNCTION public.increment_usage(
  user_id UUID,
  usage_type TEXT,
  amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
BEGIN
  IF usage_type = 'prompts' THEN
    UPDATE public.users
    SET prompts_used = prompts_used + amount
    WHERE id = user_id;
  ELSIF usage_type = 'enhancements' THEN
    UPDATE public.users
    SET enhancements_used = enhancements_used + amount
    WHERE id = user_id;
  ELSE
    RETURN FALSE;
  END IF;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset monthly usage
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET
    prompts_used = 0,
    enhancements_used = 0,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  user_id UUID,
  usage_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan plan_type;
  current_usage INTEGER;
  limit_value INTEGER;
BEGIN
  SELECT plan INTO user_plan FROM public.users WHERE id = user_id;
  
  IF usage_type = 'prompts' THEN
    SELECT prompts_used INTO current_usage FROM public.users WHERE id = user_id;
    CASE user_plan
      WHEN 'free' THEN limit_value := 15;
      WHEN 'pro' THEN limit_value := 1000;
      WHEN 'team' THEN limit_value := 7500;
      WHEN 'enterprise' THEN RETURN TRUE; -- Unlimited
    END CASE;
  ELSIF usage_type = 'enhancements' THEN
    SELECT enhancements_used INTO current_usage FROM public.users WHERE id = user_id;
    CASE user_plan
      WHEN 'free' THEN limit_value := 5;
      WHEN 'pro' THEN limit_value := 150;
      WHEN 'team' THEN limit_value := 2000;
      WHEN 'enterprise' THEN RETURN TRUE; -- Unlimited
    END CASE;
  ELSE
    RETURN FALSE;
  END IF;
  
  RETURN current_usage < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'prompts_created', (SELECT COUNT(*) FROM prompts WHERE prompts.user_id = get_user_stats.user_id),
    'prompts_shared', (SELECT COUNT(*) FROM prompts WHERE prompts.user_id = get_user_stats.user_id AND visibility = 'public'),
    'total_likes', (SELECT COALESCE(SUM(likes_count), 0) FROM prompts WHERE prompts.user_id = get_user_stats.user_id),
    'total_comments', (SELECT COALESCE(SUM(comments_count), 0) FROM prompts WHERE prompts.user_id = get_user_stats.user_id),
    'total_views', (SELECT COALESCE(SUM(views_count), 0) FROM prompts WHERE prompts.user_id = get_user_stats.user_id),
    'voice_prompts_created', (SELECT COUNT(*) FROM prompts WHERE prompts.user_id = get_user_stats.user_id AND created_via_voice = true),
    'average_rating', (SELECT COALESCE(AVG(average_rating), 0) FROM prompts WHERE prompts.user_id = get_user_stats.user_id AND ratings_count > 0)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
