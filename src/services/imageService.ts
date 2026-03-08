import { GoogleGenAI } from "@google/genai";

export async function generateArtemImage(imageBuffer: string, mimeType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBuffer,
            mimeType: mimeType,
          },
        },
        {
          text: 'Generate a 2D stylized cartoon character of this young man. Full body view, standing in a neutral pose. He should have the same short buzz cut, blue eyes, and facial features. Wearing a simple white t-shirt and blue jeans. The art style should be clean, vibrant, and friendly, similar to "My Talking Tom" or modern mobile pet games. Transparent or simple light background. High quality, 1K resolution.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
