
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    maxOutputTokens: 250,
    temperature: 0.7
  }
});

// Call Gemini API for AI diagnosis notification using GoogleGenerativeAI SDK
export async function getDiagnosisNotification({ vitals, conditions, reports, doctors }) {
  // Compose a concise prompt for Gemini
  const prompt = `A patient has the following data:\n\nVitals: ${JSON.stringify(vitals)}\n\nConditions: ${JSON.stringify(conditions)}\n\nHere is a list of available doctors grouped by department: ${JSON.stringify(doctors)}\n\nBased on the above, briefly notify the patient what condition they may have, which department to visit, and suggest a doctor from that department. The notification must be short and actionable.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    return text.trim() || 'No diagnosis available.';
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return 'AI diagnosis unavailable.';
  }
}
