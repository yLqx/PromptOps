#!/usr/bin/env tsx
// Setup Row Level Security policies for Supabase

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres';

console.log('🛡️ Setting up Row Level Security policies...');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function setupRLSPolicies() {
  try {
    console.log('🔧 Creating utility functions...');
    await createUtilityFunctions();
    
    console.log('👤 Setting up user policies...');
    await setupUserPolicies();
    
    console.log('🏢 Setting up team policies...');
    await setupTeamPolicies();
    
    console.log('📝 Setting up prompt policies...');
    await setupPromptPolicies();
    
    console.log('💬 Setting up community policies...');
    await setupCommunityPolicies();
    
    console.log('🎫 Setting up support policies...');
    await setupSupportPolicies();
    
    console.log('👑 Setting up admin policies...');
    await setupAdminPolicies();
    
    console.log('✅ RLS policies setup completed!');
    
  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createUtilityFunctions() {
  // Function to check if user is admin
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = user_id
        AND users.email IN ('admin@promptops.com', 'mourad@admin.com')
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER
  `);

  // Function to check prompt access
  await db.execute(sql`
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
    $$ LANGUAGE plpgsql SECURITY DEFINER
  `);

  // Function to check team membership
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION is_team_member(user_id UUID, target_user_id UUID)
    RETURNS BOOLEAN AS $$
    DECLARE
      user_team_id UUID;
      target_team_id UUID;
    BEGIN
      SELECT team_id INTO user_team_id FROM users WHERE id = user_id;
      SELECT team_id INTO target_team_id FROM users WHERE id = target_user_id;
      
      RETURN user_team_id IS NOT NULL 
        AND target_team_id IS NOT NULL 
        AND user_team_id = target_team_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER
  `);
}

async function setupUserPolicies() {
  // Users can view their own profile
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view their own profile" ON users
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view their own profile" ON users
      FOR SELECT USING (auth.uid() = id)
  `);

  // Users can update their own profile
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can update their own profile" ON users
  `);
  await db.execute(sql`
    CREATE POLICY "Users can update their own profile" ON users
      FOR UPDATE USING (auth.uid() = id)
  `);

  // Team members can view each other
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team members can view each other" ON users
  `);
  await db.execute(sql`
    CREATE POLICY "Team members can view each other" ON users
      FOR SELECT USING (
        team_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM users viewer 
          WHERE viewer.id = auth.uid() 
          AND viewer.team_id = users.team_id
        )
      )
  `);
}

async function setupTeamPolicies() {
  // Team members can view their team
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team members can view their team" ON teams
  `);
  await db.execute(sql`
    CREATE POLICY "Team members can view their team" ON teams
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.team_id = teams.id
        )
      )
  `);

  // Team owners can update their team
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team owners can update their team" ON teams
  `);
  await db.execute(sql`
    CREATE POLICY "Team owners can update their team" ON teams
      FOR UPDATE USING (owner_id = auth.uid())
  `);

  // Team owners can delete their team
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team owners can delete their team" ON teams
  `);
  await db.execute(sql`
    CREATE POLICY "Team owners can delete their team" ON teams
      FOR DELETE USING (owner_id = auth.uid())
  `);

  // Team invitation policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team owners can manage invitations" ON team_invitations
  `);
  await db.execute(sql`
    CREATE POLICY "Team owners can manage invitations" ON team_invitations
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM teams 
          WHERE teams.id = team_invitations.team_id 
          AND teams.owner_id = auth.uid()
        )
      )
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Invited users can view their invitations" ON team_invitations
  `);
  await db.execute(sql`
    CREATE POLICY "Invited users can view their invitations" ON team_invitations
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.email = team_invitations.email
        )
      )
  `);
}

async function setupPromptPolicies() {
  // Users can view public prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view public prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view public prompts" ON prompts
      FOR SELECT USING (
        visibility = 'public' 
        AND moderation_status = 'approved'
      )
  `);

  // Users can view their own prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view their own prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view their own prompts" ON prompts
      FOR SELECT USING (user_id = auth.uid())
  `);

  // Team members can view team prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Team members can view team prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Team members can view team prompts" ON prompts
      FOR SELECT USING (
        visibility = 'team' 
        AND moderation_status = 'approved'
        AND EXISTS (
          SELECT 1 FROM users u1, users u2
          WHERE u1.id = auth.uid() 
          AND u2.id = prompts.user_id
          AND u1.team_id = u2.team_id
          AND u1.team_id IS NOT NULL
        )
      )
  `);

  // Users can create prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create prompts" ON prompts
      FOR INSERT WITH CHECK (user_id = auth.uid())
  `);

  // Users can update their own prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Users can update their own prompts" ON prompts
      FOR UPDATE USING (user_id = auth.uid())
  `);

  // Users can delete their own prompts
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can delete their own prompts" ON prompts
  `);
  await db.execute(sql`
    CREATE POLICY "Users can delete their own prompts" ON prompts
      FOR DELETE USING (user_id = auth.uid())
  `);

  // Prompt runs policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view their own prompt runs" ON prompt_runs
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view their own prompt runs" ON prompt_runs
      FOR SELECT USING (user_id = auth.uid())
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create prompt runs" ON prompt_runs
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create prompt runs" ON prompt_runs
      FOR INSERT WITH CHECK (user_id = auth.uid())
  `);
}

async function setupCommunityPolicies() {
  // Prompt likes policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view likes on accessible prompts" ON prompt_likes
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view likes on accessible prompts" ON prompt_likes
      FOR SELECT USING (can_access_prompt(prompt_id))
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can manage their own likes" ON prompt_likes
  `);
  await db.execute(sql`
    CREATE POLICY "Users can manage their own likes" ON prompt_likes
      FOR ALL USING (user_id = auth.uid())
  `);

  // Prompt comments policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view comments on accessible prompts" ON prompt_comments
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view comments on accessible prompts" ON prompt_comments
      FOR SELECT USING (can_access_prompt(prompt_id))
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create comments on accessible prompts" ON prompt_comments
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create comments on accessible prompts" ON prompt_comments
      FOR INSERT WITH CHECK (
        user_id = auth.uid() AND can_access_prompt(prompt_id)
      )
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can update their own comments" ON prompt_comments
  `);
  await db.execute(sql`
    CREATE POLICY "Users can update their own comments" ON prompt_comments
      FOR UPDATE USING (user_id = auth.uid())
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can delete their own comments" ON prompt_comments
  `);
  await db.execute(sql`
    CREATE POLICY "Users can delete their own comments" ON prompt_comments
      FOR DELETE USING (user_id = auth.uid())
  `);

  // Prompt ratings policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view ratings on accessible prompts" ON prompt_ratings
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view ratings on accessible prompts" ON prompt_ratings
      FOR SELECT USING (can_access_prompt(prompt_id))
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can manage their own ratings" ON prompt_ratings
  `);
  await db.execute(sql`
    CREATE POLICY "Users can manage their own ratings" ON prompt_ratings
      FOR ALL USING (user_id = auth.uid())
  `);

  // Prompt reports policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create reports" ON prompt_reports
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create reports" ON prompt_reports
      FOR INSERT WITH CHECK (user_id = auth.uid())
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view their own reports" ON prompt_reports
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view their own reports" ON prompt_reports
      FOR SELECT USING (user_id = auth.uid())
  `);

  // Prompt views policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create views" ON prompt_views
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create views" ON prompt_views
      FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL)
  `);

  // Categories are read-only for users
  await db.execute(sql`
    DROP POLICY IF EXISTS "Anyone can view categories" ON prompt_categories
  `);
  await db.execute(sql`
    CREATE POLICY "Anyone can view categories" ON prompt_categories
      FOR SELECT USING (true)
  `);
}

async function setupSupportPolicies() {
  // Support tickets policies
  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets
  `);
  await db.execute(sql`
    CREATE POLICY "Users can view their own tickets" ON support_tickets
      FOR SELECT USING (user_id = auth.uid())
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can create support tickets" ON support_tickets
  `);
  await db.execute(sql`
    CREATE POLICY "Users can create support tickets" ON support_tickets
      FOR INSERT WITH CHECK (user_id = auth.uid())
  `);

  await db.execute(sql`
    DROP POLICY IF EXISTS "Users can update their own tickets" ON support_tickets
  `);
  await db.execute(sql`
    CREATE POLICY "Users can update their own tickets" ON support_tickets
      FOR UPDATE USING (user_id = auth.uid())
  `);
}

async function setupAdminPolicies() {
  // Admin policies for all tables
  const tables = [
    'users', 'teams', 'team_invitations', 'prompts', 'prompt_runs',
    'prompt_likes', 'prompt_comments', 'prompt_ratings', 'prompt_reports',
    'prompt_views', 'prompt_categories', 'support_tickets'
  ];

  for (const table of tables) {
    await db.execute(sql.raw(`
      DROP POLICY IF EXISTS "Admins can manage all ${table}" ON ${table}
    `));
    await db.execute(sql.raw(`
      CREATE POLICY "Admins can manage all ${table}" ON ${table}
        FOR ALL USING (is_admin())
    `));
  }
}

// Run the RLS setup
if (require.main === module) {
  setupRLSPolicies()
    .then(() => {
      console.log('🎉 RLS policies setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 RLS setup failed:', error);
      process.exit(1);
    });
}

export { setupRLSPolicies };
