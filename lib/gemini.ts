import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

export async function askGemini(prompt: string): Promise<string> {
  let lastErr: any = null;
  for (const model of MODELS) {
    try {
      const res = await ai.models.generateContent({ model, contents: prompt });
      return res.text ?? "";
    } catch (err: any) {
      console.log("Chat failed:", model, String(err.message).slice(0, 120));
      lastErr = err;
    }
  }
  throw lastErr;
}
