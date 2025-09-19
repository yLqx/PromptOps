import { users, prompts, promptRuns, supportTickets, type User, type InsertUser, type Prompt, type InsertPrompt, type PromptRun, type InsertPromptRun, type SupportTicket, type InsertSupportTicket } from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, count } from "drizzle-orm";
import session from "express-session";
import MemoryStore from "memorystore";
import { type IStorage } from "./mock-storage";

const MemorySessionStore = MemoryStore(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (!pool) {
      throw new Error("Database pool not initialized");
    }
    this.sessionStore = new MemorySessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
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
      .values({
        id: crypto.randomUUID(),
        ...insertUser
      })
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

  async updateUserEnhancementUsage(id: string, enhancementsUsed: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ enhancementsUsed })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  }

  async verifyPassword(_email: string, _password: string): Promise<boolean> {
    // Password verification not implemented for database storage
    // This would require a separate passwords table or auth service
    return false;
  }

  async updateUserPassword(_id: string, _newPassword: string): Promise<void> {
    // Password updates not implemented for database storage
    // This would require a separate passwords table or auth service
    throw new Error("Password updates not supported in database storage");
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

  async createPrompt(userId: string, insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db
      .insert(prompts)
      .values({
        ...insertPrompt,
        userId: userId,
      })
      .returning();
    return prompt;
  }

  async updatePrompt(id: string, userId: string, updates: Partial<InsertPrompt>): Promise<Prompt> {
    const [prompt] = await db
      .update(prompts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
      .returning();
    return prompt;
  }

  async deletePrompt(id: string, userId: string): Promise<void> {
    await db
      .delete(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
  }

  async getPromptRuns(userId: string, limit?: number): Promise<PromptRun[]> {
    const query = db
      .select()
      .from(promptRuns)
      .where(eq(promptRuns.userId, userId))
      .orderBy(desc(promptRuns.createdAt));
    
    if (limit) {
      return await query.limit(limit);
    }
    
    return await query;
  }

  async createPromptRun(userId: string, insertPromptRun: InsertPromptRun & { promptId?: string }): Promise<PromptRun> {
    const [run] = await db
      .insert(promptRuns)
      .values({
        ...insertPromptRun,
        userId: userId,
      })
      .returning();
    return run;
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

    const successfulRuns = allRuns.filter(run => run.success);
    const successRate = allRuns.length > 0 
      ? Math.round((successfulRuns.length / allRuns.length) * 100) 
      : 0;

    return {
      totalPrompts: totalPrompts[0]?.count || 0,
      runsToday: runsToday[0]?.count || 0,
      successRate,
    };
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async createSupportTicket(insertTicket: InsertSupportTicket & { userId: string }): Promise<SupportTicket> {
    const [ticket] = await db
      .insert(supportTickets)
      .values({
        subject: insertTicket.subject,
        description: insertTicket.description,
        priority: insertTicket.priority,
        category: insertTicket.category,
        userId: insertTicket.userId,
      })
      .returning();
    return ticket;
  }

  async getSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    return ticket || undefined;
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
