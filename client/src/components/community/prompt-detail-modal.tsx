import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Copy, 
  Download, 
  Edit, 
  Eye, 
  Calendar,
  User,
  Tag,
  Mic,
  Code,
  Play,
  BookOpen
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PromptInteractions from "./prompt-interactions";

interface PromptDetailModalProps {
  prompt: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptDetailModal({ prompt, isOpen, onClose }: PromptDetailModalProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [copiedContent, setCopiedContent] = useState(false);

  if (!prompt) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopiedContent(true);
    toast({ title: "Prompt content copied to clipboard!" });
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleUsePrompt = () => {
    // Navigate to AI enhancer with this prompt pre-filled
    const encodedPrompt = encodeURIComponent(prompt.content);
    window.location.href = `/ai-enhancer?prompt=${encodedPrompt}`;
  };

  const handleForkPrompt = () => {
    // Navigate to prompt creation with this prompt as template
    const encodedPrompt = encodeURIComponent(prompt.content);
    window.location.href = `/prompts?template=${encodedPrompt}&title=Fork of ${prompt.title}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "team": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "enterprise": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      creative: "#8B5CF6",
      marketing: "#10B981", 
      coding: "#3B82F6",
      business: "#F59E0B",
      education: "#EF4444",
      productivity: "#06B6D4",
      general: "#6B7280"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{prompt.title}</DialogTitle>
              <DialogDescription className="text-base">
                {prompt.description}
              </DialogDescription>
            </div>
            {prompt.createdViaVoice && (
              <Badge variant="secondary" className="ml-4">
                <Mic className="h-3 w-3 mr-1" />
                Voice Created
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author and Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {prompt.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{prompt.user.username}</span>
                  <Badge className={`text-xs ${getPlanBadgeColor(prompt.user.plan)}`}>
                    {prompt.user.plan}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(prompt.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {prompt.viewsCount} views
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getCategoryColor(prompt.category) }}
              />
              <span className="text-sm capitalize">{prompt.category}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Prompt Content</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyContent}
                    className={copiedContent ? "bg-green-50 border-green-200" : ""}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedContent ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {prompt.content}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleUsePrompt} className="flex-1 sm:flex-none">
              <Play className="h-4 w-4 mr-2" />
              Test This Prompt
            </Button>
            <Button variant="outline" onClick={handleForkPrompt} className="flex-1 sm:flex-none">
              <Edit className="h-4 w-4 mr-2" />
              Fork & Customize
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <BookOpen className="h-4 w-4 mr-2" />
              Add to Collection
            </Button>
          </div>

          {/* Interactions */}
          <PromptInteractions
            promptId={prompt.id}
            initialLikes={prompt.likesCount}
            initialComments={prompt.commentsCount}
            initialRating={prompt.averageRating}
            initialRatingsCount={prompt.ratingsCount}
            userHasLiked={false}
            userRating={0}
          />

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Examples</CardTitle>
              <CardDescription>
                See how this prompt can be used in different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Example Input</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Write a story about a time traveler who gets stuck in the past"
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <Code className="h-3 w-3 mr-1" />
                    Input
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Expected Output</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    "A compelling narrative with character development, plot twists, and emotional depth..."
                  </p>
                  <Badge variant="outline" className="text-xs">
                    <Play className="h-3 w-3 mr-1" />
                    Output
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Prompts</CardTitle>
              <CardDescription>
                Other prompts you might find useful
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Character Development Helper",
                    category: "creative",
                    likes: 23,
                    rating: 4.6
                  },
                  {
                    title: "Plot Twist Generator", 
                    category: "creative",
                    likes: 18,
                    rating: 4.4
                  }
                ].map((relatedPrompt, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <h5 className="font-medium text-sm mb-1">{relatedPrompt.title}</h5>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{relatedPrompt.category}</span>
                      <div className="flex items-center gap-2">
                        <span>❤️ {relatedPrompt.likes}</span>
                        <span>⭐ {relatedPrompt.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
