# 🚀 PromptOps Supabase Setup Guide

This guide will help you set up PromptOps with Supabase for a complete community-driven prompt sharing platform.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Git**: For version control

## 🎯 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `promptops` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Run SQL Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `SQLSUPABASE.sql` file
3. Paste it into the SQL Editor
4. Click **Run** to execute all commands
5. ✅ You should see "Success. No rows returned" - this means it worked!

### Step 3: Get Your Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string starting with `eyJ`)

### Step 4: Configure Environment

1. Open your `.env.local` file
2. Replace the placeholder values:

```env
# Replace these with your actual Supabase values
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Vite Environment Variables (same values as above)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 5: Start the Application

```bash
npm install
npm run dev
```

🎉 **That's it!** Your PromptOps application is now connected to Supabase!

## 🔧 What Gets Created

### Database Tables
- **users** - User profiles and authentication
- **teams** - Team collaboration features
- **categories** - Prompt and post categories
- **prompts** - User-created prompts
- **posts** - Community discussions and content
- **likes** - Like system for prompts and posts
- **comments** - Comment system with replies
- **views** - Analytics and view tracking
- **follows** - User following system

### Security Features
- **Row Level Security (RLS)** - Users only see authorized content
- **Authentication** - Secure user registration and login
- **Content Moderation** - Automatic and manual content review
- **Privacy Controls** - Public, private, and team visibility options

### Community Features
- **Create Posts** - Users can create discussion posts, questions, showcases
- **Like & Comment** - Full interaction system
- **Categories & Tags** - Organized content discovery
- **User Profiles** - Rich user profiles with stats
- **My Posts Page** - Personal content management

## 🎮 Testing Your Setup

### 1. Check Connection
- Start the app with `npm run dev`
- If Supabase is not connected, you'll see a connection error screen
- If connected, you'll see the normal login page

### 2. Create Test Account
1. Go to the register page
2. Create a new account
3. You should be automatically signed in

### 3. Test Community Features
1. Go to the Community page
2. Click "Create Post"
3. Create a test post
4. Go to "My Posts" to see your content

## 🛠️ Advanced Configuration

### Enable Email Authentication (Optional)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure email templates
3. Set up SMTP (or use Supabase's built-in email)

### Set Up Storage (Optional)

1. Go to **Storage** in Supabase dashboard
2. Create a bucket for user avatars: `avatars`
3. Set up RLS policies for the bucket

### Configure Custom Domain (Production)

1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Update environment variables with your custom domain

## 🔒 Security Best Practices

### Environment Variables
- ✅ **DO**: Use environment variables for all secrets
- ❌ **DON'T**: Commit `.env.local` to version control
- ✅ **DO**: Use different projects for development/production

### Database Security
- ✅ **DO**: Test RLS policies thoroughly
- ✅ **DO**: Use the anon key in client-side code
- ❌ **DON'T**: Use the service role key in client-side code
- ✅ **DO**: Monitor for suspicious activity

### Content Moderation
- ✅ **DO**: Review reported content regularly
- ✅ **DO**: Set up content filtering rules
- ✅ **DO**: Have clear community guidelines

## 🚀 Production Deployment

### 1. Environment Setup
```env
# Production environment variables
NODE_ENV=production
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

### 2. Database Migration
1. Create a production Supabase project
2. Run the same SQL setup from `SQLSUPABASE.sql`
3. Update environment variables

### 3. Deploy Application
- **Vercel**: Connect your GitHub repo
- **Netlify**: Deploy from Git
- **Railway**: One-click deployment
- **Your VPS**: Use PM2 or Docker

## 🆘 Troubleshooting

### Connection Issues
**Problem**: "Database Connection Failed" error
**Solution**: 
1. Check your environment variables
2. Verify Supabase project is active
3. Ensure SQL setup was completed

### Authentication Issues
**Problem**: Can't sign up or sign in
**Solution**:
1. Check Supabase Auth settings
2. Verify RLS policies are correct
3. Check browser console for errors

### Missing Data
**Problem**: No categories or empty database
**Solution**:
1. Re-run the SQL setup from `SQLSUPABASE.sql`
2. Check if all tables were created
3. Verify default data was inserted

### Performance Issues
**Problem**: Slow loading times
**Solution**:
1. Check database indexes
2. Optimize queries
3. Enable caching
4. Use Supabase Edge Functions for heavy operations

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🎉 You're All Set!

Your PromptOps application now has:
- ✅ Secure user authentication
- ✅ Community features with posts and comments
- ✅ Personal content management
- ✅ Real-time updates
- ✅ Production-ready security
- ✅ Scalable database architecture

Start building your prompt community! 🚀
