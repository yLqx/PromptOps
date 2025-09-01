import { Link } from "wouter";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function Logo({ className = "", size = "md", clickable = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-16",
    lg: "h-20"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const logoContent = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img
        src="/logo.png"
        alt="PromptOp Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      <span className={`font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
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
