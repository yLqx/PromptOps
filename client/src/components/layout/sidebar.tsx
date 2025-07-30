import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Edit, 
  History, 
  CreditCard, 
  UserCog,
  Wand2
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Prompts",
      href: "/prompts",
      icon: Edit,
    },
    {
      name: "AI Enhancer",
      href: "/ai-enhancer",
      icon: Wand2,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
  ];

  // Add admin link if user is admin
  if (user?.email === "admin@promptops.com" || user?.email === "mourad@admin.com") {
    navigation.push({
      name: "Admin",
      href: "/admin",
      icon: UserCog,
    });
  }

  const planLimits = {
    free: 5,
    pro: 100,
    team: Infinity,
  };

  const userLimit = planLimits[user?.plan as keyof typeof planLimits] || 5;
  const usagePercentage = user ? Math.min((user.promptsUsed / userLimit) * 100, 100) : 0;
  const remainingPrompts = user ? Math.max(userLimit - user.promptsUsed, 0) : 0;

  return (
    <aside className="w-48 md:w-64 bg-card border-r border-border flex-shrink-0 flex-col glass-effect animate-slide-in-left hidden lg:flex">
      <nav className="p-3 md:p-4 flex-1">
        <ul className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = location === item.href;
            return (
              <li key={item.name} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center space-x-3 px-3 md:px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer card-hover",
                    isActive 
                      ? "text-foreground bg-emerald-500 bg-opacity-20 border border-emerald-500 border-opacity-30 text-glow-emerald" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted hover:text-glow-emerald"
                  )}>
                    <item.icon className={cn(
                      "h-4 w-4 md:h-5 md:w-5 animate-float",
                      isActive ? "text-emerald-400" : ""
                    )} style={{animationDelay: `${index * 0.3}s`}} />
                    <span className={cn(
                      "text-sm md:text-base",
                      isActive ? "font-medium" : ""
                    )}>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usage indicator */}
      {user && (
        <div className="p-3 md:p-4 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <div className="bg-background border border-border rounded-lg p-3 md:p-4 glass-effect card-hover space-y-3">
            {/* Prompts Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-muted-foreground">Prompts</span>
                <span className="text-xs text-emerald-400 text-glow-emerald">
                  {user.promptsUsed}/{userLimit === Infinity ? "∞" : userLimit}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2 animate-pulse-glow">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all shimmer" 
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Enhancements Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm text-muted-foreground">Enhancements</span>
                <span className="text-xs text-purple-400 text-glow-purple">
                  {user.enhancementsUsed || 0}/{user.plan === "team" ? "1K" : (user.plan === "pro" ? "100" : "5")}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2 animate-pulse-glow">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all shimmer" 
                  style={{ width: `${Math.min((user.enhancementsUsed || 0) / (user.plan === "team" ? 1000 : (user.plan === "pro" ? 100 : 5)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
