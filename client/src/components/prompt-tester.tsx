import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Copy } from "lucide-react";
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  // Simple text formatter for AI responses
  const formatText = (text: string) => {
    if (!text) return text;

    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-emerald-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-emerald-300 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/__(.*?)__/g, '<u class="underline text-blue-300">$1</u>');
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
          <CardTitle className="flex items-center justify-between">
            AI Response
            {response && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(response)}
                className="h-8"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background border border-border rounded-lg p-4 min-h-32 overflow-auto mb-4">
            {response ? (
              <div
                className="text-foreground whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatText(response) }}
              />
            ) : (
              <p className="text-muted-foreground italic">AI response will appear here after testing your prompt...</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Model: <span className="text-emerald-400">{model || "Auto-selected"}</span>
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
