import { CheckIcon, XIcon, AlertTriangleIcon } from "lucide-react";

interface SeoScoreDashboardProps {
  scores: {
    basic: number;
    social: number;
    technical: number;
    overall: number;
  };
}

export default function SeoScoreDashboard({ scores }: SeoScoreDashboardProps) {
  // Helper function to get grade and color based on score
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", color: "text-green-800 bg-green-100" };
    if (score >= 80) return { grade: "B", color: "text-amber-800 bg-amber-100" };
    if (score >= 70) return { grade: "C", color: "text-amber-800 bg-amber-100" };
    if (score >= 60) return { grade: "D", color: "text-orange-800 bg-orange-100" };
    return { grade: "F", color: "text-red-800 bg-red-100" };
  };

  // Calculate grades
  const basicGrade = getGrade(scores.basic);
  const socialGrade = getGrade(scores.social);
  const technicalGrade = getGrade(scores.technical);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Basic SEO Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Basic SEO</h3>
          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${basicGrade.color} font-semibold text-sm`}>
            {basicGrade.grade}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${scores.basic >= 80 ? 'bg-success' : scores.basic >= 60 ? 'bg-warning' : 'bg-error'} h-2.5 rounded-full`} 
              style={{ width: `${scores.basic}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600 font-medium">{scores.basic}%</span>
        </div>
        <ul className="mt-3 text-sm text-gray-600">
          <li className="flex items-center">
            {scores.basic >= 70 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            )}
            Title tag {scores.basic >= 80 ? "(Great)" : "(Needs improvement)"}
          </li>
          <li className="flex items-center">
            {scores.basic >= 70 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            )}
            Meta description {scores.basic >= 80 ? "(Great)" : "(Needs improvement)"}
          </li>
          <li className="flex items-center">
            {scores.basic >= 70 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <XIcon className="h-4 w-4 text-error mr-1" />
            )}
            Canonical URL
          </li>
        </ul>
      </div>

      {/* Social Media Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Social Media</h3>
          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${socialGrade.color} font-semibold text-sm`}>
            {socialGrade.grade}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${scores.social >= 80 ? 'bg-success' : scores.social >= 60 ? 'bg-warning' : 'bg-error'} h-2.5 rounded-full`} 
              style={{ width: `${scores.social}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600 font-medium">{scores.social}%</span>
        </div>
        <ul className="mt-3 text-sm text-gray-600">
          <li className="flex items-center">
            {scores.social >= 70 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            )}
            Open Graph tags {scores.social >= 80 ? "(Great)" : "(Incomplete)"}
          </li>
          <li className="flex items-center">
            {scores.social >= 60 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            )}
            Twitter Card tags
          </li>
          <li className="flex items-center">
            <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            Missing image size hints
          </li>
        </ul>
      </div>

      {/* Technical Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-medium">Technical</h3>
          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${technicalGrade.color} font-semibold text-sm`}>
            {technicalGrade.grade}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${scores.technical >= 80 ? 'bg-success' : scores.technical >= 60 ? 'bg-warning' : 'bg-error'} h-2.5 rounded-full`} 
              style={{ width: `${scores.technical}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600 font-medium">{scores.technical}%</span>
        </div>
        <ul className="mt-3 text-sm text-gray-600">
          <li className="flex items-center">
            {scores.technical >= 60 ? (
              <CheckIcon className="h-4 w-4 text-success mr-1" />
            ) : (
              <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            )}
            Robots directives
          </li>
          <li className="flex items-center">
            <AlertTriangleIcon className="h-4 w-4 text-warning mr-1" />
            Missing Structured Data
          </li>
          <li className="flex items-center">
            <XIcon className="h-4 w-4 text-error mr-1" />
            No hreflang tags
          </li>
        </ul>
      </div>
    </div>
  );
}
