import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Info } from "lucide-react";

interface PreviewTabsProps {
  title: string;
  url: string;
  description: string;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  metaTags: Record<string, string>;
}

export default function PreviewTabs({
  title,
  url,
  description,
  openGraph,
  twitterCard,
  metaTags
}: PreviewTabsProps) {
  return (
    <div className="mb-8">
      <Tabs defaultValue="google">
        <div className="border-b border-gray-200">
          <TabsList className="bg-transparent -mb-px">
            <TabsTrigger 
              value="google" 
              className="rounded-none border-primary text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-primary border-b-2 border-transparent"
            >
              Google Preview
            </TabsTrigger>
            <TabsTrigger 
              value="facebook" 
              className="rounded-none border-primary text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-primary border-b-2 border-transparent"
            >
              Facebook
            </TabsTrigger>
            <TabsTrigger 
              value="twitter" 
              className="rounded-none border-primary text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-primary border-b-2 border-transparent"
            >
              Twitter
            </TabsTrigger>
            <TabsTrigger 
              value="raw" 
              className="rounded-none border-primary text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-primary border-b-2 border-transparent"
            >
              Raw Tags
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Google Preview */}
        <TabsContent value="google" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Google Search Result Preview</h3>
          <div className="max-w-2xl border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">{new URL(url).hostname} &gt; ...</div>
            <div className="text-blue-700 text-xl mb-1 font-medium">{title || "No title found"}</div>
            <div className="text-sm text-gray-700">{description || "No description found"}</div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <div className="flex items-center mr-3">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Page score: {title && description ? 96 : 70}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm">
            <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${title && description && title.length >= 30 && description.length >= 70 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {title && description && title.length >= 30 && description.length >= 70 ? 'EXCELLENT' : 'NEEDS IMPROVEMENT'}
            </span>
            <span className="text-gray-600 ml-2">
              {title && description && title.length >= 30 && description.length >= 70 
                ? 'Your title and description are well-optimized for search engines.'
                : 'Your title or description need improvement for better search visibility.'}
            </span>
          </div>
        </TabsContent>

        {/* Facebook Preview */}
        <TabsContent value="facebook" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Facebook Share Preview</h3>
          <div className="max-w-md border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-52 bg-gray-200 flex items-center justify-center">
              {openGraph['og:image'] ? (
                <img 
                  src={openGraph['og:image']} 
                  alt="Open Graph preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Preview+Available";
                  }}
                />
              ) : (
                <div className="text-gray-500">No preview image available</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-xs uppercase mb-1">{new URL(url).hostname}</div>
              <h4 className="font-bold mb-1">{openGraph['og:title'] || title || "No title available"}</h4>
              <p className="text-sm text-gray-700 line-clamp-3">{openGraph['og:description'] || description || "No description available"}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm">
            <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${openGraph['og:title'] && openGraph['og:description'] && openGraph['og:image'] ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {openGraph['og:title'] && openGraph['og:description'] && openGraph['og:image'] ? 'GOOD' : 'INCOMPLETE'}
            </span>
            <span className="text-gray-600 ml-2">
              {openGraph['og:title'] && openGraph['og:description'] && openGraph['og:image'] 
                ? 'Basic Open Graph tags are present for Facebook sharing.'
                : 'Missing some Open Graph tags needed for optimal Facebook sharing.'}
            </span>
          </div>
        </TabsContent>

        {/* Twitter Preview */}
        <TabsContent value="twitter" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Twitter Card Preview</h3>
          <div className="max-w-md border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-52 bg-gray-200 flex items-center justify-center">
              {twitterCard['twitter:image'] ? (
                <img 
                  src={twitterCard['twitter:image']} 
                  alt="Twitter Card preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Preview+Available";
                  }}
                />
              ) : (
                <div className="text-gray-500">No preview image available</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-xs uppercase mb-1">{new URL(url).hostname}</div>
              <h4 className="font-bold mb-1">{twitterCard['twitter:title'] || title || "No title available"}</h4>
              <p className="text-sm text-gray-700 line-clamp-3">{twitterCard['twitter:description'] || description || "No description available"}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center text-sm">
            <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${twitterCard['twitter:card'] && twitterCard['twitter:title'] && twitterCard['twitter:description'] ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {twitterCard['twitter:card'] && twitterCard['twitter:title'] && twitterCard['twitter:description'] ? 'GOOD' : 'INCOMPLETE'}
            </span>
            <span className="text-gray-600 ml-2">
              {twitterCard['twitter:card'] && twitterCard['twitter:title'] && twitterCard['twitter:description'] 
                ? 'Basic Twitter Card tags are present.'
                : 'Missing some Twitter Card tags needed for optimal Twitter sharing.'}
            </span>
          </div>
        </TabsContent>

        {/* Raw Tags */}
        <TabsContent value="raw" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Raw Meta Tags</h3>
          <ScrollArea className="h-80 border border-gray-200 rounded-lg p-4 font-mono text-sm">
            <div>
              <div className="mb-4">
                <div className="font-semibold mb-2 text-primary">Basic Meta Tags</div>
                <div className="pl-2 border-l-2 border-gray-200">
                  {title && <div className="mb-1">&lt;title&gt;{title}&lt;/title&gt;</div>}
                  {description && <div className="mb-1">&lt;meta name="description" content="{description}" /&gt;</div>}
                  {metaTags && Object.entries(metaTags).map(([name, content], index) => (
                    <div key={index} className="mb-1">&lt;meta name="{name}" content="{content}" /&gt;</div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-semibold mb-2 text-primary">Open Graph Tags</div>
                <div className="pl-2 border-l-2 border-gray-200">
                  {Object.keys(openGraph).length === 0 ? (
                    <div className="text-gray-500">No Open Graph tags found</div>
                  ) : (
                    Object.entries(openGraph).map(([property, content], index) => (
                      <div key={index} className="mb-1">&lt;meta property="{property}" content="{content}" /&gt;</div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-semibold mb-2 text-primary">Twitter Card Tags</div>
                <div className="pl-2 border-l-2 border-gray-200">
                  {Object.keys(twitterCard).length === 0 ? (
                    <div className="text-gray-500">No Twitter Card tags found</div>
                  ) : (
                    Object.entries(twitterCard).map(([name, content], index) => (
                      <div key={index} className="mb-1">&lt;meta name="{name}" content="{content}" /&gt;</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
