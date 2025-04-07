import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  seoScore: integer("seo_score"),
  metaTags: jsonb("meta_tags"),
  openGraph: jsonb("open_graph"),
  twitterCard: jsonb("twitter_card"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const insertWebsiteSchema = createInsertSchema(websites).pick({
  url: true,
});

export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical: z.string().optional(),
  metaTags: z.record(z.string(), z.any()).optional(),
  openGraph: z.record(z.string(), z.any()).optional(),
  twitterCard: z.record(z.string(), z.any()).optional(),
  robots: z.string().optional(),
  scores: z.object({
    basic: z.number(),
    social: z.number(),
    technical: z.number(),
    overall: z.number(),
  }),
  recommendations: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websites.$inferSelect;
export type SeoAnalysis = z.infer<typeof seoAnalysisSchema>;
