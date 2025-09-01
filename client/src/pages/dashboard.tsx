import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Zap, TrendingUp, FileText, Sparkles, AlertTriangle, CheckCircle, Clock, Users, X, ExternalLink, MessageSquare, Plus, Save, Download } from "lucide-react";
import { useUserUsage } from "@/hooks/use-user-usage";
import ModelSelector from "@/components/ui/model-selector";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";

type Prompt = any;
type PromptRun = any;

export default function DashboardPage() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { 
    canUsePrompts, 
    canUseEnhancements,
    canSavePrompts,
    promptsUsed, 
    enhancementsUsed,
    promptsSaved,
    promptsLimit, 
    enhancementsLimit,
    slotsLimit,
    plan 
  } = useUserUsage();
  
  // State for functionality
  const [promptText, setPromptText] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [aiResponse, setAiResponse] = useState("");
  const [responseTime, setResponseTime] = useState("--");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ model: "", error: "" });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard-stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard-stats");
      return res.json();
    },
    enabled: !!user
  });

  const { data: prompts = [] } = useQuery<Prompt[]>({
    queryKey: ["user-prompts"],
    queryFn: async () => {
      if (!user) return [] as any[];
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any;
    },
    enabled: !!user
  });

  const { data: runs = [] } = useQuery<PromptRun[]>({
    queryKey: ["prompt-runs"],
    queryFn: async () => {
      // For now return empty array - we'll implement this later
      return [] as any[];
    },
    enabled: !!user
  });

  // AI Test Mutation
  const testPromptMutation = useMutation({
    mutationFn: async (data: { promptContent: string; model?: string }) => {
      const res = await apiRequest("POST", "/api/test-prompt", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success === false) {
        // Show error modal for API failures
        setErrorDetails({ model: data.model, error: data.error || "Unknown error" });
        setShowErrorModal(true);
        setAiResponse(data.response); // Still show the error message in response
      } else {
        setAiResponse(data.response);
        toast({ title: "Prompt tested successfully!" });
      }
      setResponseTime(`${data.responseTime}ms`);
      queryClient.invalidateQueries({ queryKey: ["/api/prompt-runs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to test prompt",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Save Prompt Mutation
  const savePromptMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; description?: string }) => {
      const res = await apiRequest("POST", "/api/prompts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({ title: "Prompt saved successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save prompt",
        description: error.message,
        variant: "destructive"
      });
    },
  });



  // Handlers
  const handleTestPrompt = () => {
    if (!promptText.trim()) {
      toast({ title: "Please enter a prompt to test", variant: "destructive" });
      return;
    }

    // Check usage limits
    if (!canUsePrompts) {
      toast({
        title: "Prompt limit reached!",
        description: `You've used ${promptsUsed}/${promptsLimit} prompts. Please upgrade your plan to continue.`,
        variant: "destructive"
      });
      return;
    }

    testPromptMutation.mutate({ promptContent: promptText, model: selectedModel });
  };

  // Save prompt function
  const handleSavePrompt = () => {
    if (!promptText.trim()) {
      toast({ title: "Please enter a prompt to save", variant: "destructive" });
      return;
    }

    const title = promptText.slice(0, 50) + (promptText.length > 50 ? "..." : "");
    savePromptMutation.mutate({
      title,
      content: promptText,
      description: `Tested with ${selectedModel}`
    });
  };

  // Save response as .txt file
  const handleSaveResponse = () => {
    if (!aiResponse) {
      toast({ title: "No response to save", variant: "destructive" });
      return;
    }

    const blob = new Blob([aiResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Response saved as .txt file!" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Header with Plan Badge */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-['DM_Sans'] truncate">Welcome back, {user?.username}!</h1>
                <Badge className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-['DM_Sans'] font-semibold self-start">
                  {plan === 'free' && 'FREE PLAN'}
                  {plan === 'pro' && 'PRO PLAN'}
                  {plan === 'team' && 'TEAM PLAN'}
                  {plan === 'enterprise' && 'ENTERPRISE PLAN'}
                  {!plan && 'FREE PLAN'}
                </Badge>
              </div>
              <p className="text-muted-foreground font-['DM_Sans'] text-sm sm:text-base">Test AI models, manage prompts, and boost your productivity</p>
            </div>
          </div>



          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs sm:text-sm">Prompts Used</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-400 truncate">
                      {promptsLimit === Infinity ?
                        `${promptsUsed}/∞` :
                        `${promptsUsed}/${promptsLimit}`
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs sm:text-sm">AI Enhancements</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-400 truncate">
                      {enhancementsLimit === Infinity ?
                        `${enhancementsUsed}/∞` :
                        `${enhancementsUsed}/${enhancementsLimit}`
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs sm:text-sm">Prompts Saved</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-400 truncate">
                      {slotsLimit === Infinity ?
                        `${promptsSaved}/∞` :
                        `${promptsSaved}/${slotsLimit}`
                      }
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Save className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-xs sm:text-sm">Plan</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-400 truncate">
                      {plan === 'free' && 'FREE'}
                      {plan === 'pro' && 'PRO'}
                      {plan === 'team' && 'TEAM'}
                      {plan === 'enterprise' && 'ENTERPRISE'}
                      {!plan && 'FREE'}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Test & Response - Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 min-h-[60vh] lg:h-[calc(100vh-400px)]">
            {/* AI Quick Test - Left Side */}
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl text-foreground font-['DM_Sans'] font-bold">
                  <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  AI QUICK TEST
                </CardTitle>
                <p className="text-muted-foreground text-xs sm:text-sm font-['DM_Sans']">Test any AI model instantly</p>
              </CardHeader>
              <CardContent className="space-y-4 h-full">
                <div className="grid gap-2">
                  <Label htmlFor="model" className="text-gray-200 text-sm font-medium">AI Model</Label>
                  <ModelSelector
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  />
                </div>

                <div className="grid gap-2 flex-1">
                  <Label htmlFor="prompt" className="text-gray-200 text-sm font-medium">Your Prompt</Label>
                  <Textarea
                    placeholder="Enter your prompt here to test with AI models..."
                    className="min-h-[200px] bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-500 resize-none font-['DM_Sans']"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-medium py-3"
                    onClick={handleTestPrompt}
                    disabled={testPromptMutation.isPending || !canUsePrompts}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {!canUsePrompts ? "Limit Reached - Upgrade Plan" :
                     testPromptMutation.isPending ? "Testing..." : "TEST PROMPT"}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-medium py-3 px-4"
                    onClick={handleSavePrompt}
                    disabled={savePromptMutation.isPending || !canSavePrompts || !promptText.trim()}
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Response - Right Side */}
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground flex items-center font-['DM_Sans'] font-bold">
                      <MessageSquare className="mr-3 h-6 w-6 text-emerald-400" />
                      AI RESPONSE
                    </CardTitle>
                    <p className="text-muted-foreground text-sm font-['DM_Sans']">Enhanced AI responses</p>
                  </div>
                  {aiResponse && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={handleSaveResponse}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save .txt
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 h-[300px] overflow-auto">
                  {aiResponse ? (
                    <div className="text-gray-100 font-['DM_Sans']">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{aiResponse}</div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-1 font-['DM_Sans']">AI response will appear here</p>
                      <p className="text-gray-500 text-xs font-['DM_Sans']">Test a prompt to see results</p>
                    </div>
                  )}
                </div>
                {aiResponse && (
                  <div className="flex items-center justify-between mt-3 text-xs bg-gray-800 p-2 rounded border border-gray-600 font-['DM_Sans']">
                    <span className="text-gray-400">Model: <span className="text-emerald-400 font-medium">
                      {selectedModel.includes('gemini-1.5-flash') ? 'Gemini 1.5 Flash' :
                       selectedModel.includes('deepseek-chat') ? 'DeepSeek Chat V3.1' :
                       selectedModel.includes('deepseek-coder') ? 'DeepSeek Coder V3.0' :
                       selectedModel.includes('claude-3.5-haiku') ? 'Claude 3.5 Haiku' :
                       selectedModel.includes('mistral-3b') ? 'Mistral 3B' :
                       selectedModel.includes('claude-4-sonnet') ? 'Claude 4 Sonnet' :
                       selectedModel.includes('gpt-4o') ? 'GPT-4o' : selectedModel}
                    </span></span>
                    <span className="text-gray-400">Time: <span className="text-gray-200">{responseTime}</span></span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-foreground text-lg">Recent Prompts</CardTitle>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </CardHeader>
              <CardContent>
                {prompts.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-gray-200 font-medium mb-2">No prompts yet</h3>
                    <p className="text-gray-400 text-sm">Create your first prompt to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prompts.slice(0, 5).map((prompt: any) => (
                      <div key={prompt.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-colors">
                        <h4 className="text-gray-100 font-medium text-sm">{prompt.title}</h4>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{prompt.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs px-2 py-1 ${
                            prompt.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                          }`}>
                            {prompt.status || "draft"}
                          </Badge>
                          <span className="text-gray-500 text-xs">
                            {new Date(prompt.updated_at || prompt.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground text-lg">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-200 text-sm">Welcome to PromptOp!</p>
                      <p className="text-gray-500 text-xs">Account created</p>
                    </div>
                  </div>
                  {runs.slice(0, 3).map((run: any, index: number) => (
                    <div key={run.id || index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-200 text-sm">Prompt executed successfully</p>
                        <p className="text-gray-500 text-xs">{new Date(run.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Beautiful Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="max-w-lg w-full mx-4 bg-gray-900 border-red-500/20 max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/20 rounded-full flex-shrink-0 mt-1">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-red-400 text-lg font-semibold mb-1">
                  AI Model Error
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm break-words">
                  {errorDetails.model} failed to respond
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-gray-300 text-sm leading-relaxed break-words">
                The <span className="font-medium text-red-400">{errorDetails.model}</span> AI model 
                is currently unavailable and couldn't process your request.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This could be due to temporary service issues, API limits, or maintenance.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="break-words">Try selecting a different AI model</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <ExternalLink className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="break-words">
                  <span>Check service status at </span>
                  <a 
                    href="https://promptop.net/status" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline break-all"
                  >
                    promptop.net/status
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <Users className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="break-words">Contact support if the issue persists</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-gray-700/50">
            <Button 
              onClick={() => setShowErrorModal(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button 
              onClick={() => {
                window.open('https://promptop.net/status', '_blank');
              }}
              variant="outline"
              className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}