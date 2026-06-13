import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { extractJson } from "../utils/extractJson.js";

export async function generateStructuredRoadmap({ input, mode }) {
  if (!env.GROQ_API_KEY) {
    throw new ApiError(
      503,
      "AI features are unavailable. Add a valid GROQ_API_KEY to the backend environment."
    );
  }

  const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  
  const shape =
    mode === "planner"
      ? `
{
  "items": [
    { "day": "Monday", "title": "Task", "tag": "Focus", "tone": "accent", "completed": false, "order": 0 }
  ]
}
      `.trim()
      : `
{
  "summary": "short summary",
  "goals": [{ "title": "", "description": "", "progress": 0, "dueDate": null }],
  "nodes": [
    {
      "id": "n1",
      "kind": "goal|task|deadline|resource",
      "title": "",
      "sub": "",
      "priority": "low|med|high|null",
      "position": { "x": 200, "y": 120 }
    }
  ],
  "edges": [{ "source": "n1", "target": "n2", "label": "", "animated": true }]
}
      `.trim();

  const prompt = `
You are generating a production app JSON payload for LifeOS AI.
Return JSON only with this shape:
${shape}

Mode: ${mode}
Input:
${input}
  `.trim();

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(502, "Groq request failed", errorText);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return extractJson(text);
}
