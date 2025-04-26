// services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_PUBLIC_GEMINI_API_KEY
); // Helper to sanitize AI output (remove ```json ... ``` and trim)
function sanitizeAIResponse(text) {
  return text
    .replace(/^```json\s*/i, "") // Remove starting ```json
    .replace(/^```\s*/i, "") // Or just ```
    .replace(/```$/, "") // Remove ending ```
    .trim(); // Remove extra spaces
}

export async function analyzeCommentsWithGemini(comments) {
  const prompt = `
You are an AI assistant analyzing user comments on a post. Given the following comments:

${comments.map((c, i) => `${i + 1}. ${c.value}`).join("\n")}

Respond ONLY with valid raw JSON, no markdown, no explanations, no backticks. Only pure JSON object like:
{
  "positiveCount": number,
  "negativeCount": number,
  "positiveSummary": "short text",
  "negativeSummary": "short text",
  "overallSentiment": "positive" | "negative" | "mixed"
}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  try {
    const cleanText = sanitizeAIResponse(text);
    const json = JSON.parse(cleanText);
    return json;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    console.error("Raw AI response:", text);
    return null;
  }
}
