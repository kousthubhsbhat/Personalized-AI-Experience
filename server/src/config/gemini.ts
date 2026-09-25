import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || 'demo_gemini_api_key';

export const isGeminiConfigured = Boolean(apiKey && apiKey !== 'demo_gemini_api_key' && apiKey !== 'your-gemini-api-key');

export const ai = new GoogleGenAI({ apiKey: isGeminiConfigured ? apiKey : 'dummy_key' });
export const GEMINI_MODEL = 'gemini-2.5-flash';

console.log(`[Gemini Config] Model: ${GEMINI_MODEL}, Configured: ${isGeminiConfigured ? 'Yes (Live API)' : 'No (Simulated AI Engine)'}`);
