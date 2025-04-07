import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface URLAnalyzerProps {
  onAnalyze: (url: string) => void;
  initialUrl?: string;
}

export default function URLAnalyzer({ onAnalyze, initialUrl = "" }: URLAnalyzerProps) {
  const [url, setUrl] = useState<string>(initialUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAnalyze(url);
    }
  };

  return (
    <div className="w-full mb-8">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analyze Website SEO Tags</h2>
          <p className="text-gray-600 mb-6">Enter any URL to analyze its meta tags, Open Graph, Twitter Cards and more.</p>
          
          <form className="mb-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="url"
                  id="siteUrl"
                  placeholder="https://example.com"
                  className="pl-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="py-6 px-6">
                <span>Analyze</span>
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
