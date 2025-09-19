import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { supabaseAuth } from "./supabase-auth";
import { storage } from "./storage";
import { supabaseAdmin, supabase } from "./supabase";
import { setupCommunityRoutes } from "./community-routes";
import { testPromptWithAI, enhancePromptWithAI } from "./ai";
import { AI_MODELS, getModelsByTier, getAvailableModelsForUser, getModelById, isModelAvailableForUser } from "../shared/ai-models.js";
import { insertPromptSchema, insertPromptRunSchema } from "@shared/schema";
import { moderatePromptContent, generateModerationReport } from "./lib/content-moderation";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

// Server start time for auto-logout feature
const SERVER_START_TIME = Date.now().toString();

// Helper function to calculate prompt quality score
function calculatePromptScore(prompt: string): number {
  let score = 0;
  const length = prompt.trim().length;

  // Length scoring (0-20 points)
  if (length < 10) score += 5;
  else if (length < 30) score += 10;
  else if (length < 100) score += 15;
  else score += 20;

  // Specificity scoring (0-25 points)
  const specificWords = ['specific', 'detailed', 'exactly', 'precisely', 'format', 'style', 'tone'];
  const hasSpecificWords = specificWords.some(word => prompt.toLowerCase().includes(word));
  if (hasSpecificWords) score += 15;
  else if (prompt.includes('please') || prompt.includes('help')) score += 8;
  else score += 5;

  // Context scoring (0-25 points)
  const contextWords = ['context', 'background', 'for', 'about', 'regarding', 'concerning'];
  const hasContext = contextWords.some(word => prompt.toLowerCase().includes(word));
  if (hasContext) score += 15;
  else if (prompt.split(' ').length > 10) score += 10;
  else score += 5;

  // Structure scoring (0-20 points)
  const hasQuestions = prompt.includes('?');
  const hasInstructions = prompt.toLowerCase().includes('write') || prompt.toLowerCase().includes('create') || prompt.toLowerCase().includes('generate');
  if (hasQuestions && hasInstructions) score += 15;
  else if (hasQuestions || hasInstructions) score += 10;
  else score += 5;

  // Clarity scoring (0-10 points)
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) score += 8;
  else score += 5;

  return Math.min(Math.max(score, 5), 50); // Cap original scores at 50 to show improvement potential
}

// Helper function to create fallback enhancement
function createFallbackEnhancement(originalPrompt: string): string {
  const prompt = originalPrompt.trim();

  // Basic enhancement patterns
  if (prompt.toLowerCase().startsWith('write')) {
    return `${prompt}

Please ensure your response:
- Is well-structured and organized
- Uses clear, engaging language
- Includes relevant details and examples
- Follows proper formatting conventions
- Maintains consistency in tone and style throughout`;
  }

  if (prompt.toLowerCase().includes('story')) {
    return `Create a compelling story about ${prompt.replace(/write.*story.*about/i, '').trim()}.

Requirements:
- Include vivid descriptions and character development
- Use engaging dialogue and narrative flow
- Maintain consistent pacing and tension
- Ensure a satisfying conclusion
- Target length: 500-1000 words`;
  }

  // Generic enhancement
  return `${prompt}

Please provide a comprehensive response that:
- Addresses all aspects of the request thoroughly
- Uses clear, professional language
- Includes specific examples and details where relevant
- Is well-organized with logical flow
- Meets high quality standards for accuracy and completeness`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Setup community routes
  setupCommunityRoutes(app);

  // Add Supabase auth middleware for JWT tokens
  app.use(supabaseAuth);

  // Server info endpoint for auto-logout feature
  app.get("/api/server-info", (req, res) => {
    res.json({ startTime: SERVER_START_TIME });
  });

  // Auth middleware - require authenticated user (keep existing session-based auth)
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Plan limits middleware
  const checkPromptLimit = async (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    // Get fresh user data from database
    const currentUser = await storage.getUser(user.id);
    if (!currentUser) return res.sendStatus(404);

    // Get limit from subscription_limits table (ONLY Supabase, no hardcoded fallback)
    const { data: subscriptionLimits, error: limitsError } = await supabaseAdmin
      .from('subscription_limits')
      .select('prompts_per_month')
      .eq('tier', currentUser.plan)
      .single();

    if (limitsError || !subscriptionLimits) {
      console.error('❌ Failed to get subscription limits from Supabase:', limitsError);
      return res.status(500).json({ error: 'Failed to check subscription limits' });
    }

    const userLimit = subscriptionLimits.prompts_per_month;
    const promptsUsed = currentUser.prompts_used || 0;

    if (userLimit !== -1 && promptsUsed >= userLimit) {
      return res.status(403).json({
        message: `Prompt limit reached! You've used ${promptsUsed}/${userLimit} prompts for your ${currentUser.plan} plan. Please upgrade to continue.`,
        currentUsage: promptsUsed,
        limit: userLimit,
        plan: currentUser.plan
      });
    }
    next();
  };

  // User stats
  app.get("/api/user/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.user!.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Billing cycle reset function
  const checkAndResetBillingCycle = async (userId: string) => {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) return;

      const now = new Date();
      const billingCycleEnd = user.billing_cycle_end ? new Date(user.billing_cycle_end) : null;

      // Check if billing cycle has ended
      if (billingCycleEnd && now > billingCycleEnd) {
        const newCycleStart = now;
        const newCycleEnd = new Date(now);
        newCycleEnd.setMonth(newCycleEnd.getMonth() + 1);

        // Reset usage counters and update billing cycle
        await supabaseAdmin
          .from('users')
          .update({
            prompts_used: 0,
            enhancements_used: 0,
            billing_cycle_start: newCycleStart.toISOString().split('T')[0],
            billing_cycle_end: newCycleEnd.toISOString().split('T')[0],
            last_reset_date: newCycleStart.toISOString().split('T')[0]
          })
          .eq('id', userId);

        console.log(`🔄 Billing cycle reset for user ${user.email}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking billing cycle:', error);
      return false;
    }
  };

  // Get real-time user usage
  app.get("/api/user/usage", requireAuth, async (req, res) => {
    try {
      const user = req.user!;

      // Check and reset billing cycle if needed
      await checkAndResetBillingCycle(user.id);

      const currentUser = await storage.getUser(user.id);

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get actual prompt count from database for slots (saved prompts)
      const actualPrompts = await storage.getUserPrompts(user.id);
      const actualSavedPrompts = actualPrompts.length;

      // prompts_used is for test usage tracking, not for saved prompts
      const promptTestsUsed = currentUser.prompts_used || 0;

      // Fetch limits from subscription_limits table (ONLY Supabase, no hardcoded fallback)
      const { data: subscriptionLimits, error: limitsError } = await supabaseAdmin
        .from('subscription_limits')
        .select('prompts_per_month, ai_enhancements_per_month, prompt_slots')
        .eq('tier', currentUser.plan)
        .single();

      if (limitsError || !subscriptionLimits) {
        console.error('❌ Failed to get subscription limits from Supabase:', limitsError);
        return res.status(500).json({ error: 'Failed to fetch subscription limits' });
      }

      const finalPromptsLimit = subscriptionLimits.prompts_per_month;
      const finalEnhancementsLimit = subscriptionLimits.ai_enhancements_per_month;
      const finalSlotsLimit = subscriptionLimits.prompt_slots;

      // Debug log to see what's being returned
      console.log('🔍 USAGE API DEBUG:', {
        user_email: currentUser.email,
        plan: currentUser.plan,
        subscription_limits_from_db: subscriptionLimits,
        final_response: {
          prompts_used: promptTestsUsed,
          prompts_saved: actualSavedPrompts,
          enhancements_used: currentUser.enhancements_used || 0,
          prompts_per_month: finalPromptsLimit,
          ai_enhancements_per_month: finalEnhancementsLimit,
          prompts_slots: finalSlotsLimit,
          plan: currentUser.plan || 'free'
        }
      });

      res.json({
        // Usage counts - SEPARATE test usage from saved prompts
        prompts_used: promptTestsUsed, // For test usage tracking
        enhancements_used: currentUser.enhancements_used || 0,
        prompts_saved: actualSavedPrompts, // For slot usage (actual saved prompts)

        // Limits from database (or fallback to plan defaults)
        prompts_per_month: finalPromptsLimit,
        ai_enhancements_per_month: finalEnhancementsLimit,
        prompts_slots: finalSlotsLimit,

        // Plan info
        plan: currentUser.plan || 'free'
      });
    } catch (error) {
      console.error('Error fetching user usage:', error);
      res.status(500).json({ error: "Failed to fetch user usage" });
    }
  });

  // Sync user usage with actual data (admin/debug endpoint)
  app.post("/api/user/sync-usage", requireAuth, async (req, res) => {
    try {
      const user = req.user!;

      // Get actual counts from database
      const actualPrompts = await storage.getUserPrompts(user.id);
      const actualPromptCount = actualPrompts.length;

      // Update usage counters
      await storage.updateUserUsage(user.id, actualPromptCount);

      console.log(`🔄 Usage synced for user ${user.email}: ${actualPromptCount} prompts`);

      res.json({
        message: "Usage synced successfully",
        prompts_used: actualPromptCount,
        synced_at: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error syncing user usage:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Note: Limits are now fetched from subscription_limits table, no need for admin fix endpoint

  // Update user plan with proper limit and billing cycle management
  app.post("/api/user/update-plan", requireAuth, async (req, res) => {
    try {
      const { plan } = req.body;
      const user = req.user!;
      const validPlans = ['free', 'pro', 'team', 'enterprise'];

      if (!validPlans.includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      const now = new Date();
      const billingCycleEnd = new Date(now);
      billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

      // Update plan and billing cycle (limits come from subscription_limits table)
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          plan: plan,
          billing_cycle_start: now.toISOString().split('T')[0],
          billing_cycle_end: billingCycleEnd.toISOString().split('T')[0],
          last_reset_date: now.toISOString().split('T')[0],
          // Reset usage when changing plans
          prompts_used: 0,
          enhancements_used: 0
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user plan:', error);
        return res.status(500).json({ message: 'Failed to update plan' });
      }

      // Get the new limits from subscription_limits table
      const { data: subscriptionLimits } = await supabaseAdmin
        .from('subscription_limits')
        .select('prompts_per_month, ai_enhancements_per_month, prompt_slots')
        .eq('tier', plan)
        .single();

      console.log(`✅ Plan updated: ${user.email} -> ${plan}`);

      res.json({
        success: true,
        message: "Plan updated successfully",
        plan,
        limits: subscriptionLimits,
        billing_cycle_start: now.toISOString().split('T')[0],
        billing_cycle_end: billingCycleEnd.toISOString().split('T')[0]
      });
    } catch (error: any) {
      console.error('Error in update-plan endpoint:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get subscription limits
  app.get("/api/subscription-limits", async (req, res) => {
    try {
      const limits = await storage.getSubscriptionLimits();
      res.json(limits);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard-stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user!.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Models endpoints
  // Get all AI models
  app.get("/api/models", async (req, res) => {
    try {
      res.json(AI_MODELS);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get models by tier
  app.get("/api/models/tier/:tier", async (req, res) => {
    try {
      const { tier } = req.params;
      if (!['free', 'pro', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid tier. Must be 'free', 'pro', or 'enterprise'" });
      }
      const models = getModelsByTier(tier as 'free' | 'pro' | 'team');
      res.json(models);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Debug endpoint to check user plan detection
  app.get("/api/debug/user-plan", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const currentUser = await storage.getUser(user.id);

      console.log('🔍 Debug user plan detection:', {
        reqUser: user,
        currentUser: currentUser,
        userPlan: currentUser?.plan || 'free'
      });

      const userPlan = currentUser?.plan || 'free';
      const availableModels = getAvailableModelsForUser(userPlan);

      res.json({
        sessionUser: {
          id: user.id,
          email: user.email,
          plan: user.plan
        },
        databaseUser: currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          plan: currentUser.plan,
          promptsUsed: currentUser.promptsUsed,
          enhancementsUsed: currentUser.enhancementsUsed
        } : null,
        finalUserPlan: userPlan,
        availableModels: availableModels.length,
        modelsByTier: {
          free: availableModels.filter(m => m.tier === 'free').length,
          pro: availableModels.filter(m => m.tier === 'pro').length,
          team: availableModels.filter(m => m.tier === 'team').length
        },
        sampleProModels: availableModels.filter(m => m.tier === 'pro').slice(0, 3).map(m => m.name)
      });
    } catch (error: any) {
      console.error('Debug user plan error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Test endpoint for Claude models (no auth required for testing)
  app.post("/api/test/claude-models", async (req, res) => {
    try {
      const { model, prompt } = req.body;

      if (!model || !prompt) {
        return res.status(400).json({ error: 'Model and prompt are required' });
      }

      console.log(`🧪 Testing Claude model: ${model}`);

      const aiResponse = await testPromptWithAI(prompt, model);

      if (aiResponse.success) {
        console.log(`✅ Claude model ${model} test successful`);
        res.json({
          success: true,
          model: model,
          response: aiResponse.response,
          responseTime: aiResponse.responseTime
        });
      } else {
        console.log(`❌ Claude model ${model} test failed:`, aiResponse.error);
        res.status(500).json({
          success: false,
          model: model,
          error: aiResponse.error
        });
      }
    } catch (error: any) {
      console.error('Claude model test error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Test endpoint for ALL AI models (no auth required for testing)
  app.post("/api/test/ai-models", async (req, res) => {
    try {
      const { model, prompt } = req.body;

      if (!model || !prompt) {
        return res.status(400).json({ error: 'Model and prompt are required' });
      }

      console.log(`🧪 Testing AI model: ${model}`);

      const aiResponse = await testPromptWithAI(prompt, model);

      if (aiResponse.success) {
        console.log(`✅ AI model ${model} test successful`);
        res.json({
          success: true,
          model: model,
          response: aiResponse.response,
          responseTime: aiResponse.responseTime
        });
      } else {
        console.log(`❌ AI model ${model} test failed:`, aiResponse.error);
        res.status(500).json({
          success: false,
          model: model,
          error: aiResponse.error
        });
      }
    } catch (error: any) {
      console.error('AI model test error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all available models with their implementation status
  app.get("/api/test/models-status", async (req, res) => {
    try {
      const allModels = AI_MODELS.map(model => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        tier: model.tier,
        enabled: model.enabled,
        category: model.category,
        apiKeyEnvVar: model.apiKeyEnvVar,
        hasApiKey: !!process.env[model.apiKeyEnvVar]
      }));

      const summary = {
        total: allModels.length,
        enabled: allModels.filter(m => m.enabled).length,
        byTier: {
          free: allModels.filter(m => m.tier === 'free' && m.enabled).length,
          pro: allModels.filter(m => m.tier === 'pro' && m.enabled).length,
          team: allModels.filter(m => m.tier === 'team' && m.enabled).length
        },
        byProvider: allModels.reduce((acc, model) => {
          if (model.enabled) {
            acc[model.provider] = (acc[model.provider] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>),
        withApiKeys: allModels.filter(m => m.hasApiKey).length
      };

      res.json({
        models: allModels,
        summary
      });
    } catch (error: any) {
      console.error('Models status error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get available models for user (based on their plan) - SIMPLE & RELIABLE
  app.get("/api/models/available", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      let userPlan = user.plan || 'free';

      console.log('🔍 Models available request (initial):', {
        userId: user.id,
        userEmail: user.email,
        userPlan: userPlan
      });

      // ALWAYS fetch fresh user data from database to ensure plan is up-to-date
      try {
        const currentUser = await storage.getUser(user.id);
        if (currentUser && currentUser.plan) {
          userPlan = currentUser.plan;
          console.log('✅ Fresh plan from database:', user.email, '->', userPlan);
        } else {
          // Fallback: Try Supabase directly
          const { data: freshUserData, error: userError } = await supabaseAdmin
            .from('users')
            .select('plan')
            .eq('email', user.email)
            .single();

          if (!userError && freshUserData?.plan) {
            userPlan = freshUserData.plan;
            console.log('✅ FALLBACK: Updated plan from Supabase:', user.email, '->', userPlan);
          }
        }
      } catch (error) {
        console.warn('⚠️ Plan fetch failed, using session plan:', error);
      }

      // Simple plan-based model access (no complex subscription_limits lookup)
      let allowedTiers: string[] = [];

      switch (userPlan.toLowerCase()) {
        case 'free':
          allowedTiers = ['free'];
          break;
        case 'pro':
          allowedTiers = ['free', 'pro'];
          break;
        case 'team':
          allowedTiers = ['free', 'pro', 'team'];
          break;
        case 'enterprise':
          allowedTiers = ['free', 'pro', 'team', 'enterprise'];
          break;
        default:
          // Default to free if plan is unknown
          allowedTiers = ['free'];
          console.warn('⚠️ Unknown plan, defaulting to free:', userPlan);
      }

      console.log('✅ Plan-based access:', {
        userPlan: userPlan,
        allowedTiers: allowedTiers
      });

      // Get available models from local AI_MODELS array based on allowed tiers
      const availableModels = getAvailableModelsForUser(userPlan);

      // Group models by tier for better debugging
      const modelsByTier = {
        free: availableModels.filter(m => m.tier === 'free'),
        pro: availableModels.filter(m => m.tier === 'pro'),
        team: availableModels.filter(m => m.tier === 'team')
      };

      console.log('✅ SIMPLE PLAN SYSTEM - Models available:', {
        userEmail: user.email,
        userPlan: userPlan,
        allowedTiers: allowedTiers,
        totalModels: availableModels?.length || 0,
        modelsByTier: {
          free: modelsByTier.free.length,
          pro: modelsByTier.pro.length,
          team: modelsByTier.team.length
        }
      });

      // Return the format the frontend expects: { models, userPlan }
      res.json({
        models: availableModels || [],
        userPlan: userPlan,
        modelsByTier: modelsByTier
      });
    } catch (error: any) {
      console.error('Error fetching available models:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific model by ID
  app.get("/api/models/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const model = getModelById(id);
      
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      res.json(model);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Check if model is available for user
  app.get("/api/models/:id/available", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      const currentUser = await storage.getUser(user.id);
      
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPlan = currentUser.plan || 'free';
      const model = getModelById(id);
      
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      const isAvailable = getAvailableModelsForUser(userPlan).some(m => m.id === id);
      res.json({ 
        available: isAvailable,
        model: model,
        userPlan: userPlan,
        enabled: model.enabled
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Prompts CRUD
  app.get("/api/prompts", requireAuth, async (req, res) => {
    try {
      const prompts = await storage.getPrompts(req.user!.id);
      res.json(prompts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/prompts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const user = req.user!;

      // Check slot limits before creating prompt
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get current prompt count (this represents used slots)
      const userPrompts = await storage.getUserPrompts(user.id);
      const currentSlotUsage = userPrompts.length;

      // Get slot limit from subscription_limits table (ONLY Supabase, no hardcoded fallback)
      const { data: subscriptionLimits, error: limitsError } = await supabaseAdmin
        .from('subscription_limits')
        .select('prompt_slots')
        .eq('tier', currentUser.plan)
        .single();

      if (limitsError || !subscriptionLimits) {
        console.error('❌ Failed to get slot limits from Supabase:', limitsError);
        return res.status(500).json({ error: 'Failed to check slot limits' });
      }

      const slotLimit = subscriptionLimits.prompt_slots;

      // Check if user has reached slot limit
      if (slotLimit !== -1 && currentSlotUsage >= slotLimit) {
        return res.status(403).json({
          error: "Maximum slots reached",
          message: `You've reached your maximum of ${slotLimit} prompt slots for your ${currentUser.plan} plan. Please upgrade to create more prompts.`,
          currentUsage: currentSlotUsage,
          limit: slotLimit,
          plan: currentUser.plan
        });
      }

      // Content moderation
      const moderationResult = moderatePromptContent(
        validatedData.content,
        validatedData.title,
        validatedData.description || undefined
      );

      const report = generateModerationReport(moderationResult, validatedData.content);

      // Handle moderation result
      if (report.action === 'reject') {
        return res.status(400).json({
          message: "Content violates community guidelines",
          details: moderationResult.reasons,
          severity: moderationResult.severity
        });
      }

      // Set moderation status based on result
      const promptData = {
        ...validatedData,
        moderationStatus: report.action === 'approve' ? 'approved' : 'pending',
        visibility: report.action === 'approve' ? (validatedData.visibility || 'private') : 'private'
      };

      const prompt = await storage.createPrompt(req.user!.id, promptData);

      // Note: prompts_used is for test usage, not for saved prompts
      // Slot usage is automatically tracked by counting actual saved prompts
      console.log(`✅ Prompt created successfully - Slot usage will be updated on next API call`);

      // Include moderation info in response
      res.status(201).json({
        ...prompt,
        moderation: {
          status: report.action,
          message: report.recommendation,
          requiresReview: report.action === 'review'
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/prompts/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(req.params.id, req.user!.id, validatedData);
      res.json(prompt);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/prompts/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePrompt(req.params.id, req.user!.id);

      // Update usage counter when prompt is successfully deleted
      try {
        const currentUser = await storage.getUser(req.user!.id);
        if (currentUser && currentUser.prompts_used > 0) {
          const newUsage = Math.max(0, (currentUser.prompts_used || 0) - 1);
          await storage.updateUserUsage(req.user!.id, newUsage);
          console.log(`✅ Prompt deleted - Usage updated: ${newUsage} prompts used`);
        }
      } catch (error) {
        console.warn('❌ Failed to update usage counter after prompt deletion:', error);
      }

      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enhance prompt with AI


  // Generate prompt from file content
  app.post("/api/generate-prompt-from-file", requireAuth, async (req, res) => {
    try {
      const { content, fileName, model } = req.body;

      if (!content || !fileName) {
        return res.status(400).json({ message: "File content and name are required" });
      }

      // Create a specialized prompt for generating prompts from file content
      const systemPrompt = `You are an expert prompt engineer. Your task is to analyze the provided file content and generate a high-quality, specific prompt that could be used with AI models to work with or analyze this type of content.

Guidelines:
1. Create a prompt that is clear, specific, and actionable
2. Include relevant context about the file type and content
3. Make the prompt versatile enough to be useful for similar content
4. Focus on the most valuable use cases for this type of content
5. Keep the prompt concise but comprehensive

File: ${fileName}
Content: ${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

Generate a professional prompt that would help users effectively work with this type of content:`;

      const aiResponse = await testPromptWithAI(systemPrompt, model);

      if (!aiResponse.success) {
        return res.status(500).json({
          message: "Failed to generate prompt from file",
          error: aiResponse.error
        });
      }

      res.json({
        prompt: aiResponse.response,
        model: aiResponse.model,
        responseTime: aiResponse.responseTime,
        sourceFile: fileName
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate prompt from voice transcript
  app.post("/api/generate-prompt-from-voice", requireAuth, async (req, res) => {
    try {
      const { content, model } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Voice transcript content is required" });
      }

      // Create a specialized prompt for generating prompts from voice transcript
      const systemPrompt = `You are an expert prompt engineer. Your task is to analyze the provided voice transcript and generate a high-quality, specific prompt that could be used with AI models to accomplish what the user described.

Guidelines:
1. Create a prompt that is clear, specific, and actionable
2. Interpret the user's intent from their natural speech
3. Make the prompt professional and well-structured
4. Focus on the most valuable interpretation of what the user wants
5. Keep the prompt concise but comprehensive
6. Transform casual speech into professional prompt language

Voice Transcript: ${content}

Generate a professional prompt based on what the user described:`;

      const aiResponse = await testPromptWithAI(systemPrompt, model);

      if (!aiResponse.success) {
        return res.status(500).json({
          message: "Failed to generate prompt from voice",
          error: aiResponse.error
        });
      }

      res.json({
        prompt: aiResponse.response,
        model: aiResponse.model,
        responseTime: aiResponse.responseTime,
        sourceTranscript: content
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test prompt with AI
  app.post("/api/test-prompt", requireAuth, async (req, res) => {
    try {
      let { promptContent, promptId, model } = req.body;

      console.log('🔍 Test prompt request - received model:', model, 'promptContent length:', promptContent?.length);

      // Convert model to the actual model name (handle both UUIDs and direct names)
      let actualModelName = model;

      // First, handle direct model name mapping (for backwards compatibility)
      const directModelMapping: { [key: string]: string } = {
        'claude-3-haiku-20240307': 'claude-3-haiku',
        'claude-3-5-haiku-20241022': 'claude-3.5-haiku',
        'claude-3-opus-20240229': 'claude-3-opus',
        'claude-3-7-sonnet-20250219': 'claude-3.7-sonnet',
        'gemini-2.5-flash': 'gemini-1.5-flash', // Fix common typo
        'gemini-1.5-flash': 'gemini-1.5-flash',
        'gpt-4o': 'gpt-4o',
        'deepseek-chat': 'deepseek-chat',
        'deepseek-coder': 'deepseek-coder-v3.0',
        'llama-3-8b-instruct': 'llama-3-8b',
        'llama-3-70b-instruct': 'llama-3-70b'
      };

      if (directModelMapping[model]) {
        actualModelName = directModelMapping[model];
        console.log('✅ Direct model mapping:', model, '->', actualModelName);
      } else if (model && model.length === 36 && model.includes('-')) {
        // This looks like a UUID, fetch the actual model name from Supabase
        try {
          const { data: modelData, error: modelError } = await supabaseAdmin
            .from('ai_models')
            .select('model_id, name')
            .eq('id', model)
            .single();

          if (modelError || !modelData) {
            console.error('❌ Failed to find model with UUID:', model, modelError);
            return res.status(400).json({ message: `Invalid model ID: ${model}` });
          }

          // Map Supabase model_id to AI service expected names
          const modelMapping: { [key: string]: string } = {
            // Claude models
            'claude-3-haiku-20240307': 'claude-3-haiku',
            'claude-3-5-haiku-20241022': 'claude-3.5-haiku',
            'claude-3-opus-20240229': 'claude-3-opus',
            'claude-3-7-sonnet-20250219': 'claude-3.7-sonnet',
            'claude-3.5-sonnet': 'claude-3.5-sonnet',
            'claude-3.5-haiku': 'claude-3.5-haiku',
            'claude-3-haiku': 'claude-3-haiku',
            'claude-3-opus': 'claude-3-opus',

            // Google models
            'gemini-1.5-flash': 'gemini-1.5-flash',
            'gemini-1.5-pro': 'gemini-1.5-pro',
            'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',

            // OpenAI models
            'gpt-4o': 'gpt-4o',
            'gpt-4o-mini': 'gpt-4o-mini',
            'gpt-4-turbo': 'gpt-4-turbo',

            // DeepSeek models
            'deepseek-chat': 'deepseek-chat',
            'deepseek-coder': 'deepseek-coder-v3.0',
            'deepseek-coder-v3.0': 'deepseek-coder-v3.0',

            // LLaMA models
            'llama-3-8b-instruct': 'llama-3-8b',
            'llama-3-70b-instruct': 'llama-3-70b',
            'llama-3-8b': 'llama-3-8b',
            'llama-3-70b': 'llama-3-70b'
          };

          const rawModelId = modelData.model_id;
          actualModelName = modelMapping[rawModelId] || rawModelId;
          console.log('✅ Converted UUID to model name:', model, '->', rawModelId, '->', actualModelName);
        } catch (error) {
          console.error('❌ Error converting model UUID:', error);
          return res.status(400).json({ message: `Failed to resolve model: ${model}` });
        }
      }

      // ULTIMATE FIX: Force correct model at the API level
      if (actualModelName === "gemini-2.5-flash") {
        console.log('🚨 TEST API LEVEL FIX: gemini-2.5-flash -> gemini-1.5-flash');
        actualModelName = "gemini-1.5-flash";
      }

      console.log('🔍 Final model name for AI service:', actualModelName);

      if (!promptContent) {
        return res.status(400).json({ message: "Prompt content is required" });
      }

      // 🔒 VALIDATE MODEL ACCESS - Check if user's plan allows access to this model
      const user = req.user!;
      let userPlan = user.plan || 'free';

      // Get fresh user plan from database
      try {
        const currentUser = await storage.getUser(user.id);
        if (currentUser && currentUser.plan) {
          userPlan = currentUser.plan;
          console.log('✅ Fresh user plan from database:', user.email, '->', userPlan);
        }
      } catch (error) {
        console.warn('⚠️ Failed to get fresh user plan, using session plan:', userPlan);
      }

      // Check if user can access this model
      const hasModelAccess = isModelAvailableForUser(actualModelName, userPlan);
      if (!hasModelAccess) {
        const model = getModelById(actualModelName);
        const modelTier = model?.tier || 'unknown';
        console.log(`❌ Model access denied: ${user.email} (${userPlan}) tried to access ${actualModelName} (${modelTier})`);

        return res.status(403).json({
          message: `Access denied: ${actualModelName} requires ${modelTier} plan. Your current plan: ${userPlan}`,
          error: "INSUFFICIENT_PLAN",
          requiredPlan: modelTier,
          currentPlan: userPlan,
          modelName: actualModelName
        });
      }

      console.log(`✅ Model access granted: ${user.email} (${userPlan}) can access ${actualModelName}`);

      const aiResponse = await testPromptWithAI(promptContent, actualModelName);

      // Record run and update usage
      const runData = {
        user_id: req.user!.id,
        prompt_id: promptId || null,
        prompt_content: promptContent,
        response: aiResponse.response,
        model: aiResponse.model,
        response_time: aiResponse.responseTime,
        success: aiResponse.success,
        error: aiResponse.error,
      };

      try {
        await storage.createPromptRun(runData);
        console.log('✅ Prompt run created successfully');
      } catch (error) {
        console.warn('❌ Failed to create prompt run:', error);
      }

      // Only increment usage counter for successful AI API calls
      if (aiResponse.success) {
        try {
          // Get fresh user data to check current limits and usage
          const currentUser = await storage.getUser(req.user!.id);
          if (!currentUser) {
            console.warn('❌ User not found for usage update');
            return res.json(aiResponse); // Still return the successful response
          }

          const currentUsage = currentUser.prompts_used || 0;
          
          // Get user's limit from subscription_limits table (ONLY Supabase, no hardcoded fallback)
          const { data: subscriptionLimits, error: limitsError } = await supabaseAdmin
            .from('subscription_limits')
            .select('prompts_per_month')
            .eq('tier', currentUser.plan)
            .single();

          if (limitsError || !subscriptionLimits) {
            console.error('❌ Failed to get prompt limits from Supabase:', limitsError);
            // Still return the successful AI response, but log the error
            return res.json(aiResponse);
          }

          const userLimit = subscriptionLimits.prompts_per_month;

          // Check if user would exceed limit with this usage
          if (userLimit !== -1 && currentUsage >= userLimit) {
            console.log(`⚠️ User ${currentUser.id} has reached limit: ${currentUsage}/${userLimit}`);
            // Don't increment usage, but still return the successful AI response
            // This handles edge cases where multiple requests come in simultaneously
            return res.json(aiResponse);
          }

          // Safe to increment usage
          const newUsage = currentUsage + 1;
          await storage.updateUserUsage(req.user!.id, newUsage);
          console.log(`✅ Usage updated: ${newUsage} prompts used (limit: ${userLimit === -1 ? 'unlimited' : userLimit})`);

          // Update the user object in the request for immediate response
          req.user!.promptsUsed = newUsage;
        } catch (error) {
          console.warn('❌ Failed to update user usage:', error);
        }
      } else {
        console.log('⚠️ API call failed - not incrementing usage counter');
      }

      res.json(aiResponse);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Prompt runs history
  app.get("/api/prompt-runs", requireAuth, async (req, res) => {
    try {
      const runs = await storage.getPromptRuns(req.user!.id);
      res.json(runs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Billing routes (Stripe integration)
  if (stripe) {
    // Create checkout session for upgrades
    app.post("/api/create-checkout-session", requireAuth, async (req, res) => {
      try {
        const { plan } = req.body;
        const user = req.user!;

        // Define price IDs for each plan (these would be from your Stripe dashboard)
        const priceIds = {
          pro: process.env.STRIPE_PRO_PRICE_ID || "price_1234567890pro",
          team: process.env.STRIPE_TEAM_PRICE_ID || "price_1234567890team",
          enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_1234567890enterprise"
        };

        if (!priceIds[plan as keyof typeof priceIds]) {
          return res.status(400).json({ message: "Invalid plan selected" });
        }

        // Create customer if doesn't exist
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
            metadata: {
              userId: user.id
            }
          });
          customerId = customer.id;
          await storage.updateUserStripeInfo(user.id, {
            stripeCustomerId: customerId,
          });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceIds[plan as keyof typeof priceIds],
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/billing?canceled=true`,
          metadata: {
            userId: user.id,
            plan: plan
          }
        });

        res.json({ url: session.url });
      } catch (error: any) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ message: error.message });
      }
    });

    app.post("/api/create-subscription", requireAuth, async (req, res) => {
      try {
        const { priceId } = req.body;
        let user = req.user!;

        // Create customer if doesn't exist
        if (!user.stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
          });

          user = await storage.updateUserStripeInfo(user.id, {
            stripeCustomerId: customer.id,
          });
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: user.stripeCustomerId!,
          items: [{ price: priceId }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });

        await storage.updateUserStripeInfo(user.id, {
          stripeSubscriptionId: subscription.id,
        });

        const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = (latestInvoice as any).payment_intent as Stripe.PaymentIntent;

        res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret,
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    // Get subscription details
    app.get("/api/subscription", requireAuth, async (req, res) => {
      try {
        const user = req.user!;

        if (!user.stripeSubscriptionId) {
          return res.json({ subscription: null });
        }

        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        res.json({
          status: subscription.status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          plan: user.plan,
          price_id: subscription.items.data[0]?.price.id
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    // Create customer portal session
    app.post("/api/create-portal-session", requireAuth, async (req, res) => {
      try {
        const user = req.user!;

        if (!user.stripeCustomerId) {
          return res.status(400).json({ message: "No Stripe customer found" });
        }

        const session = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/billing`,
        });

        res.json({ url: session.url });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    app.post("/api/cancel-subscription", requireAuth, async (req, res) => {
      try {
        const user = req.user!;

        if (user.stripeSubscriptionId) {
          // Cancel at period end instead of immediately
          await stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: true
          });
        }

        res.json({ success: true });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    // Reactivate subscription
    app.post("/api/reactivate-subscription", requireAuth, async (req, res) => {
      try {
        const user = req.user!;

        if (user.stripeSubscriptionId) {
          await stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: false
          });
        }

        res.json({ success: true });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    // Manual sync subscription status (for when webhooks aren't set up yet)
    app.post("/api/sync-subscription", requireAuth, async (req, res) => {
      try {
        const user = req.user!;

        if (!user.stripeCustomerId) {
          return res.status(400).json({ message: "No Stripe customer found" });
        }

        // Get all subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          const priceId = subscription.items.data[0]?.price.id;

          // Map price ID to plan
          let plan = 'free';
          if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            plan = 'pro';
          } else if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
            plan = 'team';
          } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
            plan = 'enterprise';
          }

          // Update user plan and reset usage
          await supabaseAdmin
            .from('users')
            .update({
              plan,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              subscription_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
              prompts_used: 0,
              enhancements_used: 0,
              api_calls_used: 0
            })
            .eq('id', user.id);

          console.log(`✅ Synced user ${user.id} to ${plan} plan`);

          res.json({
            success: true,
            plan,
            message: `Successfully synced to ${plan} plan!`
          });
        } else {
          res.json({
            success: false,
            message: "No active subscription found"
          });
        }
      } catch (error: any) {
        console.error('Sync subscription error:', error);
        res.status(500).json({ message: error.message });
      }
    });

    // Stripe webhook handler
    app.post("/api/stripe-webhook", async (req, res) => {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        return res.status(400).send('Missing signature or webhook secret');
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Helper function to update user plan with billing cycle (limits from subscription_limits table)
      const updateUserPlanFromWebhook = async (userId: string, plan: string) => {
        const now = new Date();
        const billingCycleEnd = new Date(now);
        billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

        await supabaseAdmin
          .from('users')
          .update({
            plan: plan,
            billing_cycle_start: now.toISOString().split('T')[0],
            billing_cycle_end: billingCycleEnd.toISOString().split('T')[0],
            last_reset_date: now.toISOString().split('T')[0],
            // Reset usage counters for new billing cycle
            prompts_used: 0,
            enhancements_used: 0
          })
          .eq('id', userId);

        console.log(`✅ Webhook: Updated user ${userId} to ${plan} plan`);
      };

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;

          if (userId && plan) {
            await updateUserPlanFromWebhook(userId, plan);
            await storage.updateUserStripeInfo(userId, {
              stripeSubscriptionId: session.subscription as string,
            });
          }
          break;

        case 'customer.subscription.updated':
          const updatedSubscription = event.data.object;
          if (updatedSubscription.metadata?.userId && updatedSubscription.metadata?.plan) {
            await updateUserPlanFromWebhook(updatedSubscription.metadata.userId, updatedSubscription.metadata.plan);
          }
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          if (customer && !customer.deleted) {
            // Find user by stripe customer ID and downgrade to free
            const users = await storage.getAllUsers();
            const user = users.find(u => u.stripeCustomerId === customer.id);
            if (user) {
              await updateUserPlanFromWebhook(user.id, "free");
              await storage.updateUserStripeInfo(user.id, {
                stripeSubscriptionId: undefined,
              });
            }
          }
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          console.log('Payment succeeded for invoice:', invoice.id);
          // Reset billing cycle on successful payment
          if ((invoice as any).subscription && invoice.metadata?.userId) {
            await checkAndResetBillingCycle(invoice.metadata.userId);
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    });
  }

  // Support ticket routes
  app.get("/api/support/tickets", requireAuth, async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets(req.user!.id);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/support-tickets", requireAuth, async (req, res) => {
    try {
      const { title, description, urgency } = req.body;
      const ticket = await storage.createSupportTicket({
        userId: req.user!.id,
        subject: title,
        description,
        priority: urgency,
        category: "general"
      });
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Password change endpoint
  app.post("/api/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Verify current password
      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValidPassword = await storage.verifyPassword(user.email, currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password
      await storage.updateUserPassword(user.id, newPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin moderation routes
  app.get("/api/admin/moderation/queue", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.email !== "admin@promptops.com" && user.email !== "mourad@admin.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Mock moderation queue data
      const queue = [
        {
          id: "1",
          type: "prompt",
          title: "Advanced Marketing Strategy",
          content: "Create a comprehensive marketing strategy for...",
          author: { username: "marketer123", plan: "pro" },
          status: "pending",
          severity: "medium",
          reasons: ["Contains suspicious keywords: hack, exploit"],
          confidence: 0.6,
          createdAt: new Date().toISOString(),
          reportCount: 2
        }
      ];

      res.json(queue);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/moderation/stats", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.email !== "admin@promptops.com" && user.email !== "mourad@admin.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Mock moderation stats
      const stats = {
        totalReviewed: 1247,
        pendingReview: 23,
        approvedToday: 45,
        rejectedToday: 8,
        averageReviewTime: "2.3 minutes",
        flaggedContent: 12
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/moderation/action", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.email !== "admin@promptops.com" && user.email !== "mourad@admin.com") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { itemId, action, reason } = req.body;

      if (!itemId || !action) {
        return res.status(400).json({ message: "Item ID and action are required" });
      }

      // In a real implementation, this would update the database
      console.log(`Moderation action: ${action} on item ${itemId} by ${user.email}`, { reason });

      res.json({ success: true, message: `Content ${action}d successfully` });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin users route moved to admin-routes.ts

  // Admin tickets route moved to admin-routes.ts

  app.put("/api/admin/tickets/:id", requireAuth, async (req, res) => {
    if (req.user!.email !== "admin@promptops.com" && req.user!.email !== "mourad@admin.com") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      const { status, adminResponse } = req.body;
      const ticket = await storage.updateSupportTicket(id, { status, adminResponse });
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/tickets/:id", requireAuth, async (req, res) => {
    if (req.user!.email !== "admin@promptops.com" && req.user!.email !== "mourad@admin.com") {
      return res.sendStatus(403);
    }

    try {
      const { id } = req.params;
      await storage.deleteSupportTicket(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin stats route moved to admin-routes.ts

  // Change Password endpoint
  app.post("/api/change-password", requireAuth, async (req, res) => {
    try {
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Hash the new password using the same method as auth.ts
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);

      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(newPassword, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;

      await storage.updateUserPassword(req.user!.id, hashedPassword);

      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Forgot Password endpoint
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: "If an account with this email exists, you will receive a password reset link." });
      }

      // Generate reset token
      const { randomBytes } = await import("crypto");
      const resetToken = randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database
      await storage.storePasswordResetToken(user.id, resetToken, resetExpires);

      // Send reset email
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const resetUrl = `${process.env.SITE_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'support@promptop.net',
        to: email,
        subject: 'Password Reset Request - PromptOps',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Password Reset Request</h2>
            <p>Hello ${user.full_name || 'User'},</p>
            <p>You requested a password reset for your PromptOps account. Click the link below to reset your password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <br>
            <p>Best regards,<br>PromptOps Team</p>
          </div>
        `
      });

      res.json({ message: "If an account with this email exists, you will receive a password reset link." });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset Password endpoint
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Verify reset token
      const resetData = await storage.getPasswordResetToken(token);
      if (!resetData || resetData.expires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Update password and remove reset token
      // Supabase Auth will handle password hashing automatically
      await storage.updateUserPassword(resetData.userId, newPassword);
      await storage.deletePasswordResetToken(token);

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // COMPLETELY REWRITTEN AI PROMPT ENHANCEMENT ENDPOINT
  app.post("/api/enhance-prompt", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      console.log('🚀 BRAND NEW ENHANCEMENT SYSTEM: Starting enhancement...');

      // Get user data for limit checking
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get enhancement limits from subscription_limits table (ONLY Supabase, no hardcoded fallback)
      const { data: subscriptionLimits, error: limitsError } = await supabaseAdmin
        .from('subscription_limits')
        .select('ai_enhancements_per_month')
        .eq('tier', currentUser.plan)
        .single();

      if (limitsError || !subscriptionLimits) {
        console.error('❌ Failed to get enhancement limits from Supabase:', limitsError);
        return res.status(500).json({ error: 'Failed to check enhancement limits' });
      }

      const userLimit = subscriptionLimits.ai_enhancements_per_month;
      const enhancementsUsed = currentUser.enhancements_used || 0;

      if (userLimit !== -1 && enhancementsUsed >= userLimit) {
        return res.status(403).json({
          error: "Enhancement limit reached",
          message: `Enhancement limit reached! You've used ${enhancementsUsed}/${userLimit} enhancements.`
        });
      }

      // Calculate original score
      const originalScore = calculatePromptScore(prompt);
      console.log('📊 Original prompt score:', originalScore);

      // SIMPLE FALLBACK ENHANCEMENT FUNCTION
      const createSimpleEnhancement = (originalPrompt: string): string => {
        const enhancements = [
          `**Enhanced Professional Prompt:**\n\n${originalPrompt}\n\n**Additional Requirements:**`,
          `- Provide detailed, comprehensive responses`,
          `- Include specific examples where relevant`,
          `- Structure the output clearly with headings or bullet points`,
          `- Ensure accuracy and cite sources when applicable`,
          `- Consider multiple perspectives or approaches`,
          `- Provide actionable insights or recommendations`
        ];
        return enhancements.join('\n');
      };

      let enhancedPrompt = "";
      let enhancedScore = 75;
      let improvements = ["Enhanced with AI optimization"];

      // TRY GEMINI API
      try {
        if (process.env.GEMINI_API_KEY) {
          console.log('🔑 Attempting Gemini API call...');

          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const enhancementPrompt = `Transform this prompt into a professional, detailed version:

"${prompt}"

Make it 2-3x more detailed with:
- Clear context and requirements
- Specific output format
- Relevant constraints
- Professional structure

Return only the enhanced prompt, no JSON.`;

          const result = await model.generateContent(enhancementPrompt);
          const responseText = result.response.text();

          if (responseText && responseText.length > prompt.length) {
            enhancedPrompt = responseText;
            enhancedScore = Math.min(originalScore + 25, 90);
            improvements = ["Enhanced with Gemini AI", "Improved structure and clarity", "Added professional requirements"];
            console.log('✅ Gemini enhancement successful');
          } else {
            throw new Error("Gemini response too short");
          }
        } else {
          throw new Error("No Gemini API key");
        }
      } catch (error: any) {
        console.log('⚠️ Gemini failed, using fallback:', error.message);
        enhancedPrompt = createSimpleEnhancement(prompt);
        enhancedScore = Math.min(originalScore + 15, 75);
        improvements = ["Enhanced with fallback system", "Improved structure", "Added professional guidelines"];
      }

      // Ensure enhanced score is always higher than original
      enhancedScore = Math.max(enhancedScore, originalScore + 10);
      enhancedScore = Math.min(enhancedScore, 95); // Cap at 95
      const scoreImprovement = enhancedScore - originalScore;

      console.log('📈 Enhancement complete:', { originalScore, enhancedScore, scoreImprovement });

      // Update user's enhancement usage
      try {
        await storage.updateUser(user.id, {
          enhancements_used: enhancementsUsed + 1
        });
        console.log(`✅ Enhancement usage updated: ${enhancementsUsed + 1} enhancements used`);
      } catch (updateError) {
        console.log('⚠️ Failed to update enhancement usage:', updateError);
      }

      // Return the enhanced prompt
      res.json({
        enhancedPrompt,
        originalScore,
        enhancedScore,
        scoreImprovement,
        model: "promptop-enhancer-v1",
        improvements
      });
    } catch (error: any) {
      console.error("Error enhancing prompt:", error);
      res.status(500).json({ 
        error: "Failed to enhance prompt", 
        message: error.message 
      });
    }
  });

  // Team management routes
  app.get("/api/team", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      // For now, return mock team data since database is disabled
      const teamData = {
        id: "team-" + user.id,
        name: user.username + "'s Team",
        ownerId: user.id,
        plan: user.plan,
        maxMembers: user.plan === "enterprise" ? -1 : 10,
        createdAt: new Date().toISOString()
      };

      res.json(teamData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/team/members", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      // For now, return mock data with just the current user as team owner
      const members = [
        {
          id: user.id,
          username: user.username,
          email: user.email,
          isTeamOwner: true,
          joinedAt: new Date().toISOString()
        }
      ];

      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/team/invitations", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      // For now, return empty array since database is disabled
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/team/invite", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { email } = req.body;

      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // For now, just return success since database is disabled
      const invitation = {
        id: "inv-" + Date.now(),
        teamId: "team-" + user.id,
        email: email,
        invitedBy: user.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      res.json(invitation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/team/members/:memberId", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { memberId } = req.params;

      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      // For now, just return success since database is disabled
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/team/invitations/:invitationId", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { invitationId } = req.params;

      if (user.plan !== "team" && user.plan !== "enterprise") {
        return res.status(403).json({ message: "Team features require Team or Enterprise plan" });
      }

      // For now, just return success since database is disabled
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Community routes
  // Create a new community post
  app.post("/api/community/posts", requireAuth, async (req, res) => {
    try {
      const { title, content, type, category_id, tags, is_anonymous } = req.body;
      const user = req.user!;

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      // Create the post using storage method
      const post = await storage.createPost({
        user_id: user.id,
        title,
        content,
        type: type || 'discussion',
        category_id: category_id || null,
        tags: tags || [],
        is_anonymous: is_anonymous || false,
        // Remove moderation_status since it doesn't exist in posts table
      });

      res.status(201).json(post);
    } catch (error: any) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get community posts
  app.get("/api/community/posts", async (req, res) => {
    try {
      // First get posts
      const { data: posts, error: postsError } = await supabaseAdmin
        .from('posts')
        .select('*')
        // Remove moderation_status filter since column doesn't exist
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return res.status(500).json({ message: 'Failed to fetch posts' });
      }

      // Get user data for each post
      const postsWithUsers = await Promise.all((posts || []).map(async (post) => {
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('id, username, email, full_name, avatar_url, plan')
          .eq('id', post.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user for post:', post.id, userError);
        }

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          description: post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content,
          type: post.type,
          category: null, // Will be populated from categories table later
          tags: post.tags || [],
          is_anonymous: post.is_anonymous || false,
          user: userData || {
            id: post.user_id,
            username: 'Unknown User',
            email: '',
            full_name: 'Unknown User',
            avatar_url: null,
            plan: 'free'
          },
          likesCount: post.likes_count || 0,
          commentsCount: post.comments_count || 0,
          viewsCount: post.views_count || 0,
          createdAt: post.created_at,
          updatedAt: post.updated_at
        };
      }));

      console.log('Fetched posts with users:', postsWithUsers.length);
      res.json(postsWithUsers);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get individual post details
  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Get post with user data
      const { data: post, error: postError } = await supabaseAdmin
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            id, username, email, full_name, avatar_url, plan
          ),
          categories (
            id, name, icon, color
          )
        `)
        .eq('id', id)
        // Remove moderation_status filter since column doesn't exist
        .single();

      if (postError || !post) {
        console.error('Error fetching post:', postError);
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if user has liked this post
      let userHasLiked = false;
      if (userId) {
        const { data: likeData } = await supabaseAdmin
          .from('post_likes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', userId)
          .single();

        userHasLiked = !!likeData;
      }

      // Format response
      const formattedPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type,
        is_anonymous: post.is_anonymous,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        views_count: post.views_count,
        tags: post.tags || [],
        created_at: post.created_at,
        updated_at: post.updated_at,
        user: post.users,
        category: post.categories,
        user_has_liked: userHasLiked
      };

      res.json(formattedPost);
    } catch (error: any) {
      console.error('Error fetching post details:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Track post view
  app.post("/api/community/posts/:id/view", async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .rpc('increment_views', { post_id: id });

      if (error) {
        console.error('Error updating post views:', error);
        return res.status(500).json({ message: 'Failed to update views' });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error tracking post view:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Like/Unlike post
  app.post("/api/community/posts/:id/like", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Check if user already liked this post
      const { data: existingLike } = await supabaseAdmin
        .from('post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike: Remove like and decrement count
        await supabaseAdmin
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        await supabaseAdmin
          .rpc('decrement_likes', { post_id: id });

        res.json({ liked: false });
      } else {
        // Like: Add like and increment count
        await supabaseAdmin
          .from('post_likes')
          .insert({ post_id: id, user_id: user.id });

        await supabaseAdmin
          .rpc('increment_likes', { post_id: id });

        res.json({ liked: true });
      }
    } catch (error: any) {
      console.error('Error toggling post like:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get post comments
  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;

      const { data: comments, error } = await supabaseAdmin
        .from('post_comments')
        .select(`
          *,
          users!post_comments_user_id_fkey (
            id, username, email, full_name, avatar_url, plan
          )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching post comments:', error);
        return res.status(500).json({ message: 'Failed to fetch comments' });
      }

      const formattedComments = (comments || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        likes_count: comment.likes_count || 0,
        created_at: comment.created_at,
        user: comment.users
      }));

      res.json(formattedComments);
    } catch (error: any) {
      console.error('Error fetching post comments:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Add comment to post
  app.post("/api/community/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user!;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      // Insert comment
      const { data: comment, error: commentError } = await supabaseAdmin
        .from('post_comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: content.trim()
        })
        .select(`
          *,
          users!post_comments_user_id_fkey (
            id, username, email, full_name, avatar_url, plan
          )
        `)
        .single();

      if (commentError) {
        console.error('Error creating comment:', commentError);
        return res.status(500).json({ message: 'Failed to create comment' });
      }

      // Update post comments count
      await supabaseAdmin
        .rpc('increment_comments', { post_id: id });

      const formattedComment = {
        id: comment.id,
        content: comment.content,
        likes_count: comment.likes_count || 0,
        created_at: comment.created_at,
        user: comment.users
      };

      res.json(formattedComment);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's own posts
  app.get("/api/community/posts/user/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = req.user!;

      // Users can only fetch their own posts
      if (user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { data: posts, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ message: "Failed to fetch posts" });
      }

      // Add user data to posts
      const postsWithUser = (posts || []).map(post => ({
        ...post,
        user: {
          id: user.id,
          username: post.is_anonymous ? 'Anonymous' : user.username,
          email: user.email,
          full_name: post.is_anonymous ? 'Anonymous' : user.fullName,
          avatar_url: post.is_anonymous ? null : user.avatarUrl,
          plan: user.plan
        }
      }));

      res.json(postsWithUser);
    } catch (error: any) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/community/prompts", async (req, res) => {
    try {
      const { search, category, sort, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // Get real prompts from Supabase
      let query = supabaseAdmin
        .from('prompts')
        .select('*')
        .eq('visibility', 'public')
        .eq('status', 'active');

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply sorting
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        default:
          // Default: trending (combination of likes and comments)
          query = query.order('created_at', { ascending: false });
      }

      const { data: prompts, error } = await query
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        console.error('Error fetching community prompts:', error);
        return res.status(500).json({ message: 'Failed to fetch prompts' });
      }

      // Get user data for each prompt
      const promptsWithUsers = await Promise.all((prompts || []).map(async (prompt) => {
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('id, username, email, full_name, avatar_url, plan')
          .eq('id', prompt.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user for prompt:', prompt.id, userError);
        }

        return {
          ...prompt,
          type: 'prompt',
          user: userData || {
            id: prompt.user_id,
            username: 'Unknown User',
            email: '',
            full_name: 'Unknown User',
            avatar_url: null,
            plan: 'free'
          },
          likesCount: prompt.likes_count || 0,
          commentsCount: prompt.comments_count || 0,
          viewsCount: prompt.views_count || 0,
          averageRating: prompt.average_rating || 0,
          createdAt: prompt.created_at,
          updatedAt: prompt.updated_at
        };
      }));

      res.json(promptsWithUsers || []);
    } catch (error: any) {
      console.error('Error in community prompts endpoint:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Track prompt view
  app.post("/api/community/prompts/:id/view", async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .rpc('increment_prompt_views', { prompt_id: id });

      if (error) {
        console.error('Error updating prompt views:', error);
        return res.status(500).json({ message: 'Failed to update views' });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error tracking prompt view:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get comments for a post or prompt
  app.get("/api/community/:type/:id/comments", async (req, res) => {
    try {
      const { type, id } = req.params;

      // Get comments from the appropriate table
      const tableName = type === 'post' ? 'post_comments' : 'prompt_comments';
      const foreignKey = type === 'post' ? 'post_id' : 'prompt_id';

      const { data: comments, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq(foreignKey, id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Failed to fetch comments' });
      }

      // Get user data for each comment
      const commentsWithUsers = await Promise.all((comments || []).map(async (comment) => {
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('id, username, email, full_name, avatar_url, plan')
          .eq('id', comment.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user for comment:', comment.id, userError);
        }

        return {
          ...comment,
          user: userData || {
            id: comment.user_id,
            username: 'Unknown User',
            email: '',
            full_name: 'Unknown User',
            avatar_url: null,
            plan: 'free'
          }
        };
      }));

      res.json(commentsWithUsers);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Add comment to post or prompt
  app.post("/api/community/:type/:id/comments", requireAuth, async (req, res) => {
    try {
      const { type, id } = req.params;
      const { content } = req.body;
      const user = req.user!;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      // Insert comment into the appropriate table
      const tableName = type === 'post' ? 'post_comments' : 'prompt_comments';
      const foreignKey = type === 'post' ? 'post_id' : 'prompt_id';

      const { data: comment, error } = await supabaseAdmin
        .from(tableName)
        .insert({
          [foreignKey]: id,
          user_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Failed to create comment' });
      }

      // Return comment with user data
      const commentWithUser = {
        ...comment,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.fullName,
          avatar_url: user.avatarUrl,
          plan: user.plan
        }
      };

      res.status(201).json(commentWithUser);
    } catch (error: any) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/community/categories", async (req, res) => {
    try {
      // Mock categories data
      const categories = [
        { name: "all", count: 156, color: "#6B7280", description: "All categories" },
        { name: "creative", count: 45, color: "#8B5CF6", description: "Creative writing and storytelling" },
        { name: "marketing", count: 32, color: "#10B981", description: "Marketing and sales content" },
        { name: "coding", count: 28, color: "#3B82F6", description: "Programming and development" },
        { name: "business", count: 25, color: "#F59E0B", description: "Business strategy and planning" },
        { name: "education", count: 18, color: "#EF4444", description: "Educational content and tutorials" },
        { name: "productivity", count: 8, color: "#06B6D4", description: "Productivity and workflow optimization" }
      ];

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/community/stats", async (req, res) => {
    try {
      // Mock community stats
      const stats = {
        totalPrompts: 156,
        totalContributors: 89,
        totalLikes: 1247,
        weeklyGrowth: 23
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/community/prompts/:id/like", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Mock like functionality
      console.log(`User ${user.id} liked prompt ${id}`);

      res.json({ success: true, message: "Prompt liked successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/community/prompts/:id/like", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Mock unlike functionality
      console.log(`User ${user.id} unliked prompt ${id}`);

      res.json({ success: true, message: "Prompt unliked successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/community/prompts/:id/comments", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user!;

      if (!content) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      // Mock comment creation
      const comment = {
        id: Date.now().toString(),
        userId: user.id,
        promptId: id,
        content,
        user: { username: user.username, plan: user.plan },
        likesCount: 0,
        createdAt: new Date().toISOString()
      };

      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/community/prompts/:id/ratings", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const user = req.user!;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      // Mock rating creation
      const ratingData = {
        id: Date.now().toString(),
        userId: user.id,
        promptId: id,
        rating,
        review,
        user: { username: user.username, plan: user.plan },
        createdAt: new Date().toISOString()
      };

      res.status(201).json(ratingData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Roadmap endpoint
  app.get("/api/roadmap", async (req, res) => {
    try {
      const roadmapItems = [
        {
          id: "1",
          title: "Advanced AI Model Integration",
          description: "Integration with GPT-5, Claude 4, and other cutting-edge AI models",
          status: "in-progress",
          quarter: "Q1 2025",
          category: "AI Models"
        },
        {
          id: "2",
          title: "Team Collaboration Features",
          description: "Real-time collaboration, shared workspaces, and team analytics",
          status: "planned",
          quarter: "Q2 2025",
          category: "Collaboration"
        },
        {
          id: "3",
          title: "API Rate Limiting & Analytics",
          description: "Advanced rate limiting, usage analytics, and performance monitoring",
          status: "completed",
          quarter: "Q4 2024",
          category: "Infrastructure"
        },
        {
          id: "4",
          title: "Custom Model Training",
          description: "Train custom AI models on your specific use cases and data",
          status: "planned",
          quarter: "Q3 2025",
          category: "AI Models"
        },
        {
          id: "5",
          title: "Enterprise SSO Integration",
          description: "Single Sign-On with SAML, OAuth, and Active Directory",
          status: "in-progress",
          quarter: "Q1 2025",
          category: "Security"
        }
      ];

      res.json(roadmapItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Integrations endpoint
  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = [
        {
          id: "slack",
          name: "Slack",
          description: "Test and enhance prompts directly from Slack channels",
          category: "Communication",
          status: "available",
          icon: "slack",
          features: ["Slash commands", "Bot integration", "Channel notifications"]
        },
        {
          id: "discord",
          name: "Discord",
          description: "Integrate PromptOps with your Discord server for team collaboration",
          category: "Communication",
          status: "available",
          icon: "discord",
          features: ["Bot commands", "Server integration", "Role-based access"]
        },
        {
          id: "zapier",
          name: "Zapier",
          description: "Connect PromptOps with 5000+ apps through Zapier automation",
          category: "Automation",
          status: "available",
          icon: "zapier",
          features: ["Trigger workflows", "Data sync", "Custom automations"]
        },
        {
          id: "github",
          name: "GitHub",
          description: "Version control for prompts and integrate with your development workflow",
          category: "Development",
          status: "coming-soon",
          icon: "github",
          features: ["Version control", "Pull requests", "CI/CD integration"]
        },
        {
          id: "notion",
          name: "Notion",
          description: "Sync prompts and results with your Notion workspace",
          category: "Productivity",
          status: "coming-soon",
          icon: "notion",
          features: ["Database sync", "Template sharing", "Documentation"]
        },
        {
          id: "google-sheets",
          name: "Google Sheets",
          description: "Export prompt results and analytics to Google Sheets",
          category: "Productivity",
          status: "available",
          icon: "google-sheets",
          features: ["Data export", "Real-time sync", "Custom formulas"]
        }
      ];

      res.json(integrations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Simple status endpoint
  app.get("/api/status", async (req, res) => {
    try {
      res.json({
        server: {
          status: 'online',
          uptime: Date.now() - parseInt(SERVER_START_TIME),
          version: '1.0.0'
        },
        models: {
          total: Object.keys(AI_MODELS).length,
          enabled: Object.values(AI_MODELS).filter(m => m.enabled).length
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
