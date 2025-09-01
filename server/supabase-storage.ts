import { supabaseAdmin } from "./supabase";
import { type IStorage } from "./mock-storage";
import { type User } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const MemorySessionStore = MemoryStore(session);

export class SupabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemorySessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<any | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error || !data || data.length === 0) {
      // Try to create user profile if it doesn't exist
      try {
        await this.ensureUserProfile(id);
        // Try again after creating profile
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', id)
          .limit(1);

        if (retryError || !retryData || retryData.length === 0) {
          return undefined;
        }
        return retryData[0];
      } catch (createError) {
        return undefined;
      }
    }
    return data[0];
  }

  async ensureUserProfile(userId: string, email?: string): Promise<void> {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return; // User already exists
    }

    // Generate username
    let username = email ? email.split('@')[0] : 'user';
    username = username.replace(/[^a-zA-Z0-9_-]/g, '');

    if (username.length < 3) {
      username = username + '_user';
    }

    // Find unique username
    let finalUsername = username;
    let counter = 0;
    while (true) {
      const { data: existingUsername } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', finalUsername)
        .limit(1);

      if (!existingUsername || existingUsername.length === 0) {
        break;
      }
      counter++;
      finalUsername = username + '_' + counter;
    }

    // Create user profile - limits are set in Supabase defaults/triggers
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: email || '',
        username: finalUsername,
        full_name: '',
        plan: 'free',
        // Usage counters (start at 0)
        prompts_used: 0,
        enhancements_used: 0,
        prompts_saved: 0
      });

    if (error) {
      console.warn('Failed to create user profile:', error);
    }
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error || !data || data.length === 0) return undefined;
    return data[0];
  }



  async createUser(insertUser: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(insertUser)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('Failed to create user');
    return data[0];
  }

  async getUserById(id: string): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data || null;
  }

  async updateUserUsage(id: string, promptsUsed: number): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ prompts_used: promptsUsed })
      .eq('id', id)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('User not found');
    return data[0];
  }

  async updateUserEnhancementUsage(id: string, enhancementsUsed: number): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ enhancements_used: enhancementsUsed })
      .eq('id', id)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('User not found');
    return data[0];
  }

  async updateUserPlan(userId: string, plan: string): Promise<void> {
    // Only update the plan field - limits are managed in Supabase directly
    const { error } = await supabaseAdmin
      .from('users')
      .update({ plan })
      .eq('id', userId);

    if (error) throw error;
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserStripeInfo(userId: string, data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string
  }): Promise<User> {
    const updateData: any = {};

    if (data.stripeCustomerId !== undefined) {
      updateData.stripe_customer_id = data.stripeCustomerId;
    }
    if (data.stripeSubscriptionId !== undefined) {
      updateData.stripe_subscription_id = data.stripeSubscriptionId;
    }

    const { data: result, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async getSubscriptionLimits(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('subscription_limits')
      .select('*')
      .order('price_usd', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createPrompt(userId: string, insertPrompt: any): Promise<any> {
    // Remove moderation_status since it doesn't exist in the table
    const { moderationStatus, ...cleanPromptData } = insertPrompt;

    const promptData = {
      ...cleanPromptData,
      user_id: userId,
      // Use status instead of moderation_status
      status: insertPrompt.status || 'active'
    };

    const { data, error } = await supabaseAdmin
      .from('prompts')
      .insert(promptData)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) {
      console.error('Failed to create prompt:', error);
      throw error || new Error('Failed to create prompt');
    }
    return data[0];
  }

  async getPrompts(userId: string): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updatePrompt(id: string, userId: string, updates: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deletePrompt(id: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getUserPrompts(userId: string): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createPromptRun(insertPromptRun: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('prompt_runs')
      .insert(insertPromptRun)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('Failed to create prompt run');
    return data[0];
  }

  async getPromptRuns(userId: string, limit = 20): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('prompt_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async createPost(data: any): Promise<any> {
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        ...data,
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        is_pinned: false
      })
      .select()
      .single();

    if (error) throw error;
    return post;
  }

  async getPosts(): Promise<any[]> {
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return posts || [];
  }

  async createSupportTicket(insertTicket: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert(insertTicket)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('Failed to create support ticket');
    return data[0];
  }

  async getSupportTickets(userId: string): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getAllSupportTickets(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateSupportTicket(id: string, updates: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .limit(1);

    if (error || !data || data.length === 0) throw error || new Error('Support ticket not found');
    return data[0];
  }

  async deleteSupportTicket(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('support_tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Placeholder methods for compatibility
  async verifyPassword(email: string, password: string): Promise<boolean> {
    return false; // Not used with Supabase auth
  }

  async updatePassword(email: string, password: string): Promise<void> {
    // Not used with Supabase auth
  }

  async getUserStats(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const prompts = await this.getUserPrompts(userId);
    const runs = await this.getPromptRuns(userId);

    return {
      totalPrompts: prompts.length,
      totalRuns: runs.length,
      promptsUsed: user.prompts_used || 0,
      enhancementsUsed: user.enhancements_used || 0,
      plan: user.plan || 'free'
    };
  }

  async getDashboardStats(userId: string): Promise<{
    totalPrompts: number;
    runsToday: number;
    successRate: number;
    totalUsers?: number;
    activeSubscriptions?: number;
    monthlyRevenue?: number;
    apiCalls?: number;
  }> {
    // Get user's prompts
    const { data: prompts } = await supabaseAdmin
      .from('prompts')
      .select('id')
      .eq('user_id', userId);

    // Get today's runs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: runsToday } = await supabaseAdmin
      .from('prompt_runs')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    // Get all runs for success rate
    const { data: allRuns } = await supabaseAdmin
      .from('prompt_runs')
      .select('success')
      .eq('user_id', userId);

    const successfulRuns = allRuns?.filter(run => run.success) || [];
    const successRate = allRuns && allRuns.length > 0
      ? Math.round((successfulRuns.length / allRuns.length) * 100)
      : 0;

    return {
      totalPrompts: prompts?.length || 0,
      runsToday: runsToday?.length || 0,
      successRate,
    };
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    apiCalls: number;
  }> {
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('plan');

    const { data: runs } = await supabaseAdmin
      .from('prompt_runs')
      .select('id');

    const activeSubscriptions = users?.filter(u => u.plan === 'pro' || u.plan === 'team') || [];

    return {
      totalUsers: users?.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRevenue: 0, // TODO: Calculate from Stripe data
      apiCalls: runs?.length || 0,
    };
  }

  async getAllUsers(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }



  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    // For Supabase Auth, we always use the admin API to update password
    // The password will be automatically hashed by Supabase
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) throw error;
  }



  async storePasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    const { error } = await supabaseAdmin
      .from('password_reset_tokens')
      .upsert({
        user_id: userId,
        token,
        expires: expires.toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  async getPasswordResetToken(token: string): Promise<{ userId: string; expires: Date } | null> {
    const { data, error } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('user_id, expires')
      .eq('token', token)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      userId: data.user_id,
      expires: new Date(data.expires)
    };
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('password_reset_tokens')
      .delete()
      .eq('token', token);

    if (error) throw error;
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data || undefined;
  }

}

export const storage = new SupabaseStorage();
