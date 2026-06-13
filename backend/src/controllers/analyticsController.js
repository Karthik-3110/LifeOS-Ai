import { asyncHandler } from "../utils/asyncHandler.js";
import { getAnalyticsOverview, getAnalyticsProgress } from "../services/analyticsService.js";
import { calculateReadiness } from "../services/readinessService.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const data = await getAnalyticsOverview(req.user);
  res.json({ success: true, data });
});

export const getProgress = asyncHandler(async (req, res) => {
  const data = await getAnalyticsProgress(req.user._id);
  res.json({ success: true, data });
});

export const getReadiness = asyncHandler(async (req, res) => {
  const data = await calculateReadiness(req.user);
  res.json({ success: true, data });
});
