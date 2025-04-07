import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Globe, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface URLAnalyzerProps {
  onAnalyze: (url: string) => void;
  initialUrl?: string;
}

export default function URLAnalyzer({ onAnalyze, initialUrl = "" }: URLAnalyzerProps) {
  const [url, setUrl] = useState<string>(initialUrl);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  // Function to normalize URL with proper protocol
  const normalizeUrl = (inputUrl: string): string => {
    if (!inputUrl) return "";
    
    // If URL already has protocol, return as is
    if (inputUrl.match(/^https?:\/\//i)) {
      return inputUrl;
    }
    
    // If no protocol, add https://
    return `https://${inputUrl}`;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUrl(inputValue);
    
    // If it's empty, don't validate yet
    if (!inputValue) {
      setIsValidUrl(true);
      return;
    }
    
    // Simple validation - ensure we can construct a URL object
    try {
      // If input doesn't have protocol, add one for validation purposes
      const urlToTest = normalizeUrl(inputValue);
      new URL(urlToTest);
      setIsValidUrl(true);
    } catch (error) {
      setIsValidUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;
    
    try {
      // Normalize the URL before submitting
      const normalizedUrl = normalizeUrl(url);
      
      // Validate again just to be sure
      new URL(normalizedUrl);
      
      // Update the input field to show the normalized URL
      setUrl(normalizedUrl);
      
      // Pass the normalized URL to the analyze function
      onAnalyze(normalizedUrl);
    } catch (error) {
      // Show toast error if URL is invalid
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className="shadow-md border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-primary">Analyze Website SEO Tags</h2>
        </div>
        <CardContent className="p-6 pt-5">
          <p className="text-gray-600 mb-6">Enter any URL to analyze its meta tags, Open Graph, Twitter Cards and more.</p>
          
          <form className="space-y-4 sm:space-y-0" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text" // Changed from url to text for custom validation
                  id="siteUrl"
                  placeholder="example.com"
                  className={`pl-10 pr-4 py-6 text-base ${!isValidUrl ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={url}
                  onChange={handleUrlChange}
                  required
                />
                {!isValidUrl && (
                  <p className="text-red-500 text-xs mt-1 absolute">Please enter a valid URL</p>
                )}
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="py-6 px-6 transition-all duration-300 relative group"
                disabled={!isValidUrl || !url}
              >
                <span className="flex items-center">
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Analyze</span>
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
              </Button>
            </div>
          </form>
          
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
              100% Free Analysis
            </span>
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1"></span>
              No Sign-up Required
            </span>
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
              Instant Results
            </span>
            <span className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
              Auto URL Detection
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
