import { users, type User, type InsertUser, type SeoAnalysis } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveAnalysis(analysis: SeoAnalysis): Promise<void>;
  getRecentAnalyses(): Promise<Omit<SeoAnalysis, "metaTags" | "openGraph" | "twitterCard">[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: SeoAnalysis[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.analyses = [];
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveAnalysis(analysis: SeoAnalysis): Promise<void> {
    // Add at the beginning to have the most recent first
    this.analyses.unshift(analysis);
    
    // Keep only the 10 most recent analyses
    if (this.analyses.length > 10) {
      this.analyses = this.analyses.slice(0, 10);
    }
  }

  async getRecentAnalyses(): Promise<Omit<SeoAnalysis, "metaTags" | "openGraph" | "twitterCard">[]> {
    return this.analyses.map(analysis => {
      // Omit large objects to reduce payload size
      const { metaTags, openGraph, twitterCard, ...rest } = analysis;
      return rest;
    });
  }
}

export const storage = new MemStorage();
