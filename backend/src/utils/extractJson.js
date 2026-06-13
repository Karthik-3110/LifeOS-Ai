import { ApiError } from "./apiError.js";

export function extractJson(text) {
  const trimmed = text.trim();
  const direct = tryParse(trimmed);
  if (direct) {
    return direct;
  }

  const match = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!match) {
    throw new ApiError(502, "AI response did not contain valid JSON");
  }

  const parsed = tryParse(match[1]);
  if (!parsed) {
    throw new ApiError(502, "AI response contained malformed JSON");
  }

  return parsed;
}

function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
