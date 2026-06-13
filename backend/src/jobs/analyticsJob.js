import { Analytics } from "../models/Analytics.js";
import { User } from "../models/User.js";
import { getAnalyticsProgress } from "../services/analyticsService.js";
import { calculateReadiness } from "../services/readinessService.js";

export function startAnalyticsSnapshotJob() {
  const intervalMs = 1000 * 60 * 30;

  setInterval(async () => {
    try {
      const users = await User.find().select("_id profile");
      for (const user of users) {
        const progress = await getAnalyticsProgress(user._id);
        const readiness = await calculateReadiness(user);

        await Analytics.findOneAndUpdate(
          {
            user: user._id,
            date: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          {
            tasksCompleted: progress.completedTasks,
            tasksPlanned: progress.totalTasks,
            goalsCompleted: progress.goalsCompleted,
            readinessScore: readiness.score,
          },
          { upsert: true, new: true }
        );
      }
    } catch {
      // Snapshot failures should not crash the server.
    }
  }, intervalMs);
}
