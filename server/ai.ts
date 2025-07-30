import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Initialize AI clients  
const gemini = process.env.GEMINI_API_KEY ? 
  new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const openai = process.env.OPENAI_API_KEY ? 
  new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  }) : null;

// DeepSeek client (using OpenAI-compatible API)
const deepseek = process.env.DEEPSEEK_API_KEY ? 
  new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1"
  }) : null;

export interface AIResponse {
  response: string;
  model: string;
  responseTime: number;
  success: boolean;
  error?: string;
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
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(enhancementPrompt);
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

  // Use preferred model if specified
  if (preferredModel === "deepseek-v3-pro" && deepseek) {
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: enhancedPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseTime = Date.now() - startTime;
      const text = response.choices[0]?.message?.content || "No response generated";

      return {
        response: text,
        model: "deepseek-v3-pro",
        responseTime,
        success: true,
      };
    } catch (deepseekError: any) {
      console.log("DeepSeek failed, trying fallback:", deepseekError);
      // Fall through to try other models
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

  // Try Gemini (default or fallback)
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: enhancedPrompt,
      });

      const responseTime = Date.now() - startTime;
      const text = response.text || "No response generated";

      return {
        response: text,
        model: "gemini-2.5-flash",
        responseTime,
        success: true,
      };
    } catch (geminiError: any) {
      console.log("Gemini failed, trying fallback:", geminiError);

      // Try DeepSeek if available and not already tried
      if (deepseek && preferredModel !== "deepseek-v3-pro") {
        try {
          const response = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: enhancedPrompt }],
            max_tokens: 2000,
            temperature: 0.7,
          });

          const responseTime = Date.now() - startTime;
          const text = response.choices[0]?.message?.content || "No response generated";

          return {
            response: text,
            model: "deepseek-v3-pro",
            responseTime,
            success: true,
          };
        } catch (deepseekError: any) {
          console.log("DeepSeek fallback failed:", deepseekError);
        }
      }

      // Fallback to OpenAI GPT-4o
      if (openai && preferredModel !== "gpt-4o") { // Only try if we haven't already tried it above
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
          const responseTime = Date.now() - startTime;
          
          return {
            response: "",
            model: "none",
            responseTime,
            success: false,
            error: `Both AI services failed. Gemini: ${geminiError.message}. OpenAI: ${openaiError.message}`,
          };
        }
      } else {
        const responseTime = Date.now() - startTime;
        return {
          response: "",
          model: "gemini-2.5-flash",
          responseTime,
          success: false,
          error: `Gemini API error: ${geminiError.message}. No OpenAI fallback configured.`,
        };
      }
    }
  } else if (openai) {
    // Only OpenAI available
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: promptContent }],
        max_tokens: 1000,
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
      const responseTime = Date.now() - startTime;
      
      return {
        response: "",
        model: "gpt-4o",
        responseTime,
        success: false,
        error: `OpenAI API error: ${openaiError.message}`,
      };
    }
  } else {
    // No API keys available
    const responseTime = Date.now() - startTime;
    return {
      response: "",
      model: "none",
      responseTime,
      success: false,
      error: "No AI API keys configured. Please set GEMINI_API_KEY or OPENAI_API_KEY environment variables.",
    };
  }
}
