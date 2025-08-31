#!/usr/bin/env tsx
// Seed sample data for development and testing

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres';

console.log('🌱 Starting data seeding...');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function seedSampleData() {
  try {
    console.log('👥 Creating sample users...');
    await createSampleUsers();
    
    console.log('🏢 Creating sample teams...');
    await createSampleTeams();
    
    console.log('📝 Creating sample prompts...');
    await createSamplePrompts();
    
    console.log('💬 Creating sample interactions...');
    await createSampleInteractions();
    
    console.log('🎫 Creating sample support tickets...');
    await createSampleTickets();
    
    console.log('✅ Sample data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createSampleUsers() {
  // Insert sample users
  await db.execute(sql`
    INSERT INTO users (id, username, email, password, plan, prompts_used, enhancements_used) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@promptops.com', 'hashed_password', 'enterprise', 0, 0),
    ('22222222-2222-2222-2222-222222222222', 'john_doe', 'john@example.com', 'hashed_password', 'pro', 5, 2),
    ('33333333-3333-3333-3333-333333333333', 'jane_smith', 'jane@example.com', 'hashed_password', 'free', 3, 1),
    ('44444444-4444-4444-4444-444444444444', 'mike_wilson', 'mike@example.com', 'hashed_password', 'team', 12, 8),
    ('55555555-5555-5555-5555-555555555555', 'sarah_jones', 'sarah@example.com', 'hashed_password', 'pro', 8, 5)
    ON CONFLICT (id) DO NOTHING
  `);
}

async function createSampleTeams() {
  // Insert sample team
  await db.execute(sql`
    INSERT INTO teams (id, name, owner_id, plan, max_members) VALUES
    ('66666666-6666-6666-6666-666666666666', 'Development Team', '44444444-4444-4444-4444-444444444444', 'team', 10)
    ON CONFLICT (id) DO NOTHING
  `);

  // Update user to be part of team
  await db.execute(sql`
    UPDATE users SET 
      team_id = '66666666-6666-6666-6666-666666666666', 
      is_team_owner = true 
    WHERE id = '44444444-4444-4444-4444-444444444444'
  `);

  // Add another team member
  await db.execute(sql`
    UPDATE users SET 
      team_id = '66666666-6666-6666-6666-666666666666', 
      is_team_owner = false 
    WHERE id = '55555555-5555-5555-5555-555555555555'
  `);
}

async function createSamplePrompts() {
  // Insert sample prompts
  await db.execute(sql`
    INSERT INTO prompts (
      id, user_id, title, content, description, category, tags, 
      visibility, status, moderation_status, created_via_voice, 
      likes_count, comments_count, views_count, average_rating, ratings_count
    ) VALUES
    (
      '77777777-7777-7777-7777-777777777777',
      '22222222-2222-2222-2222-222222222222',
      'Creative Writing Assistant',
      'Help me write a compelling story about a time traveler who gets stuck in the past. Include character development, plot twists, and emotional depth. Make it engaging and thought-provoking.',
      'Perfect for generating creative fiction and storytelling ideas',
      'creative',
      ARRAY['writing', 'fiction', 'creative', 'storytelling'],
      'public',
      'active',
      'approved',
      false,
      45, 12, 234, 4.8, 15
    ),
    (
      '88888888-8888-8888-8888-888888888888',
      '33333333-3333-3333-3333-333333333333',
      'Marketing Copy Generator',
      'Create compelling marketing copy for [PRODUCT/SERVICE]. Focus on benefits, address pain points, include a strong call-to-action, and make it conversion-focused. Target audience: [AUDIENCE].',
      'Generate high-converting marketing content for any product',
      'marketing',
      ARRAY['marketing', 'copywriting', 'sales', 'conversion'],
      'public',
      'active',
      'approved',
      true,
      78, 23, 456, 4.9, 28
    ),
    (
      '99999999-9999-9999-9999-999999999999',
      '22222222-2222-2222-2222-222222222222',
      'Code Review Assistant',
      'Review this code and provide detailed feedback on: 1) Code quality and best practices 2) Potential bugs or issues 3) Performance optimizations 4) Security considerations 5) Suggestions for improvement',
      'Get detailed code reviews and improvement suggestions',
      'coding',
      ARRAY['programming', 'review', 'debugging', 'optimization'],
      'public',
      'active',
      'approved',
      false,
      32, 8, 189, 4.6, 12
    ),
    (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      '44444444-4444-4444-4444-444444444444',
      'Business Strategy Planner',
      'Help me develop a comprehensive business strategy for [BUSINESS TYPE]. Include market analysis, competitive positioning, revenue streams, growth opportunities, and risk assessment.',
      'Strategic business planning and analysis tool',
      'business',
      ARRAY['strategy', 'planning', 'analysis', 'growth'],
      'public',
      'active',
      'approved',
      false,
      56, 15, 298, 4.7, 18
    ),
    (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      '55555555-5555-5555-5555-555555555555',
      'Educational Content Creator',
      'Create educational content about [TOPIC] for [GRADE LEVEL/AUDIENCE]. Make it engaging, interactive, and include examples, exercises, and assessment questions.',
      'Design comprehensive educational materials',
      'education',
      ARRAY['education', 'teaching', 'learning', 'curriculum'],
      'team',
      'active',
      'approved',
      true,
      24, 6, 145, 4.5, 8
    ),
    (
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      '33333333-3333-3333-3333-333333333333',
      'Personal Productivity Optimizer',
      'Analyze my daily routine and suggest improvements for better productivity. Consider time management, task prioritization, energy levels, and work-life balance.',
      'Optimize your daily routine for maximum productivity',
      'productivity',
      ARRAY['productivity', 'time-management', 'optimization', 'routine'],
      'private',
      'active',
      'approved',
      false,
      12, 3, 67, 4.3, 5
    )
    ON CONFLICT (id) DO NOTHING
  `);
}

async function createSampleInteractions() {
  // Insert sample likes
  await db.execute(sql`
    INSERT INTO prompt_likes (user_id, prompt_id) VALUES
    ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777'),
    ('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777'),
    ('55555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777'),
    ('22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888'),
    ('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888'),
    ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999'),
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
    ON CONFLICT (user_id, prompt_id) DO NOTHING
  `);

  // Insert sample comments
  await db.execute(sql`
    INSERT INTO prompt_comments (user_id, prompt_id, content, likes_count) VALUES
    ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'This is an amazing prompt! Really helped me with my creative writing project. The structure and guidance are perfect.', 5),
    ('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'Love the creativity here. Could you add more examples for different genres?', 2),
    ('22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'Great for marketing campaigns! Used this for our product launch and saw great results.', 8),
    ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 'Very thorough code review process. Helped me catch several issues I missed.', 3),
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Excellent business planning framework. Very comprehensive approach.', 6),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Perfect for creating educational content. The structure is very helpful.', 4)
    ON CONFLICT DO NOTHING
  `);

  // Insert sample ratings
  await db.execute(sql`
    INSERT INTO prompt_ratings (user_id, prompt_id, rating, review) VALUES
    ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 5, 'Excellent prompt for creative writing. Very detailed and helpful.'),
    ('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 5, 'Perfect structure and guidance for storytelling.'),
    ('22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 5, 'Outstanding marketing prompt. Highly effective for conversions.'),
    ('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 5, 'Great for creating compelling copy quickly.'),
    ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 4, 'Very useful for code reviews. Could use more security focus.'),
    ('33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', 5, 'Comprehensive code review assistant. Saves a lot of time.'),
    ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'Excellent business strategy framework.'),
    ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'Very helpful for strategic planning.')
    ON CONFLICT (user_id, prompt_id) DO NOTHING
  `);

  // Insert sample views
  await db.execute(sql`
    INSERT INTO prompt_views (user_id, prompt_id, ip_address) VALUES
    ('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', '192.168.1.1'),
    ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', '192.168.1.2'),
    ('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', '192.168.1.3'),
    ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', '192.168.1.4'),
    (NULL, '77777777-7777-7777-7777-777777777777', '192.168.1.5'),
    (NULL, '88888888-8888-8888-8888-888888888888', '192.168.1.6')
    ON CONFLICT DO NOTHING
  `);

  // Insert sample prompt runs
  await db.execute(sql`
    INSERT INTO prompt_runs (user_id, prompt_id, model, input, output, tokens_used, cost, duration_ms, status) VALUES
    ('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'gpt-4', 'Write a story about a time traveler stuck in medieval times', 'Marcus clutched the broken temporal device, its circuits sparking uselessly in the dim candlelight of the monastery cell...', 1250, 0.025, 3500, 'completed'),
    ('33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 'gpt-3.5-turbo', 'Create marketing copy for a new fitness app', 'Transform Your Body, Transform Your Life! Discover the fitness app that adapts to YOU...', 890, 0.012, 2100, 'completed'),
    ('44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'gpt-4', 'Review this JavaScript function for performance issues', 'Code Review Results: 1. Performance: Consider using Map instead of Object for lookups...', 1100, 0.022, 2800, 'completed')
    ON CONFLICT DO NOTHING
  `);
}

async function createSampleTickets() {
  // Insert sample support tickets
  await db.execute(sql`
    INSERT INTO support_tickets (user_id, subject, description, status, priority, category) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Voice prompt not working', 'The voice-to-text feature is not capturing my speech correctly. It seems to cut off after a few seconds.', 'open', 'medium', 'technical'),
    ('33333333-3333-3333-3333-333333333333', 'Billing question', 'I was charged twice for my Pro subscription this month. Can you please help resolve this?', 'in_progress', 'high', 'billing'),
    ('44444444-4444-4444-4444-444444444444', 'Feature request', 'Would love to see integration with Google Docs for easier prompt management and collaboration.', 'open', 'low', 'feature_request'),
    ('55555555-5555-5555-5555-555555555555', 'Team invitation issue', 'Cannot send team invitations. Getting an error message when trying to invite new members.', 'open', 'medium', 'technical')
    ON CONFLICT DO NOTHING
  `);
}

// Update category counts based on actual prompts
async function updateCategoryCounts() {
  await db.execute(sql`
    UPDATE prompt_categories SET prompts_count = (
      SELECT COUNT(*) FROM prompts 
      WHERE prompts.category = prompt_categories.name 
      AND visibility = 'public' 
      AND moderation_status = 'approved'
    )
  `);
}

// Run the seeding
if (require.main === module) {
  seedSampleData()
    .then(async () => {
      await updateCategoryCounts();
      console.log('🎉 Sample data seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedSampleData };
