import { GoogleGenAI } from "@google/genai";

// This line is specific to Vite environments like CodeSandbox and Replit.
// It safely reads your API key from the "Secret Keys" section.
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("VITE_API_KEY is not set in Secret Keys. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCompliment = async (): Promise<string> => {
  if (!API_KEY) return "The creator forgot to add their magic key!";
  const prompt = `Generate a short, unique, and heartfelt compliment for a dear friend named Sriya. Avoid generic phrases. Focus on a specific, admirable quality, like her kindness, strength, or smile. Make it sound personal and sincere. One sentence.`;
  const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
  return response.text.trim();
};

export const generateImage = async (): Promise<string> => {
  if (!API_KEY) throw new Error("API Key not configured.");
  const prompt = `A magical and elegant birthday card for a 25th birthday. The scene features a beautiful cake with glowing candles, surrounded by sparkling lights and soft, ethereal flower petals in shades of pink and gold. The style should be dreamy and artistic. The card should have the following text beautifully integrated: "For you maa 💟 This cake may fade, but the love and prayers behind it stay forever. Happy 25th, my blessing, my Devi, Sriya Reddie."`;
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-01',
    prompt: prompt,
    config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '1:1' },
  });
  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return `data:image/png;base64,${base64ImageBytes}`;
};
