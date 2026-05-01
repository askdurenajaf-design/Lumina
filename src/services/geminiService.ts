import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getStudyHelp(
  prompt: string, 
  history: Message[] = [], 
  category: string = 'general'
) {
  const model = "gemini-3-flash-preview";
  
  const systemInstructions: Record<string, string> = {
    general: "You are a helpful and supportive student study assistant. Your goal is to explain concepts clearly, provide examples, and help users learn, rather than just giving direct answers if it's a practice problem.",
    math: "You are a math tutor. Break down problems step-by-step. Focus on the logical progression of solving the equation or problem. Use LaTeX-like formatting for math where appropriate.",
    writing: "You are a writing coach. Help users with brainstorming, outlining, grammar, and style. Provide constructive feedback on drafts.",
    coding: "You are a computer science tutor. Explain code logic, find bugs, and suggest best practices. Provide code examples in the appropriate language.",
    summarize: "You are an expert at information synthesis. Create clear, concise summaries that highlight key terms, main ideas, and critical details from the provided text."
  };

  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstructions[category] || systemInstructions.general,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
