import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup, SelectSeparator } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Brain, Code, Palette, Eye } from "lucide-react";
import { AI_MODELS, type AIModel } from "@shared/ai-models";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const categoryIcons = {
  general: <Brain className="h-3 w-3" />,
  coding: <Code className="h-3 w-3" />,
  creative: <Palette className="h-3 w-3" />,
  reasoning: <Brain className="h-3 w-3" />,
  multimodal: <Eye className="h-3 w-3" />,
  image: <Eye className="h-3 w-3" />,
  audio: <Eye className="h-3 w-3" />
};

const speedColors = {
  fast: "text-emerald-400",
  medium: "text-yellow-400", 
  slow: "text-orange-400"
};

const qualityColors = {
  good: "text-gray-400",
  excellent: "text-emerald-400",
  premium: "text-emerald-300"
};

const tierColors = {
  free: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pro: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
  team: "bg-emerald-700/20 text-emerald-400 border-emerald-700/30"
};

export default function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
  const { user } = useSupabaseAuth();
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  // Fetch available models from server
  useEffect(() => {
    const fetchAvailableModels = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/models/available', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Fetched models from server:', data);

          // Handle both old format (array) and new format (object)
          if (Array.isArray(data)) {
            // Old format - just models array
            setAvailableModels(data);
            setUserPlan(user?.plan || 'free');
          } else {
            // New format - object with models and userPlan
            setAvailableModels(data.models || []);
            setUserPlan(data.userPlan || user?.plan || 'free');
          }

          console.log('✅ Model selector updated:', {
            modelsCount: Array.isArray(data) ? data.length : (data.models?.length || 0),
            userPlan: Array.isArray(data) ? (user?.plan || 'free') : (data.userPlan || user?.plan || 'free')
          });
        } else {
          console.error('Failed to fetch models:', response.status);
          // Fallback: Use user's actual plan from auth context
          const actualUserPlan = user?.plan || 'free';
          setUserPlan(actualUserPlan);

          // Filter models based on user's actual plan
          if (actualUserPlan === 'pro') {
            setAvailableModels(AI_MODELS.filter(m => m.tier === 'free' || m.tier === 'pro'));
          } else if (actualUserPlan === 'team') {
            setAvailableModels(AI_MODELS.filter(m => ['free', 'pro', 'team'].includes(m.tier)));
          } else {
            setAvailableModels(AI_MODELS.filter(m => m.tier === 'free'));
          }

          console.log('⚠️ Using fallback plan detection:', actualUserPlan);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback: Use user's actual plan from auth context
        const actualUserPlan = user?.plan || 'free';
        setUserPlan(actualUserPlan);

        // Filter models based on user's actual plan
        if (actualUserPlan === 'pro') {
          setAvailableModels(AI_MODELS.filter(m => m.tier === 'free' || m.tier === 'pro'));
        } else if (actualUserPlan === 'team') {
          setAvailableModels(AI_MODELS.filter(m => ['free', 'pro', 'team'].includes(m.tier)));
        } else {
          setAvailableModels(AI_MODELS.filter(m => m.tier === 'free'));
        }

        console.log('⚠️ Using fallback plan detection (error):', actualUserPlan);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableModels();
  }, [user]);

  const freeModels = availableModels.filter(m => m.tier === 'free');
  const proModels = availableModels.filter(m => m.tier === 'pro');
  const teamModels = availableModels.filter(m => m.tier === 'team');

  // Get unavailable models for display with lock icon
  const isModelAvailable = (modelId: string) => availableModels.some(m => m.id === modelId);
  const unavailableProModels = AI_MODELS.filter(m => m.tier === 'pro' && !isModelAvailable(m.id));
  const unavailableTeamModels = AI_MODELS.filter(m => m.tier === 'team' && !isModelAvailable(m.id));

  const renderModelItem = (model: AIModel, isAvailable: boolean = true) => (
    <SelectItem 
      key={model.id} 
      value={model.id}
      disabled={!isAvailable || !model.enabled}
      className={cn(
        "flex items-center justify-between py-3 px-3",
        !isAvailable && "opacity-50 cursor-not-allowed",
        !model.enabled && "opacity-60"
      )}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className="flex items-center space-x-2">
          {categoryIcons[model.category]}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{model.name}</span>
              {!isAvailable && <Lock className="h-3 w-3 text-muted-foreground" />}
              {!model.enabled && <Badge variant="outline" className="text-xs">Coming Soon</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">{model.description}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={cn("text-xs", tierColors[model.tier])}>
            {model.tier}
          </Badge>
          <span className={cn("text-xs", speedColors[model.speed])}>
            {model.speed}
          </span>
          <span className={cn("text-xs", qualityColors[model.quality])}>
            {model.quality}
          </span>
        </div>
      </div>
    </SelectItem>
  );

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder="Loading models..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select an AI model" />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {/* Free Models */}
        {freeModels.length > 0 && (
          <SelectGroup>
            <SelectLabel className="flex items-center space-x-2 text-emerald-400">
              <Zap className="h-4 w-4" />
              <span>Free Models</span>
            </SelectLabel>
            {freeModels.map(model => renderModelItem(model, true))}
          </SelectGroup>
        )}

        {/* Pro Models */}
        {(proModels.length > 0 || unavailableProModels.length > 0) && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="flex items-center space-x-2 text-emerald-400">
                <Brain className="h-4 w-4" />
                <span>Pro Models</span>
                {userPlan === 'free' && (
                  <Badge variant="outline" className="text-xs bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                    Pro Plan Required
                  </Badge>
                )}
              </SelectLabel>
              {proModels.map(model => renderModelItem(model, true))}
              {userPlan === 'free' && unavailableProModels.slice(0, 5).map(model => renderModelItem(model, false))}
            </SelectGroup>
          </>
        )}

        {/* Team Models */}
        {(teamModels.length > 0 || unavailableTeamModels.length > 0) && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="flex items-center space-x-2 text-purple-400">
                <Lock className="h-4 w-4" />
                <span>Team Models</span>
                {(userPlan === 'free' || userPlan === 'pro') && (
                  <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Team Plan Required
                  </Badge>
                )}
              </SelectLabel>
              {teamModels.map(model => renderModelItem(model, true))}
              {(userPlan === 'free' || userPlan === 'pro') && unavailableTeamModels.slice(0, 5).map(model => renderModelItem(model, false))}
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
