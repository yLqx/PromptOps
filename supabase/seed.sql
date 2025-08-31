-- Seed data for PromptOps development
-- This file contains sample data for testing and development

-- Insert sample users (these will be created through Supabase Auth in real usage)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@promptops.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
), (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'john@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "john_doe"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
), (
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'jane@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "jane_smith"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding users in public.users table
INSERT INTO public.users (id, username, email, password, plan, prompts_used, enhancements_used) VALUES
('11111111-1111-1111-1111-111111111111', 'admin', 'admin@promptops.com', 'auth_managed', 'enterprise', 0, 0),
('22222222-2222-2222-2222-222222222222', 'john_doe', 'john@example.com', 'auth_managed', 'pro', 5, 2),
('33333333-3333-3333-3333-333333333333', 'jane_smith', 'jane@example.com', 'auth_managed', 'free', 3, 1);

-- Insert sample team
INSERT INTO teams (id, name, owner_id, plan, max_members) VALUES
('44444444-4444-4444-4444-444444444444', 'Development Team', '22222222-2222-2222-2222-222222222222', 'team', 10);

-- Update user to be part of team
UPDATE public.users SET team_id = '44444444-4444-4444-4444-444444444444', is_team_owner = true WHERE id = '22222222-2222-2222-2222-222222222222';

-- Insert sample prompts
INSERT INTO prompts (id, user_id, title, content, description, category, tags, visibility, status, moderation_status, created_via_voice, likes_count, comments_count, views_count, average_rating, ratings_count) VALUES
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Creative Writing Assistant', 'Help me write a compelling story about a time traveler who gets stuck in the past. Include character development, plot twists, and emotional depth. Make it engaging and thought-provoking.', 'Perfect for generating creative fiction and storytelling ideas', 'creative', ARRAY['writing', 'fiction', 'creative', 'storytelling'], 'public', 'active', 'approved', false, 45, 12, 234, 4.8, 15),

('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Marketing Copy Generator', 'Create compelling marketing copy for [PRODUCT/SERVICE]. Focus on benefits, address pain points, include a strong call-to-action, and make it conversion-focused. Target audience: [AUDIENCE].', 'Generate high-converting marketing content for any product', 'marketing', ARRAY['marketing', 'copywriting', 'sales', 'conversion'], 'public', 'active', 'approved', true, 78, 23, 456, 4.9, 28),

('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Code Review Assistant', 'Review this code and provide detailed feedback on: 1) Code quality and best practices 2) Potential bugs or issues 3) Performance optimizations 4) Security considerations 5) Suggestions for improvement', 'Get detailed code reviews and improvement suggestions', 'coding', ARRAY['programming', 'review', 'debugging', 'optimization'], 'public', 'active', 'approved', false, 32, 8, 189, 4.6, 12),

('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Business Strategy Planner', 'Help me develop a comprehensive business strategy for [BUSINESS TYPE]. Include market analysis, competitive positioning, revenue streams, growth opportunities, and risk assessment.', 'Strategic business planning and analysis tool', 'business', ARRAY['strategy', 'planning', 'analysis', 'growth'], 'public', 'active', 'approved', false, 56, 15, 298, 4.7, 18),

('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Educational Content Creator', 'Create educational content about [TOPIC] for [GRADE LEVEL/AUDIENCE]. Make it engaging, interactive, and include examples, exercises, and assessment questions.', 'Design comprehensive educational materials', 'education', ARRAY['education', 'teaching', 'learning', 'curriculum'], 'team', 'active', 'approved', true, 24, 6, 145, 4.5, 8);

-- Insert sample likes
INSERT INTO prompt_likes (user_id, prompt_id) VALUES
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'),
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555'),
('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666'),
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666');

-- Insert sample comments
INSERT INTO prompt_comments (user_id, prompt_id, content, likes_count) VALUES
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'This is an amazing prompt! Really helped me with my creative writing project. The structure and guidance are perfect.', 5),
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Love the creativity here. Could you add more examples for different genres?', 2),
('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Great for marketing campaigns! Used this for our product launch and saw great results.', 8),
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Very thorough code review process. Helped me catch several issues I missed.', 3);

-- Insert sample ratings
INSERT INTO prompt_ratings (user_id, prompt_id, rating, review) VALUES
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 5, 'Excellent prompt for creative writing. Very detailed and helpful.'),
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 5, 'Perfect structure and guidance for storytelling.'),
('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 5, 'Outstanding marketing prompt. Highly effective for conversions.'),
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 5, 'Great for creating compelling copy quickly.'),
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 4, 'Very useful for code reviews. Could use more security focus.'),
('11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 5, 'Comprehensive code review assistant. Saves a lot of time.');

-- Insert sample prompt runs
INSERT INTO prompt_runs (user_id, prompt_id, model, input, output, tokens_used, cost, duration_ms, status) VALUES
('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'gpt-4', 'Write a story about a time traveler stuck in medieval times', 'Marcus clutched the broken temporal device, its circuits sparking uselessly in the dim candlelight of the monastery cell...', 1250, 0.025, 3500, 'completed'),
('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'gpt-3.5-turbo', 'Create marketing copy for a new fitness app', 'Transform Your Body, Transform Your Life! Discover the fitness app that adapts to YOU...', 890, 0.012, 2100, 'completed');

-- Insert sample views
INSERT INTO prompt_views (user_id, prompt_id, ip_address) VALUES
('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '192.168.1.1'),
('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '192.168.1.2'),
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', '192.168.1.3'),
(NULL, '55555555-5555-5555-5555-555555555555', '192.168.1.4'), -- Anonymous view
(NULL, '66666666-6666-6666-6666-666666666666', '192.168.1.5'); -- Anonymous view

-- Insert sample support tickets
INSERT INTO support_tickets (user_id, subject, description, status, priority, category) VALUES
('22222222-2222-2222-2222-222222222222', 'Voice prompt not working', 'The voice-to-text feature is not capturing my speech correctly. It seems to cut off after a few seconds.', 'open', 'medium', 'technical'),
('33333333-3333-3333-3333-333333333333', 'Billing question', 'I was charged twice for my Pro subscription this month. Can you please help resolve this?', 'in_progress', 'high', 'billing'),
('22222222-2222-2222-2222-222222222222', 'Feature request', 'Would love to see integration with Google Docs for easier prompt management and collaboration.', 'open', 'low', 'feature_request');

-- Update category counts based on actual prompts
UPDATE prompt_categories SET prompts_count = (
  SELECT COUNT(*) FROM prompts 
  WHERE prompts.category = prompt_categories.name 
  AND visibility = 'public' 
  AND moderation_status = 'approved'
);
