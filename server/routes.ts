import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { testPromptWithAI } from "./ai";
import { insertPromptSchema, insertPromptRunSchema } from "@shared/schema";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    next();
  };

  // Middleware to check plan limits
  const checkPromptLimit = async (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const user = req.user;
    const limits = { free: 5, pro: 100, team: Infinity };
    const userLimit = limits[user.plan as keyof typeof limits] || 5;
    
    if (user.promptsUsed >= userLimit) {
      return res.status(403).json({ 
        message: "Prompt limit reached for your plan. Please upgrade to continue." 
      });
    }
    next();
  };

  // Dashboard stats
  app.get("/api/dashboard-stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user!.id);
      res.json(stats);
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
      const prompt = await storage.createPrompt(req.user!.id, validatedData);
      res.status(201).json(prompt);
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
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Test prompt with AI
  app.post("/api/test-prompt", requireAuth, checkPromptLimit, async (req, res) => {
    try {
      const { promptContent, promptId } = req.body;
      
      if (!promptContent) {
        return res.status(400).json({ message: "Prompt content is required" });
      }

      const aiResponse = await testPromptWithAI(promptContent);
      
      // Record the run
      const runData = {
        promptContent,
        response: aiResponse.response,
        model: aiResponse.model,
        responseTime: aiResponse.responseTime,
        success: aiResponse.success,
        error: aiResponse.error,
      };
      
      await storage.createPromptRun(req.user!.id, { ...runData, promptId });
      
      // Update user's prompt usage count
      await storage.updateUserUsage(req.user!.id, req.user!.promptsUsed + 1);
      
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
        const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

        res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    });

    app.post("/api/cancel-subscription", requireAuth, async (req, res) => {
      try {
        const user = req.user!;
        
        if (user.stripeSubscriptionId) {
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
          await storage.updateUserPlan(user.id, "free");
          await storage.updateUserStripeInfo(user.id, {
            stripeSubscriptionId: undefined,
          });
        }

        res.json({ success: true });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
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

  app.post("/api/support/tickets", requireAuth, async (req, res) => {
    try {
      const { subject, description, priority, category } = req.body;
      const ticket = await storage.createSupportTicket(req.user!.id, {
        subject,
        description, 
        priority,
        category
      });
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, async (req, res) => {
    // Simple admin check (in production, implement proper role-based access)
    if (req.user!.email !== "admin@promptops.com") {
      return res.sendStatus(403);
    }

    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/tickets", requireAuth, async (req, res) => {
    if (req.user!.email !== "admin@promptops.com") {
      return res.sendStatus(403);
    }

    try {
      const tickets = await storage.getSupportTickets(); // All tickets for admin
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/tickets/:id", requireAuth, async (req, res) => {
    if (req.user!.email !== "admin@promptops.com") {
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
    if (req.user!.email !== "admin@promptops.com") {
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

  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    if (req.user!.email !== "admin@promptops.com") {
      return res.sendStatus(403);
    }

    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
