import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seoAnalysisSchema } from "@shared/schema";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to analyze a website's SEO tags
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Format the URL properly
      let formattedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }

      // Fetch the HTML from the provided URL
      const response = await fetch(formattedUrl, {
        headers: {
          "User-Agent": "SEO-Tag-Inspector/1.0",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ 
          message: `Failed to fetch website: ${response.statusText}` 
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract basic SEO tags
      const title = $("title").text();
      const description = $('meta[name="description"]').attr("content") || "";
      const canonical = $('link[rel="canonical"]').attr("href") || "";
      const robots = $('meta[name="robots"]').attr("content") || "";
      
      // Extract Open Graph tags
      const openGraph: Record<string, string> = {};
      $('meta[property^="og:"]').each((i, el) => {
        const property = $(el).attr("property");
        const content = $(el).attr("content");
        if (property && content) {
          openGraph[property] = content;
        }
      });
      
      // Extract Twitter Card tags
      const twitterCard: Record<string, string> = {};
      $('meta[name^="twitter:"]').each((i, el) => {
        const name = $(el).attr("name");
        const content = $(el).attr("content");
        if (name && content) {
          twitterCard[name] = content;
        }
      });
      
      // Extract other meta tags
      const metaTags: Record<string, string> = {};
      $("meta").each((i, el) => {
        const name = $(el).attr("name");
        const property = $(el).attr("property");
        const content = $(el).attr("content");
        
        if (name && content && !name.startsWith("twitter:")) {
          metaTags[name] = content;
        } else if (property && content && !property.startsWith("og:")) {
          metaTags[property] = content;
        }
      });
      
      // Calculate scores
      const basicScore = calculateBasicScore(title, description, canonical);
      const socialScore = calculateSocialScore(openGraph, twitterCard);
      const technicalScore = calculateTechnicalScore(robots);
      const overallScore = Math.round((basicScore + socialScore + technicalScore) / 3);
      
      // Generate recommendations
      const recommendations = generateRecommendations(
        title, 
        description, 
        canonical, 
        openGraph, 
        twitterCard,
        robots
      );

      const analysis = {
        url: formattedUrl,
        title,
        description,
        canonical,
        metaTags,
        openGraph,
        twitterCard,
        robots,
        scores: {
          basic: basicScore,
          social: socialScore,
          technical: technicalScore,
          overall: overallScore,
        },
        recommendations,
      };

      // Validate the analysis data
      const result = seoAnalysisSchema.safeParse(analysis);
      if (!result.success) {
        return res.status(500).json({ 
          message: "Failed to parse website data", 
          errors: result.error.errors 
        });
      }

      // Store the analysis result
      await storage.saveAnalysis(analysis);
      
      return res.status(200).json(analysis);
    } catch (error) {
      console.error("Error analyzing website:", error);
      return res.status(500).json({ 
        message: "Failed to analyze website", 
        error: (error as Error).message 
      });
    }
  });

  // Endpoint to get recent analyses
  app.get("/api/recent", async (req, res) => {
    try {
      const recentAnalyses = await storage.getRecentAnalyses();
      return res.status(200).json(recentAnalyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      return res.status(500).json({ 
        message: "Failed to fetch recent analyses", 
        error: (error as Error).message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions to calculate scores
function calculateBasicScore(
  title: string, 
  description: string, 
  canonical: string
): number {
  let score = 0;
  let total = 0;
  
  // Title check (ideally 50-60 characters)
  if (title) {
    total += 40;
    if (title.length >= 10 && title.length <= 70) {
      score += 40;
    } else if (title.length > 0) {
      score += 20;
    }
  }
  
  // Description check (ideally 120-155 characters)
  if (description) {
    total += 40;
    if (description.length >= 120 && description.length <= 155) {
      score += 40;
    } else if (description.length >= 50) {
      score += 20;
    } else if (description.length > 0) {
      score += 10;
    }
  }
  
  // Canonical URL check
  if (canonical) {
    total += 20;
    score += 20;
  }
  
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function calculateSocialScore(
  openGraph: Record<string, string>, 
  twitterCard: Record<string, string>
): number {
  let score = 0;
  let total = 100;
  
  // Open Graph checks - key tags are og:title, og:description, og:url, og:image
  const ogKeys = Object.keys(openGraph);
  if (ogKeys.includes("og:title")) score += 15;
  if (ogKeys.includes("og:description")) score += 15;
  if (ogKeys.includes("og:url")) score += 10;
  if (ogKeys.includes("og:image")) score += 15;
  
  // Twitter Card checks - key tags are twitter:card, twitter:title, twitter:description, twitter:image
  const twitterKeys = Object.keys(twitterCard);
  if (twitterKeys.includes("twitter:card")) score += 10;
  if (twitterKeys.includes("twitter:title")) score += 10;
  if (twitterKeys.includes("twitter:description")) score += 10;
  if (twitterKeys.includes("twitter:image")) score += 15;
  
  return Math.round((score / total) * 100);
}

function calculateTechnicalScore(robots: string): number {
  let score = 0;
  let total = 100;
  
  // Robots check
  if (robots) {
    if (robots.includes("index") && !robots.includes("noindex")) {
      score += 50;
    }
    if (robots.includes("follow") && !robots.includes("nofollow")) {
      score += 30;
    }
  } else {
    // Default is to allow indexing and following if no robots meta tag
    score += 60;
  }
  
  // Since we don't check for hreflang and structured data in this version,
  // we'll give a partial score for these aspects
  score += 20;
  
  return Math.round((score / total) * 100);
}

function generateRecommendations(
  title: string, 
  description: string, 
  canonical: string, 
  openGraph: Record<string, string>, 
  twitterCard: Record<string, string>,
  robots: string
): { title: string; description: string }[] {
  const recommendations: { title: string; description: string }[] = [];
  
  // Title recommendations
  if (!title) {
    recommendations.push({
      title: "Add a page title",
      description: "Every page should have a unique, descriptive title tag between 50-60 characters."
    });
  } else if (title.length < 20) {
    recommendations.push({
      title: "Improve your page title",
      description: "Your title is too short. Aim for 50-60 characters for optimal display in search results."
    });
  } else if (title.length > 70) {
    recommendations.push({
      title: "Shorten your page title",
      description: "Your title is too long and may be truncated in search results. Aim for 50-60 characters."
    });
  }
  
  // Description recommendations
  if (!description) {
    recommendations.push({
      title: "Add a meta description",
      description: "Add a compelling meta description between 120-155 characters to improve click-through rates."
    });
  } else if (description.length < 70) {
    recommendations.push({
      title: "Expand your meta description",
      description: "Your description is too short. Aim for 120-155 characters to fully utilize this space."
    });
  } else if (description.length > 160) {
    recommendations.push({
      title: "Shorten your meta description",
      description: "Your description may be truncated in search results. Aim for 120-155 characters."
    });
  }
  
  // Canonical recommendations
  if (!canonical) {
    recommendations.push({
      title: "Add a canonical URL",
      description: "Include a canonical URL to prevent duplicate content issues and consolidate ranking signals."
    });
  }
  
  // Open Graph recommendations
  const ogKeys = Object.keys(openGraph);
  if (!ogKeys.includes("og:title") || !ogKeys.includes("og:description") || 
      !ogKeys.includes("og:url") || !ogKeys.includes("og:image")) {
    recommendations.push({
      title: "Add missing Open Graph tags",
      description: "Ensure you have og:title, og:description, og:url, and og:image tags for better social media sharing."
    });
  }
  
  // Twitter Card recommendations
  const twitterKeys = Object.keys(twitterCard);
  if (!twitterKeys.includes("twitter:card") || !twitterKeys.includes("twitter:title") || 
      !twitterKeys.includes("twitter:description") || !twitterKeys.includes("twitter:image")) {
    recommendations.push({
      title: "Add missing Twitter Card tags",
      description: "Implement twitter:card, twitter:title, twitter:description, and twitter:image tags for Twitter sharing."
    });
  }
  
  // Open Graph image dimensions
  if (!ogKeys.includes("og:image:width") || !ogKeys.includes("og:image:height")) {
    recommendations.push({
      title: "Add image dimensions to Open Graph tags",
      description: "Include og:image:width and og:image:height properties to improve social media sharing."
    });
  }
  
  // Structured data recommendation
  recommendations.push({
    title: "Add Structured Data",
    description: "Implement JSON-LD structured data for your business and content type to enhance rich search results."
  });
  
  // hreflang recommendation for international websites
  recommendations.push({
    title: "Implement hreflang tags",
    description: "Add hreflang tags to specify language and regional targeting for international visitors."
  });
  
  return recommendations;
}
