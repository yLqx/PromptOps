# 🚀 Automated Supabase Setup for PromptOps

This guide will help you set up your Supabase database automatically using our custom scripts.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase CLI** installed globally:
   ```bash
   npm install -g @supabase/cli
   ```

## ⚡ Quick Setup (Recommended)

### 1. Start Supabase
```bash
supabase start
```

### 2. Copy Environment Variables
```bash
cp .env.example .env.local
```

### 3. Run Complete Setup
```bash
npm run db:setup
```

That's it! 🎉 Your database is now fully configured with:
- ✅ All tables and relationships
- ✅ Row Level Security policies
- ✅ Community features
- ✅ Sample data for testing

## 🔧 Manual Setup (Step by Step)

If you prefer to run each step individually:

### 1. Create Database Schema
```bash
npm run db:schema
```
Creates all tables, enums, indexes, and functions.

### 2. Setup Row Level Security
```bash
npm run db:rls
```
Implements comprehensive security policies.

### 3. Seed Sample Data
```bash
npm run db:seed
```
Adds sample users, prompts, and interactions.

## 📊 What Gets Created

### Database Tables
- **Users & Teams**: User management and team collaboration
- **Prompts**: Core prompt storage with community features
- **Community**: Likes, comments, ratings, reports, views
- **Support**: Customer support ticket system

### Security Features
- **Row Level Security**: Comprehensive access control
- **Content Moderation**: Automated filtering system
- **Admin Privileges**: Special access for administrators
- **Team Permissions**: Team-based access control

### Sample Data
- **5 Sample Users**: Different plan types and roles
- **6 Sample Prompts**: Various categories and visibility levels
- **Community Interactions**: Likes, comments, ratings
- **Support Tickets**: Example customer support cases

## 🔗 Access Your Database

After setup, you can access:

- **Supabase Studio**: http://localhost:54323
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres
- **API**: http://localhost:54321

## 👥 Sample Users

| Email | Plan | Role | Password |
|-------|------|------|----------|
| admin@promptops.com | Enterprise | Admin | hashed_password |
| john@example.com | Pro | User | hashed_password |
| jane@example.com | Free | User | hashed_password |
| mike@example.com | Team | Team Owner | hashed_password |
| sarah@example.com | Pro | Team Member | hashed_password |

## 📝 Sample Prompts

1. **Creative Writing Assistant** - Public, 45 likes, 4.8 rating
2. **Marketing Copy Generator** - Public, Voice-created, 78 likes
3. **Code Review Assistant** - Public, Programming category
4. **Business Strategy Planner** - Public, Business category
5. **Educational Content Creator** - Team visibility
6. **Personal Productivity Optimizer** - Private

## 🛠️ Troubleshooting

### Common Issues

**1. Connection Error**
```bash
# Make sure Supabase is running
supabase status
supabase start
```

**2. Permission Denied**
```bash
# Check your .env.local file
cat .env.local
```

**3. Table Already Exists**
```bash
# Reset the database
supabase db reset
npm run db:setup
```

### Reset Everything
```bash
supabase db reset
npm run db:setup
```

## 🔒 Security Notes

### Row Level Security
All tables have RLS enabled with policies that ensure:
- Users only see their own data
- Public prompts are accessible to all
- Team prompts are restricted to team members
- Admins have full access for moderation

### Content Moderation
- Automatic filtering of inappropriate content
- Manual moderation workflow for flagged content
- Report system for community policing

### Best Practices
1. **Never expose service role key** in client code
2. **Use environment variables** for all secrets
3. **Test RLS policies** thoroughly before production
4. **Monitor for suspicious activity**
5. **Regular security audits**

## 📈 Performance Optimization

### Indexes
All frequently queried columns have indexes:
- User lookups (email, username)
- Prompt filtering (category, visibility, status)
- Community interactions (user_id, prompt_id)

### Query Optimization
- Use RLS policies efficiently
- Implement pagination for large datasets
- Cache frequently accessed data
- Monitor slow queries

## 🚀 Production Deployment

### 1. Create Production Project
```bash
# Create new Supabase project at https://supabase.com
```

### 2. Link Project
```bash
supabase link --project-ref your-project-ref
```

### 3. Push Schema
```bash
supabase db push
```

### 4. Update Environment Variables
```bash
# Update .env.production with production values
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase logs: `supabase logs`
3. Check our GitHub issues
4. Join the Supabase Discord community

---

**Happy coding! 🎉**
