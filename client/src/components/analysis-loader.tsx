import { Search, Loader2, FileSearch, Database, Code } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface AnalysisLoaderProps {
  url: string;
}

export default function AnalysisLoader({ url }: AnalysisLoaderProps) {
  const [progressValue, setProgressValue] = useState(10);
  const [step, setStep] = useState(0);
  
  // Extract domain name for display
  const domain = url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : "the website";
  
  // Analysis steps
  const steps = [
    { icon: Search, text: "Connecting to website..." },
    { icon: FileSearch, text: "Extracting meta tags..." },
    { icon: Database, text: "Analyzing content..." },
    { icon: Code, text: "Generating recommendations..." },
  ];

  useEffect(() => {
    // Simulate progress
    const timer = setInterval(() => {
      setProgressValue((oldProgress) => {
        // When we reach certain thresholds, move to next step
        if (oldProgress === 25) setStep(1);
        if (oldProgress === 50) setStep(2);
        if (oldProgress === 75) setStep(3);
        
        // Calculate new progress value
        const newProgress = Math.min(oldProgress + 5, 95);
        return newProgress;
      });
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="max-w-md mx-auto mt-8 mb-12 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-5">
        <h3 className="font-semibold text-lg text-gray-800">Analyzing SEO Tags</h3>
        <p className="text-gray-600 text-sm">Analyzing {domain}</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <CurrentIcon className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{steps[step].text}</p>
            <p className="text-sm text-gray-500">Step {step + 1} of 4</p>
          </div>
        </div>
        
        <Progress value={progressValue} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Collecting data</span>
          <span>{progressValue}%</span>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin text-primary mr-1" />
            <span>Please wait while we analyze the website...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
