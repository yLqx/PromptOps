import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// Initialize AI clients
const gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY ? 
  new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
  }) : null;

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
