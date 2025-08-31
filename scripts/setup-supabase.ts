#!/usr/bin/env tsx
// Automated Supabase setup script using Drizzle ORM
// This script will create all tables, policies, and seed data automatically

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres';

console.log('🚀 Starting Supabase database setup...');

// Create database connection
const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function setupDatabase() {
  try {
    console.log('📦 Creating extensions...');
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    
    console.log('🏗️ Creating enums...');
    await createEnums();
    
    console.log('📋 Creating tables...');
    await createTables();
    
    console.log('📊 Creating indexes...');
    await createIndexes();
    
    console.log('🔧 Creating functions...');
    await createFunctions();
    
    console.log('🛡️ Setting up Row Level Security...');
    await setupRLS();
    
    console.log('🌱 Seeding data...');
    await seedData();
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createEnums() {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE plan_type AS ENUM ('free', 'pro', 'team', 'enterprise');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE status_type AS ENUM ('draft', 'active', 'archived');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE prompt_visibility AS ENUM ('private', 'public', 'team');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE report_reason AS ENUM ('spam', 'inappropriate', 'copyright', 'harassment', 'other');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
}

async function createTables() {
  // Teams table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      owner_id UUID NOT NULL,
      plan plan_type DEFAULT 'team' NOT NULL,
      max_members INTEGER DEFAULT 10 NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      plan plan_type DEFAULT 'free' NOT NULL,
      prompts_used INTEGER DEFAULT 0 NOT NULL,
      enhancements_used INTEGER DEFAULT 0 NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
      is_team_owner BOOLEAN DEFAULT false NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Team invitations table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS team_invitations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending' NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `);

  // Prompt categories table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      color TEXT DEFAULT '#6B7280' NOT NULL,
      icon TEXT,
      prompts_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Prompts table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'general' NOT NULL,
      tags TEXT[],
      visibility prompt_visibility DEFAULT 'private' NOT NULL,
      status status_type DEFAULT 'draft' NOT NULL,
      moderation_status moderation_status DEFAULT 'pending' NOT NULL,
      created_via_voice BOOLEAN DEFAULT false NOT NULL,
      likes_count INTEGER DEFAULT 0 NOT NULL,
      comments_count INTEGER DEFAULT 0 NOT NULL,
      views_count INTEGER DEFAULT 0 NOT NULL,
      shares_count INTEGER DEFAULT 0 NOT NULL,
      average_rating REAL DEFAULT 0,
      ratings_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Prompt runs table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_runs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      model TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT,
      tokens_used INTEGER,
      cost DECIMAL(10,6),
      duration_ms INTEGER,
      status TEXT DEFAULT 'pending' NOT NULL,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Community tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_likes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, prompt_id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES prompt_comments(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_ratings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, prompt_id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      reason report_reason NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS prompt_views (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);

  // Support tickets table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'open' NOT NULL,
      priority TEXT DEFAULT 'medium' NOT NULL,
      category TEXT DEFAULT 'general' NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    )
  `);
}

async function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
    'CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompts_visibility ON prompts(visibility)',
    'CREATE INDEX IF NOT EXISTS idx_prompts_moderation_status ON prompts(moderation_status)',
    'CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category)',
    'CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_id ON prompt_likes(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_likes_prompt_id ON prompt_likes(prompt_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_comments_prompt_id ON prompt_comments(prompt_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_ratings_prompt_id ON prompt_ratings(prompt_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_views_prompt_id ON prompt_views(prompt_id)',
    'CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id)'
  ];

  for (const index of indexes) {
    await db.execute(sql.raw(index));
  }
}

async function createFunctions() {
  // Updated at trigger function
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql'
  `);

  // Create triggers
  const triggers = [
    'DROP TRIGGER IF EXISTS update_users_updated_at ON users',
    'CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    'DROP TRIGGER IF EXISTS update_teams_updated_at ON teams',
    'CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    'DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts',
    'CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    'DROP TRIGGER IF EXISTS update_prompt_comments_updated_at ON prompt_comments',
    'CREATE TRIGGER update_prompt_comments_updated_at BEFORE UPDATE ON prompt_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    'DROP TRIGGER IF EXISTS update_prompt_ratings_updated_at ON prompt_ratings',
    'CREATE TRIGGER update_prompt_ratings_updated_at BEFORE UPDATE ON prompt_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
    'DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets',
    'CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
  ];

  for (const trigger of triggers) {
    await db.execute(sql.raw(trigger));
  }

  // Stats update functions
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_prompt_stats()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'prompt_likes' THEN
          UPDATE prompts SET likes_count = likes_count + 1 WHERE id = NEW.prompt_id;
        END IF;
        IF TG_TABLE_NAME = 'prompt_comments' THEN
          UPDATE prompts SET comments_count = comments_count + 1 WHERE id = NEW.prompt_id;
        END IF;
        IF TG_TABLE_NAME = 'prompt_views' THEN
          UPDATE prompts SET views_count = views_count + 1 WHERE id = NEW.prompt_id;
        END IF;
        RETURN NEW;
      END IF;
      
      IF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'prompt_likes' THEN
          UPDATE prompts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.prompt_id;
        END IF;
        IF TG_TABLE_NAME = 'prompt_comments' THEN
          UPDATE prompts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.prompt_id;
        END IF;
        RETURN OLD;
      END IF;
      
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql
  `);

  // Create stat triggers
  const statTriggers = [
    'DROP TRIGGER IF EXISTS update_prompt_likes_count ON prompt_likes',
    'CREATE TRIGGER update_prompt_likes_count AFTER INSERT OR DELETE ON prompt_likes FOR EACH ROW EXECUTE FUNCTION update_prompt_stats()',
    'DROP TRIGGER IF EXISTS update_prompt_comments_count ON prompt_comments',
    'CREATE TRIGGER update_prompt_comments_count AFTER INSERT OR DELETE ON prompt_comments FOR EACH ROW EXECUTE FUNCTION update_prompt_stats()',
    'DROP TRIGGER IF EXISTS update_prompt_views_count ON prompt_views',
    'CREATE TRIGGER update_prompt_views_count AFTER INSERT ON prompt_views FOR EACH ROW EXECUTE FUNCTION update_prompt_stats()'
  ];

  for (const trigger of statTriggers) {
    await db.execute(sql.raw(trigger));
  }
}

async function setupRLS() {
  // Enable RLS on all tables
  const tables = [
    'users', 'teams', 'team_invitations', 'prompts', 'prompt_runs',
    'prompt_likes', 'prompt_comments', 'prompt_ratings', 'prompt_reports',
    'prompt_views', 'prompt_categories', 'support_tickets'
  ];

  for (const table of tables) {
    await db.execute(sql.raw(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`));
  }

  console.log('🛡️ RLS enabled on all tables');
  console.log('ℹ️  Note: RLS policies will be managed through your application auth system');
}

async function seedData() {
  // Insert default categories
  await db.execute(sql`
    INSERT INTO prompt_categories (name, description, color, icon) VALUES
    ('general', 'General purpose prompts', '#6B7280', '📝'),
    ('creative', 'Creative writing and storytelling', '#8B5CF6', '🎨'),
    ('marketing', 'Marketing and sales content', '#10B981', '📈'),
    ('coding', 'Programming and development', '#3B82F6', '💻'),
    ('business', 'Business strategy and planning', '#F59E0B', '💼'),
    ('education', 'Educational content and tutorials', '#EF4444', '📚'),
    ('productivity', 'Productivity and workflow optimization', '#06B6D4', '⚡'),
    ('analysis', 'Data analysis and research', '#8B5CF6', '📊'),
    ('writing', 'Professional writing assistance', '#10B981', '✍️'),
    ('research', 'Research and investigation', '#F59E0B', '🔍')
    ON CONFLICT (name) DO NOTHING
  `);

  console.log('✅ Default categories inserted');
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Supabase setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };
