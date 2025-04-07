import { Card } from "@/components/ui/card";
import SeoScoreDashboard from "./seo-score-dashboard";
import PreviewTabs from "./preview-tabs";
import SeoTagAnalysis from "./seo-tag-analysis";
import ImprovementRecommendations from "./improvement-recommendations";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoAnalysis } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface AnalysisResultsProps {
  results: SeoAnalysis;
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  // Get domain name
  const domain = new URL(results.url).hostname;
  
  // Calculate tag count
  const tagCount = Object.keys({
    ...results.metaTags,
    ...results.openGraph,
    ...results.twitterCard,
  }).length;
  
  // Format the analyzed time to "X min ago"
  const analyzedTime = formatDistanceToNow(new Date(), { addSuffix: true });

  return (
    <Card className="p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Results for {domain}</h2>
            <span className="ml-3 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Analyzed {analyzedTime}</span>
          </div>
          <p className="text-gray-600 mt-1">{tagCount} SEO tags found - {results.scores.overall}% optimization score</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="mr-2">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <SeoScoreDashboard scores={results.scores} />
      
      <PreviewTabs
        title={results.title || ""}
        url={results.url}
        description={results.description || ""}
        openGraph={results.openGraph || {}}
        twitterCard={results.twitterCard || {}}
        metaTags={results.metaTags || {}}
      />
      
      <SeoTagAnalysis
        title={results.title || ""}
        description={results.description || ""}
        canonical={results.canonical || ""}
        openGraph={results.openGraph || {}}
        twitterCard={results.twitterCard || {}}
        robots={results.robots || ""}
      />
      
      <ImprovementRecommendations recommendations={results.recommendations} />
    </Card>
  );
}
