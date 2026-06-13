import { Goal } from "../models/Goal.js";
import { Node } from "../models/Node.js";
import { Planner } from "../models/Planner.js";
import { rememberCache } from "../cache/cacheService.js";
import { calculateReadiness } from "./readinessService.js";
import { addDays } from "../utils/date.js";

export async function getDashboardStats(user) {
  return rememberCache(`dashboard:stats:${user._id}`, async () => {
    const now = new Date();
    const inSevenDays = addDays(now, 7);

    const [totalGoals, totalTasks, completedTasks, goalDeadlines, nodeDeadlines, readiness] = await Promise.all([
      Goal.countDocuments({ user: user._id }),
      Node.countDocuments({ user: user._id, type: "task" }),
      Node.countDocuments({ user: user._id, type: "task", status: "done" }),
      Goal.countDocuments({
        user: user._id,
        dueDate: { $gte: now, $lte: inSevenDays },
      }),
      Node.countDocuments({
        user: user._id,
        type: "deadline",
        "metadata.dueDate": { $gte: now, $lte: inSevenDays },
      }),
      calculateReadiness(user),
    ]);

    return {
      totalGoals,
      totalTasks,
      completedTasks,
      upcomingDeadlines: goalDeadlines + nodeDeadlines,
      readinessScore: readiness.score,
      readiness,
    };
  });
}

export async function getDashboardRecent(userId) {
  return rememberCache(`dashboard:recent:${userId}`, async () => {
    const goals = await Goal.find({ user: userId }).sort({ updatedAt: -1 }).limit(6);
    return goals.map((goal) => ({
      id: goal._id,
      title: goal.title,
      progress: goal.progress,
      due: goal.dueDate,
      status: goal.status,
    }));
  });
}

export async function getDashboardUpcoming(userId) {
  return rememberCache(`dashboard:upcoming:${userId}`, async () => {
    const plannerItems = await Planner.find({ user: userId }).sort({ weekStart: 1, order: 1 }).limit(10);
    return plannerItems.map((item) => ({
      id: item._id,
      day: item.day,
      title: item.title,
      completed: item.completed,
      tag: item.tag,
    }));
  });
}
