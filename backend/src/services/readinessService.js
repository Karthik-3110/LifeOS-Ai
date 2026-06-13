import { Goal } from "../models/Goal.js";
import { Node } from "../models/Node.js";

export async function calculateReadiness(user) {
  const [goalCounts, completedTasks, totalTasks] = await Promise.all([
    Goal.countDocuments({ user: user._id, status: "completed" }),
    Node.countDocuments({ user: user._id, type: "task", status: "done" }),
    Node.countDocuments({ user: user._id, type: "task" }),
  ]);

  const completedGoalScore = Math.min(goalCounts * 8, 24);
  const dsaScore = Math.min(user.profile?.dsaProgress || 0, 20);
  const projectScore = Math.min((user.profile?.projectCount || 0) * 5, 20);
  const resumeScore = user.profile?.resumeStatus === "done" ? 18 : user.profile?.resumeStatus === "in_progress" ? 10 : 0;
  const aptitudeScore = user.profile?.aptitudeStatus === "done" ? 18 : user.profile?.aptitudeStatus === "in_progress" ? 10 : 0;
  const taskExecutionScore = totalTasks > 0 ? Math.min(Math.round((completedTasks / totalTasks) * 20), 20) : 0;

  const score = Math.min(
    completedGoalScore + dsaScore + projectScore + resumeScore + aptitudeScore + taskExecutionScore,
    100
  );

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (dsaScore >= 15) strengths.push("Consistent DSA progress");
  else {
    weaknesses.push("DSA consistency is below target");
    recommendations.push("Increase weekly DSA practice blocks");
  }

  if (projectScore >= 15) strengths.push("Strong project portfolio momentum");
  else {
    weaknesses.push("Project count is still light");
    recommendations.push("Ship one more portfolio-grade project");
  }

  if (resumeScore >= 18) strengths.push("Resume is up to date");
  else {
    weaknesses.push("Resume is not production-ready");
    recommendations.push("Finish or refresh your resume this week");
  }

  if (aptitudeScore >= 18) strengths.push("Aptitude prep looks healthy");
  else {
    weaknesses.push("Aptitude practice needs attention");
    recommendations.push("Schedule timed aptitude sessions");
  }

  if (taskExecutionScore >= 14) strengths.push("Execution rate is trending well");
  else {
    weaknesses.push("Task completion rate can improve");
    recommendations.push("Reduce in-progress work and close tasks faster");
  }

  return { score, strengths, weaknesses, recommendations };
}
