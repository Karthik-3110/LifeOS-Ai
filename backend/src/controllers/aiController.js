import { asyncHandler } from "../utils/asyncHandler.js";
import { createRoadmapFromInput } from "../services/roadmapService.js";
import { extractYoutubeTranscript } from "../services/youtubeService.js";
import { deleteCache } from "../cache/cacheService.js";

export const brainDump = asyncHandler(async (req, res) => {
  const data = await createRoadmapFromInput({
    userId: req.user._id,
    input: req.validated.body.prompt,
    mode: "braindump",
  });

  await invalidateAiCaches(req.user._id);
  res.status(201).json({ success: true, data });
});

export const youtubeRoadmap = asyncHandler(async (req, res) => {
  const transcript = await extractYoutubeTranscript(req.validated.body.youtubeUrl);
  const data = await createRoadmapFromInput({
    userId: req.user._id,
    input: `YouTube URL: ${req.validated.body.youtubeUrl}\nTranscript:\n${transcript}`,
    mode: "youtube",
  });

  await invalidateAiCaches(req.user._id);
  res.status(201).json({ success: true, data });
});

async function invalidateAiCaches(userId) {
  await deleteCache([
    `dashboard:stats:${userId}`,
    `dashboard:recent:${userId}`,
    `analytics:overview:${userId}`,
    `analytics:progress:${userId}`,
  ]);
}
