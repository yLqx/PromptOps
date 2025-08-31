import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserUsage } from "@/hooks/use-user-usage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ModelSelector from "@/components/ui/model-selector";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Zap, 
  Save, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Wand2,
  Copy,
  RefreshCw,
  Target,
  Brain,
  Shield,
  BarChart3,
  Clock,
  Rocket
} from "lucide-react";

export default function AIEnhancerPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { canUseEnhancements, enhancementsUsed, enhancementsLimit } = useUserUsage();
  
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [promptScore, setPromptScore] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [testResponse, setTestResponse] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [promptTitle, setPromptTitle] = useState("");
  const [promptDescription, setPromptDescription] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Enhanced AI prompt enhancement with scoring
  const enhancePromptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/enhance-prompt", { prompt });
      return res.json();
    },
    onSuccess: (data) => {
      setEnhancedPrompt(data.enhancedPrompt);
      setPromptScore(data.score);
      setImprovements(data.improvements || []);
      toast({
        title: "Prompt Enhanced!",
        description: `Quality score: ${data.score}/100`
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Enhancement failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Test enhanced prompt
  const testPromptMutation = useMutation({
    mutationFn: async (data: { promptContent: string; model?: string }) => {
      const res = await apiRequest("POST", "/api/test-prompt", data);
      return res.json();
    },
    onSuccess: (data) => {
      setTestResponse(data.response);
      queryClient.invalidateQueries({ queryKey: ["/api/prompt-runs"] });
      toast({ title: "Enhanced prompt tested successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Test failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Save enhanced prompt
  const savePromptMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; description?: string }) => {
      const res = await apiRequest("POST", "/api/prompts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setIsSaveDialogOpen(false);
      setPromptTitle("");
      setPromptDescription("");
      toast({ title: "Enhanced prompt saved successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Save failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const enhancementLimits = { free: 5, pro: Infinity, team: Infinity, enterprise: Infinity };
  const userEnhancementLimit = enhancementLimits[user?.plan || "free"];
  const remainingEnhancements = userEnhancementLimit === Infinity ? "Unlimited" : Math.max(0, userEnhancementLimit - enhancementsUsed);

  const handleEnhancePrompt = () => {
    if (!originalPrompt.trim()) {
      toast({ 
        title: "Please enter a prompt", 
        variant: "destructive" 
      });
      return;
    }

    // Check usage limits
    if (!canUseEnhancements) {
      toast({
        title: "Enhancement limit reached!",
        description: `You've used ${enhancementsUsed}/${enhancementsLimit} enhancements. Please upgrade your plan to continue.`,
        variant: "destructive"
      });
      return;
    }

    enhancePromptMutation.mutate(originalPrompt);
  };

  const handleTestEnhanced = () => {
    if (!enhancedPrompt.trim()) {
      toast({ 
        title: "No enhanced prompt to test", 
        variant: "destructive" 
      });
      return;
    }
    testPromptMutation.mutate({ 
      promptContent: enhancedPrompt, 
      model: selectedModel 
    });
  };

  const handleSavePrompt = () => {
    if (!promptTitle.trim()) {
      toast({ 
        title: "Please enter a title", 
        variant: "destructive" 
      });
      return;
    }
    savePromptMutation.mutate({
      title: promptTitle,
      content: enhancedPrompt,
      description: promptDescription
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", color: "bg-emerald-500" };
    if (score >= 60) return { variant: "secondary" as const, text: "Good", color: "bg-yellow-500" };
    return { variant: "destructive" as const, text: "Needs Work", color: "bg-red-500" };
  };

  const enhancements = [
    {
      title: "Clarity Enhancement",
      description: "Improves prompt clarity and specificity",
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
      color: "from-emerald-500/10 to-emerald-600/10",
      active: true
    },
    {
      title: "Context Optimization",
      description: "Adds relevant context for better understanding",
      icon: <Brain className="h-5 w-5 text-gray-400" />,
      color: "from-gray-500/10 to-gray-600/10",
      active: true
    },
    {
      title: "Format Structuring",
      description: "Optimizes prompt structure and format",
      icon: <Target className="h-5 w-5 text-purple-400" />,
      color: "from-purple-500/10 to-purple-600/10",
      active: true
    },
    {
      title: "Performance Scoring",
      description: "Provides quality scores from 1-100",
      icon: <BarChart3 className="h-5 w-5 text-yellow-400" />,
      color: "from-yellow-500/10 to-yellow-600/10",
      active: true
    },
    {
      title: "Advanced Guidelines",
      description: "Intelligent constraints and guidelines",
      icon: <Shield className="h-5 w-5 text-green-400" />,
      color: "from-green-500/10 to-green-600/10",
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Wand2 className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground font-['DM_Sans']">
                  AI Prompt Enhancer
                </h1>
                <p className="text-muted-foreground font-['DM_Sans']">
                  Transform your prompts with AI-driven enhancements
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {enhancementsUsed}/{enhancementsLimit === Infinity ? "∞" : enhancementsLimit} used
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {enhancementsLimit === Infinity ? "Unlimited" : `${Math.max(0, enhancementsLimit - enhancementsUsed)} remaining`}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhancement Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {enhancements.map((enhancement, index) => (
                <Card
                  key={index}
                  className="hover:border-emerald-500/50 transition-colors"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center mx-auto mb-3">
                      {enhancement.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{enhancement.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{enhancement.description}</p>
                    <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Original Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-emerald-500" />
                  Original Prompt
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter your prompt to enhance with AI optimization
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="original-prompt">Your Prompt</Label>
                  <Textarea
                    id="original-prompt"
                    placeholder="Enter your prompt here to enhance it with AI..."
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                    className="min-h-[200px] resize-none"
                    rows={8}
                  />
                </div>
                <Button
                  onClick={handleEnhancePrompt}
                  disabled={enhancePromptMutation.isPending || !originalPrompt.trim() || !canUseEnhancements}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600"
                >
                  {!canUseEnhancements ? "Limit Reached - Upgrade Plan" :
                   enhancePromptMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Prompt Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-emerald-500" />
                    Enhanced Prompt
                  </div>
                  {promptScore && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Star className="h-3 w-3 mr-1" />
                        {promptScore}/100
                      </Badge>
                    </div>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-optimized version with quality scoring
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="enhanced-prompt">Enhanced Version</Label>
                  <Textarea
                    id="enhanced-prompt"
                    value={enhancedPrompt}
                    onChange={(e) => setEnhancedPrompt(e.target.value)}
                    className="min-h-[200px] resize-none"
                    rows={8}
                    placeholder="Enhanced prompt will appear here..."
                  />
                </div>
                
                {improvements.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-emerald-400">AI Improvements Applied:</Label>
                    <div className="space-y-1">
                      {improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(enhancedPrompt)}
                    disabled={!enhancedPrompt}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  
                  <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        disabled={!enhancedPrompt}
                        className="flex-1 btn-shadow bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Enhanced Prompt</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={promptTitle}
                            onChange={(e) => setPromptTitle(e.target.value)}
                            placeholder="Enter prompt title..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description (optional)</Label>
                          <Textarea
                            id="description"
                            value={promptDescription}
                            onChange={(e) => setPromptDescription(e.target.value)}
                            placeholder="Brief description of this prompt..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleSavePrompt}
                          disabled={savePromptMutation.isPending}
                          className="btn-shadow bg-emerald-600 hover:bg-emerald-700"
                        >
                          {savePromptMutation.isPending ? "Saving..." : "Save Prompt"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>


        </main>
      </div>
    </div>
  );
}