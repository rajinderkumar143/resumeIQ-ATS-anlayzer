import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env.js';

let genAI = null;
let model = null;

if (ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    // Use gemini-1.5-flash or gemini-2.0-flash
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✨ Gemini AI Client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Gemini client:', error.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not set in .env. AI engine will operate in Smart Heuristic & Dual-Engine mode.');
}

export { genAI, model };
