import { GoogleGenAI, Type } from "@google/genai";
import { GoalSuggestion } from '../types';

// Initialize the client. 
// Note: API Key must be in process.env.API_KEY
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing via process.env.API_KEY");
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates specific goals or affirmations based on a user's theme.
 */
export const generateGoalIdeas = async (theme: string): Promise<GoalSuggestion[]> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 specific, inspiring, and actionable vision board goals or affirmations for the following theme: "${theme}". Return them as a JSON list with category and goal text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              goal: { type: Type.STRING },
            },
            required: ["category", "goal"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as GoalSuggestion[];
  } catch (error) {
    console.error("Error generating goals:", error);
    throw error;
  }
};

/**
 * Generates an image based on a prompt using the Gemini Image model.
 */
export const generateVisionImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high quality, artistic, inspiring image for a vision board about: ${prompt}. Photorealistic, bright, aesthetic, 4k.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract base64 image from response
    let base64Image = "";
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           base64Image = part.inlineData.data;
           return `data:image/png;base64,${base64Image}`;
         }
       }
    }
    
    throw new Error("No image data returned from API");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Generates a prompt for an image based on a goal text.
 * Useful if the user has a goal but needs a visualization idea.
 */
export const visualizeGoal = async (goal: string): Promise<string> => {
   const ai = getAiClient();
   try {
     const response = await ai.models.generateContent({
       model: "gemini-3-flash-preview",
       contents: `Create a short, vivid, artistic image generation prompt (max 20 words) to visualize this goal: "${goal}". Do not include "image of", just the scene description.`
     });
     return response.text || goal;
   } catch (error) {
     return goal;
   }
}
