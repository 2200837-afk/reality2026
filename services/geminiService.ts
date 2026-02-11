
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a concise physics explanation using gemini-3-flash-preview.
 */
export const generatePhysicsExplanation = async (
  topic: string, 
  velocity: number, 
  gamma: number
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Explain the concept of ${topic} in the context of Special Relativity. 
          Specifically, explain what happens when an object travels at ${velocity * 100}% the speed of light (max 0.999c), 
          resulting in a Lorentz factor (gamma) of ${gamma.toFixed(2)}. 
          Keep the explanation under 150 words, engaging, and strictly scientifically accurate. 
          Use simple analogies suitable for a university student.`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I couldn't generate an explanation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the relativity database (AI service unavailable).";
  }
};

/**
 * Chats with the Albert Einstein persona using gemini-3-pro-preview for complex reasoning.
 */
// Fix: Added missing chatWithEinstein function to support ChatTutor component
export const chatWithEinstein = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are Albert Einstein, a digital projection of his legendary mind. Explain concepts of special relativity with your characteristic wisdom, humility, and clear analogies (like riding on a beam of light). Be encouraging and curious about the explorer's questions. Keep responses relatively concise and suitable for a university student. Avoid excessive mathematical formalism unless explicitly asked.",
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "I am pondering the deep equations of our universe. Please try again in a moment.";
  } catch (error) {
    console.error("Einstein Chat Error:", error);
    return "The space-time continuum seems a bit noisy right now. My apologies, fellow explorer. Let us try again shortly.";
  }
};
