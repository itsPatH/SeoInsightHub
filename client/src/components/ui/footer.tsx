import { Search, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg gradient-text">SEO Tag Inspector</span>
            </div>
            <p className="text-gray-500 text-sm mb-4 max-w-md">
              A powerful tool to analyze website meta tags, Open Graph, and Twitter Cards to improve your SEO and social sharing.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">SEO Guide</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Meta Tag Best Practices</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SEO Tag Inspector. All rights reserved.
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <span>Made with</span>
            <Heart className="h-3 w-3 mx-1 text-red-500" fill="currentColor" />
            <span>for the web</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
