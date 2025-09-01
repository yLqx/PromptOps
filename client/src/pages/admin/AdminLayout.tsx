import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  MessageSquare,
  Bot,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Shield,
  Activity
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
  last_login?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Use fetch directly for admin auth to avoid Supabase auth headers
      const res = await fetch("/api/admin/me", {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        navigate("/admin-pl/login");
      }
    } catch (error) {
      navigate("/admin-pl/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAdmin(null);
      navigate("/admin-pl/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/admin-pl",
      permission: null
    },
    {
      icon: Users,
      label: "Users",
      path: "/admin-pl/users",
      permission: "users"
    },
    {
      icon: MessageSquare,
      label: "Community",
      path: "/admin-pl/community",
      permission: "community"
    },
    {
      icon: Bot,
      label: "AI Models",
      path: "/admin-pl/ai-models",
      permission: "ai_models"
    },
    {
      icon: FileText,
      label: "Logs",
      path: "/admin-pl/logs",
      permission: "system"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin-pl/settings",
      permission: "system"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-emerald-500" />
            <div>
              <h1 className="text-xl font-bold text-white">PromptOps Admin</h1>
              <p className="text-sm text-gray-400">Administrative Control Panel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{admin.full_name || admin.email}</p>
              <div className="flex items-center space-x-2">
                <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} className="text-xs">
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </Badge>
                <Activity className="h-3 w-3 text-emerald-500" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const hasPermission = !item.permission || admin.permissions[item.permission];
              const isActive = location === item.path;
              
              if (!hasPermission) return null;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
