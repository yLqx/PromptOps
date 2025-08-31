import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupSchema = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🗄️ Setting up database schema...');
    
    // Create enums
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE plan_type AS ENUM ('free', 'pro', 'team');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE status_type AS ENUM ('draft', 'active', 'archived');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        plan plan_type DEFAULT 'free' NOT NULL,
        prompts_used INTEGER DEFAULT 0 NOT NULL,
        enhancements_used INTEGER DEFAULT 0 NOT NULL,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create prompts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        description TEXT,
        status status_type DEFAULT 'draft' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create prompt_runs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prompt_runs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        prompt_id VARCHAR REFERENCES prompts(id) ON DELETE SET NULL,
        prompt_content TEXT NOT NULL,
        response TEXT NOT NULL,
        model TEXT NOT NULL,
        response_time INTEGER NOT NULL,
        success BOOLEAN NOT NULL,
        error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create support_tickets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        admin_response TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
      CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);
      CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);
      CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
    `);
    
    // Create session table for express-session
    await client.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      )
      WITH (OIDS=FALSE);
    `);
    
    await client.query(`
      ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
    `);
    
    console.log('✅ Database schema created successfully!');
    console.log('🎉 Your PromptOps database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
};

setupSchema();
