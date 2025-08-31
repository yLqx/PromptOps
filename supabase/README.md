# PromptOps Supabase Setup

This directory contains all the necessary files to set up your Supabase database for the PromptOps application.

## Files Overview

### Migration Files
- `000_initial_schema.sql` - Creates all tables, enums, indexes, and basic structure
- `001_rls_policies.sql` - Implements Row Level Security policies for data protection
- `002_auth_setup.sql` - Sets up authentication functions and user management
- `003_community_functions.sql` - Adds community features and interaction functions

### Configuration Files
- `config.toml` - Supabase local development configuration
- `seed.sql` - Sample data for development and testing
- `.env.example` - Environment variables template
- `README.md` - This documentation file

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g @supabase/cli
```

### 2. Initialize Supabase Project

```bash
# In your project root directory
supabase init
```

### 3. Copy Configuration Files

Copy all files from this directory to your `supabase/` folder:

```bash
cp supabase/migrations/* your-project/supabase/migrations/
cp supabase/config.toml your-project/supabase/
cp supabase/seed.sql your-project/supabase/
```

### 4. Set Up Environment Variables

```bash
cp supabase/.env.example .env.local
# Edit .env.local with your actual values
```

### 5. Start Local Development

```bash
supabase start
```

This will start all Supabase services locally:
- Database: `postgresql://postgres:postgres@localhost:54322/postgres`
- API: `http://localhost:54321`
- Studio: `http://localhost:54323`
- Auth: `http://localhost:54324`

### 6. Run Migrations

```bash
supabase db reset
```

This will:
1. Reset the database
2. Run all migrations in order
3. Apply RLS policies
4. Set up authentication
5. Create community functions
6. Load seed data

### 7. Verify Setup

Visit `http://localhost:54323` to access Supabase Studio and verify:
- All tables are created
- RLS policies are active
- Sample data is loaded
- Functions are available

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `teams` - Team management
- `team_invitations` - Team invitation system
- `prompts` - User prompts with community features
- `prompt_runs` - Prompt execution history

### Community Tables
- `prompt_likes` - User likes on prompts
- `prompt_comments` - Comments and discussions
- `prompt_ratings` - Star ratings and reviews
- `prompt_reports` - Content moderation reports
- `prompt_views` - Analytics and view tracking
- `prompt_categories` - Prompt categorization

### Support Tables
- `support_tickets` - Customer support system

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with comprehensive policies:

- **Users**: Can only access their own data
- **Teams**: Team members can view team data, owners can manage
- **Prompts**: Visibility-based access (public, team, private)
- **Community**: Access based on prompt visibility
- **Admin**: Special access for admin users

### Content Moderation
- Automatic content filtering
- Manual moderation workflow
- Report and flagging system
- Admin moderation dashboard

### Authentication
- Supabase Auth integration
- JWT-based authentication
- Secure password handling
- User registration/login flows

## API Functions

### Authentication Functions
- `handle_new_user()` - Process new user registration
- `get_current_user()` - Get current authenticated user
- `is_admin()` - Check admin privileges
- `update_user_plan()` - Manage user subscriptions

### Community Functions
- `get_community_prompts()` - Fetch public prompts with filters
- `toggle_prompt_like()` - Like/unlike prompts
- `add_comment()` - Add comments to prompts
- `rate_prompt()` - Rate prompts with stars
- `report_prompt()` - Report inappropriate content

### Utility Functions
- `increment_usage()` - Track usage limits
- `check_usage_limit()` - Validate usage against plan limits
- `get_user_stats()` - Get user statistics
- `get_community_stats()` - Get community metrics

## Development Workflow

### Making Schema Changes

1. Create a new migration file:
```bash
supabase migration new your_migration_name
```

2. Write your SQL changes in the new file

3. Apply the migration:
```bash
supabase db reset
```

### Testing Changes

1. Use the seed data for consistent testing
2. Test RLS policies with different user roles
3. Verify functions work correctly
4. Check performance with indexes

### Production Deployment

1. Link to your production project:
```bash
supabase link --project-ref your-project-ref
```

2. Push migrations:
```bash
supabase db push
```

3. Verify deployment in Supabase Dashboard

## Troubleshooting

### Common Issues

1. **Migration Errors**: Check SQL syntax and dependencies
2. **RLS Denials**: Verify policies match your access patterns
3. **Function Errors**: Check parameter types and return values
4. **Performance**: Add indexes for frequently queried columns

### Debugging

1. Check Supabase logs:
```bash
supabase logs
```

2. Use Supabase Studio SQL editor for testing

3. Enable debug logging in your application

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Security Considerations

### Production Checklist

- [ ] Change default passwords
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up monitoring and alerts
- [ ] Review and test all RLS policies
- [ ] Implement proper backup strategy
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment variables securely
- [ ] Test disaster recovery procedures

### Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** for all data access control
3. **Validate all inputs** on both client and server
4. **Monitor for suspicious activity** and implement alerts
5. **Regular security audits** of policies and functions
6. **Keep dependencies updated** and patch vulnerabilities
7. **Use environment variables** for all sensitive configuration
8. **Implement proper logging** for security events

## Performance Optimization

### Indexing Strategy
- Primary keys and foreign keys are automatically indexed
- Add indexes for frequently filtered columns
- Use composite indexes for multi-column queries
- Monitor query performance with `EXPLAIN ANALYZE`

### Query Optimization
- Use appropriate filters in RLS policies
- Limit result sets with pagination
- Use database functions for complex operations
- Cache frequently accessed data

### Monitoring
- Set up performance monitoring
- Track slow queries
- Monitor connection pool usage
- Set up alerts for resource usage
