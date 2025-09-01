import { type User, type InsertUser, type Prompt, type InsertPrompt, type PromptRun, type InsertPromptRun, type SupportTicket, type InsertSupportTicket } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const MemorySessionStore = MemoryStore(session);

// Mock data storage - starts empty, gets populated as users register and create content
let mockUsers: User[] = [];
let mockPrompts: Prompt[] = [];
let mockPromptRuns: PromptRun[] = [];
let mockSupportTickets: SupportTicket[] = [];

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUserUsage(id: string, promptsUsed: number): Promise<User>;
  updateUserEnhancementUsage(id: string, enhancementsUsed: number): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  verifyPassword(email: string, password: string): Promise<boolean>;
  updateUserPassword(id: string, newPassword: string): Promise<User>;
  updateUserPlan(id: string, plan: "free" | "pro" | "team"): Promise<User>;
  updateUserStripeInfo(id: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User>;
  getPrompts(userId: string): Promise<Prompt[]>;
  getPrompt(id: string, userId: string): Promise<Prompt | undefined>;
  createPrompt(userId: string, insertPrompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, userId: string, updates: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: string, userId: string): Promise<void>;
  getPromptRuns(userId: string, limit?: number): Promise<PromptRun[]>;
  createPromptRun(userId: string, insertPromptRun: InsertPromptRun & { promptId?: string }): Promise<PromptRun>;
  getDashboardStats(userId: string): Promise<{
    totalPrompts: number;
    runsToday: number;
    successRate: number;
    totalUsers?: number;
    activeSubscriptions?: number;
    monthlyRevenue?: number;
    apiCalls?: number;
  }>;
  getSystemStats(): Promise<{
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    apiCalls: number;
  }>;
  getAllUsers(): Promise<User[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(userId: string, insertTicket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTickets(userId: string): Promise<SupportTicket[]>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  updateSupportTicket(id: string, updates: { status?: string; adminResponse?: string }): Promise<SupportTicket>;
  deleteSupportTicket(id: string): Promise<void>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
  updateUserPlan(userId: string, plan: string): Promise<User>;
}

export class MockStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemorySessionStore({ 
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return mockUsers.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return mockUsers.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return mockUsers.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      ...insertUser,
      plan: "free",
      promptsUsed: 0,
      enhancementsUsed: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      teamId: null,
      isTeamOwner: false,
      createdAt: new Date()
    };
    mockUsers.push(user);
    return user;
  }

  async updateUserUsage(id: string, promptsUsed: number): Promise<User> {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    mockUsers[userIndex].promptsUsed = promptsUsed;
    return mockUsers[userIndex];
  }

  async updateUserEnhancementUsage(id: string, enhancementsUsed: number): Promise<User> {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    mockUsers[userIndex].enhancementsUsed = enhancementsUsed;
    return mockUsers[userIndex];
  }

  async getUserById(id: string): Promise<User | null> {
    return mockUsers.find(user => user.id === id) || null;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;

    // Simple demo password check - any password works for demo
    return true;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    // In mock storage, we don't actually store passwords
    // This is just for demo purposes
  }

  async updateUserPlan(id: string, plan: "free" | "pro" | "team"): Promise<User> {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    mockUsers[userIndex].plan = plan;
    return mockUsers[userIndex];
  }

  async updateUserStripeInfo(id: string, data: { stripeCustomerId?: string; stripeSubscriptionId?: string }): Promise<User> {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    if (data.stripeCustomerId) mockUsers[userIndex].stripeCustomerId = data.stripeCustomerId;
    if (data.stripeSubscriptionId) mockUsers[userIndex].stripeSubscriptionId = data.stripeSubscriptionId;
    return mockUsers[userIndex];
  }

  async getPrompts(userId: string): Promise<Prompt[]> {
    const userPrompts = mockPrompts.filter(prompt => prompt.userId === userId);
    console.log(`🔍 Getting prompts for user ${userId}: found ${userPrompts.length} prompts`);
    console.log(`📊 All prompts in storage: ${mockPrompts.length}`);
    return userPrompts;
  }

  async getPrompt(id: string, userId: string): Promise<Prompt | undefined> {
    return mockPrompts.find(prompt => prompt.id === id && prompt.userId === userId);
  }

  async createPrompt(userId: string, insertPrompt: InsertPrompt): Promise<Prompt> {
    const prompt: Prompt = {
      id: `prompt-${Date.now()}`,
      userId: userId,
      title: insertPrompt.title,
      content: insertPrompt.content,
      description: insertPrompt.description || null,
      category: insertPrompt.category || "general",
      tags: insertPrompt.tags || [],
      visibility: insertPrompt.visibility || "private",
      status: insertPrompt.status || "draft",
      moderationStatus: "pending",
      createdViaVoice: insertPrompt.createdViaVoice || false,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      sharesCount: 0,
      averageRating: 0,
      ratingsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPrompts.push(prompt);
    console.log(`📝 Created prompt for user ${userId}:`, prompt.title);
    console.log(`📊 Total prompts in storage: ${mockPrompts.length}`);
    return prompt;
  }

  async updatePrompt(id: string, userId: string, updates: Partial<InsertPrompt>): Promise<Prompt> {
    const promptIndex = mockPrompts.findIndex(prompt => prompt.id === id && prompt.userId === userId);
    if (promptIndex === -1) throw new Error("Prompt not found");
    
    mockPrompts[promptIndex] = {
      ...mockPrompts[promptIndex],
      ...updates,
      updatedAt: new Date()
    };
    return mockPrompts[promptIndex];
  }

  async deletePrompt(id: string, userId: string): Promise<void> {
    const promptIndex = mockPrompts.findIndex(prompt => prompt.id === id && prompt.userId === userId);
    if (promptIndex === -1) throw new Error("Prompt not found");
    mockPrompts.splice(promptIndex, 1);
  }

  async getPromptRuns(userId: string, limit?: number): Promise<PromptRun[]> {
    const runs = mockPromptRuns.filter(run => run.userId === userId);
    return limit ? runs.slice(0, limit) : runs;
  }

  async createPromptRun(userId: string, insertPromptRun: InsertPromptRun & { promptId?: string }): Promise<PromptRun> {
    const run: PromptRun = {
      id: `run-${Date.now()}`,
      userId: userId,
      promptId: insertPromptRun.promptId || null,
      promptContent: insertPromptRun.promptContent,
      response: insertPromptRun.response,
      model: insertPromptRun.model,
      responseTime: insertPromptRun.responseTime,
      success: insertPromptRun.success,
      error: insertPromptRun.error || null,
      createdAt: new Date()
    };
    mockPromptRuns.push(run);
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
    const userPrompts = mockPrompts.filter(p => p.userId === userId);
    const userRuns = mockPromptRuns.filter(r => r.userId === userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const runsToday = userRuns.filter(r => r.createdAt >= today);
    const successfulRuns = userRuns.filter(r => r.success);

    return {
      totalPrompts: userPrompts.length,
      runsToday: runsToday.length,
      successRate: userRuns.length > 0 ? Math.round((successfulRuns.length / userRuns.length) * 100) : 0
    };
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    apiCalls: number;
  }> {
    const activeSubscriptions = mockUsers.filter(u => u.plan === "pro" || u.plan === "team");
    
    return {
      totalUsers: mockUsers.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRevenue: 0,
      apiCalls: mockPromptRuns.length
    };
  }

  async getAllUsers(): Promise<User[]> {
    return mockUsers;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return mockSupportTickets;
  }

  async createSupportTicket(userId: string, insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: userId,
      subject: insertTicket.subject,
      description: insertTicket.description,
      priority: insertTicket.priority,
      category: insertTicket.category,
      status: "open",
      adminResponse: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockSupportTickets.push(ticket);
    return ticket;
  }

  async getSupportTickets(userId: string): Promise<SupportTicket[]> {
    return mockSupportTickets.filter(ticket => ticket.userId === userId);
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    return mockSupportTickets.find(ticket => ticket.id === id);
  }

  async updateSupportTicket(id: string, updates: { status?: string; adminResponse?: string }): Promise<SupportTicket> {
    const ticketIndex = mockSupportTickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) throw new Error("Ticket not found");
    
    mockSupportTickets[ticketIndex] = {
      ...mockSupportTickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    };
    return mockSupportTickets[ticketIndex];
  }

  async deleteSupportTicket(id: string): Promise<void> {
    const ticketIndex = mockSupportTickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) throw new Error("Ticket not found");
    mockSupportTickets.splice(ticketIndex, 1);
  }
}

export const storage = new MockStorage();
