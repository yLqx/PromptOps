export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: 'free' | 'pro' | 'team';
  category: 'general' | 'coding' | 'reasoning' | 'multimodal' | 'image' | 'audio';
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'excellent' | 'premium';
  contextLength: string;
  enabled: boolean;
  comingSoon?: boolean;
  maxPromptLength?: number;
  apiKeyEnvVar: string;
}

export const AI_MODELS: AIModel[] = [
  // 🆓 FREE TIER - Access to free tier models (cheap and compatible)
  // TONS of free models for everyone to use!

  // OpenAI Free Models
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Classic OpenAI model, fast and reliable',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '16K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
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
    id: 'gpt-3.5-turbo-instruct',
    name: 'GPT-3.5 Turbo Instruct',
    provider: 'OpenAI',
    description: 'Instruction-following variant of GPT-3.5',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '4K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },

  // Claude Free Models
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
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    description: "Anthropic's improved fast model with better reasoning",
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'excellent',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },

  // DeepSeek Free Models
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
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
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

  // Google Free Models
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
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash 8B',
    provider: 'Google',
    description: 'Smaller, faster version of Gemini Flash',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '1M tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },

  // Meta LLaMA Free Models
  {
    id: 'llama-3.1-8b',
    name: 'LLaMA 3.1 8B',
    provider: 'Meta',
    description: 'Strong open-source baseline model',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'llama-3.2-3b',
    name: 'LLaMA 3.2 3B',
    provider: 'Meta',
    description: 'Lightweight LLaMA model for basic tasks',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'llama-3.2-1b',
    name: 'LLaMA 3.2 1B',
    provider: 'Meta',
    description: 'Ultra-lightweight LLaMA model',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },

  // Mistral Free Models
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    description: 'Efficient open-source model for basic tasks',
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
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'Mistral AI',
    description: 'Small but capable Mistral model',
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

  // Microsoft Free Models
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    provider: 'Microsoft',
    description: 'Small but capable model from Microsoft',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },
  {
    id: 'phi-3.5-mini',
    name: 'Phi-3.5 Mini',
    provider: 'Microsoft',
    description: 'Improved version of Phi-3 Mini',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },

  // Alibaba Free Models
  {
    id: 'qwen-2.5-7b',
    name: 'Qwen 2.5 7B',
    provider: 'Alibaba',
    description: 'Multilingual model with strong performance',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },
  {
    id: 'qwen-2.5-3b',
    name: 'Qwen 2.5 3B',
    provider: 'Alibaba',
    description: 'Smaller Qwen model for basic tasks',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },

  // Cohere Free Models
  {
    id: 'command-light',
    name: 'Command Light',
    provider: 'Cohere',
    description: 'Lightweight Cohere model for basic tasks',
    tier: 'free',
    category: 'general',
    speed: 'fast',
    quality: 'good',
    contextLength: '4K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'COHERE_API_KEY'
  },

  // 💎 PRO TIER - Access to free + pro tier models (little bit cheap and good for pro tier)
  // More powerful models with better capabilities, moderate cost

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
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Full GPT-4o with vision, reasoning, and coding capabilities',
    tier: 'pro',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Fast and capable GPT-4 variant',
    tier: 'pro',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'llama-3.1-70b',
    name: 'LLaMA 3.1 70B',
    provider: 'Meta',
    description: 'High quality open model, excellent for complex tasks',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'deepseek-r1-pro',
    name: 'DeepSeek R1 Pro',
    provider: 'DeepSeek',
    description: 'Advanced reasoning model with enhanced capabilities',
    tier: 'pro',
    category: 'reasoning',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-coder-v3',
    name: 'DeepSeek Coder V3',
    provider: 'DeepSeek',
    description: 'Specialized coding model with excellent programming capabilities',
    tier: 'pro',
    category: 'coding',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    description: 'Excellent coding model with programming capabilities',
    tier: 'pro',
    category: 'coding',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    description: 'Powerful model for complex reasoning tasks',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'mixtral-8x22b',
    name: 'Mixtral 8x22B',
    provider: 'Mistral AI',
    description: 'Large mixture of experts model with excellent performance',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: "Google's flagship model with multimodal capabilities",
    tier: 'pro',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '2M tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },
  {
    id: 'command-r',
    name: 'Command R',
    provider: 'Cohere',
    description: 'Excellent for RAG and enterprise applications',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'COHERE_API_KEY'
  },
  {
    id: 'phi-3-medium',
    name: 'Phi-3 Medium',
    provider: 'Microsoft',
    description: 'Balanced model with good reasoning capabilities',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    description: 'Large multilingual model with strong performance',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },

  // Additional OpenAI Pro Models
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Original GPT-4 model with excellent reasoning',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '8K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-4-32k',
    name: 'GPT-4 32K',
    provider: 'OpenAI',
    description: 'GPT-4 with extended context window',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-5o-nano',
    name: 'GPT-5o Nano',
    provider: 'OpenAI',
    description: 'Next-gen OpenAI model with improved capabilities',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },

  // Additional Claude Pro Models
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Previous generation Claude Sonnet, still excellent',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },

  // Additional Google Pro Models
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    provider: 'Google',
    description: 'Previous generation Gemini Pro model',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },

  // Additional Meta Pro Models
  {
    id: 'llama-3.2-90b',
    name: 'LLaMA 3.2 90B',
    provider: 'Meta',
    description: 'Latest large LLaMA model with enhanced capabilities',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },

  // Additional DeepSeek Pro Models
  {
    id: 'deepseek-v2.5',
    name: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    description: 'Enhanced DeepSeek model with improved performance',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },

  // Additional Mistral Pro Models
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'Mistral AI',
    description: 'Balanced Mistral model for general use',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'codestral',
    name: 'Codestral',
    provider: 'Mistral AI',
    description: 'Specialized coding model from Mistral',
    tier: 'pro',
    category: 'coding',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },

  // Additional Cohere Pro Models
  {
    id: 'command-nightly',
    name: 'Command Nightly',
    provider: 'Cohere',
    description: 'Latest experimental Cohere model',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'COHERE_API_KEY'
  },

  // Additional Microsoft Pro Models
  {
    id: 'phi-3-large',
    name: 'Phi-3 Large',
    provider: 'Microsoft',
    description: 'Largest Phi-3 model with enhanced capabilities',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },

  // Additional Alibaba Pro Models
  {
    id: 'qwen-2.5-32b',
    name: 'Qwen 2.5 32B',
    provider: 'Alibaba',
    description: 'Mid-size Qwen model with good performance',
    tier: 'pro',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },
  {
    id: 'qwen-coder-32b',
    name: 'Qwen Coder 32B',
    provider: 'Alibaba',
    description: 'Specialized coding model from Alibaba',
    tier: 'pro',
    category: 'coding',
    speed: 'medium',
    quality: 'premium',
    contextLength: '32K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  },

  // 🏆 TEAM TIER - Access to Team + Pro + Free tier models (all models available)
  // Premium models for team collaboration and advanced use cases
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: "Anthropic's most advanced model with superior reasoning",
    tier: 'team',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    description: 'Latest Claude model with enhanced capabilities',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'gpt-4o-high-context',
    name: 'GPT-4o High-Context',
    provider: 'OpenAI',
    description: 'GPT-4o with extended context window for large documents',
    tier: 'team',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '512K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gpt-5-preview',
    name: 'GPT-5 Preview',
    provider: 'OpenAI',
    description: 'Early access to next generation OpenAI model',
    tier: 'team',
    category: 'multimodal',
    speed: 'medium',
    quality: 'premium',
    contextLength: '256K tokens',
    enabled: false,
    comingSoon: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    provider: 'Google',
    description: "Google's most capable model for complex reasoning",
    tier: 'team',
    category: 'multimodal',
    speed: 'slow',
    quality: 'premium',
    contextLength: '2M tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'GEMINI_API_KEY'
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    description: 'Advanced model with excellent RAG capabilities',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'COHERE_API_KEY'
  },
  {
    id: 'llama-3.1-405b',
    name: 'LLaMA 3.1 405B',
    provider: 'Meta',
    description: 'Largest open-source model with exceptional capabilities',
    tier: 'team',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'META_API_KEY'
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    description: 'Latest and most powerful Mistral model',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '128K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'MISTRAL_API_KEY'
  },
  {
    id: 'deepseek-v3-pro',
    name: 'DeepSeek V3 Pro',
    provider: 'DeepSeek',
    description: 'Most advanced DeepSeek model for complex tasks',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '64K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'claude-4-preview',
    name: 'Claude 4 Preview',
    provider: 'Anthropic',
    description: 'Early access to next generation Claude',
    tier: 'team',
    category: 'general',
    speed: 'slow',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: false,
    comingSoon: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'perplexity-sonar-large',
    name: 'Perplexity Sonar Large',
    provider: 'Perplexity',
    description: 'Real-time web search and reasoning model',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '127K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'PERPLEXITY_API_KEY'
  },
  {
    id: 'yi-large',
    name: 'Yi Large',
    provider: '01.AI',
    description: 'Advanced Chinese-English bilingual model',
    tier: 'team',
    category: 'general',
    speed: 'medium',
    quality: 'premium',
    contextLength: '200K tokens',
    enabled: true,
    maxPromptLength: 2000,
    apiKeyEnvVar: 'HUGGINGFACE_API_KEY'
  }
];

// Helper functions
export function getModelsByTier(tier: 'free' | 'pro' | 'team'): AIModel[] {
  return AI_MODELS.filter(model => model.tier === tier);
}

export function getAvailableModelsForUser(userPlan: string): AIModel[] {
  // Normalize plan name to lowercase and handle variations
  const normalizedPlan = userPlan.toLowerCase().trim();

  const planTierMap: Record<string, ('free' | 'pro' | 'team')[]> = {
    'free': ['free'],
    'pro': ['free', 'pro'],
    'team': ['free', 'pro', 'team'],
    // Handle common variations
    'basic': ['free'],
    'premium': ['free', 'pro'],
    'business': ['free', 'pro', 'team'],
    'unlimited': ['free', 'pro', 'team'],
    'enterprise': ['free', 'pro', 'team'] // Map enterprise to team for backward compatibility
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

export function getModelsByCategory(category: 'general' | 'coding' | 'reasoning' | 'multimodal' | 'image' | 'audio'): AIModel[] {
  return AI_MODELS.filter(model => model.category === category);
}

export function getEnabledModels(): AIModel[] {
  return AI_MODELS.filter(model => model.enabled);
}

export function getModelCountByTier(): Record<string, number> {
  const counts = { free: 0, pro: 0, team: 0 };
  AI_MODELS.forEach(model => {
    if (model.enabled) {
      counts[model.tier]++;
    }
  });
  return counts;
}
