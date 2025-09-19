import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const planEnum = pgEnum("plan", ["free", "pro", "team", "enterprise"]);
export const statusEnum = pgEnum("status", ["draft", "active", "archived"]);
export const promptVisibilityEnum = pgEnum("prompt_visibility", ["private", "public", "team"]);
export const moderationStatusEnum = pgEnum("moderation_status", ["pending", "approved", "rejected", "flagged"]);
export const reportReasonEnum = pgEnum("report_reason", ["spam", "inappropriate", "copyright", "harassment", "other"]);

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  plan: planEnum("plan").default("team").notNull(),
  maxMembers: integer("max_members").default(10).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  plan: planEnum("plan").default("free").notNull(),
  promptsUsed: integer("prompts_used").default(0).notNull(),
  enhancementsUsed: integer("enhancements_used").default(0).notNull(),
  bio: text("bio"),
  website: text("website"),
  location: text("location"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teamInvitations = pgTable("team_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  invitedBy: varchar("invited_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("pending").notNull(), // "pending", "accepted", "declined", "expired"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  category: text("category").default("general").notNull(),
  tags: text("tags").array(),
  visibility: promptVisibilityEnum("visibility").default("private").notNull(),
  status: statusEnum("status").default("draft").notNull(),
  moderationStatus: moderationStatusEnum("moderation_status").default("pending").notNull(),
  createdViaVoice: boolean("created_via_voice").default(false).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  sharesCount: integer("shares_count").default(0).notNull(),
  averageRating: real("average_rating").default(0),
  ratingsCount: integer("ratings_count").default(0).notNull(),
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

// Community tables
export const promptLikes = pgTable("prompt_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promptComments = pgTable("prompt_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  parentId: varchar("parent_id"), // Self-reference will be added in relations
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promptRatings = pgTable("prompt_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promptReports = pgTable("prompt_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  reason: reportReasonEnum("reason").notNull(),
  description: text("description"),
  status: text("status").default("pending").notNull(), // "pending", "reviewed", "resolved"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promptViews = pgTable("prompt_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  promptId: varchar("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promptCategories = pgTable("prompt_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: text("color").default("#6B7280").notNull(),
  icon: text("icon"),
  promptsCount: integer("prompts_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(users),
  invitations: many(teamInvitations),
}));

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [teamInvitations.invitedBy],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  promptRuns: many(promptRuns),
  supportTickets: many(supportTickets),

  sentInvitations: many(teamInvitations),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
  runs: many(promptRuns),
  likes: many(promptLikes),
  comments: many(promptComments),
  ratings: many(promptRatings),
  reports: many(promptReports),
  views: many(promptViews),
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

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // "urgent", "medium", "low"
  category: text("category").notNull(), // "technical", "billing", "feature", "bug", "other"
  status: text("status").notNull().default("open"), // "open", "in_progress", "closed"
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
}));

// Community relations
export const promptLikesRelations = relations(promptLikes, ({ one }) => ({
  user: one(users, {
    fields: [promptLikes.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptLikes.promptId],
    references: [prompts.id],
  }),
}));

export const promptCommentsRelations = relations(promptComments, ({ one, many }) => ({
  user: one(users, {
    fields: [promptComments.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptComments.promptId],
    references: [prompts.id],
  }),
  parent: one(promptComments, {
    fields: [promptComments.parentId],
    references: [promptComments.id],
    relationName: "parent_comment",
  }),
  replies: many(promptComments, {
    relationName: "parent_comment",
  }),
}));

export const promptRatingsRelations = relations(promptRatings, ({ one }) => ({
  user: one(users, {
    fields: [promptRatings.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptRatings.promptId],
    references: [prompts.id],
  }),
}));

export const promptReportsRelations = relations(promptReports, ({ one }) => ({
  user: one(users, {
    fields: [promptReports.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptReports.promptId],
    references: [prompts.id],
  }),
}));

export const promptViewsRelations = relations(promptViews, ({ one }) => ({
  user: one(users, {
    fields: [promptViews.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptViews.promptId],
    references: [prompts.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  fullName: true,
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  title: true,
  content: true,
  description: true,
  category: true,
  tags: true,
  visibility: true,
  status: true,
  createdViaVoice: true,
});

export const insertPromptRunSchema = createInsertSchema(promptRuns).pick({
  promptContent: true,
  response: true,
  model: true,
  responseTime: true,
  success: true,
  error: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  subject: true,
  description: true,
  priority: true,
  category: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  ownerId: true,
  plan: true,
  maxMembers: true,
});

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).pick({
  teamId: true,
  email: true,
  invitedBy: true,
  expiresAt: true,
});

export const insertPromptCommentSchema = createInsertSchema(promptComments).pick({
  promptId: true,
  parentId: true,
  content: true,
});

export const insertPromptRatingSchema = createInsertSchema(promptRatings).pick({
  promptId: true,
  rating: true,
  review: true,
});

export const insertPromptReportSchema = createInsertSchema(promptReports).pick({
  promptId: true,
  reason: true,
  description: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPromptRun = z.infer<typeof insertPromptRunSchema>;
export type PromptRun = typeof promptRuns.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeamInvitation = z.infer<typeof insertTeamInvitationSchema>;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertPromptComment = z.infer<typeof insertPromptCommentSchema>;
export type PromptComment = typeof promptComments.$inferSelect;
export type InsertPromptRating = z.infer<typeof insertPromptRatingSchema>;
export type PromptRating = typeof promptRatings.$inferSelect;
export type InsertPromptReport = z.infer<typeof insertPromptReportSchema>;
export type PromptReport = typeof promptReports.$inferSelect;
export type PromptLike = typeof promptLikes.$inferSelect;
export type PromptView = typeof promptViews.$inferSelect;
export type PromptCategory = typeof promptCategories.$inferSelect;
