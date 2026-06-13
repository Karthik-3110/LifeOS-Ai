import { Goal } from "../models/Goal.js";
import { Node } from "../models/Node.js";
import { Planner } from "../models/Planner.js";
import { rememberCache } from "../cache/cacheService.js";
import { calculateReadiness } from "./readinessService.js";

export async function getAnalyticsOverview(user) {
  return rememberCache(`analytics:overview:${user._id}`, async () => {
    const [goals, tasks, plannerItems, readiness] = await Promise.all([
      Goal.find({ user: user._id }).sort({ createdAt: 1 }),
      Node.find({ user: user._id, type: "task" }).sort({ updatedAt: 1 }),
      Planner.find({ user: user._id }).sort({ weekStart: 1, order: 1 }),
      calculateReadiness(user),
    ]);

    const monthlyProgress = buildMonthlyCompletion(goals);
    const weeklyProductivity = buildWeeklyProductivity(plannerItems);
    const deadlineHeatmap = buildDeadlineHeatmap(
      tasks.filter((task) => task.metadata?.dueDate).map((task) => new Date(task.metadata.dueDate))
    );

    return {
      completion: monthlyProgress,
      weekly: weeklyProductivity,
      readiness: [{ name: "Score", value: readiness.score, fill: "oklch(0.72 0.18 145)" }],
      readinessDetail: readiness,
      heat: deadlineHeatmap,
    };
  });
}

export async function getAnalyticsProgress(userId) {
  return rememberCache(`analytics:progress:${userId}`, async () => {
    const [goalsCompleted, totalGoals, completedTasks, totalTasks] = await Promise.all([
      Goal.countDocuments({ user: userId, status: "completed" }),
      Goal.countDocuments({ user: userId }),
      Node.countDocuments({ user: userId, type: "task", status: "done" }),
      Node.countDocuments({ user: userId, type: "task" }),
    ]);

    return {
      goalCompletionPercent: totalGoals ? Math.round((goalsCompleted / totalGoals) * 100) : 0,
      taskCompletionPercent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      goalsCompleted,
      totalGoals,
      completedTasks,
      totalTasks,
    };
  });
}

function buildMonthlyCompletion(goals) {
  const map = new Map();

  goals.forEach((goal) => {
    const date = goal.updatedAt || goal.createdAt;
    const key = date.toLocaleString("en-US", { month: "short" });
    const current = map.get(key) || { month: key, value: 0, total: 0 };
    current.total += 1;
    current.value += goal.status === "completed" ? 1 : Math.max(goal.progress / 100, 0.2);
    map.set(key, current);
  });

  return Array.from(map.values()).slice(-6).map((item) => ({
    month: item.month,
    value: Math.round((item.value / Math.max(item.total, 1)) * 100),
  }));
}

function buildWeeklyProductivity(items) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return days.map((day, index) => {
    const planned = items.filter((item) => item.day === fullDays[index]).length;
    const done = items.filter((item) => item.day === fullDays[index] && item.completed).length;
    return { day, planned, done };
  });
}

function buildDeadlineHeatmap(deadlines) {
  const weeks = 12;
  const cells = [];

  for (let index = 0; index < weeks * 7; index += 1) {
    const day = new Date();
    day.setDate(day.getDate() - (weeks * 7 - index));
    const count = deadlines.filter((deadline) => sameDay(deadline, day)).length;
    cells.push({ d: index, v: Math.min(count, 4) });
  }

  return cells;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
