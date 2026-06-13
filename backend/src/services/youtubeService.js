import { YoutubeTranscript } from "youtube-transcript";
import { ApiError } from "../utils/apiError.js";

export async function extractYoutubeTranscript(url) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    if (!transcript?.length) {
      throw new Error("Transcript unavailable");
    }
    return transcript.map((item) => item.text).join(" ");
  } catch (error) {
    throw new ApiError(400, "Unable to extract YouTube transcript", error.message);
  }
}
