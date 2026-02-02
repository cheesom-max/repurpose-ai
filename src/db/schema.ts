import { pgTable, uuid, text, integer, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').unique().notNull(),
  name: text('name'),
  plan: text('plan').default('free'), // free, creator, pro
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  monthlyUsage: integer('monthly_usage').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  sourceUrl: text('source_url'),
  sourceType: text('source_type'), // youtube, upload
  sourceFilePath: text('source_file_path'),
  status: text('status').default('pending'), // pending, processing, completed, failed
  transcript: jsonb('transcript'),
  highlights: jsonb('highlights'),
  duration: integer('duration'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Clips table
export const clips = pgTable('clips', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title'),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time').notNull(),
  score: decimal('score', { precision: 3, scale: 2 }),
  filePath: text('file_path'),
  thumbnailPath: text('thumbnail_path'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contents table
export const contents = pgTable('contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // blog, twitter, linkedin, newsletter
  title: text('title'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Clip = typeof clips.$inferSelect;
export type NewClip = typeof clips.$inferInsert;
export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
