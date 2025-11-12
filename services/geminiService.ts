import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateText = async (prompt: string, modelName: string = 'gemini-2.5-flash'): Promise<string> => {
    if (!API_KEY) {
        return "API Key is not configured. Please check your environment variables."
    }
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error(`Error generating text for model ${modelName}:`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate content: ${errorMessage}`);
    }
}

export const generatePoem = async (): Promise<string> => {
  const prompt = `Write a beautiful and heartfelt acrostic poem for the name "Sriya". The poem should celebrate her turning 25. Start the response with a title and a short intro line, then the poem. For example: "For Sriya, on her 25th Birthday\nA poem to celebrate you."`;
  return generateText(prompt);
};

export const generateForecast = async (): Promise<string> => {
  const prompt = `Create a mystical and positive "forecast" for Sriya's 25th year of life. Make it sound like a beautiful, uplifting prophecy or horoscope. Focus on themes of growth, joy, and adventure. Keep it to one paragraph.`;
  return generateText(prompt);
};

export const generateCompliment = async (): Promise<string> => {
  const prompt = `Generate a short, unique, and heartfelt compliment for a dear friend named Sriya. Avoid generic phrases. Focus on a specific, admirable quality, like her kindness, strength, or smile. Make it sound personal and sincere. One sentence.`;
  return generateText(prompt);
};

export const generateImage = async (): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }
  try {
    const prompt = `A magical and elegant birthday card for a 25th birthday. The scene features a beautiful cake with glowing candles, surrounded by sparkling lights and soft, ethereal flower petals in shades of pink and gold. The style should be dreamy and artistic. The card should have the following text beautifully integrated: "For you maa 💟 This cake may fade, but the love and prayers behind it stay forever. Happy 25th, my blessing, my Devi, Sriya Reddie."`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to generate image: ${errorMessage}`);
  }
};