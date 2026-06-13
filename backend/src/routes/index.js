import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { dashboardRouter } from "./dashboardRoutes.js";
import { canvasRouter } from "./canvasRoutes.js";
import { aiRouter } from "./aiRoutes.js";
import { plannerRouter } from "./plannerRoutes.js";
import { analyticsRouter } from "./analyticsRoutes.js";
import { settingsRouter } from "./settingsRoutes.js";
import { goalsRouter } from "./goalsRoutes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "LifeOS API is running" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/canvas", canvasRouter);
apiRouter.use("/ai", aiRouter);
apiRouter.use("/planner", plannerRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/goals", goalsRouter);
