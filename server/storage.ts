import { users, prompts, promptRuns, supportTickets, type User, type InsertUser, type Prompt, type InsertPrompt, type PromptRun, type InsertPromptRun, type SupportTicket, type InsertSupportTicket } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserUsage(id: string, promptsUsed: number): Promise<User>;
  updateUserPlan(id: string, plan: "free" | "pro" | "team"): Promise<User>;
  updateUserStripeInfo(id: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User>;
  
  // Prompt methods
  getPrompts(userId: string): Promise<Prompt[]>;
  getPrompt(id: string, userId: string): Promise<Prompt | undefined>;
  createPrompt(userId: string, prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, userId: string, prompt: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: string, userId: string): Promise<void>;
  
  // Prompt run methods
  getPromptRuns(userId: string): Promise<PromptRun[]>;
  createPromptRun(userId: string, run: InsertPromptRun & { promptId?: string }): Promise<PromptRun>;
  
  // Stats methods
  getDashboardStats(userId: string): Promise<{
    totalPrompts: number;
    runsToday: number;
    successRate: number;
    totalUsers?: number;
    activeSubscriptions?: number;
    monthlyRevenue?: number;
    apiCalls?: number;
  }>;
  
  // Support ticket methods
  getSupportTickets(userId?: string): Promise<SupportTicket[]>;
  createSupportTicket(userId: string, ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: string, updates: { status?: string; adminResponse?: string }): Promise<SupportTicket>;
  deleteSupportTicket(id: string): Promise<void>;

  // Admin methods
  getAllUsers(): Promise<User[]>;
  getSystemStats(): Promise<{
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    apiCalls: number;
  }>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserUsage(id: string, promptsUsed: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ promptsUsed })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserPlan(id: string, plan: "free" | "pro" | "team"): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ plan })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getPrompts(userId: string): Promise<Prompt[]> {
    return await db
      .select()
      .from(prompts)
      .where(eq(prompts.userId, userId))
      .orderBy(desc(prompts.updatedAt));
  }

  async getPrompt(id: string, userId: string): Promise<Prompt | undefined> {
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
    return prompt || undefined;
  }

  async createPrompt(userId: string, prompt: InsertPrompt): Promise<Prompt> {
    const [newPrompt] = await db
      .insert(prompts)
      .values({ ...prompt, userId })
      .returning();
    return newPrompt;
  }

  async updatePrompt(id: string, userId: string, prompt: Partial<InsertPrompt>): Promise<Prompt> {
    const [updatedPrompt] = await db
      .update(prompts)
      .set({ ...prompt, updatedAt: new Date() })
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
      .returning();
    return updatedPrompt;
  }

  async deletePrompt(id: string, userId: string): Promise<void> {
    await db
      .delete(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
  }

  async getPromptRuns(userId: string): Promise<PromptRun[]> {
    return await db
      .select()
      .from(promptRuns)
      .where(eq(promptRuns.userId, userId))
      .orderBy(desc(promptRuns.createdAt));
  }

  async createPromptRun(userId: string, run: InsertPromptRun & { promptId?: string }): Promise<PromptRun> {
    const [newRun] = await db
      .insert(promptRuns)
      .values({ ...run, userId })
      .returning();
    return newRun;
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
    const totalPrompts = await db
      .select({ count: count() })
      .from(prompts)
      .where(eq(prompts.userId, userId));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const runsToday = await db
      .select({ count: count() })
      .from(promptRuns)
      .where(and(
        eq(promptRuns.userId, userId),
        eq(promptRuns.createdAt, today)
      ));

    const allRuns = await db
      .select()
      .from(promptRuns)
      .where(eq(promptRuns.userId, userId));

    const successCount = allRuns.filter(run => run.success).length;
    const successRate = allRuns.length > 0 ? (successCount / allRuns.length) * 100 : 0;

    return {
      totalPrompts: totalPrompts[0]?.count || 0,
      runsToday: runsToday[0]?.count || 0,
      successRate: Math.round(successRate * 10) / 10,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    apiCalls: number;
  }> {
    const totalUsers = await db.select({ count: count() }).from(users);
    const activeSubscriptions = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        eq(users.plan, "pro"),
        eq(users.plan, "team")
      ));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      activeSubscriptions: activeSubscriptions[0]?.count || 0,
      monthlyRevenue: 0, // TODO: Calculate from Stripe data
      apiCalls: 0, // TODO: Track API calls
    };
  }

  // Support ticket methods
  async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    if (userId) {
      return await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.userId, userId))
        .orderBy(desc(supportTickets.createdAt));
    } else {
      return await db
        .select()
        .from(supportTickets)
        .orderBy(desc(supportTickets.createdAt));
    }
  }

  async createSupportTicket(userId: string, ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [created] = await db
      .insert(supportTickets)
      .values({ ...ticket, userId })
      .returning();
    return created;
  }

  async updateSupportTicket(id: string, updates: { status?: string; adminResponse?: string }): Promise<SupportTicket> {
    const [updated] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updated;
  }

  async deleteSupportTicket(id: string): Promise<void> {
    await db.delete(supportTickets).where(eq(supportTickets.id, id));
  }
}

export const storage = new DatabaseStorage();
