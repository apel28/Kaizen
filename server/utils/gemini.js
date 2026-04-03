
import 'dotenv/config';
// Call Gemini API for AI diagnosis notification (using fetch)
export async function getDiagnosisNotification({ vitals, conditions, reports, doctors }) {
  // Compose a concise prompt for Gemini
  const prompt = `A patient has the following data:\n\nVitals: ${JSON.stringify(vitals)}\n\nConditions: ${JSON.stringify(conditions)}\n\nRecent reports (last month): ${JSON.stringify(reports)}\n\nHere is a list of available doctors grouped by department: ${JSON.stringify(doctors)}\n\nBased on the above, briefly notify the patient what condition they may have, which department to visit, and suggest a doctor from that department. The notification must be short and actionable.`;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://googleapis.com{API_KEY}';

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, max_tokens: 80, temperature: 0.7 })
    });
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    // Adjust this depending on Gemini's response format
    return data.choices?.[0]?.text?.trim() || 'No diagnosis available.';
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return 'AI diagnosis unavailable.';
  }
}
