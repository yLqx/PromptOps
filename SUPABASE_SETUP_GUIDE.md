# 🚀 Supabase Setup Guide for PromptOps

This guide will help you set up your Supabase database and connect it to your PromptOps application.

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your PromptOps project ready

## 🎯 Step 1: Create a Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Click "New Project"

2. **Configure Your Project**
   - **Organization**: Select or create an organization
   - **Name**: `promptops` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free tier

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll see a progress indicator

## 🗄️ Step 2: Set Up the Database Schema

1. **Open SQL Editor**
   - In your Supabase dashboard, go to "SQL Editor"
   - Click "New Query"

2. **Run Schema Creation**
   - Copy and paste the contents of `supabase/01_schema.sql`
   - Click "Run" to execute
   - ✅ You should see "Success. No rows returned"

3. **Set Up Security Policies**
   - Create another new query
   - Copy and paste the contents of `supabase/02_rls_policies.sql`
   - Click "Run" to execute

4. **Add Sample Data (Optional)**
   - Create another new query
   - Copy and paste the contents of `supabase/03_sample_data.sql`
   - Click "Run" to execute

## 🔑 Step 3: Get Your Credentials

1. **Go to Project Settings**
   - Click the gear icon (⚙️) in the sidebar
   - Go to "API" section

2. **Copy These Values**:
   ```
   Project URL: https://your-project-ref.supabase.co
   Anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service role (secret) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Get Database URL**
   - Go to "Database" section in settings
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres`

## ⚙️ Step 4: Update Your Environment

1. **Update `.env` file**:
   ```env
   # Database Configuration - Supabase
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres

   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Keep your existing keys
   SESSION_SECRET=your_session_secret
   GEMINI_API_KEY=your_gemini_key
   DEEPSEEK_API_KEY=your_deepseek_key
   OPENAI_API_KEY=your_openai_key
   STRIPE_SECRET_KEY=your_stripe_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

## 🔄 Step 5: Switch from Mock to Real Database

1. **Update `server/storage.ts`**:
   ```typescript
   // Replace mock storage with real database storage
   export { DatabaseStorage as storage, type IStorage } from "./database-storage";
   ```

2. **Update `server/db.ts`**:
   ```typescript
   import { Pool } from 'pg';
   import { drizzle } from 'drizzle-orm/node-postgres';
   import * as schema from "@shared/schema";
   import 'dotenv/config';

   if (!process.env.DATABASE_URL) {
     throw new Error("DATABASE_URL must be set");
   }

   export const pool = new Pool({ 
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   export const db = drizzle(pool, { schema });
   ```

## 🧪 Step 6: Test the Connection

1. **Push Schema with Drizzle**:
   ```bash
   npm run db:push
   ```

2. **Start Your App**:
   ```bash
   npm run dev
   ```

3. **Test Login**:
   - Go to http://localhost:5000
   - Try registering a new account
   - Check if data appears in your Supabase dashboard

## 🔐 Step 7: Set Up Authentication (Optional)

If you want to use Supabase Auth instead of custom auth:

1. **Enable Auth Providers**
   - Go to Authentication → Settings
   - Configure email/password or social providers

2. **Update Auth Configuration**
   - Site URL: `http://localhost:5000` (development)
   - Redirect URLs: Add your production domain later

## 📊 Step 8: Verify Everything Works

1. **Check Tables**
   - Go to "Table Editor" in Supabase
   - You should see: `users`, `prompts`, `prompt_runs`, `support_tickets`

2. **Test Functionality**
   - Create prompts
   - Run prompts
   - Check admin dashboard
   - Submit support tickets

## 🚀 Step 9: Production Deployment

When deploying to production:

1. **Update Environment Variables**
   - Set production `DATABASE_URL`
   - Update `SUPABASE_URL` if needed
   - Keep API keys secure

2. **Update Supabase Settings**
   - Add production domain to allowed origins
   - Update redirect URLs
   - Configure custom domain (optional)

## 🛠️ Troubleshooting

### Connection Issues
- ✅ Check if DATABASE_URL is correct
- ✅ Verify password in connection string
- ✅ Ensure SSL is enabled for production

### Permission Errors
- ✅ Check RLS policies are applied
- ✅ Verify user authentication
- ✅ Check if admin functions work

### Schema Issues
- ✅ Run `npm run db:push` to sync schema
- ✅ Check for migration conflicts
- ✅ Verify all tables exist

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Drizzle Docs**: https://orm.drizzle.team/docs
- **Check Supabase Logs**: Dashboard → Logs

---

🎉 **Congratulations!** Your PromptOps app is now connected to Supabase!
