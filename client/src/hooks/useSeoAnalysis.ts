import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SeoAnalysis } from '@shared/schema';

export function useSeoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string): Promise<SeoAnalysis> => {
    setIsAnalyzing(true);
    
    try {
      // Format the URL if it doesn't have http:// or https:// prefix
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = `https://${url}`;
      }
      
      const response = await apiRequest('POST', '/api/analyze', { url: formattedUrl });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze website');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Analysis Complete',
        description: `Successfully analyzed ${new URL(data.url).hostname}`,
      });
      
      return data;
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: (error as Error).message || 'Failed to analyze website',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWebsite,
    isAnalyzing
  };
}
