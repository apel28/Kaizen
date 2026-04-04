
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7
  }
});

// Call Gemini API for AI diagnosis notification using GoogleGenerativeAI SDK
export async function getDiagnosisNotification({ vitals, conditions, reports, doctors }) {
  // Compose a concise prompt for Gemini
  const prompt = `You are a patient advisor. You have to sound confident and give suggestions. If nothing, say you are in good health. Patient summary:
  Vitals: HR ${vitals.heart_rate}, BP ${vitals.bp}, Blood Sugar ${vitals.blood_sugar}
  Conditions: ${conditions.join(', ')}
  Doctors by department: ${Object.entries(doctors).map(([dept, docs]) => dept + ': ' + docs.map(d => d.name).join(', ')).join('; ')}

  Provide a short, actionable notification: what condition the patient may have, which department to visit, and a suggested doctor.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text.trim() || 'No diagnosis available.';
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return 'AI diagnosis unavailable.';
  }
}
