import { Planner } from "../models/Planner.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getWeekStart } from "../utils/date.js";
import { deleteCache } from "../cache/cacheService.js";
import { Goal } from "../models/Goal.js";
import { generateStructuredRoadmap } from "../services/groqService.js";
import { ApiError } from "../utils/apiError.js";

export const getPlanner = asyncHandler(async (req, res) => {
  const weekStart = req.query.weekStart ? getWeekStart(new Date(req.query.weekStart)) : getWeekStart();
  const items = await Planner.find({ user: req.user._id, weekStart }).sort({ day: 1, order: 1 });
  res.json({ success: true, data: items });
});

export const createPlannerItem = asyncHandler(async (req, res) => {
  const weekStart = req.validated.body.weekStart ? getWeekStart(new Date(req.validated.body.weekStart)) : getWeekStart();
  const item = await Planner.create({
    user: req.user._id,
    weekStart,
    day: req.validated.body.day,
    title: req.validated.body.title,
    tag: req.validated.body.tag || "",
    tone: req.validated.body.tone || "neutral",
    completed: Boolean(req.validated.body.completed),
    order: req.validated.body.order || 0,
  });

  await invalidatePlannerCaches(req.user._id);
  res.status(201).json({ success: true, data: item });
});

export const updatePlannerItem = asyncHandler(async (req, res) => {
  const item = await Planner.findOneAndUpdate(
    { _id: req.validated.params.id, user: req.user._id },
    req.validated.body,
    { new: true }
  );

  if (!item) {
    throw new ApiError(404, "Planner item not found");
  }

  await invalidatePlannerCaches(req.user._id);
  res.json({ success: true, data: item });
});

export const deletePlannerItem = asyncHandler(async (req, res) => {
  const item = await Planner.findOneAndDelete({ _id: req.validated.params.id, user: req.user._id });
  if (!item) {
    throw new ApiError(404, "Planner item not found");
  }

  await invalidatePlannerCaches(req.user._id);
  res.json({ success: true, message: "Planner item deleted" });
});

export const generatePlanner = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(8);
  const prompt = `
Generate a weekly plan from these goals:
${goals.map((goal) => `- ${goal.title} (${goal.progress}% progress)`).join("\n")}
Additional instructions: ${req.validated.body.prompt || "Balance focus work and deadlines."}

Return JSON only:
{
  "items": [
    { "day": "Monday", "title": "Task", "tag": "Focus", "tone": "accent", "completed": false, "order": 0 }
  ]
}
  `.trim();

  const plan = await generateStructuredRoadmap({ input: prompt, mode: "planner" });
  const weekStart = req.validated.body.weekStart ? getWeekStart(new Date(req.validated.body.weekStart)) : getWeekStart();
  await Planner.deleteMany({ user: req.user._id, weekStart });

  const rawItems = Array.isArray(plan.items) ? plan.items : [];
  const items = await Planner.insertMany(
    rawItems.map((item, index) => ({
      user: req.user._id,
      weekStart,
      day: item.day,
      title: item.title,
      tag: item.tag || "",
      tone: item.tone || "neutral",
      completed: Boolean(item.completed),
      order: item.order ?? index,
    }))
  );

  await invalidatePlannerCaches(req.user._id);
  res.json({ success: true, data: items });
});

async function invalidatePlannerCaches(userId) {
  await deleteCache([
    `dashboard:upcoming:${userId}`,
    `dashboard:stats:${userId}`,
    `analytics:overview:${userId}`,
    `analytics:progress:${userId}`,
  ]);
}
