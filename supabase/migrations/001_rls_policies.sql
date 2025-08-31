-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Teams table policies
CREATE POLICY "Team members can view their team" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.team_id = teams.id
    )
  );

CREATE POLICY "Team owners can update their team" ON teams
  FOR UPDATE USING (owner_id = auth.uid()::text);

CREATE POLICY "Team owners can delete their team" ON teams
  FOR DELETE USING (owner_id = auth.uid()::text);

-- Team invitations policies
CREATE POLICY "Team owners can manage invitations" ON team_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_invitations.team_id 
      AND teams.owner_id = auth.uid()::text
    )
  );

CREATE POLICY "Invited users can view their invitations" ON team_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.email = team_invitations.email
    )
  );

-- Prompts table policies
CREATE POLICY "Users can view public prompts" ON prompts
  FOR SELECT USING (
    visibility = 'public' 
    AND moderation_status = 'approved'
  );

CREATE POLICY "Users can view their own prompts" ON prompts
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Team members can view team prompts" ON prompts
  FOR SELECT USING (
    visibility = 'team' 
    AND moderation_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM users u1, users u2
      WHERE u1.id = auth.uid()::text 
      AND u2.id = prompts.user_id
      AND u1.team_id = u2.team_id
      AND u1.team_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create prompts" ON prompts
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own prompts" ON prompts
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own prompts" ON prompts
  FOR DELETE USING (user_id = auth.uid()::text);

-- Prompt runs policies
CREATE POLICY "Users can view their own prompt runs" ON prompt_runs
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create prompt runs" ON prompt_runs
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Prompt likes policies
CREATE POLICY "Users can view likes on public prompts" ON prompt_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_likes.prompt_id 
      AND (prompts.visibility = 'public' OR prompts.user_id = auth.uid()::text)
      AND prompts.moderation_status = 'approved'
    )
  );

CREATE POLICY "Users can manage their own likes" ON prompt_likes
  FOR ALL USING (user_id = auth.uid()::text);

-- Prompt comments policies
CREATE POLICY "Users can view comments on accessible prompts" ON prompt_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_comments.prompt_id 
      AND (
        prompts.visibility = 'public' 
        OR prompts.user_id = auth.uid()::text
        OR (
          prompts.visibility = 'team' 
          AND EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.id = auth.uid()::text 
            AND u2.id = prompts.user_id
            AND u1.team_id = u2.team_id
            AND u1.team_id IS NOT NULL
          )
        )
      )
      AND prompts.moderation_status = 'approved'
    )
  );

CREATE POLICY "Users can create comments on accessible prompts" ON prompt_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_comments.prompt_id 
      AND (
        prompts.visibility = 'public' 
        OR prompts.user_id = auth.uid()::text
        OR (
          prompts.visibility = 'team' 
          AND EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.id = auth.uid()::text 
            AND u2.id = prompts.user_id
            AND u1.team_id = u2.team_id
            AND u1.team_id IS NOT NULL
          )
        )
      )
      AND prompts.moderation_status = 'approved'
    )
  );

CREATE POLICY "Users can update their own comments" ON prompt_comments
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own comments" ON prompt_comments
  FOR DELETE USING (user_id = auth.uid()::text);

-- Prompt ratings policies
CREATE POLICY "Users can view ratings on accessible prompts" ON prompt_ratings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_ratings.prompt_id 
      AND (
        prompts.visibility = 'public' 
        OR prompts.user_id = auth.uid()::text
        OR (
          prompts.visibility = 'team' 
          AND EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.id = auth.uid()::text 
            AND u2.id = prompts.user_id
            AND u1.team_id = u2.team_id
            AND u1.team_id IS NOT NULL
          )
        )
      )
      AND prompts.moderation_status = 'approved'
    )
  );

CREATE POLICY "Users can manage their own ratings" ON prompt_ratings
  FOR ALL USING (user_id = auth.uid()::text);

-- Prompt reports policies
CREATE POLICY "Users can create reports" ON prompt_reports
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own reports" ON prompt_reports
  FOR SELECT USING (user_id = auth.uid()::text);

-- Prompt views policies (for analytics)
CREATE POLICY "Users can create views" ON prompt_views
  FOR INSERT WITH CHECK (
    user_id = auth.uid()::text OR user_id IS NULL
  );

-- Prompt categories policies (read-only for users)
CREATE POLICY "Anyone can view categories" ON prompt_categories
  FOR SELECT USING (true);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can create support tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own tickets" ON support_tickets
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Admin policies (for users with admin role)
CREATE POLICY "Admins can view all data" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
    )
  );

CREATE POLICY "Admins can manage all prompts" ON prompts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
    )
  );

CREATE POLICY "Admins can manage all support tickets" ON support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
    )
  );

CREATE POLICY "Admins can manage all reports" ON prompt_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
    )
  );

-- Functions for common checks
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = user_id
    AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_access_prompt(prompt_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = prompt_id
    AND (
      prompts.visibility = 'public'
      OR prompts.user_id = user_id
      OR (
        prompts.visibility = 'team'
        AND EXISTS (
          SELECT 1 FROM users u1, users u2
          WHERE u1.id = user_id
          AND u2.id = prompts.user_id
          AND u1.team_id = u2.team_id
          AND u1.team_id IS NOT NULL
        )
      )
      OR is_admin(user_id)
    )
    AND (prompts.moderation_status = 'approved' OR prompts.user_id = user_id OR is_admin(user_id))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_prompt_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update likes count
    IF TG_TABLE_NAME = 'prompt_likes' THEN
      UPDATE prompts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.prompt_id;
    END IF;
    
    -- Update comments count
    IF TG_TABLE_NAME = 'prompt_comments' THEN
      UPDATE prompts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.prompt_id;
    END IF;
    
    -- Update views count
    IF TG_TABLE_NAME = 'prompt_views' THEN
      UPDATE prompts 
      SET views_count = views_count + 1 
      WHERE id = NEW.prompt_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    -- Update likes count
    IF TG_TABLE_NAME = 'prompt_likes' THEN
      UPDATE prompts 
      SET likes_count = GREATEST(likes_count - 1, 0) 
      WHERE id = OLD.prompt_id;
    END IF;
    
    -- Update comments count
    IF TG_TABLE_NAME = 'prompt_comments' THEN
      UPDATE prompts 
      SET comments_count = GREATEST(comments_count - 1, 0) 
      WHERE id = OLD.prompt_id;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_prompt_likes_count
  AFTER INSERT OR DELETE ON prompt_likes
  FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

CREATE TRIGGER update_prompt_comments_count
  AFTER INSERT OR DELETE ON prompt_comments
  FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

CREATE TRIGGER update_prompt_views_count
  AFTER INSERT ON prompt_views
  FOR EACH ROW EXECUTE FUNCTION update_prompt_stats();

-- Update ratings average
CREATE OR REPLACE FUNCTION update_prompt_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prompts 
  SET 
    average_rating = (
      SELECT AVG(rating)::REAL 
      FROM prompt_ratings 
      WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
    ),
    ratings_count = (
      SELECT COUNT(*) 
      FROM prompt_ratings 
      WHERE prompt_id = COALESCE(NEW.prompt_id, OLD.prompt_id)
    )
  WHERE id = COALESCE(NEW.prompt_id, OLD.prompt_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prompt_rating_stats
  AFTER INSERT OR UPDATE OR DELETE ON prompt_ratings
  FOR EACH ROW EXECUTE FUNCTION update_prompt_rating();
