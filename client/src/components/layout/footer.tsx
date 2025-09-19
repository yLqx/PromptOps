import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-700/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">&copy; 2025 PromptOp. All rights reserved.</p>
            <p className="text-gray-400 text-xs mt-1">Powered by monzed.com</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/PromptOp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-300 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.x.com/promptopnet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-300 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/promptopnet/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-300 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
