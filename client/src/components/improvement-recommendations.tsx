import { AlertTriangle } from "lucide-react";

interface ImprovementRecommendationsProps {
  recommendations: { title: string; description: string }[];
}

export default function ImprovementRecommendations({ recommendations }: ImprovementRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Improvement Recommendations</h3>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800 mb-2">
          {recommendations.length} {recommendations.length === 1 ? 'Recommendation' : 'Recommendations'} to improve SEO
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{rec.title}</p>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
