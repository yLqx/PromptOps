import type { Express } from "express";
import { AdminAuthService, requireAdminAuth, requirePermission } from "./admin-auth";
import { supabaseAdmin } from "./supabase";
import { storage } from "./storage";
import nodemailer from "nodemailer";

export function setupAdminRoutes(app: Express) {
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      console.log('🔐 Admin login request received:', req.body.email);
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;

      const { admin, sessionToken } = await AdminAuthService.login(email, password, ipAddress);

      // Set session cookie
      res.cookie('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', // Changed from 'strict' to 'lax'
        path: '/' // Explicitly set path
      });

      console.log('🍪 Cookie set with token:', sessionToken.substring(0, 10) + '...');

      console.log('✅ Admin login successful, sending response');
      res.json({ admin, sessionToken });
    } catch (error: any) {
      console.error('❌ Admin login failed:', error.message);
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/admin/logout", requireAdminAuth, async (req, res) => {
    try {
      const sessionToken = req.cookies?.admin_session || req.headers.authorization?.replace('Bearer ', '');
      if (sessionToken) {
        await AdminAuthService.logout(sessionToken);
      }
      res.clearCookie('admin_session');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/me", requireAdminAuth, (req, res) => {
    res.json({ admin: req.admin });
  });

  // User management routes
  app.get("/api/admin/users", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { page = 1, limit = 50, search = '' } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = supabaseAdmin
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (search) {
        query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      const { data: users, error, count } = await query;
      if (error) throw error;

      res.json({
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/users/:id", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get user details
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userError) throw userError;

      // Get user's prompts count
      const { count: promptsCount } = await supabaseAdmin
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      // Get user's posts count
      const { count: postsCount } = await supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      // Get recent activity
      const { data: recentPrompts } = await supabaseAdmin
        .from('prompts')
        .select('id, title, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(5);

      res.json({
        user,
        stats: {
          promptsCount: promptsCount || 0,
          postsCount: postsCount || 0
        },
        recentActivity: recentPrompts || []
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/users/:id", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'update_user',
        'user',
        id,
        { updates },
        req.ip
      );

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/users/:id", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'delete_user',
        'user',
        id,
        {},
        req.ip
      );

      // Delete user and all related data
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/users/:id/reset-password", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      // Update password using storage
      await storage.updateUserPassword(id, newPassword);
      
      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'reset_password',
        'user',
        id,
        {},
        req.ip
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/users/:id/upgrade-plan", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const { plan } = req.body;
      
      // Update user plan
      await storage.updateUserPlan(id, plan);
      
      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'upgrade_plan',
        'user',
        id,
        { plan },
        req.ip
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/users/:id/reset-usage", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Reset usage counters
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          prompts_used: 0,
          enhancements_used: 0,
          api_calls_used: 0
        })
        .eq('id', id);

      if (error) throw error;
      
      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'reset_usage',
        'user',
        id,
        {},
        req.ip
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Email functionality
  app.post("/api/admin/users/:id/send-email", requireAdminAuth, requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const { subject, message } = req.body;
      
      // Get user email
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, full_name')
        .eq('id', id)
        .single();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Configure email transporter (you'll need to set up SMTP)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'admin@promptops.com',
        to: user.email,
        subject,
        html: `
          <h2>Message from PromptOps Admin</h2>
          <p>Hello ${user.full_name || 'User'},</p>
          <div>${message}</div>
          <br>
          <p>Best regards,<br>PromptOps Team</p>
        `
      });

      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'send_email',
        'user',
        id,
        { subject, message },
        req.ip
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Community management routes
  app.get("/api/admin/posts", requireAdminAuth, requirePermission('community'), async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { data: posts, error, count } = await supabaseAdmin
        .from('posts')
        .select(`
          *,
          users (id, username, email, full_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/posts/:id", requireAdminAuth, requirePermission('community'), async (req, res) => {
    try {
      const { id } = req.params;

      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'delete_post',
        'post',
        id,
        {},
        req.ip
      );

      const { error } = await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Models management
  app.get("/api/admin/ai-models", requireAdminAuth, requirePermission('ai_models'), async (req, res) => {
    try {
      const { data: models, error } = await supabaseAdmin
        .from('ai_models')
        .select('*')
        .order('tier', { ascending: true });

      if (error) throw error;
      res.json({ models });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/ai-models/:id", requireAdminAuth, requirePermission('ai_models'), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: model, error } = await supabaseAdmin
        .from('ai_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await AdminAuthService.logAction(
        req.admin!.id,
        'update_ai_model',
        'ai_model',
        id,
        { updates },
        req.ip
      );

      res.json({ model });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/ai-models/test/:id", requireAdminAuth, requirePermission('ai_models'), async (req, res) => {
    try {
      const { id } = req.params;

      const { data: model, error } = await supabaseAdmin
        .from('ai_models')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Test the model with a simple prompt
      let testResult = { success: false, message: '', responseTime: 0 };
      const startTime = Date.now();

      try {
        if (model.provider === 'anthropic') {
          // Test Anthropic model
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY || '',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: model.model_id,
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Test' }]
            })
          });

          if (response.ok) {
            testResult = { success: true, message: 'Model is working correctly', responseTime: Date.now() - startTime };
          } else {
            testResult = { success: false, message: `API Error: ${response.status}`, responseTime: Date.now() - startTime };
          }
        } else if (model.provider === 'openai') {
          // Test OpenAI model
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: model.model_id,
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Test' }]
            })
          });

          if (response.ok) {
            testResult = { success: true, message: 'Model is working correctly', responseTime: Date.now() - startTime };
          } else {
            testResult = { success: false, message: `API Error: ${response.status}`, responseTime: Date.now() - startTime };
          }
        }
      } catch (error: any) {
        testResult = { success: false, message: error.message, responseTime: Date.now() - startTime };
      }

      // Log the test
      await AdminAuthService.logAction(
        req.admin!.id,
        'test_ai_model',
        'ai_model',
        id,
        { testResult },
        req.ip
      );

      res.json({ testResult });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // System stats and logs
  app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
      // Get user counts by plan
      const { data: userStats } = await supabaseAdmin
        .from('users')
        .select('plan')
        .then(result => {
          const stats = { free: 0, pro: 0, team: 0, enterprise: 0, total: 0 };
          result.data?.forEach(user => {
            stats[user.plan as keyof typeof stats]++;
            stats.total++;
          });
          return { data: stats };
        });

      // Get recent activity counts
      const { count: promptsToday } = await supabaseAdmin
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { count: postsToday } = await supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      res.json({
        users: userStats,
        activity: {
          promptsToday: promptsToday || 0,
          postsToday: postsToday || 0
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/logs", requireAdminAuth, async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { data: logs, error, count } = await supabaseAdmin
        .from('admin_logs')
        .select(`
          *,
          admin_users (email, full_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw error;

      res.json({
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}
