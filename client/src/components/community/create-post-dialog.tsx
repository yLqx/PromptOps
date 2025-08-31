import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent } from "../ui/card";
import {
  Plus,
  X,
  MessageSquare,
  HelpCircle,
  Star,
  Code,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Smile,
  Eye,
  EyeOff,
  BookOpen,
  Target,
  Users
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { getCategories } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useSupabaseAuth } from "../../hooks/use-supabase-auth";

interface CreatePostDialogProps {
  children?: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const { user } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"general" | "question" | "showcase" | "tutorial" | "best_practices">("general");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Rich text formatting functions
  const formatText = (format: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + emoji + content.substring(start);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const res = await apiRequest("POST", "/api/community/posts", postData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Created!",
        description: "Your post has been published to the community.",
      });
      setOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['community-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("general");
    setCategoryId("");
    setTags([]);
    setTagInput("");
    setIsAnonymous(false);
    setIsSubmitting(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
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

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        type,
        category_id: categoryId === "none" ? null : categoryId || null,
        tags,
        is_anonymous: isAnonymous,
        moderation_status: "approved"
      });
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = [
    {
      value: "general",
      label: "General",
      icon: MessageSquare,
      description: "General discussions and topics",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      fields: ["title", "content", "tags", "category"]
    },
    {
      value: "question",
      label: "Question",
      icon: HelpCircle,
      description: "Ask for help or advice",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      fields: ["title", "content", "tags", "category"]
    },
    {
      value: "showcase",
      label: "Showcase",
      icon: Star,
      description: "Show off your projects and achievements",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      fields: ["title", "content", "tags", "category"]
    },
    {
      value: "tutorial",
      label: "Tutorial",
      icon: BookOpen,
      description: "Step-by-step guides and tutorials",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      fields: ["title", "content", "tags", "category"]
    },
    {
      value: "best_practices",
      label: "Best Practices",
      icon: Target,
      description: "Share and learn best practices",
      color: "bg-emerald-100 text-emerald-700 border-emerald-300",
      fields: ["title", "content", "tags", "category"]
    },

  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or showcase your work with the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose Post Type</Label>
            <div className="grid grid-cols-1 gap-3">
              {postTypes.map((postType) => {
                const Icon = postType.icon;
                const isSelected = type === postType.value;
                return (
                  <button
                    key={postType.value}
                    type="button"
                    onClick={() => setType(postType.value as any)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                      isSelected
                        ? `${postType.color} border-current shadow-lg`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <div>
                        <span className={`font-semibold text-base ${isSelected ? 'text-current' : 'text-gray-900 dark:text-gray-100'}`}>
                          {postType.label}
                        </span>
                        {isSelected && (
                          <div className="text-xs font-medium opacity-75 mt-1">Selected</div>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-current opacity-80' : 'text-gray-600 dark:text-gray-400'}`}>
                      {postType.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
          </div>

          {/* Content with Rich Text Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>

            {/* Rich Text Toolbar */}
            <Card className="border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex flex-wrap items-center gap-2 mb-3 border-b border-slate-700/50 pb-3">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText("bold")}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText("italic")}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => formatText("underline")}
                      className="h-8 w-8 p-0"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="h-4 w-px bg-slate-700/50" />

                  <div className="flex items-center gap-1">
                    {["😀", "👍", "❤️", "🎉", "💡", "🔥", "✨", "🚀"].map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertEmoji(emoji)}
                        className="h-8 w-8 p-0 text-base"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>

                <Textarea
                  ref={contentRef}
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, ask your question, or describe your showcase...

Use **bold**, *italic*, __underline__ for formatting.
Add emojis to make your post more engaging! 🎉"
                  rows={8}
                  maxLength={5000}
                  className="border-0 resize-none focus:ring-0 bg-transparent"
                />
              </CardContent>
            </Card>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Supports **bold**, *italic*, __underline__ formatting</span>
              <span>{content.length}/5000 characters</span>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Add up to 5 tags to help others find your post
              </p>
            </div>
          </div>

          {/* Anonymous Posting Option */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="flex items-center gap-2">
                {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Post anonymously
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              {isAnonymous
                ? "Your name and tier will be hidden. Only 'Anonymous' will be shown."
                : "Your name and tier will be visible to other users."
              }
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
