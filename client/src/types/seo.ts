export interface SeoTagsData {
  url: string;
  title?: string;
  description?: string;
  canonical?: string;
  metaTags?: Record<string, string>;
  openGraph?: Record<string, string>;
  twitterCard?: Record<string, string>;
  robots?: string;
}

export interface SeoScores {
  basic: number;
  social: number;
  technical: number;
  overall: number;
}

export interface SeoRecommendation {
  title: string;
  description: string;
}

export interface AnalysisResponse {
  url: string;
  title?: string;
  description?: string;
  canonical?: string;
  metaTags?: Record<string, string>;
  openGraph?: Record<string, string>;
  twitterCard?: Record<string, string>;
  robots?: string;
  scores: SeoScores;
  recommendations: SeoRecommendation[];
}
