import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardRecent, getDashboardStats, getDashboardUpcoming } from "../services/dashboardService.js";

export const stats = asyncHandler(async (req, res) => {
  const data = await getDashboardStats(req.user);
  res.json({ success: true, data });
});

export const recent = asyncHandler(async (req, res) => {
  const data = await getDashboardRecent(req.user._id);
  res.json({ success: true, data });
});

export const upcoming = asyncHandler(async (req, res) => {
  const data = await getDashboardUpcoming(req.user._id);
  res.json({ success: true, data });
});
