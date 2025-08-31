-- Sample data for PromptOps (Optional)
-- Run this to populate your database with test data

-- Insert sample users
INSERT INTO users (id, username, email, password, plan, prompts_used, enhancements_used) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo_user', 'demo@example.com', '$2b$10$demo_hash_here', 'free', 5, 2),
('550e8400-e29b-41d4-a716-446655440001', 'pro_user', 'pro@example.com', '$2b$10$demo_hash_here', 'pro', 25, 10),
('550e8400-e29b-41d4-a716-446655440002', 'admin_user', 'admin@monzed.com', '$2b$10$demo_hash_here', 'team', 100, 50);

-- Insert sample prompts
INSERT INTO prompts (id, user_id, title, content, description, status) VALUES
('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Creative Writing Prompt', 'Write a creative story about {topic} in {style} style. Make it engaging and {length} long.', 'A versatile prompt for creative writing tasks', 'active'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Code Review Helper', 'Review this {language} code and provide suggestions for improvement:\n\n{code}\n\nFocus on: {focus_areas}', 'Helps with code review and optimization', 'active'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Marketing Copy Generator', 'Create compelling marketing copy for {product} targeting {audience}. The tone should be {tone} and highlight {benefits}.', 'Generate marketing content', 'draft'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Email Template', 'Write a professional email about {subject} to {recipient}. The purpose is to {purpose} and the tone should be {tone}.', 'Professional email writing assistant', 'active');

-- Insert sample prompt runs
INSERT INTO prompt_runs (id, user_id, prompt_id, prompt_content, response, model, response_time, success, error) VALUES
('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Write a creative story about space exploration in sci-fi style. Make it engaging and short long.', 'In the year 2157, Captain Maya Chen stood at the observation deck of the starship Horizon, watching as the twin suns of Kepler-442 painted the cosmos in brilliant gold...', 'gpt-4', 1500, true, null),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', 'Review this JavaScript code and provide suggestions for improvement:\n\nfunction getData() {\n  return fetch("/api/data").then(res => res.json())\n}\n\nFocus on: error handling, async/await', 'Here are my suggestions for improving this code:\n\n1. **Add Error Handling**: The current code doesn''t handle potential errors...\n2. **Use Async/Await**: Consider converting to async/await syntax for better readability...', 'gpt-4', 2100, true, null),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Create compelling marketing copy for AI writing tool targeting content creators. The tone should be exciting and highlight productivity benefits.', 'Unlock Your Creative Potential with AI-Powered Writing!\n\nTired of staring at blank pages? Our revolutionary AI writing tool transforms your ideas into compelling content in seconds...', 'gpt-3.5-turbo', 1200, true, null),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 'Write a professional email about project deadline extension to project manager. The purpose is to request additional time and the tone should be respectful.', 'Subject: Request for Project Deadline Extension\n\nDear [Project Manager Name],\n\nI hope this email finds you well. I am writing to discuss the current timeline for [Project Name]...', 'gpt-4', 1800, true, null);

-- Insert sample support tickets
INSERT INTO support_tickets (id, user_id, subject, description, priority, category, status, admin_response) VALUES
('850e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'API Rate Limit Issues', 'I''m experiencing rate limit errors when making API calls. The error occurs after about 10 requests per minute.', 'medium', 'technical', 'in_progress', 'Thank you for reporting this issue. We''re investigating the rate limiting behavior and will update you soon.'),
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Billing Question', 'I was charged twice for my pro subscription this month. Can you please check my billing history?', 'high', 'billing', 'open', null),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Feature Request: Prompt Templates', 'It would be great to have pre-built prompt templates for common use cases like emails, blog posts, etc.', 'low', 'feature', 'closed', 'Great suggestion! We''ve added this to our roadmap and will consider it for the next major release.');

-- Update some timestamps to make data more realistic
UPDATE prompt_runs SET created_at = NOW() - INTERVAL '1 day' WHERE id = '750e8400-e29b-41d4-a716-446655440000';
UPDATE prompt_runs SET created_at = NOW() - INTERVAL '2 hours' WHERE id = '750e8400-e29b-41d4-a716-446655440001';
UPDATE prompt_runs SET created_at = NOW() - INTERVAL '30 minutes' WHERE id = '750e8400-e29b-41d4-a716-446655440002';

UPDATE support_tickets SET created_at = NOW() - INTERVAL '3 days' WHERE id = '850e8400-e29b-41d4-a716-446655440000';
UPDATE support_tickets SET created_at = NOW() - INTERVAL '1 day' WHERE id = '850e8400-e29b-41d4-a716-446655440001';
UPDATE support_tickets SET created_at = NOW() - INTERVAL '1 week' WHERE id = '850e8400-e29b-41d4-a716-446655440002';
