export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: 'free' | 'pro' | 'enterprise';
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
    category: 'reasoning',
    speed: 'medium',
    quality: 'excellent',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    description: "Anthropic's fast + cheapest Claude model",
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
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
    enabled: true,
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
    enabled: true,
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

  // 🔹 PRO TIER (low-cost but powerful)
  // Stronger models but still affordable - users pay because these cost more per token
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Much smarter than Haiku, balanced price/performance',
    tier: 'pro',
    category: 'reasoning',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
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
    enabled: true,
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
    category: 'reasoning',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },

  // 🔹 ENTERPRISE / TEAM TIER (high-cost, premium)
  // Only offer to Pro+ or Enterprise subscribers (since they're expensive)
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: "Anthropic's most advanced model (expensive)",
    tier: 'enterprise',
    category: 'reasoning',
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

  // 🔹 COMING SOON MODELS (Disabled for now)
  // Future models to be added when APIs become available
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    provider: 'Anthropic',
    description: 'Coming Soon - Next generation reasoning',
    tier: 'enterprise',
    category: 'reasoning',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Coming Soon - Next generation OpenAI model',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '256K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  }
];

// Helper functions
export function getModelsByTier(tier: 'free' | 'pro' | 'enterprise'): AIModel[] {
  return AI_MODELS.filter(model => model.tier === tier);
}
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
    enabled: true,
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
    category: 'reasoning',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },

  // 🔹 ENTERPRISE / TEAM TIER (high-cost, premium)
  // Only offer to Pro+ or Enterprise subscribers (since they're expensive)
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: "Anthropic's most advanced model (expensive)",
    tier: 'enterprise',
    category: 'reasoning',
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
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    provider: 'Anthropic',
    description: 'Coming Soon - Ultimate reasoning capabilities',
    tier: 'pro',
    category: 'reasoning',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },

  // 🔹 COMING SOON MODELS (Disabled for now)
  // Future models to be added when APIs become available
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    provider: 'Anthropic',
    description: 'Coming Soon - Next generation reasoning',
    tier: 'enterprise',
    category: 'reasoning',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Coming Soon - Next generation OpenAI model',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '256K tokens',
    enabled: false,
    comingSoon: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  }
];
  {
    id: 'pplx-online',
    name: 'Perplexity Online',
    provider: 'Perplexity',
    description: 'Pro Perplexity API - Real-time web search integration',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'excellent',
    contextLength: '127K tokens',
    enabled: true,
    apiKeyEnvVar: 'PERPLEXITY_API_KEY'
  },
  {
    id: 'llama-2-70b',
    name: 'LLaMA 2 70B',
    provider: 'Meta',
    description: 'Pro Meta API - Large open source model',
    tier: 'pro',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '4K tokens',
    enabled: true,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'meta-llama-3',
    name: 'Meta LLaMA 3',
    provider: 'Meta',
    description: 'Pro Meta API - Next generation open source',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '8K tokens',
    enabled: true,
    apiKeyEnvVar: 'META_API_KEY'
  },

  // TEAM/ENTERPRISE TIER MODELS (Collaboration, heavy-duty, enterprise pricing)
  {
    id: 'claude-3.5-sonnet-enterprise',
    name: 'Claude 3.5 Sonnet Enterprise',
    provider: 'Anthropic',
    description: 'Enterprise Anthropic API - Team collaboration features',
    tier: 'enterprise',
    category: 'reasoning',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'claude-4-opus-enterprise',
    name: 'Claude 4 Opus Enterprise',
    provider: 'Anthropic',
    description: 'Enterprise Anthropic API - Ultimate business AI',
    tier: 'enterprise',
    category: 'reasoning',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4o-enterprise',
    name: 'GPT-4o Enterprise',
    provider: 'OpenAI',
    description: 'Enterprise OpenAI API - Full enterprise features',
    tier: 'enterprise',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'mixtral-8x7b-enterprise',
    name: 'Mixtral 8x7B Enterprise',
    provider: 'Mistral AI',
    description: 'Enterprise Mistral API - Enterprise tuning via Together AI',
    tier: 'enterprise',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    apiKeyEnvVar: 'TOGETHER_AI_API_KEY'
  },
  {
    id: 'meta-llama-3-enterprise',
    name: 'Meta LLaMA 3 Enterprise',
    provider: 'Meta',
    description: 'Enterprise Meta API - Largest weights for enterprise R&D',
    tier: 'enterprise',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '8K tokens',
    enabled: true,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'pplx-online-enterprise',
    name: 'Perplexity Online Enterprise',
    provider: 'Perplexity',
    description: 'Enterprise Perplexity API - Real-time web search for teams',
    tier: 'enterprise',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '127K tokens',
    enabled: true,
    apiKeyEnvVar: 'PERPLEXITY_API_KEY'
  }
];

// Helper functions
export function getModelsByTier(tier: 'free' | 'pro' | 'enterprise'): AIModel[] {
  return AI_MODELS.filter(model => model.tier === tier);
}

export function getAvailableModelsForUser(userPlan: string): AIModel[] {
  // Normalize plan name to lowercase and handle variations
  const normalizedPlan = userPlan.toLowerCase().trim();
  
  // Debug logging to see what plan is being detected
  console.log('🔍 Plan Detection Debug:', { originalPlan: userPlan, normalizedPlan });
  
  // Use the actual user's plan (respects PRO, ENTERPRISE, FREE, etc.)
  const finalPlan = normalizedPlan;
  
  const planTierMap: Record<string, ('free' | 'pro' | 'enterprise')[]> = {
    'free': ['free'],
    'pro': ['free', 'pro'],
    'team': ['free', 'pro', 'enterprise'],
    'enterprise': ['free', 'pro', 'enterprise'],
    // Handle common variations
    'basic': ['free'],
    'premium': ['free', 'pro'],
    'business': ['free', 'pro', 'enterprise'],
    'unlimited': ['free', 'pro', 'enterprise']
  };
  
  const allowedTiers = planTierMap[finalPlan] || ['free'];
  return AI_MODELS.filter(model => allowedTiers.includes(model.tier) && model.enabled);
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
