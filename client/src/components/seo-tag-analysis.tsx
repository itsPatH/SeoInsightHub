import { Card } from "@/components/ui/card";

interface SeoTagAnalysisProps {
  title: string;
  description: string;
  canonical: string;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  robots: string;
}

export default function SeoTagAnalysis({
  title,
  description,
  canonical,
  openGraph,
  twitterCard,
  robots
}: SeoTagAnalysisProps) {
  // Calculate scores for each tag type
  const titleScore = calculateTitleScore(title);
  const descriptionScore = calculateDescriptionScore(description);
  const canonicalScore = canonical ? "GOOD" : "MISSING";
  const openGraphScore = calculateOpenGraphScore(openGraph);
  const twitterCardScore = calculateTwitterCardScore(twitterCard);
  const robotsScore = robots ? "GOOD" : "DEFAULT";

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">SEO Tag Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Tag */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Title Tag</h4>
              <p className="text-xs text-gray-500">Importance: Critical</p>
            </div>
            <TagStatus status={titleScore.status} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {title ? `<title>${title}</title>` : "No title tag found"}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {title ? `${title.length} characters (Recommended: 50-60)` : "Missing title tag"}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`${titleScore.color} h-1.5 rounded-full`} 
                style={{ width: `${titleScore.percentage}%` }}
              ></div>
            </div>
          </div>
        </Card>
        
        {/* Meta Description */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Meta Description</h4>
              <p className="text-xs text-gray-500">Importance: High</p>
            </div>
            <TagStatus status={descriptionScore.status} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {description ? 
              `<meta name="description" content="${description.length > 100 ? description.substring(0, 100) + '...' : description}">` : 
              "No meta description found"
            }
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {description ? `${description.length} characters (Recommended: 120-155)` : "Missing meta description"}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`${descriptionScore.color} h-1.5 rounded-full`} 
                style={{ width: `${descriptionScore.percentage}%` }}
              ></div>
            </div>
          </div>
        </Card>
        
        {/* Canonical URL */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Canonical URL</h4>
              <p className="text-xs text-gray-500">Importance: High</p>
            </div>
            <TagStatus status={canonicalScore} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {canonical ? 
              `<link rel="canonical" href="${canonical}">` : 
              "No canonical URL found"
            }
          </div>
          <div className="text-sm text-gray-600">
            {canonical ? "Canonical URL is properly implemented" : "Missing canonical URL tag"}
          </div>
        </Card>
        
        {/* Open Graph */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Open Graph</h4>
              <p className="text-xs text-gray-500">Importance: Medium</p>
            </div>
            <TagStatus status={openGraphScore.status} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {Object.keys(openGraph).length > 0 ? (
              <div>
                {openGraph['og:title'] && <div>{`<meta property="og:title" content="${truncateString(openGraph['og:title'], 40)}">`}</div>}
                {openGraph['og:description'] && <div>{`<meta property="og:description" content="${truncateString(openGraph['og:description'], 40)}...">`}</div>}
                {openGraph['og:url'] && <div>{`<meta property="og:url" content="${truncateString(openGraph['og:url'], 40)}">`}</div>}
                {openGraph['og:image'] && <div>{`<meta property="og:image" content="${truncateString(openGraph['og:image'], 40)}...">`}</div>}
              </div>
            ) : (
              "No Open Graph tags found"
            )}
          </div>
          <div className="text-sm text-gray-600">
            {openGraphScore.message}
          </div>
        </Card>
        
        {/* Twitter Card */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Twitter Card</h4>
              <p className="text-xs text-gray-500">Importance: Medium</p>
            </div>
            <TagStatus status={twitterCardScore.status} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {Object.keys(twitterCard).length > 0 ? (
              <div>
                {twitterCard['twitter:card'] && <div>{`<meta name="twitter:card" content="${twitterCard['twitter:card']}">`}</div>}
                {twitterCard['twitter:title'] && <div>{`<meta name="twitter:title" content="${truncateString(twitterCard['twitter:title'], 40)}">`}</div>}
                {twitterCard['twitter:description'] && <div>{`<meta name="twitter:description" content="${truncateString(twitterCard['twitter:description'], 40)}...">`}</div>}
                {twitterCard['twitter:image'] && <div>{`<meta name="twitter:image" content="${truncateString(twitterCard['twitter:image'], 40)}...">`}</div>}
              </div>
            ) : (
              "No Twitter Card tags found"
            )}
          </div>
          <div className="text-sm text-gray-600">
            {twitterCardScore.message}
          </div>
        </Card>
        
        {/* Robots */}
        <Card className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">Robots Directives</h4>
              <p className="text-xs text-gray-500">Importance: High</p>
            </div>
            <TagStatus status={robotsScore} />
          </div>
          <div className="bg-gray-50 p-3 rounded mb-2 font-mono text-sm overflow-x-auto">
            {robots ? 
              `<meta name="robots" content="${robots}">` : 
              "No robots meta tag found (default is index, follow)"
            }
          </div>
          <div className="text-sm text-gray-600">
            {robots ? 
              (robots.includes("noindex") || robots.includes("nofollow") ? 
                "Page is being restricted from search engines" : 
                "Page is properly accessible to search engines"
              ) : 
              "Default behavior allows search engines to index and follow links"
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper components
function TagStatus({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch(status) {
      case "EXCELLENT":
        return "bg-green-100 text-green-800";
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "FAIR":
        return "bg-amber-100 text-amber-800";
      case "POOR":
        return "bg-amber-100 text-amber-800";
      case "MISSING":
        return "bg-red-100 text-red-800";
      case "DEFAULT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
}

// Helper functions
function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength);
}

function calculateTitleScore(title: string) {
  if (!title) {
    return { status: "MISSING", color: "bg-error", percentage: 0 };
  }
  
  if (title.length >= 50 && title.length <= 60) {
    return { status: "EXCELLENT", color: "bg-success", percentage: 95 };
  } else if (title.length >= 30 && title.length <= 70) {
    return { status: "GOOD", color: "bg-success", percentage: 80 };
  } else if (title.length < 30) {
    return { status: "FAIR", color: "bg-warning", percentage: 50 };
  } else {
    return { status: "POOR", color: "bg-warning", percentage: 40 };
  }
}

function calculateDescriptionScore(description: string) {
  if (!description) {
    return { status: "MISSING", color: "bg-error", percentage: 0 };
  }
  
  if (description.length >= 120 && description.length <= 155) {
    return { status: "EXCELLENT", color: "bg-success", percentage: 95 };
  } else if (description.length >= 80 && description.length <= 165) {
    return { status: "GOOD", color: "bg-success", percentage: 80 };
  } else if (description.length < 80) {
    return { status: "FAIR", color: "bg-warning", percentage: 50 };
  } else {
    return { status: "POOR", color: "bg-warning", percentage: 40 };
  }
}

function calculateOpenGraphScore(openGraph: Record<string, string>) {
  const ogKeys = Object.keys(openGraph);
  const essentialTags = ['og:title', 'og:description', 'og:url', 'og:image'];
  const presentEssentialTags = essentialTags.filter(tag => ogKeys.includes(tag));
  
  if (presentEssentialTags.length === 0) {
    return { status: "MISSING", message: "No Open Graph tags found" };
  } else if (presentEssentialTags.length === essentialTags.length) {
    return { 
      status: "GOOD", 
      message: `All essential Open Graph tags present (${presentEssentialTags.length}/${essentialTags.length})` 
    };
  } else {
    return { 
      status: "FAIR", 
      message: `${presentEssentialTags.length} of ${essentialTags.length} essential Open Graph tags present` 
    };
  }
}

function calculateTwitterCardScore(twitterCard: Record<string, string>) {
  const twitterKeys = Object.keys(twitterCard);
  const essentialTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  const presentEssentialTags = essentialTags.filter(tag => twitterKeys.includes(tag));
  
  if (presentEssentialTags.length === 0) {
    return { status: "MISSING", message: "No Twitter Card tags found" };
  } else if (presentEssentialTags.length === essentialTags.length) {
    return { 
      status: "GOOD", 
      message: "All essential Twitter Card tags present" 
    };
  } else {
    return { 
      status: "FAIR", 
      message: `${presentEssentialTags.length} of ${essentialTags.length} essential Twitter Card tags present` 
    };
  }
}
