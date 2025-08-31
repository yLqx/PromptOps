-- Row Level Security (RLS) Policies for PromptOps
-- Run this after creating the schema

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Allow users to insert their own record (for registration)
CREATE POLICY "Users can insert own record" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Prompts table policies
-- Users can only access their own prompts
CREATE POLICY "Users can view own prompts" ON prompts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own prompts" ON prompts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
    FOR DELETE USING (auth.uid()::text = user_id);

-- Prompt runs table policies
-- Users can only access their own prompt runs
CREATE POLICY "Users can view own prompt runs" ON prompt_runs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own prompt runs" ON prompt_runs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own prompt runs" ON prompt_runs
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own prompt runs" ON prompt_runs
    FOR DELETE USING (auth.uid()::text = user_id);

-- Support tickets table policies
-- Users can only access their own support tickets
CREATE POLICY "Users can view own support tickets" ON support_tickets
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own support tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own support tickets" ON support_tickets
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Admin policies (for users with admin role)
-- Note: You'll need to implement a role system or use Supabase's built-in roles

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- You can customize this logic based on your admin system
    -- For now, we'll check if the user has a specific email domain or role
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::text 
        AND (email LIKE '%@monzed.com' OR email = 'admin@promptops.com')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view all records
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all prompts" ON prompts
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all prompt runs" ON prompt_runs
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can view all support tickets" ON support_tickets
    FOR SELECT USING (is_admin());

-- Admin can update support tickets (for admin responses)
CREATE POLICY "Admins can update support tickets" ON support_tickets
    FOR UPDATE USING (is_admin());

-- Create a view for admin dashboard stats
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE plan IN ('pro', 'team')) as active_subscriptions,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
    (SELECT COUNT(*) FROM prompt_runs) as total_api_calls,
    (SELECT COUNT(*) FROM prompts) as total_prompts
WHERE is_admin();

-- Grant access to the admin stats view
GRANT SELECT ON admin_stats TO authenticated;
