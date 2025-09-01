import { useState, useRef, useEffect } from "react";
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
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Save, 
  Trash2,
  Volume2,
  VolumeX,
  Wand2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModelSelector from "@/components/ui/model-selector";

interface VoicePromptCreatorProps {
  onClose?: () => void;
}

export default function VoicePromptCreator({ onClose }: VoicePromptCreatorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [isPublic, setIsPublic] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech recognition error",
          description: "Please try again or type manually",
          variant: "destructive"
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      toast({
        title: "Recording started",
        description: "Speak clearly to create your prompt"
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    toast({
      title: "Recording stopped",
      description: "Your voice has been converted to text"
    });
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl("");
    setTranscript("");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Generate prompt from voice transcript mutation
  const generatePromptMutation = useMutation({
    mutationFn: async (data: { content: string; model: string }) => {
      const res = await apiRequest("POST", "/api/generate-prompt-from-voice", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedPrompt(data.prompt);
      toast({ title: "Prompt generated successfully from voice!" });
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
      toast({ title: "Voice prompt saved successfully!" });
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setTranscript("");
      setGeneratedPrompt("");
      clearRecording();
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

  const handleGeneratePrompt = () => {
    if (!transcript.trim()) {
      toast({
        title: "No voice transcript",
        description: "Please record some audio first",
        variant: "destructive"
      });
      return;
    }

    generatePromptMutation.mutate({
      content: transcript.trim(),
      model: selectedModel
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!generatedPrompt.trim()) {
      toast({ title: "Please generate a prompt from your voice recording first", variant: "destructive" });
      return;
    }

    const promptData = {
      title: title.trim(),
      content: generatedPrompt.trim(),
      description: description.trim(),
      category: category || "general",
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      isPublic: false, // Remove community sharing option
      created_via_voice: true
    };

    savePromptMutation.mutate(promptData);
  };

  const categories = [
    "general", "marketing", "writing", "coding", "business", 
    "education", "creative", "analysis", "research", "productivity"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Prompt Creator
        </CardTitle>
        <CardDescription>
          Create prompts using your voice or type them manually
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Voice Recording Section */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Voice Recording</Label>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className={isRecording ? "animate-pulse" : ""}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            {audioUrl && (
              <>
                <Button
                  onClick={playAudio}
                  variant="outline"
                  size="lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  onClick={clearRecording}
                  variant="outline"
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </>
            )}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording in progress...</span>
            </div>
          )}
        </div>

        {/* Transcript Section */}
        <div className="space-y-2">
          <Label htmlFor="transcript">Voice Transcript</Label>
          <Textarea
            id="transcript"
            placeholder="Your voice will be transcribed here, or you can type directly..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            className="min-h-[150px]"
          />
          {transcript && (
            <Badge variant="secondary" className="text-xs">
              {transcript.split(' ').length} words
            </Badge>
          )}
        </div>

        {/* AI Model Selection */}
        {transcript && (
          <div className="space-y-2">
            <Label>AI Model for Prompt Generation</Label>
            <ModelSelector
              value={selectedModel}
              onValueChange={setSelectedModel}
            />
          </div>
        )}

        {/* Generate Prompt Button */}
        {transcript && (
          <div className="flex justify-center">
            <Button
              onClick={handleGeneratePrompt}
              disabled={generatePromptMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {generatePromptMutation.isPending ? "Generating..." : "Generate Prompt from Voice"}
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
            placeholder="ai, writing, creative, marketing..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4 border-t">
              <div className="flex gap-2">
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={savePromptMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {savePromptMutation.isPending ? "Saving..." : "Save Prompt"}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Hidden audio element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
        )}
      </CardContent>
    </Card>
  );
}
