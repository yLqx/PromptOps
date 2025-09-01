export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: 'free' | 'pro' | 'team' | 'enterprise';
  category: 'general' | 'coding' | 'reasoning' | 'multimodal';
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'excellent' | 'premium';
  contextLength: string;
  enabled: boolean;
  comingSoon?: boolean;
  maxPromptLength?: number;
  apiKeyEnvVar: string;
}

export const AI_MODELS: AIModel[] = [
  // 🔹 FREE TIER (good, fast, cheap / nearly free)
  // These models cost very little or are completely free - perfect for free users
  {
    id: 'deepseek-chat-v2',
    name: 'DeepSeek Chat V2',
    provider: 'DeepSeek',
    description: 'Super cheap, open model with competitive quality',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Advanced reasoning model, still very affordable',
    tier: 'free',
    category: 'general',
    speed: 'medium',
    quality: 'excellent',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: "Anthropic's fast and affordable Claude model",
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '200K tokens',
    enabled: false,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: "Anthropic's most capable model with excellent reasoning",
    tier: 'free',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Cheaper than GPT-4o, great reasoning for cost',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral AI',
    description: 'Open-source, free to host, efficient',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '32K tokens',
    enabled: false,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    description: 'Open-source mixture of experts model',
    tier: 'free',
    category: 'general',
    speed: 'medium',
    quality: 'excellent',
    contextLength: '32K tokens',
    enabled: false,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'llama-3-8b',
    name: 'LLaMA 3 8B',
    provider: 'Meta',
    description: 'Strong open-source baseline model',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '8K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    description: 'Fast and efficient Google model with good quality',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
    contextLength: '1M tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },

  // 🔹 PRO TIER (low-cost but powerful)
  // Stronger models but still affordable - users pay because these cost more per token
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Much smarter than Haiku, balanced price/performance',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    description: 'Latest Claude model with enhanced capabilities',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Full GPT-4o (vision, reasoning, coding), mid-tier cost',
    tier: 'pro',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Stronger than Mixtral, low to mid cost',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: false,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'llama-3-70b',
    name: 'LLaMA 3 70B',
    provider: 'Meta',
    description: 'High quality open model, good competitor to Sonnet',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '8K tokens',
    enabled: true,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'deepseek-r1-pro',
    name: 'DeepSeek R1 Pro',
    provider: 'DeepSeek',
    description: 'Reasoning-optimized model, still cheap compared to GPT-4',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    description: 'Specialized coding model with excellent programming capabilities',
    tier: 'pro',
    category: 'coding',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    description: 'Lightweight GPT-5 variant optimized for speed and efficiency',
    tier: 'pro',
    category: 'general',
    speed: 'fast',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },

  // 🔹 ENTERPRISE / TEAM TIER (high-cost, premium)
  // Only offer to Pro+ or Enterprise subscribers (since they're expensive)
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: "Anthropic's most advanced model (expensive)",
    tier: 'team',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Top OpenAI model (legacy but powerful)',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-4o-high-context',
    name: 'GPT-4o High-Context',
    provider: 'OpenAI',
    description: 'GPT-4o with extended context window',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '512K tokens',
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: "Google's flagship reasoning + multimodal",
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '2M tokens',
    enabled: true,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },
  {
    id: 'gemini-1.5-flash-high-context',
    name: 'Gemini 1.5 Flash (High Context)',
    provider: 'Google',
    description: 'Cheaper than Pro but still not free-tier',
    tier: 'enterprise',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
    contextLength: '1M tokens',
    enabled: true,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    description: 'Good enterprise-tier with large context',
    tier: 'enterprise',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'COHERE_API_KEY'
  },

  // 🔹 TEAM TIER (Premium models for team plans)
  // High-performance models for team collaboration
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Top OpenAI model (legacy but powerful)',
    tier: 'team',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    description: 'Compact GPT-5 variant with excellent performance',
    tier: 'team',
    category: 'general',
    speed: 'fast',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: "Google's flagship reasoning + multimodal",
    tier: 'team',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '2M tokens',
    enabled: true,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable Claude 3 model with superior performance on highly complex tasks',
    tier: 'team',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },

  // 🔹 ENTERPRISE TIER (Top-tier premium models)
  // Highest performance models for enterprise customers
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Next generation OpenAI model with enhanced capabilities',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '256K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    provider: 'Anthropic',
    description: 'Coming Soon - Next generation reasoning',
    tier: 'enterprise',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  }
];

// Helper functions
export function getModelsByTier(tier: 'free' | 'pro' | 'team' | 'enterprise'): AIModel[] {
  return AI_MODELS.filter(model => model.tier === tier);
}

export function getAvailableModelsForUser(userPlan: string): AIModel[] {
  // Normalize plan name to lowercase and handle variations
  const normalizedPlan = userPlan.toLowerCase().trim();
  
  const planTierMap: Record<string, ('free' | 'pro' | 'team' | 'enterprise')[]> = {
    'free': ['free'],
    'pro': ['free', 'pro'],
    'team': ['free', 'pro', 'team'],
    'enterprise': ['free', 'pro', 'team', 'enterprise'],
    // Handle common variations
    'basic': ['free'],
    'premium': ['free', 'pro'],
    'business': ['free', 'pro', 'enterprise'],
    'unlimited': ['free', 'pro', 'enterprise']
  };
  
  const allowedTiers = planTierMap[normalizedPlan] || ['free'];
  return AI_MODELS.filter(model => allowedTiers.includes(model.tier));
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(model => model.id === id);
}

export function isModelAvailableForUser(modelId: string, userPlan: string): boolean {
  const model = getModelById(modelId);
  if (!model || !model.enabled) return false;
  
  const availableModels = getAvailableModelsForUser(userPlan);
  return availableModels.some(m => m.id === modelId);
}
