import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const planEnum = pgEnum("plan", ["free", "pro", "team"]);
export const statusEnum = pgEnum("status", ["draft", "active", "archived"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: planEnum("plan").default("free").notNull(),
  promptsUsed: integer("prompts_used").default(0).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promptRuns = pgTable("prompt_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").references(() => prompts.id, { onDelete: "set null" }),
  promptContent: text("prompt_content").notNull(),
  response: text("response").notNull(),
  model: text("model").notNull(),
  responseTime: integer("response_time").notNull(),
  success: boolean("success").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  promptRuns: many(promptRuns),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
  runs: many(promptRuns),
}));

export const promptRunsRelations = relations(promptRuns, ({ one }) => ({
  user: one(users, {
    fields: [promptRuns.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptRuns.promptId],
    references: [prompts.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  title: true,
  content: true,
  description: true,
  status: true,
});

export const insertPromptRunSchema = createInsertSchema(promptRuns).pick({
  promptContent: true,
  response: true,
  model: true,
  responseTime: true,
  success: true,
  error: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPromptRun = z.infer<typeof insertPromptRunSchema>;
export type PromptRun = typeof promptRuns.$inferSelect;
