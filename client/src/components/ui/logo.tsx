import { Link } from "wouter";
import { Zap } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function Logo({ className = "", size = "md", clickable = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg`}>
        <Zap className="text-white h-6 w-6" />
      </div>
      <span className={`font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
        promptop
      </span>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
