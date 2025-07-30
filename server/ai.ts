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

export interface AIResponse {
  response: string;
  model: string;
  responseTime: number;
  success: boolean;
  error?: string;
}

export async function testPromptWithAI(promptContent: string, preferredModel?: string): Promise<AIResponse> {
  const startTime = Date.now();

  // Use preferred model if specified
  if (preferredModel === "gpt-4o" && openai) {
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
      console.log("OpenAI failed, trying Gemini fallback:", openaiError);
      // Fall through to try Gemini
    }
  }

  // Try Gemini (default or fallback)
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptContent,
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
      console.log("Gemini failed, trying OpenAI fallback:", geminiError);

      // Fallback to OpenAI GPT-4o
      if (openai && preferredModel !== "gpt-4o") { // Only try if we haven't already tried it above
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
