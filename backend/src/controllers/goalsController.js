import { Goal } from "../models/Goal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { deleteCache } from "../cache/cacheService.js";

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: goals });
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({
    user: req.user._id,
    title: req.validated.body.title,
    description: req.validated.body.description || "",
    progress: req.validated.body.progress || 0,
    dueDate: req.validated.body.dueDate || null,
    source: "manual",
  });

  await invalidateGoalCaches(req.user._id);
  res.status(201).json({ success: true, data: goal });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.validated.params.id, user: req.user._id },
    req.validated.body,
    { new: true }
  );

  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  await invalidateGoalCaches(req.user._id);
  res.json({ success: true, data: goal });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.validated.params.id, user: req.user._id });
  if (!goal) {
    throw new ApiError(404, "Goal not found");
  }

  await invalidateGoalCaches(req.user._id);
  res.json({ success: true, message: "Goal deleted" });
});

async function invalidateGoalCaches(userId) {
  await deleteCache([
    `dashboard:stats:${userId}`,
    `dashboard:recent:${userId}`,
    `analytics:overview:${userId}`,
    `analytics:progress:${userId}`,
  ]);
}
