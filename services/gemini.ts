
import {GoogleGenAI} from "@google/genai";

export class CampusAssistantService {
  /**
   * Help the user with login issues using the Gemini API.
   * Following guidelines: Creating the GoogleGenAI instance right before making an API call.
   */
  async getHelp(query: string, role: string): Promise<string> {
    const prompt = `
      You are the UniPortal Campus Assistant. 
      The user is at the login screen and identifies as a ${role}.
      Provide short, helpful, and professional advice for common login issues:
      - Forgotten ID
      - Password reset procedures
      - Technical support contacts
      - First-time registration
      Keep your response under 3 sentences. Be friendly and academic.
      User question: "${query}"
    `;

    try {
      // Correct initialization using named parameter and process.env.API_KEY (removed extra spaces)
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Directly accessing the .text property as per SDK documentation
      return response.text || "I'm here to help. Please contact campus IT if you cannot log in.";
    } catch (e) {
      console.error("Gemini Assistant Error:", e);
      return "I am currently offline. Please visit the Registrar's office for login assistance.";
    }
  }
}
