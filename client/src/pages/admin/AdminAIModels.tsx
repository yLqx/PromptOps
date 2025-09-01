import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { adminQueryFn, adminApiRequestJson } from "@/lib/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bot,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Settings
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  tier: 'free' | 'pro' | 'team' | 'enterprise';
  enabled: boolean;
  api_endpoint?: string;
  max_tokens?: number;
  cost_per_token?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface TestResult {
  success: boolean;
  message: string;
  responseTime: number;
}

export default function AdminAIModels() {
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modelsData, isLoading } = useQuery({
    queryKey: ["admin-ai-models"],
    queryFn: () => adminQueryFn("/api/admin/ai-models"),
  });

  const updateModelMutation = useMutation({
    mutationFn: async ({ modelId, updates }: { modelId: string; updates: any }) => {
      return adminApiRequestJson("PUT", `/api/admin/ai-models/${modelId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ai-models"] });
      toast({ title: "Model updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update model", description: error.message, variant: "destructive" });
    },
  });

  const testModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      return adminApiRequestJson("POST", `/api/admin/ai-models/test/${modelId}`);
    },
    onSuccess: (data, modelId) => {
      setTestResults(prev => ({ ...prev, [modelId]: data.testResult }));
      setCurrentTestResult(data.testResult);
      setShowTestDialog(true);
      setTestingModel(null);

      if (data.testResult.success) {
        toast({ title: "Model test successful", description: data.testResult.message });
      } else {
        toast({
          title: "Model test failed",
          description: data.testResult.message,
          variant: "destructive"
        });
      }
    },
    onError: (error: any, modelId) => {
      setTestingModel(null);
      toast({ title: "Test failed", description: error.message, variant: "destructive" });
    },
  });

  const handleToggleModel = (modelId: string, enabled: boolean) => {
    updateModelMutation.mutate({ modelId, updates: { enabled } });
  };

  const handleTestModel = (modelId: string) => {
    setTestingModel(modelId);
    testModelMutation.mutate(modelId);
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'pro': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'team': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'enterprise': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'anthropic': return '🤖';
      case 'openai': return '🧠';
      case 'google': return '🔍';
      default: return '⚡';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Models</h1>
          <p className="text-gray-400 mt-1">Manage and test AI model integrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-emerald-500" />
          <span className="text-sm text-gray-400">
            {modelsData?.models?.length || 0} models configured
          </span>
        </div>
      </div>

      {/* Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['free', 'pro', 'team', 'enterprise'].map((tier) => {
          const tierModels = modelsData?.models?.filter((m: AIModel) => m.tier === tier) || [];
          const enabledCount = tierModels.filter((m: AIModel) => m.enabled).length;
          
          return (
            <Card key={tier} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 capitalize">{tier} Tier</p>
                    <p className="text-lg font-bold text-white">{enabledCount}/{tierModels.length}</p>
                    <p className="text-xs text-gray-500">Active models</p>
                  </div>
                  <Badge className={getTierBadgeColor(tier)}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Models Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Model Configuration</CardTitle>
          <CardDescription className="text-gray-400">
            Enable/disable models and test their API connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Model</TableHead>
                  <TableHead className="text-gray-400">Provider</TableHead>
                  <TableHead className="text-gray-400">Tier</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Last Test</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelsData?.models?.map((model: AIModel) => (
                  <TableRow key={model.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getProviderIcon(model.provider)}</span>
                        <div>
                          <p className="font-medium text-white">{model.name}</p>
                          <p className="text-sm text-gray-400">{model.model_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {model.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierBadgeColor(model.tier)}>
                        {model.tier.charAt(0).toUpperCase() + model.tier.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={model.enabled}
                          onCheckedChange={(enabled) => handleToggleModel(model.id, enabled)}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <span className={`text-sm ${model.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {model.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {testResults[model.id] ? (
                        <div className="flex items-center space-x-2">
                          {testResults[model.id].success ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-sm text-gray-400">
                            {testResults[model.id].responseTime}ms
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not tested</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestModel(model.id)}
                        disabled={testingModel === model.id || !model.enabled}
                        className="text-gray-400 hover:text-white"
                      >
                        {testingModel === model.id ? (
                          <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Test Result Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Model Test Result</DialogTitle>
            <DialogDescription className="text-gray-400">
              API connectivity test results
            </DialogDescription>
          </DialogHeader>
          
          {currentTestResult && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {currentTestResult.success ? (
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-400" />
                )}
                <div>
                  <p className="font-medium text-white">
                    {currentTestResult.success ? 'Test Successful' : 'Test Failed'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Response time: {currentTestResult.responseTime}ms
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300">{currentTestResult.message}</p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowTestDialog(false)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
