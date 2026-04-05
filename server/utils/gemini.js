
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7
  }
});

export async function getDiagnosisNotification({ vitals, conditions, reports, doctors }) {

  const vitalsText = vitals && vitals.length > 0
    ? vitals.map((v, i) =>
        `Record ${i + 1}: HR ${v.heart_rate ?? 'N/A'}, BP ${v.bp ?? 'N/A'}, Blood Sugar ${v.blood_sugar ?? 'N/A'} mg/dL`
      ).join(' | ')
    : 'No vitals available';


  const conditionsText = conditions && conditions.length > 0
    ? conditions.map(c => c.condition).join(', ')
    : 'No conditions recorded';

  const doctorsText = Object.entries(doctors)
    .map(([dept, docs]) => dept + ': ' + docs.map(d => d.name).join(', '))
    .join('; ');

  const prompt = `You are a patient advisor. You have to sound confident and give suggestions. If nothing, say you are in good health. Patient summary:
  Vitals (recent records): ${vitalsText}
  Conditions: ${conditionsText}
  Doctors by department: ${doctorsText}
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