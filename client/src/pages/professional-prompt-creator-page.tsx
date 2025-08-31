import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import VoicePromptCreator from "@/components/voice/voice-prompt-creator";
import FileUploadPromptCreator from "@/components/file-upload/file-upload-prompt-creator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Wand2,
  Zap,
  Clock,
  Volume2,
  MessageSquare,
  Sparkles,
  Upload,
  FileText
} from "lucide-react";

export default function ProfessionalPromptCreatorPage() {
  const { user } = useSupabaseAuth();

  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-500" />,
      title: "Voice-to-Text",
      description: "Speak naturally and watch your words transform into powerful prompts instantly"
    },
    {
      icon: <Upload className="h-8 w-8 text-green-500" />,
      title: "File-Based Generation",
      description: "Upload files and let AI generate contextual prompts based on content"
    },
    {
      icon: <Wand2 className="h-8 w-8 text-purple-500" />,
      title: "AI Enhancement",
      description: "Automatically improve your prompts with AI-powered suggestions"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Quick Creation",
      description: "Create prompts 3x faster than traditional methods"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      title: "Community Sharing",
      description: "Share your created prompts with the community and get feedback"
    }
  ];

  const tips = [
    "Speak clearly and at a moderate pace for best voice results",
    "Upload text, images, PDFs, or documents for file-based prompts",
    "Use punctuation words like 'comma', 'period', 'question mark' in voice mode",
    "You can edit generated prompts before saving",
    "Try different AI models for varied prompt generation styles",
    "Try different categories to organize your prompts",
    "Add tags to make your prompts discoverable"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Mic className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-4xl font-bold">Professional Prompt Creator</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your ideas into powerful prompts using the magic of voice. 
                Speak naturally and let AI do the rest.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  3x Faster
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Voice Recognition
                </Badge>
              </div>
            </div>

            {/* Prompt Creator Tabs */}
            <Tabs defaultValue="voice" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Voice Creator
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Creator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="mt-6">
                <VoicePromptCreator />
              </TabsContent>

              <TabsContent value="file" className="mt-6">
                <FileUploadPromptCreator />
              </TabsContent>
            </Tabs>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-3">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Pro Tips for Voice Prompts
                </CardTitle>
                <CardDescription>
                  Get the best results from voice-to-text conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-500 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            {user && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Voice Prompts Created</CardTitle>
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      This month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0 min</div>
                    <p className="text-xs text-muted-foreground">
                      Compared to typing
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Community Shares</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      Public prompts shared
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Browser Compatibility Notice */}
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Browser Compatibility
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Voice recognition works best in Chrome, Edge, and Safari. 
                      Make sure to allow microphone access when prompted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
