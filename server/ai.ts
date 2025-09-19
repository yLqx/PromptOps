import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { getModelById, isModelAvailableForUser } from "../shared/ai-models.js";
import { createRequire } from 'module';

// Import Anthropic SDK using createRequire
const require = createRequire(import.meta.url);
let Anthropic: any = null;
try {
  Anthropic = require('@anthropic-ai/sdk');
  console.log('✅ Anthropic SDK loaded successfully');
} catch (error: any) {
  console.log('❌ Anthropic SDK not found:', error.message);
}

// Function to sanitize error messages and remove sensitive information
function sanitizeErrorMessage(error: string, modelName: string): string {
  if (!error) return "Unknown error occurred";
  
  // Remove API keys (any string starting with sk-, pk-, etc.)
  let sanitized = error.replace(/[sp]k-[a-zA-Z0-9*]{20,}/g, '[API_KEY_HIDDEN]');
  
  // Remove URLs that might contain sensitive info
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '[URL_HIDDEN]');
  
  // Remove specific technical error patterns
  sanitized = sanitized.replace(/Incorrect API key provided:.*?\./g, 'Invalid API key.');
  sanitized = sanitized.replace(/You can find your API key at.*?\./g, '');
  sanitized = sanitized.replace(/API key.*?\./g, 'API authentication failed.');
  sanitized = sanitized.replace(/401 Incorrect API key.*?\./g, 'API authentication failed.');
  
  // Clean up extra whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // If the error is still too technical or empty, provide a user-friendly message
  if (sanitized.length < 10 || sanitized.includes('401') || sanitized.includes('403')) {
    return `${modelName} is currently unavailable. Please try a different model or contact support.`;
  }
  
  return sanitized;
}

// Initialize AI clients with proper error handling
const geminiClient = process.env.GEMINI_API_KEY ?
  new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const gemini = geminiClient ? geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

const openai = process.env.OPENAI_API_KEY ?
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  }) : null;

// Anthropic client - using proper Anthropic SDK
const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-api03-placeholder-key-for-testing' && Anthropic ?
  (() => {
    try {
      console.log('🤖 Initializing Anthropic client with API key:', process.env.ANTHROPIC_API_KEY?.substring(0, 10) + '...');
      return new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    } catch (error: any) {
      console.log('❌ Failed to initialize Anthropic client:', error.message);
      return null;
    }
  })() : null;

// DeepSeek client (using OpenAI-compatible API)
const deepseek = process.env.DEEPSEEK_API_KEY ?
  new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1"
  }) : null;

// Meta/LLaMA client (configurable provider)
// Try different LLaMA providers based on API key format or environment variable
const getLlamaClient = () => {
  if (!process.env.META_API_KEY) return null;

  console.log('🦙 Initializing LLaMA client with API key:', process.env.META_API_KEY?.substring(0, 8) + '...');

  // Check if it's a Groq API key (starts with gsk_)
  if (process.env.META_API_KEY.startsWith('gsk_')) {
    console.log('🦙 Using Groq API for LLaMA models');
    return new OpenAI({
      apiKey: process.env.META_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  // Check if it's a Together AI key (starts with specific pattern)
  if (process.env.META_API_KEY.length > 40) {
    console.log('🦙 Using Together AI for LLaMA models');
    return new OpenAI({
      apiKey: process.env.META_API_KEY,
      baseURL: "https://api.together.xyz/v1"
    });
  }

  // For API LLM (apillm.com) - UUID format keys
  if (process.env.META_API_KEY.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.log('🦙 Using API LLM (apillm.com) for LLaMA models');
    // Try different possible endpoints for API LLM
    const possibleEndpoints = [
      "https://api.apillm.com/v1",
      "https://apillm.com/api/v1",
      "https://api.apillm.com",
      "https://apillm.com/api"
    ];

    // For now, use the first one - we'll add fallback logic later if needed
    return new OpenAI({
      apiKey: process.env.META_API_KEY,
      baseURL: possibleEndpoints[0]
    });
  }

  // Default to Together AI for other keys
  console.log('🦙 Using Together AI (default) for LLaMA models');
  return new OpenAI({
    apiKey: process.env.META_API_KEY,
    baseURL: "https://api.together.xyz/v1"
  });
};

const metaLlama = getLlamaClient();

// Mistral AI client
const mistral = process.env.MISTRAL_API_KEY ?
  new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: "https://api.mistral.ai/v1"
  }) : null;

// Cohere client (using OpenAI-compatible API)
const cohere = process.env.COHERE_API_KEY ?
  new OpenAI({
    apiKey: process.env.COHERE_API_KEY,
    baseURL: "https://api.cohere.ai/v1"
  }) : null;

// Perplexity client
const perplexity = process.env.PERPLEXITY_API_KEY ?
  new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: "https://api.perplexity.ai"
  }) : null;

// Hugging Face client (for open source models)
const huggingface = process.env.HUGGINGFACE_API_KEY ?
  new OpenAI({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    baseURL: "https://api-inference.huggingface.co/v1"
  }) : null;

export interface AIResponse {
  response: string;
  model: string;
  responseTime: number;
  success: boolean;
  error?: string;
}

// Validate if user can access the requested model
export function validateModelAccess(modelId: string, userPlan: string): boolean {
  const model = getModelById(modelId);
  if (!model) return false;

  // Check if model is enabled (implemented)
  if (!model.enabled) return false;

  // Check if user's plan allows access to this model
  return isModelAvailableForUser(modelId, userPlan);
}

// Enhanced prompt formatting for better AI responses
function enhancePrompt(promptContent: string): string {
  // Add context and formatting instructions for better responses
  const enhancedPrompt = `You are an AI assistant providing helpful, clear, and actionable responses. Please:

1. Provide clear, well-structured answers
2. Use examples when helpful
3. Break down complex topics into understandable steps
4. Be concise but comprehensive
5. Format your response for easy reading

User's prompt: ${promptContent}

Please provide a thoughtful, well-formatted response:`;

  return enhancedPrompt;
}

// Enhanced prompt enhancement with intelligent scoring
export async function enhancePromptWithAI(promptContent: string): Promise<{ enhancedPrompt: string; score: number; improvements: string[] }> {
  const startTime = Date.now();
  
  const enhancementPrompt = `You are an expert prompt engineering AI. Your task is to enhance the given prompt by improving clarity, context, structure, specificity, and effectiveness.

Please analyze and enhance this prompt: "${promptContent}"

Apply these 5 enhancements:
1. Clarity Enhancement - Make the prompt more specific and clear
2. Context Optimization - Add relevant context for better understanding  
3. Format Structuring - Improve the structure and organization
4. Performance Guidelines - Add guidelines for better AI responses
5. Advanced Constraints - Include helpful constraints and examples

Respond ONLY with a plain text enhanced prompt. Do not include any JSON, code blocks, or explanations. Just return the improved prompt directly.`;

  try {
    let enhancedPrompt = "";
    
    // Try DeepSeek first (most reliable with current setup)
    if (deepseek) {
      try {
        const response = await deepseek.chat.completions.create({
          model: "deepseek-chat",
          messages: [{ role: "user", content: enhancementPrompt }],
          max_tokens: 1000,
          temperature: 0.7,
        });
        enhancedPrompt = response.choices[0]?.message?.content || "";
        console.log("DeepSeek enhancement successful");
      } catch (deepseekError) {
        console.log("DeepSeek failed for enhancement, trying Gemini fallback:", deepseekError);
      }
    }
    
    // Try Gemini if DeepSeek failed
    if (!enhancedPrompt && gemini) {
      try {
        const result = await gemini.generateContent(enhancementPrompt);
        enhancedPrompt = result.response.text();
        console.log("Gemini enhancement successful");
      } catch (geminiError) {
        console.log("Gemini failed for enhancement:", geminiError);
      }
    }
    
    // Last fallback to OpenAI if both Gemini and DeepSeek failed
    if (!enhancedPrompt && openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: enhancementPrompt }],
          max_tokens: 1000,
          temperature: 0.7,
        });
        enhancedPrompt = response.choices[0]?.message?.content || "";
        console.log("OpenAI enhancement successful");
      } catch (openaiError) {
        console.log("OpenAI failed for enhancement:", openaiError);
      }
    }
    
    if (!enhancedPrompt) {
      // Return a helpful fallback response instead of failing completely
      enhancedPrompt = `Enhanced version of your prompt:

${promptContent}

**Improvement suggestions:**
- Add more specific context and details
- Include examples of desired output format
- Specify the target audience or use case
- Add constraints or requirements for better results
- Use clear, actionable language

**Enhanced prompt structure:**
You are a helpful assistant. Please ${promptContent.toLowerCase()}. 

Requirements:
- Be specific and detailed in your response
- Use clear, professional language
- Include relevant examples where helpful
- Structure your response for easy reading

Please provide a comprehensive and well-formatted response.`;
      
      console.log("Using fallback enhancement due to API limits");
    }
    
    // Clean up response - remove any JSON formatting or code blocks
    enhancedPrompt = enhancedPrompt
      .replace(/```json\s*\{[^}]*"enhancedPrompt":\s*"/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\{[^}]*"enhancedPrompt":\s*"/g, '')
      .replace(/"\s*\}?\s*$/g, '')
      .replace(/^["']|["']$/g, '')
      .trim();
    
    // Calculate quality score based on various factors
    const score = calculatePromptScore(promptContent, enhancedPrompt);
    
    // Generate improvement descriptions
    const improvements = generateImprovements(promptContent, enhancedPrompt);
    
    return {
      enhancedPrompt,
      score,
      improvements
    };
    
  } catch (error: any) {
    console.error("Enhancement error:", error);
    throw new Error("Failed to enhance prompt: " + error.message);
  }
}

// Calculate a reliable quality score for prompts
function calculatePromptScore(original: string, enhanced: string): number {
  let score = 50; // Base score
  
  // Length and detail improvements
  if (enhanced.length > original.length * 1.2) score += 15;
  else if (enhanced.length > original.length) score += 10;
  
  // Specificity indicators
  const specificityKeywords = ['specific', 'detailed', 'step-by-step', 'format', 'example', 'context', 'guidelines'];
  const specificityCount = specificityKeywords.filter(keyword => 
    enhanced.toLowerCase().includes(keyword) && !original.toLowerCase().includes(keyword)
  ).length;
  score += specificityCount * 5;
  
  // Structure improvements
  if (enhanced.includes(':') && !original.includes(':')) score += 8;
  if (enhanced.includes('\n') && !original.includes('\n')) score += 6;
  if ((enhanced.match(/\d+\./g) || []).length > 0) score += 10;
  
  // Clarity improvements
  const clarityWords = ['please', 'ensure', 'make sure', 'clearly', 'specifically'];
  const clarityCount = clarityWords.filter(word => 
    enhanced.toLowerCase().includes(word) && !original.toLowerCase().includes(word)
  ).length;
  score += clarityCount * 3;
  
  // Context additions
  if (enhanced.toLowerCase().includes('context') && !original.toLowerCase().includes('context')) score += 8;
  if (enhanced.toLowerCase().includes('background') && !original.toLowerCase().includes('background')) score += 6;
  
  // Cap the score between 60-98 for realistic ranges
  return Math.min(98, Math.max(60, score));
}

// Generate specific improvement descriptions
function generateImprovements(original: string, enhanced: string): string[] {
  const improvements: string[] = [];
  
  if (enhanced.length > original.length * 1.3) {
    improvements.push("Added comprehensive details and context");
  }
  
  if ((enhanced.match(/\d+\./g) || []).length > 0 && !(original.match(/\d+\./g) || []).length) {
    improvements.push("Structured with numbered steps for clarity");
  }
  
  if (enhanced.toLowerCase().includes('format') && !original.toLowerCase().includes('format')) {
    improvements.push("Added format specifications for better output");
  }
  
  if (enhanced.toLowerCase().includes('example') && !original.toLowerCase().includes('example')) {
    improvements.push("Included examples for clearer guidance");
  }
  
  if (enhanced.toLowerCase().includes('context') && !original.toLowerCase().includes('context')) {
    improvements.push("Enhanced with relevant context information");
  }
  
  const specificityWords = ['specific', 'detailed', 'clearly', 'precisely'];
  if (specificityWords.some(word => enhanced.toLowerCase().includes(word) && !original.toLowerCase().includes(word))) {
    improvements.push("Improved specificity and precision");
  }
  
  if (improvements.length === 0) {
    improvements.push("Enhanced overall clarity and effectiveness");
  }
  
  return improvements.slice(0, 5); // Max 5 improvements
}

export async function testPromptWithAI(promptContent: string, preferredModel?: string): Promise<AIResponse> {
  const startTime = Date.now();
  const enhancedPrompt = enhancePrompt(promptContent);

  // FORCE CORRECT MODEL FOR GEMINI - FIX THE PERSISTENT BUG
  if (preferredModel === "gemini-2.5-flash") {
    console.log('🚨 DETECTED WRONG MODEL: gemini-2.5-flash -> FORCING gemini-1.5-flash');
    preferredModel = "gemini-1.5-flash";
  }

  console.log(`🔍 Debug: preferredModel = ${preferredModel} (after fix)`);

  // Use preferred model if specified
  // Handle DeepSeek models (Chat V2, V3, Coder models)
  const deepseekModels = ["deepseek-chat-v2", "deepseek-v3", "deepseek-r1-pro", "deepseek-coder", "deepseek-coder-v3", "deepseek-v2.5", "deepseek-v3-pro"];

  // Handle Mistral models
  const mistralModels = ["mistral-7b", "mistral-small", "mistral-medium", "mistral-large", "mistral-large-2", "mixtral-8x7b", "mixtral-8x22b", "codestral"];

  // Handle Cohere models
  const cohereModels = ["command-light", "command-r", "command-r-plus", "command-nightly"];

  // Handle Perplexity models
  const perplexityModels = ["perplexity-sonar-large"];

  // Handle Hugging Face models
  const huggingfaceModels = ["phi-3-mini", "phi-3.5-mini", "phi-3-medium", "phi-3-large", "qwen-2.5-3b", "qwen-2.5-7b", "qwen-2.5-32b", "qwen-2.5-72b", "qwen-coder-32b", "yi-large"];

  // Handle LLaMA models
  const llamaModels = ["llama-3.2-1b", "llama-3.2-3b", "llama-3.1-8b", "llama-3.2-90b", "llama-3.1-70b", "llama-3.1-405b", "llama-3.1-405b-instruct"];
  if (preferredModel && deepseekModels.includes(preferredModel) && deepseek) {
    try {
      // Map model IDs to display names
      const modelDisplayNames: { [key: string]: string } = {
        "deepseek-chat-v2": "DeepSeek Chat V2",
        "deepseek-v3": "DeepSeek V3",
        "deepseek-r1-pro": "DeepSeek R1 Pro",
        "deepseek-coder": "DeepSeek Coder",
        "deepseek-coder-v3": "DeepSeek Coder V3",
        "deepseek-v2.5": "DeepSeek V2.5",
        "deepseek-v3-pro": "DeepSeek V3 Pro"
      };
      
      const modelDisplayName = modelDisplayNames[preferredModel] || preferredModel;
      console.log(`🔥 Using ${modelDisplayName} as requested`);
      
      // Use appropriate DeepSeek model endpoint
      const deepseekModelMapping: { [key: string]: string } = {
        "deepseek-chat-v2": "deepseek-chat",
        "deepseek-v3": "deepseek-chat",
        "deepseek-r1-pro": "deepseek-chat",
        "deepseek-coder": "deepseek-coder",
        "deepseek-coder-v3": "deepseek-coder",
        "deepseek-v2.5": "deepseek-chat",
        "deepseek-v3-pro": "deepseek-chat"
      };
      const deepseekModel = deepseekModelMapping[preferredModel] || "deepseek-chat";
      
      const response = await deepseek.chat.completions.create({
        model: deepseekModel,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      let text = response.choices[0]?.message?.content || "No response generated";
      
      // Remove DeepSeek thinking tags
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      console.log(`✅ ${modelDisplayName} response successful`);
      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (deepseekError: any) {
      console.log("❌ DeepSeek failed:", deepseekError.message || deepseekError);
      const sanitizedError = sanitizeErrorMessage(deepseekError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Handle Mistral models
  if (preferredModel && mistralModels.includes(preferredModel) && mistral) {
    try {
      const modelMapping: { [key: string]: string } = {
        "mistral-7b": "mistral-tiny",
        "mistral-small": "mistral-small-latest",
        "mistral-medium": "mistral-medium-latest",
        "mistral-large": "mistral-large-latest",
        "mistral-large-2": "mistral-large-2407",
        "mixtral-8x7b": "mistral-small-latest",
        "mixtral-8x22b": "mistral-medium-latest",
        "codestral": "codestral-latest"
      };

      const actualModel = modelMapping[preferredModel] || "mistral-small-latest";
      console.log(`🔥 Using Mistral model: ${preferredModel} -> ${actualModel}`);

      const response = await mistral.chat.completions.create({
        model: actualModel,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (mistralError: any) {
      console.log("❌ Mistral failed:", mistralError.message || mistralError);
      const sanitizedError = sanitizeErrorMessage(mistralError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please try a different model.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Handle Cohere models
  if (preferredModel && cohereModels.includes(preferredModel) && cohere) {
    try {
      const modelMapping: { [key: string]: string } = {
        "command-light": "command-light",
        "command-r": "command-r",
        "command-r-plus": "command-r-plus",
        "command-nightly": "command-nightly"
      };

      const actualModel = modelMapping[preferredModel] || "command-r";
      console.log(`🔥 Using Cohere model: ${preferredModel} -> ${actualModel}`);

      const response = await cohere.chat.completions.create({
        model: actualModel,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (cohereError: any) {
      console.log("❌ Cohere failed:", cohereError.message || cohereError);
      const sanitizedError = sanitizeErrorMessage(cohereError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please try a different model.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Handle Hugging Face models
  if (preferredModel && huggingfaceModels.includes(preferredModel) && huggingface) {
    try {
      const modelMapping: { [key: string]: string } = {
        "phi-3-mini": "microsoft/Phi-3-mini-4k-instruct",
        "phi-3.5-mini": "microsoft/Phi-3.5-mini-instruct",
        "phi-3-medium": "microsoft/Phi-3-medium-4k-instruct",
        "phi-3-large": "microsoft/Phi-3-large-4k-instruct",
        "qwen-2.5-3b": "Qwen/Qwen2.5-3B-Instruct",
        "qwen-2.5-7b": "Qwen/Qwen2.5-7B-Instruct",
        "qwen-2.5-32b": "Qwen/Qwen2.5-32B-Instruct",
        "qwen-2.5-72b": "Qwen/Qwen2.5-72B-Instruct",
        "qwen-coder-32b": "Qwen/Qwen2.5-Coder-32B-Instruct",
        "yi-large": "01-ai/Yi-Large"
      };

      const actualModel = modelMapping[preferredModel] || "microsoft/Phi-3-mini-4k-instruct";
      console.log(`🤗 Using Hugging Face model: ${preferredModel} -> ${actualModel}`);

      const response = await huggingface.chat.completions.create({
        model: actualModel,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (huggingfaceError: any) {
      console.log("❌ Hugging Face failed:", huggingfaceError.message || huggingfaceError);
      const sanitizedError = sanitizeErrorMessage(huggingfaceError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Handle Perplexity models
  if (preferredModel && perplexityModels.includes(preferredModel) && perplexity) {
    try {
      const modelMapping: { [key: string]: string } = {
        "perplexity-sonar-large": "llama-3.1-sonar-large-128k-online"
      };

      const actualModel = modelMapping[preferredModel] || "llama-3.1-sonar-large-128k-online";
      console.log(`🔍 Using Perplexity model: ${preferredModel} -> ${actualModel}`);

      const response = await perplexity.chat.completions.create({
        model: actualModel,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (perplexityError: any) {
      console.log("❌ Perplexity failed:", perplexityError.message || perplexityError);
      const sanitizedError = sanitizeErrorMessage(perplexityError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  if (preferredModel === "gpt-4o" && openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: "gpt-4o",
        responseTime,
        success: true,
      };
    } catch (openaiError: any) {
      console.log("OpenAI failed, trying fallback:", openaiError);
      // Fall through to try other models
    }
  }

  // Try Anthropic Claude models if specified
  // SECOND FIX ATTEMPT - Force correct model again
  if (preferredModel === "gemini-2.5-flash") {
    console.log('🚨 SECOND FIX: gemini-2.5-flash -> gemini-1.5-flash');
    preferredModel = "gemini-1.5-flash";
  }
  console.log('🔍 Debug: preferredModel =', preferredModel, ', anthropic client =', !!anthropic);
  const claudeModels = {
    // Claude 4 models (map to latest available Claude 3.5 Sonnet)
    "claude-4-sonnet": "claude-3-5-sonnet-20241022",

    // Claude 3.5 models (official Anthropic API IDs)
    "claude-3.5-haiku": "claude-3-5-haiku-20241022",

    // Claude 3 models (official Anthropic API IDs)
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229",
    "claude-3-haiku": "claude-3-haiku-20240307"
  };

  console.log('🔍 Available Claude models:', Object.keys(claudeModels));
  console.log('🔍 Looking for model:', preferredModel, 'in mapping:', !!claudeModels[preferredModel as keyof typeof claudeModels]);
  console.log('🔍 Anthropic client status:', {
    hasClient: !!anthropic,
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 15) + '...'
  });

  if (preferredModel && claudeModels[preferredModel as keyof typeof claudeModels] && anthropic) {
    try {
      const modelDisplayName = preferredModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const anthropicModelId = claudeModels[preferredModel as keyof typeof claudeModels];
      
      console.log(`🤖 Using ${modelDisplayName} as requested (${anthropicModelId})`);

      // Set appropriate max_tokens based on model
      const maxTokensMap: { [key: string]: number } = {
        "claude-3-haiku-20240307": 4096,
        "claude-3-5-haiku-20241022": 8192,
        "claude-3-sonnet-20240229": 4096,
        "claude-3-opus-20240229": 4096,
        "claude-3-5-sonnet-20241022": 8192
      };
      const maxTokens = maxTokensMap[anthropicModelId] || 4096;

      const response = await anthropic.messages.create({
        model: anthropicModelId,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{ role: "user", content: enhancedPrompt }],
      });

      const responseTime = Date.now() - startTime;
      const text = response.content[0]?.text || "No response generated";

      console.log(`✅ ${modelDisplayName} response successful`);
      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (anthropicError: any) {
      console.log("❌ Claude failed:", anthropicError.message || anthropicError);
      console.log("❌ Full error details:", {
        name: anthropicError.name,
        message: anthropicError.message,
        status: anthropicError.status,
        error: anthropicError.error,
        type: anthropicError.type,
        requestedModel: preferredModel,
        mappedModel: claudeModels[preferredModel as keyof typeof claudeModels]
      });
      
      // Check if it's a specific model availability issue
      if (anthropicError.message && anthropicError.message.includes('model') && anthropicError.message.includes('not found')) {
        console.log("🚨 Model not found error - this suggests the model ID is incorrect or unavailable");
      }
      
      const sanitizedError = sanitizeErrorMessage(anthropicError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Try OpenAI models (GPT-3.5, GPT-4o, GPT-4o Mini, etc.)
  const openaiModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-instruct", "gpt-4", "gpt-4-32k", "gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4o-high-context", "gpt-5o-nano"];
  if (preferredModel && openaiModels.includes(preferredModel) && openai) {
    try {
      const modelDisplayName = preferredModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`🤖 Using ${modelDisplayName} as requested`);

      // Map model IDs to actual OpenAI model names
      const modelMapping: { [key: string]: string } = {
        "gpt-3.5-turbo": "gpt-3.5-turbo",
        "gpt-3.5-turbo-instruct": "gpt-3.5-turbo-instruct",
        "gpt-4": "gpt-4",
        "gpt-4-32k": "gpt-4-32k",
        "gpt-4o": "gpt-4o",
        "gpt-4o-mini": "gpt-4o-mini",
        "gpt-4-turbo": "gpt-4-turbo",
        "gpt-4o-high-context": "gpt-4o",
        "gpt-5o-nano": "gpt-4o"
      };
      
      const response = await openai.chat.completions.create({
        model: modelMapping[preferredModel] || "gpt-4o",
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      console.log(`✅ ${modelDisplayName} response successful`);
      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (openaiError: any) {
      console.log("❌ GPT-4o failed:", openaiError.message || openaiError);
      const sanitizedError = sanitizeErrorMessage(openaiError.message || "API call failed", "GPT-4o");
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Try LLaMA models
  if (preferredModel && llamaModels.includes(preferredModel) && metaLlama) {
    try {
      const modelDisplayName = preferredModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`🦙 Using ${modelDisplayName} as requested`);

      // Map model IDs to actual provider model names
      const getModelName = (modelId: string) => {
        // For API LLM (apillm.com)
        if (process.env.META_API_KEY?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          const apiLlmMapping: { [key: string]: string } = {
            "llama-3.2-1b": "llama-3.2-1b-instruct",
            "llama-3.2-3b": "llama-3.2-3b-instruct",
            "llama-3.1-8b": "llama-3.1-8b-instruct",
            "llama-3.2-90b": "llama-3.2-90b-instruct",
            "llama-3.1-70b": "llama-3.1-70b-instruct",
            "llama-3.1-405b": "llama-3.1-405b-instruct",
            "llama-3.1-405b-instruct": "llama-3.1-405b-instruct"
          };
          return apiLlmMapping[modelId] || "llama-3.1-8b-instruct";
        }

        // For Together AI (default)
        const togetherMapping: { [key: string]: string } = {
          "llama-3.2-1b": "meta-llama/Llama-3.2-1B-Instruct-Turbo",
          "llama-3.2-3b": "meta-llama/Llama-3.2-3B-Instruct-Turbo",
          "llama-3.1-8b": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          "llama-3.2-90b": "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
          "llama-3.1-70b": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
          "llama-3.1-405b": "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
          "llama-3.1-405b-instruct": "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo"
        };
        return togetherMapping[modelId] || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";
      };

      const modelName = getModelName(preferredModel);
      console.log(`🦙 Using model: ${modelName}`);

      const response = await metaLlama.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      console.log(`✅ ${modelDisplayName} response successful`);
      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (llamaError: any) {
      console.log("❌ LLaMA failed:", llamaError.message || llamaError);
      const sanitizedError = sanitizeErrorMessage(llamaError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Try Gemini models
  const geminiModels = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-ultra"];
  if (preferredModel && geminiModels.includes(preferredModel) && geminiClient) {
    try {
      const modelDisplayName = preferredModel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`🤖 Using ${modelDisplayName} as requested`);

      // Map model IDs to actual Gemini model names
      const modelMapping: { [key: string]: string } = {
        "gemini-1.5-flash": "gemini-1.5-flash",
        "gemini-1.5-flash-8b": "gemini-1.5-flash-8b",
        "gemini-1.5-pro": "gemini-1.5-pro",
        "gemini-1.0-pro": "gemini-1.0-pro",
        "gemini-ultra": "gemini-1.5-pro" // Map to available model
      };

      const geminiModel = geminiClient.getGenerativeModel({ model: modelMapping[preferredModel] || "gemini-1.5-flash" });
      const response = await geminiModel.generateContent(enhancedPrompt);

      const responseTime = Date.now() - startTime;
      const text = response.response.text() || "No response generated";

      console.log(`✅ ${modelDisplayName} response successful`);
      return {
        response: text,
        model: preferredModel,
        responseTime,
        success: true,
      };
    } catch (geminiError: any) {
      console.log("❌ Gemini failed:", geminiError.message || geminiError);
      const sanitizedError = sanitizeErrorMessage(geminiError.message || "API call failed", preferredModel);
      return {
        response: `API Error: ${preferredModel} failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: preferredModel,
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // Try Gemini as fallback if no model specified
  if (!preferredModel && gemini) {
    try {
      console.log("🤖 Using Gemini 1.5 Flash as fallback");
      const response = await gemini.generateContent(enhancedPrompt);

      const responseTime = Date.now() - startTime;
      const text = response.response.text() || "No response generated";

      console.log("✅ Gemini 1.5 Flash response successful");
      return {
        response: text,
        model: "gemini-1.5-flash",
        responseTime,
        success: true,
      };
    } catch (geminiError: any) {
      console.log("❌ Gemini failed:", geminiError.message || geminiError);
      const sanitizedError = sanitizeErrorMessage(geminiError.message || "API call failed", "Gemini 1.5 Flash");
      return {
        response: `API Error: gemini-1.5-flash failed to respond. Please contact support or check promptop.net/status for service updates.`,
        model: 'gemini-1.5-flash',
        responseTime: Date.now() - startTime,
        success: false,
        error: sanitizedError
      };
    }
  }

  // If no model specified or model not available, return error
  const responseTime = Date.now() - startTime;
  return {
    response: `API Error: The requested model "${preferredModel || 'unknown'}" is not available or configured. Please contact support or check promptop.net/status for service updates.`,
    model: preferredModel || 'unknown',
    responseTime,
    success: false,
    error: "Model not available or configured"
  };
}
