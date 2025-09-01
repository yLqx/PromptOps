import { useState } from "react";
import { useLocation } from "wouter";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  X,
  Lightbulb,
  Bot,
  Newspaper,
  HelpCircle,
  Star,
  Users,
  BookOpen,
  Zap,
  Eye,
  EyeOff,
  Sparkles,
  Send
} from "lucide-react";

const categoryOptions = [
  {
    value: "prompt_engineering",
    label: "Prompt Engineering",
    icon: Lightbulb,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Share tips, tricks, and best practices for crafting effective prompts"
  },
  {
    value: "ai_models",
    label: "AI Models",
    icon: Bot,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Discuss different AI models, comparisons, and capabilities"
  },
  {
    value: "ai_news",
    label: "AI News",
    icon: Newspaper,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "Share the latest news and updates from the AI world"
  },
  {
    value: "help_support",
    label: "Help & Support",
    icon: HelpCircle,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    description: "Get help with your AI projects and questions"
  },
  {
    value: "showcase",
    label: "Showcase",
    icon: Star,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: "Show off your amazing AI-powered projects and creations"
  },
  {
    value: "discussion",
    label: "Discussion",
    icon: Users,
    color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    description: "General discussions about AI, technology, and the future"
  },
  {
    value: "tutorials",
    label: "Tutorials",
    icon: BookOpen,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    description: "Create step-by-step guides and learning resources"
  },
  {
    value: "resources",
    label: "Resources",
    icon: Zap,
    color: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    description: "Share useful tools, links, and resources for AI enthusiasts"
  }
];

export default function CreateCommunityPost() {
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      if (!user) throw new Error('Must be logged in to create posts');

      const res = await apiRequest("POST", "/api/community/posts", postData);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Post Created! 🎉",
        description: "Your post has been published to the community.",
      });
      setLocation(`/community/post/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, content, and select a category",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      tags,
      is_anonymous: isAnonymous
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setLocation('/community')}
                className="mb-4 text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
              
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Share with the Community
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Create a post to share your knowledge, ask questions, or showcase your AI projects
                </p>
              </div>
            </div>

            {/* Create Post Form */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Create New Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-200">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's your post about?"
                      maxLength={200}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    />
                    <p className="text-xs text-slate-400">{title.length}/200 characters</p>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <Label className="text-slate-200">Category *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryOptions.map((category) => {
                        const Icon = category.icon;
                        return (
                          <div
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedCategory === category.value
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`h-5 w-5 mt-0.5 ${
                                selectedCategory === category.value ? 'text-emerald-400' : 'text-slate-400'
                              }`} />
                              <div>
                                <h3 className={`font-medium ${
                                  selectedCategory === category.value ? 'text-emerald-300' : 'text-slate-200'
                                }`}>
                                  {category.label}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                  {category.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-200">Content *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts, knowledge, or questions with the community..."
                      rows={12}
                      maxLength={10000}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                    />
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Supports **bold**, *italic*, and `code` formatting</span>
                      <span>{content.length}/10,000 characters</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-slate-200">Tags (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Add a tag..."
                        maxLength={20}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!tagInput.trim() || tags.length >= 5}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1"
                          >
                            #{tag}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-emerald-100"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-400">
                      Add up to 5 tags to help others discover your post
                    </p>
                  </div>

                  {/* Anonymous Option */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                      />
                      <Label htmlFor="anonymous" className="text-slate-200 flex items-center gap-2">
                        {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        Post anonymously
                      </Label>
                    </div>
                    <p className="text-sm text-slate-400 ml-7">
                      {isAnonymous 
                        ? "Your identity will be hidden. Only 'Anonymous' will be shown."
                        : "Your name and profile will be visible to other community members."
                      }
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/community')}
                      disabled={isSubmitting}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !content.trim() || !selectedCategory}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Publish Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
