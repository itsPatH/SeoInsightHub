import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import URLAnalyzer from "@/components/url-analyzer";
import AnalysisLoader from "@/components/analysis-loader";
import AnalysisResults from "@/components/analysis-results";
import Footer from "@/components/ui/footer";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import { SeoAnalysis } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Search, Info, Settings, History, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const { analyzeWebsite, isAnalyzing } = useSeoAnalysis();
  const [analysisResults, setAnalysisResults] = useState<SeoAnalysis | null>(null);

  // Fetch recent analyses
  const { data: recentAnalyses = [] } = useQuery<SeoAnalysis[]>({
    queryKey: ['/api/recent'],
    staleTime: 30000, // 30 seconds
  });

  const handleAnalyze = async (urlToAnalyze: string) => {
    try {
      const results = await analyzeWebsite(urlToAnalyze);
      setAnalysisResults(results);
      setUrl(urlToAnalyze);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleRecentAnalysisClick = (url: string) => {
    setUrl(url);
    handleAnalyze(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold gradient-text">SEO Tag Inspector</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Info className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Settings className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {!analysisResults && !isAnalyzing && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">
                Analyze Any Website's SEO Meta Tags
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get instant insights into meta tags, social media previews, and SEO recommendations to improve your website's visibility.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Detailed Analysis</h3>
                  <p className="text-gray-600 text-sm">Examine title tags, meta descriptions, Open Graph, and Twitter Card tags.</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Visual Previews</h3>
                  <p className="text-gray-600 text-sm">See how your pages appear in Google search results and social media platforms.</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Actionable Tips</h3>
                  <p className="text-gray-600 text-sm">Get practical recommendations to improve your SEO and social sharing performance.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <URLAnalyzer onAnalyze={handleAnalyze} initialUrl={url} />

        {recentAnalyses && recentAnalyses.length > 0 && !isAnalyzing && !analysisResults && (
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-3">
              <History className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm font-medium text-gray-500">Recent analyses</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentAnalyses.map((analysis, index) => (
                <button 
                  key={index}
                  onClick={() => handleRecentAnalysisClick(analysis.url)}
                  className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors flex items-center"
                >
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {new URL(analysis.url).hostname}
                </button>
              ))}
            </div>
          </div>
        )}

        {isAnalyzing ? (
          <AnalysisLoader url={url} />
        ) : analysisResults ? (
          <AnalysisResults results={analysisResults} />
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
