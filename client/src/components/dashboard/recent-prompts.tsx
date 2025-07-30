import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import type { Prompt } from "@shared/schema";

export default function RecentPrompts() {
  const { data: prompts = [] } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const recentPrompts = prompts.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Recent Prompts</h3>
        <Link href="/prompts">
          <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
            View All
          </Button>
        </Link>
      </div>
      
      {recentPrompts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No prompts yet</p>
          <Link href="/prompts">
            <Button variant="outline" size="sm" className="mt-2">
              Create Your First Prompt
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentPrompts.map((prompt) => (
            <div key={prompt.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-emerald-500 transition-colors cursor-pointer">
              <div className="flex-1">
                <h4 className="text-foreground font-medium">{prompt.title}</h4>
                <p className="text-muted-foreground text-sm truncate">
                  {prompt.description || prompt.content.substring(0, 50) + "..."}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={prompt.status === "active" ? "default" : "secondary"}>
                  {prompt.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
