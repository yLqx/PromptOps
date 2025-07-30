import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Edit, 
  History, 
  CreditCard, 
  UserCog 
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
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 flex flex-col">
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                    isActive 
                      ? "text-foreground bg-emerald-500 bg-opacity-20 border border-emerald-500 border-opacity-30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-emerald-400" : ""
                    )} />
                    <span className={cn(isActive ? "font-medium" : "")}>{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usage indicator */}
      {user && (
        <div className="p-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Usage</span>
              <span className="text-xs text-emerald-400">
                {user.promptsUsed}/{userLimit === Infinity ? "∞" : userLimit}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all" 
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userLimit === Infinity ? "Unlimited" : `${remainingPrompts} prompts remaining`}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
