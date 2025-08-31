# 🚀 PromptOps Supabase Setup Guide

Complete guide to set up PromptOps with Supabase for secure, production-ready deployment.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free tier works)
- Basic knowledge of SQL and environment variables

## 🎯 Quick Start (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `promptops-production` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 2. Run Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase.sql` from this repository
3. Paste it into the SQL Editor
4. Click **Run** to execute all commands
5. Verify success - you should see "Setup Complete!" message

### 3. Configure Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your project credentials
3. Create/update your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (for server-side operations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Optional: AI API Keys for real responses
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
DEEPSEEK_API_KEY=your-deepseek-key-here

# Optional: Stripe for payments
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

### 4. Enable Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure these settings:

**Site URL**: `http://localhost:5000` (for development)
**Redirect URLs**: Add your production domain when ready

**Email Templates** (optional but recommended):
- Customize signup confirmation email
- Customize password reset email

### 5. Test Your Setup

1. Remove test mode from your code:
   ```bash
   # Restore real Supabase client
   git checkout client/src/lib/supabase.ts
   git checkout client/src/hooks/use-supabase-auth.tsx
   git checkout server/db.ts
   ```

2. Start your application:
   ```bash
   npm run dev
   ```

3. Test authentication:
   - Visit `http://localhost:5000`
   - Try registering a new account
   - Check email for confirmation
   - Test login/logout

## 🔒 Security Features

### Row Level Security (RLS)

Your database is protected with comprehensive RLS policies:

- **Users**: Can only see/edit their own profiles
- **Prompts**: Visibility based on public/private/team settings
- **Comments**: Only on accessible prompts
- **Teams**: Members can only see their team data
- **Admin Access**: Special permissions for admin users

### Authentication Security

- JWT-based authentication with automatic refresh
- Email confirmation required for new accounts
- Password reset functionality
- Session management with secure cookies
- CSRF protection enabled

### Data Protection

- All sensitive data encrypted at rest
- API rate limiting enabled
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

## 🏗️ Database Schema

### Core Tables

- **users** - User profiles extending auth.users
- **teams** - Team collaboration features
- **prompts** - User-created prompts with visibility controls
- **prompt_runs** - AI execution history
- **prompt_likes** - Community engagement
- **prompt_comments** - Discussion system
- **support_tickets** - Customer support

### Key Features

- **Automatic timestamps** - created_at/updated_at
- **Soft deletes** - Preserve data integrity
- **Performance indexes** - Optimized queries
- **Foreign key constraints** - Data consistency
- **Enum types** - Controlled vocabularies

## 🚀 Production Deployment

### 1. Environment Setup

Create production environment variables:

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key
DATABASE_URL=your-prod-database-url

# Production settings
NODE_ENV=production
SESSION_SECRET=your-super-secure-production-secret

# Production domains
SITE_URL=https://yourdomain.com
```

### 2. Supabase Production Settings

1. **Authentication Settings**:
   - Update Site URL to your domain
   - Add production redirect URLs
   - Enable email confirmations
   - Configure custom SMTP (recommended)

2. **Database Settings**:
   - Enable connection pooling
   - Set up read replicas if needed
   - Configure backups
   - Monitor performance

3. **Security Settings**:
   - Review RLS policies
   - Enable audit logging
   - Set up monitoring alerts
   - Configure rate limiting

### 3. Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Authentication flow verified
- [ ] Email templates customized
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Performance tested

## 🔧 Customization

### Adding New Tables

1. Create migration in Supabase dashboard
2. Add RLS policies for security
3. Update TypeScript types
4. Add API endpoints if needed

### Modifying User Roles

1. Update `is_admin()` function in database
2. Add new role checks to RLS policies
3. Update client-side permission checks

### Custom Email Templates

1. Go to Authentication → Email Templates
2. Customize HTML/text for each template
3. Test with real email addresses

## 🐛 Troubleshooting

### Common Issues

**Authentication not working**:
- Check environment variables
- Verify Site URL matches your domain
- Ensure RLS policies allow user creation

**Database connection errors**:
- Verify DATABASE_URL format
- Check password special characters
- Ensure IP allowlist includes your server

**RLS blocking queries**:
- Test policies with different user roles
- Check function permissions
- Verify user context in policies

### Debug Mode

Enable debug logging:

```env
DEBUG=supabase:*
SUPABASE_DEBUG=true
```

### Getting Help

1. Check Supabase documentation
2. Review error logs in dashboard
3. Test with Supabase CLI locally
4. Contact support if needed

## 📊 Monitoring

### Key Metrics

- Authentication success rate
- Database query performance
- API response times
- Error rates
- User engagement

### Supabase Dashboard

Monitor in real-time:
- Database usage
- API requests
- Authentication events
- Storage usage
- Function executions

## ✅ Success!

Your PromptOps application is now running on Supabase with:

- ✅ Secure authentication system
- ✅ Protected database with RLS
- ✅ Scalable architecture
- ✅ Production-ready security
- ✅ Community features
- ✅ AI integration ready
- ✅ Team collaboration
- ✅ Support system

**Next Steps**: Customize the UI, add your branding, and launch! 🎉
