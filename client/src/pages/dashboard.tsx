import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserUsage } from "@/hooks/use-user-usage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ModelSelector from "@/components/ui/model-selector";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Save, 
  Download, 
  Copy,
  Sparkles,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react";
import { createPrompt as createPromptDb, type Prompt } from "@/lib/supabase";

interface TestResult {
  response: string;
  responseTime: number;
  model: string;
  timestamp: string;
}

export default function Dashboard() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { promptsUsed, promptsLimit, enhancementsUsed, enhancementsLimit, plan } = useUserUsage();

  // AI Testing State
  const [selectedModel, setSelectedModel] = useState("");
  const [promptTitle, setPromptTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);

  // Dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard-stats");
      return await res.json();
    },
    enabled: !!user
  });

  // Test Prompt Mutation
  const testPromptMutation = useMutation({
    mutationFn: async ({ content, model }: { content: string; model: string }) => {
      const startTime = Date.now();
      const res = await apiRequest("POST", "/api/test-prompt", { 
        promptContent: content,
        model: model
      });
      const data = await res.json();
      const responseTime = Date.now() - startTime;
      
      return {
        response: data.response || data.result,
        responseTime,
        model,
        timestamp: new Date().toISOString()
      };
    },
    onSuccess: (data) => {
      setTestResult(data);
      setIsTestingInProgress(false);
      toast({ 
        title: "Prompt tested successfully!", 
        description: `Response time: ${data.responseTime}ms`
      });
    },
    onError: (error: any) => {
      setIsTestingInProgress(false);
      toast({
        title: "Test failed",
        description: error.message || "Failed to test prompt",
        variant: "destructive"
      });
    }
  });

  // Save Prompt Mutation
  const savePromptMutation = useMutation({
    mutationFn: async () => {
      if (!user || !promptTitle.trim() || !promptContent.trim()) {
        throw new Error('Title and content are required');
      }
      
      return await createPromptDb({
        user_id: user.id,
        title: promptTitle,
        content: promptContent,
        description: `AI tested with ${selectedModel}`,
        status: 'active',
        category_id: undefined,
        tags: selectedModel ? [selectedModel] : [],
        visibility: 'private',
        created_via_voice: false,
      } as Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'views_count' | 'shares_count'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-prompts"] });
      toast({ title: "Prompt saved successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save prompt",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleTestPrompt = () => {
    if (!promptContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedModel) {
      toast({
        title: "Error", 
        description: "Please select an AI model",
        variant: "destructive"
      });
      return;
    }

    setIsTestingInProgress(true);
    setTestResult(null);
    testPromptMutation.mutate({ content: promptContent, model: selectedModel });
  };

  const handleSavePrompt = () => {
    if (!promptTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your prompt",
        variant: "destructive"
      });
      return;
    }
    savePromptMutation.mutate();
  };

  const handleDownloadResult = () => {
    if (!testResult) return;
    
    const downloadData = {
      prompt: promptContent,
      model: testResult.model,
      response: testResult.response,
      responseTime: `${testResult.responseTime}ms`,
      timestamp: testResult.timestamp
    };
    
    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-test-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Test result downloaded!" });
  };

  const handleCopyResponse = () => {
    if (!testResult?.response) return;
    navigator.clipboard.writeText(testResult.response);
    toast({ title: "Response copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2 font-['DM_Sans']">AI Prompt Testing</h1>
            <p className="text-gray-400 font-['DM_Sans']">Test your prompts with different AI models and save the results</p>
          </div>

          {/* Usage Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900/50 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Prompts Used</p>
                    <p className="text-lg font-bold text-gray-100">{promptsUsed}/{promptsLimit === Infinity ? "∞" : promptsLimit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">AI Enhancements</p>
                    <p className="text-lg font-bold text-gray-100">{enhancementsUsed}/{enhancementsLimit === Infinity ? "∞" : enhancementsLimit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Tests Today</p>
                    <p className="text-lg font-bold text-gray-100">{statsLoading ? "..." : stats?.runsToday || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-lg font-bold text-emerald-400">{statsLoading ? "..." : stats?.successRate || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main AI Testing Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Input */}
            <Card className="bg-gray-900/30 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-emerald-400" />
                  AI Model Testing
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Select a model, enter your prompt, and test it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="model" className="text-gray-100">AI Model</Label>
                  <ModelSelector
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-gray-100">Prompt Title (Optional)</Label>
                  <Input
                    id="title"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    placeholder="Enter a title for your prompt..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="prompt" className="text-gray-100">Your Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="min-h-32 mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleTestPrompt}
                    disabled={isTestingInProgress || !promptContent.trim() || !selectedModel}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isTestingInProgress ? "Testing..." : "Test Prompt"}
                  </Button>
                  
                  <Button
                    onClick={handleSavePrompt}
                    disabled={!promptTitle.trim() || !promptContent.trim() || savePromptMutation.isPending}
                    variant="outline"
                    className="hover:bg-emerald-600/10 hover:border-emerald-500"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Results */}
            <Card className="bg-gray-900/30 border-emerald-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-100 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-emerald-400" />
                    AI Response
                  </CardTitle>
                  {testResult && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyResponse}
                        className="hover:bg-emerald-600/10 hover:border-emerald-500"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadResult}
                        className="hover:bg-emerald-600/10 hover:border-emerald-500"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {testResult && (
                  <CardDescription className="text-gray-400">
                    Response from {testResult.model} • {testResult.responseTime}ms
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {isTestingInProgress ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
                      <span className="text-gray-400">Testing your prompt...</span>
                    </div>
                  </div>
                ) : testResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Test completed successfully</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        {testResult.responseTime}ms
                      </Badge>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <pre className="text-gray-100 whitespace-pre-wrap text-sm font-mono">
                        {testResult.response}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No test results yet</p>
                      <p className="text-sm text-gray-500 mt-1">Run a prompt test to see the AI response here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
