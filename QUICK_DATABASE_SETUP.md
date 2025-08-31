# 🚀 Quick Database Setup for PromptOps

Since there seems to be a network connectivity issue, let's set up the database manually through the Supabase dashboard.

## 📋 Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `rppjhopgqgszqhufcvmb`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## 🗄️ Step 2: Run This SQL Script

Copy and paste this entire script into the SQL Editor and click "Run":

```sql
-- Create custom types (enums)
DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('free', 'pro', 'team');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE status_type AS ENUM ('draft', 'active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table
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

-- Prompts table
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

-- Prompt runs table
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

-- Support tickets table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_created_at ON prompt_runs(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Session table for express-session
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

-- Add primary key constraint if it doesn't exist
DO $$ BEGIN
    ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create session index
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at 
    BEFORE UPDATE ON prompts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## ✅ Step 3: Verify Setup

After running the script, you should see:
- ✅ "Success. No rows returned" message
- Go to "Table Editor" in the sidebar
- You should see these tables:
  - `users`
  - `prompts` 
  - `prompt_runs`
  - `support_tickets`
  - `session`

## 🎯 Step 4: Test Your App

1. Your server should already be running at http://localhost:5000
2. Try to register a new account
3. If successful, you'll see the user appear in your Supabase `users` table

## 🔧 Troubleshooting

### If you get connection errors:
1. Check your `.env` file has the correct `DATABASE_URL`
2. Make sure your Supabase project is active
3. Verify the password in the connection string is correct

### If registration fails:
1. Check the browser console for errors
2. Look at the server terminal for error messages
3. Verify the database tables were created correctly

## 🎉 Success!

Once the database is set up and you can register/login, your PromptOps app is fully functional with:
- ✅ Real Supabase database
- ✅ User authentication
- ✅ Prompt management
- ✅ AI integrations
- ✅ Beautiful UI with logos

Your app is now production-ready!
