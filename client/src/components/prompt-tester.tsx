import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PromptTesterProps {
  initialPrompt?: string;
  onTest?: (response: any) => void;
}

export default function PromptTester({ initialPrompt = "", onTest }: PromptTesterProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const { toast } = useToast();

  const testPromptMutation = useMutation({
    mutationFn: async (promptContent: string) => {
      const res = await apiRequest("POST", "/api/test-prompt", { promptContent });
      return res.json();
    },
    onSuccess: (data) => {
      setResponse(data.response);
      setModel(data.model);
      setResponseTime(`${data.responseTime}ms`);
      
      if (onTest) {
        onTest(data);
      }

      toast({ 
        title: "Prompt tested successfully", 
        description: `Response time: ${data.responseTime}ms` 
      });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to test prompt", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleTest = () => {
    if (!prompt.trim()) {
      toast({ 
        title: "Empty prompt", 
        description: "Please enter a prompt to test",
        variant: "destructive" 
      });
      return;
    }
    testPromptMutation.mutate(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your prompt here..."
              className="min-h-32"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              onClick={handleTest}
              disabled={testPromptMutation.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              {testPromptMutation.isPending ? "Testing..." : "Test Prompt"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background border border-border rounded-lg p-4 min-h-32 overflow-auto mb-4">
            {response ? (
              <p className="text-foreground whitespace-pre-wrap">{response}</p>
            ) : (
              <p className="text-muted-foreground italic">AI response will appear here after testing your prompt...</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Model: <span className="text-emerald-400">{model || "Gemini Pro"}</span>
            </span>
            <span className="text-muted-foreground">
              Response time: <span className="text-foreground">{responseTime || "--"}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
