import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getRecipeSuggestions(cartItems: CartItem[]) {
  if (cartItems.length === 0) return null;

  const itemsList = cartItems.map(item => `${item.quantity}x ${item.name}`).join(", ");
  const prompt = `I have these items in my grocery cart: ${itemsList}. 
  Suggest 2 quick and healthy recipes I can make with these items. 
  Keep the response concise and friendly. Format as Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not get suggestions at this time.";
  }
}
