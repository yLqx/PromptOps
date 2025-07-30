import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Play, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Prompt } from "@shared/schema";

export default function PromptsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: prompts = [], isLoading } = useQuery<Prompt[]>({
    queryKey: ["/api/prompts"],
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/prompts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setIsCreateOpen(false);
      toast({ title: "Prompt created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create prompt", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/prompts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setIsEditOpen(false);
      setSelectedPrompt(null);
      toast({ title: "Prompt updated successfully" });
    },
  });

  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/prompts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({ title: "Prompt deleted successfully" });
    },
  });

  const testPromptMutation = useMutation({
    mutationFn: async ({ promptContent, promptId }: { promptContent: string; promptId?: string }) => {
      const res = await apiRequest("POST", "/api/test-prompt", { promptContent, promptId });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Prompt tested successfully", 
        description: `Response time: ${data.responseTime}ms` 
      });
    },
  });

  const handleCreatePrompt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createPromptMutation.mutate({
      title: formData.get("title"),
      content: formData.get("content"),
      description: formData.get("description"),
      status: formData.get("status"),
    });
  };

  const handleUpdatePrompt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPrompt) return;
    
    const formData = new FormData(e.currentTarget);
    updatePromptMutation.mutate({
      id: selectedPrompt.id,
      data: {
        title: formData.get("title"),
        content: formData.get("content"),
        description: formData.get("description"),
        status: formData.get("status"),
      },
    });
  };

  const handleTestPrompt = (prompt: Prompt) => {
    testPromptMutation.mutate({
      promptContent: prompt.content,
      promptId: prompt.id,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">My Prompts</h2>
              <p className="text-muted-foreground">Create, edit, and manage your AI prompts</p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Prompt</DialogTitle>
                  <DialogDescription>
                    Create a new AI prompt to save and test.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePrompt}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" placeholder="Enter prompt title" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" placeholder="Brief description of the prompt" />
                    </div>
                    <div>
                      <Label htmlFor="content">Prompt Content</Label>
                      <Textarea 
                        id="content" 
                        name="content" 
                        placeholder="Enter your prompt here..." 
                        className="min-h-32"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue="draft">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit" disabled={createPromptMutation.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      Create Prompt
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading prompts...</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No prompts yet</h3>
              <p className="text-muted-foreground mb-4">Create your first prompt to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="hover:border-emerald-500 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {prompt.description || "No description"}
                        </CardDescription>
                      </div>
                      <Badge variant={prompt.status === "active" ? "default" : "secondary"}>
                        {prompt.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {prompt.content}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestPrompt(prompt)}
                        disabled={testPromptMutation.isPending}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPrompt(prompt);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePromptMutation.mutate(prompt.id)}
                        disabled={deletePromptMutation.isPending}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Prompt</DialogTitle>
                <DialogDescription>
                  Update your prompt details and content.
                </DialogDescription>
              </DialogHeader>
              {selectedPrompt && (
                <form onSubmit={handleUpdatePrompt}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Title</Label>
                      <Input 
                        id="edit-title" 
                        name="title" 
                        defaultValue={selectedPrompt.title}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Input 
                        id="edit-description" 
                        name="description" 
                        defaultValue={selectedPrompt.description || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-content">Prompt Content</Label>
                      <Textarea 
                        id="edit-content" 
                        name="content" 
                        defaultValue={selectedPrompt.content}
                        className="min-h-32"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select name="status" defaultValue={selectedPrompt.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit" disabled={updatePromptMutation.isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      Update Prompt
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
