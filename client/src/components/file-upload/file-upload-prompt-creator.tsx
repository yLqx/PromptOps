import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Upload, 
  File, 
  X, 
  Wand2,
  Save,
  FileText,
  Image,
  FileCode,
  FileSpreadsheet
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModelSelector from "@/components/ui/model-selector";

interface FileUploadPromptCreatorProps {
  onClose?: () => void;
}

export default function FileUploadPromptCreator({ onClose }: FileUploadPromptCreatorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [isPublic, setIsPublic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate prompt from file content mutation
  const generatePromptMutation = useMutation({
    mutationFn: async (data: { content: string; fileName: string; model: string }) => {
      const res = await apiRequest("POST", "/api/generate-prompt-from-file", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedPrompt(data.prompt);
      toast({ title: "Prompt generated successfully from file!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to generate prompt", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/prompts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({ title: "File-based prompt saved successfully!" });
      // Reset form
      resetForm();
      if (onClose) onClose();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to save prompt", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTags("");
    setSelectedFile(null);
    setFileContent("");
    setGeneratedPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please select a file smaller than 10MB",
        variant: "destructive" 
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'application/json',
      'text/markdown',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({ 
        title: "Unsupported file type", 
        description: "Please select a text, image, PDF, Word, or Excel file",
        variant: "destructive" 
      });
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Read file content
      let content = "";
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        content = await file.text();
      } else if (file.type.startsWith('image/')) {
        // For images, we'll send the file as base64
        const reader = new FileReader();
        reader.onload = () => {
          content = reader.result as string;
          setFileContent(content);
        };
        reader.readAsDataURL(file);
        setIsProcessing(false);
        return;
      } else {
        // For other file types, we'll need to handle them on the server
        content = `[${file.type}] ${file.name} - ${(file.size / 1024).toFixed(1)}KB`;
      }

      setFileContent(content);
    } catch (error) {
      toast({ 
        title: "Error reading file", 
        description: "Failed to read the selected file",
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePrompt = () => {
    if (!selectedFile || !fileContent) {
      toast({ 
        title: "No file selected", 
        description: "Please select a file first",
        variant: "destructive" 
      });
      return;
    }

    generatePromptMutation.mutate({
      content: fileContent,
      fileName: selectedFile.name,
      model: selectedModel
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!generatedPrompt.trim()) {
      toast({ title: "Please generate a prompt from the file first", variant: "destructive" });
      return;
    }

    const promptData = {
      title: title.trim(),
      content: generatedPrompt.trim(),
      description: description.trim(),
      category: category || "general",
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      isPublic,
      createdViaFile: true,
      sourceFileName: selectedFile?.name
    };

    savePromptMutation.mutate(promptData);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.includes('spreadsheet') || file.type.includes('csv')) return <FileSpreadsheet className="h-5 w-5" />;
    if (file.type.includes('code') || file.type === 'application/json') return <FileCode className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const categories = [
    "general", "marketing", "writing", "coding", "business", 
    "education", "creative", "analysis", "research", "productivity"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          File-Based Prompt Creator
        </CardTitle>
        <CardDescription>
          Upload a file and let AI generate a powerful prompt based on its content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <Label>Upload File</Label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".txt,.csv,.json,.md,.pdf,.jpg,.jpeg,.png,.gif,.docx,.xlsx"
            />
            
            {!selectedFile ? (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <File className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supports: Text, CSV, JSON, Markdown, PDF, Images, Word, Excel (max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {getFileIcon(selectedFile)}
                  <span className="font-medium">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileContent("");
                      setGeneratedPrompt("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)}KB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Model Selection */}
        {selectedFile && (
          <div className="space-y-2">
            <Label>AI Model for Prompt Generation</Label>
            <ModelSelector
              value={selectedModel}
              onValueChange={setSelectedModel}
            />
          </div>
        )}

        {/* Generate Prompt Button */}
        {selectedFile && fileContent && (
          <div className="flex justify-center">
            <Button
              onClick={handleGeneratePrompt}
              disabled={generatePromptMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {generatePromptMutation.isPending ? "Generating..." : "Generate Prompt from File"}
            </Button>
          </div>
        )}

        {/* Generated Prompt Display */}
        {generatedPrompt && (
          <div className="space-y-2">
            <Label>Generated Prompt</Label>
            <Textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              rows={8}
              className="min-h-[200px]"
              placeholder="Generated prompt will appear here..."
            />
            <Badge variant="secondary" className="text-xs">
              {generatedPrompt.split(' ').length} words
            </Badge>
          </div>
        )}

        {/* Form Fields */}
        {generatedPrompt && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter prompt title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this prompt does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="ai, analysis, file-based, automation..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSave}
                disabled={savePromptMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {savePromptMutation.isPending ? "Saving..." : "Save Prompt"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
