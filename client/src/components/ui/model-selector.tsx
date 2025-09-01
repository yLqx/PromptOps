import { useState } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup, SelectSeparator } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Brain, Code, Palette, Eye } from "lucide-react";
import { AI_MODELS, getAvailableModelsForUser, isModelAvailableForUser, type AIModel } from "@shared/ai-models";
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
  multimodal: <Eye className="h-3 w-3" />
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
  pro: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  team: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  enterprise: "bg-emerald-600/20 text-emerald-300 border-emerald-600/30"
};

export default function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
  const { user } = useSupabaseAuth();
  const userPlan = user?.plan || 'free';
  
  const availableModels = getAvailableModelsForUser(userPlan);
  const freeModels = availableModels.filter(m => m.tier === 'free');
  const proModels = availableModels.filter(m => m.tier === 'pro');
  const teamModels = availableModels.filter(m => m.tier === 'team');
  const enterpriseModels = availableModels.filter(m => m.tier === 'enterprise');
  
  // Get unavailable models for display with lock icon
  const unavailableProModels = AI_MODELS.filter(m => m.tier === 'pro' && !isModelAvailableForUser(m.id, userPlan));
  const unavailableTeamModels = AI_MODELS.filter(m => m.tier === 'team' && !isModelAvailableForUser(m.id, userPlan));
  const unavailableEnterpriseModels = AI_MODELS.filter(m => m.tier === 'enterprise' && !isModelAvailableForUser(m.id, userPlan));

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
              <SelectLabel className="flex items-center space-x-2 text-gray-400">
                <Brain className="h-4 w-4" />
                <span>Pro Models</span>
                {userPlan === 'free' && (
                  <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                    Upgrade Required
                  </Badge>
                )}
              </SelectLabel>
              {proModels.map(model => renderModelItem(model, true))}
              {userPlan === 'free' && unavailableProModels.slice(0, 3).map(model => renderModelItem(model, false))}
            </SelectGroup>
          </>
        )}

        {/* Team Models */}
        {(teamModels.length > 0 || unavailableTeamModels.length > 0) && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="flex items-center space-x-2 text-blue-400">
                <Brain className="h-4 w-4" />
                <span>Team Models</span>
                {(userPlan === 'free' || userPlan === 'pro') && (
                  <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Team Plan Required
                  </Badge>
                )}
              </SelectLabel>
              {teamModels.map(model => renderModelItem(model, true))}
              {(userPlan === 'free' || userPlan === 'pro') && unavailableTeamModels.slice(0, 3).map(model => renderModelItem(model, false))}
            </SelectGroup>
          </>
        )}

        {/* Enterprise Models */}
        {(enterpriseModels.length > 0 || unavailableEnterpriseModels.length > 0) && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel className="flex items-center space-x-2 text-purple-400">
                <Lock className="h-4 w-4" />
                <span>Enterprise Models</span>
                {userPlan !== 'enterprise' && (
                  <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Enterprise Only
                  </Badge>
                )}
              </SelectLabel>
              {enterpriseModels.map(model => renderModelItem(model, true))}
              {(userPlan === 'free' || userPlan === 'pro' || userPlan === 'team') && unavailableEnterpriseModels.slice(0, 2).map(model => renderModelItem(model, false))}
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
