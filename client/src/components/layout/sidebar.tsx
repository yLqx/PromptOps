import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { NavbarUsage } from "@/components/usage/navbar-usage";
import {
  LayoutDashboard,
  Edit,
  History,
  CreditCard,
  UserCog,
  Wand2,
  Mic,
  Users
} from "lucide-react";

export default function Sidebar() {
  const { user } = useSupabaseAuth();
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
      name: "Professional Prompt Creator",
      href: "/professional-prompt-creator",
      icon: Mic,
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
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

  // Add team link if user has team plan
  if (user?.plan === "team" || user?.plan === "enterprise") {
    navigation.push({
      name: "Team",
      href: "/team",
      icon: Users,
    });
  }

  // Add team management link for team/enterprise users
  if (user?.plan === "team" || user?.plan === "enterprise") {
    navigation.push({
      name: "Team",
      href: "/team",
      icon: Users,
    });
  }

  // Add admin link if user is admin
  if (user?.email === "admin@promptops.com" || user?.email === "mourad@admin.com") {
    navigation.push({
      name: "Admin",
      href: "/admin",
      icon: UserCog,
    });
  }



  return (
    <aside className="w-56 lg:w-64 bg-card border-r border-border flex-shrink-0 flex-col hidden lg:flex">
      <nav className="p-3 lg:p-4 flex-1">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}>
                    <item.icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="font-medium text-sm lg:text-base truncate">{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* New Usage & Plan Information */}
      <div className="border-t border-border">
        <NavbarUsage />
      </div>
    </aside>
  );
}
