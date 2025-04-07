import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import URLAnalyzer from "@/components/url-analyzer";
import AnalysisLoader from "@/components/analysis-loader";
import AnalysisResults from "@/components/analysis-results";
import Footer from "@/components/ui/footer";
import { useSeoAnalysis } from "@/hooks/useSeoAnalysis";
import { SeoAnalysis } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const { analyzeWebsite, isAnalyzing } = useSeoAnalysis();
  const [analysisResults, setAnalysisResults] = useState<SeoAnalysis | null>(null);

  // Fetch recent analyses
  const { data: recentAnalyses } = useQuery({
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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Search className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">SEO Tag Inspector</h1>
          </div>
          <div className="flex space-x-3">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <URLAnalyzer onAnalyze={handleAnalyze} initialUrl={url} />

        {recentAnalyses && recentAnalyses.length > 0 && !isAnalyzing && !analysisResults && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentAnalyses.map((analysis: any, index: number) => (
                <button 
                  key={index}
                  onClick={() => handleRecentAnalysisClick(analysis.url)}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                >
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
