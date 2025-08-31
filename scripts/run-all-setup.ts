#!/usr/bin/env tsx
// Master setup script that runs all database setup tasks

import { setupDatabase } from './setup-supabase';
import { setupRLSPolicies } from './setup-rls';
import { seedSampleData } from './seed-data';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🚀 Starting complete Supabase setup...');
console.log('📋 This will:');
console.log('   1. Create all database tables and functions');
console.log('   2. Set up Row Level Security policies');
console.log('   3. Seed sample data for development');
console.log('');

async function runCompleteSetup() {
  try {
    console.log('🏗️ Step 1: Setting up database schema...');
    await setupDatabase();
    console.log('✅ Database schema setup completed!\n');

    console.log('🛡️ Step 2: Setting up Row Level Security...');
    await setupRLSPolicies();
    console.log('✅ RLS policies setup completed!\n');

    console.log('🌱 Step 3: Seeding sample data...');
    await seedSampleData();
    console.log('✅ Sample data seeded successfully!\n');

    console.log('🎉 Complete Supabase setup finished successfully!');
    console.log('');
    console.log('📊 Your database now includes:');
    console.log('   ✓ All tables with proper relationships');
    console.log('   ✓ Row Level Security policies');
    console.log('   ✓ Community features (likes, comments, ratings)');
    console.log('   ✓ Voice prompt support');
    console.log('   ✓ Team collaboration features');
    console.log('   ✓ Content moderation system');
    console.log('   ✓ Sample data for testing');
    console.log('');
    console.log('🔗 Access your database:');
    console.log('   • Supabase Studio: http://localhost:54323');
    console.log('   • Database URL: postgresql://postgres:postgres@localhost:54322/postgres');
    console.log('   • API URL: http://localhost:54321');
    console.log('');
    console.log('👥 Sample users created:');
    console.log('   • admin@promptops.com (Enterprise plan)');
    console.log('   • john@example.com (Pro plan)');
    console.log('   • jane@example.com (Free plan)');
    console.log('   • mike@example.com (Team owner)');
    console.log('   • sarah@example.com (Team member)');
    console.log('');
    console.log('📝 Sample prompts available:');
    console.log('   • Creative Writing Assistant');
    console.log('   • Marketing Copy Generator');
    console.log('   • Code Review Assistant');
    console.log('   • Business Strategy Planner');
    console.log('   • Educational Content Creator');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure Supabase is running: supabase start');
    console.log('   2. Check your .env.local file has correct DATABASE_URL');
    console.log('   3. Verify database connection is working');
    console.log('   4. Check the error message above for specific issues');
    process.exit(1);
  }
}

// Run the complete setup
runCompleteSetup();
