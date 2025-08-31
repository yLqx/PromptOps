import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function QuickTest() {
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

  const testPromptMutation = useMutation({
    mutationFn: async (promptContent: string) => {
      const res = await apiRequest("POST", "/api/test-prompt", { promptContent });
      return res.json();
    },
    onSuccess: (data) => {
      // Update the AI response display
      const responseEl = document.getElementById("ai-response");
      const modelEl = document.querySelector("[data-model]");
      const timeEl = document.querySelector("[data-time]");

      const safeResponse = data?.response && data.response.trim().length > 0
        ? data.response
        : (data?.error ? `AI Error: ${data.error}` : "No response generated. Check your AI API keys in the server .env.");

      if (responseEl) {
        responseEl.innerHTML = `<p class="text-foreground">${safeResponse}</p>`;
      }
      if (modelEl) {
        modelEl.textContent = data?.model || 'unknown';
      }
      if (timeEl) {
        timeEl.textContent = `${data?.responseTime ?? 0}ms`;
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
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">Quick Test Prompt</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="quick-prompt">Prompt</Label>
          <Textarea
            id="quick-prompt"
            placeholder="Enter your prompt here..."
            className="min-h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            onClick={handleTest}
            disabled={testPromptMutation.isPending}
          >
            <Play className="mr-2 h-4 w-4" />
            {testPromptMutation.isPending ? "Testing..." : "Test Prompt"}
          </Button>
          <Button variant="outline" className="px-4">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
