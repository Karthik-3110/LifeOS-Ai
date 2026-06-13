import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAnalytics, getProgress, getReadiness } from "../controllers/analyticsController.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);
analyticsRouter.get("/", getAnalytics);
analyticsRouter.get("/progress", getProgress);
analyticsRouter.get("/readiness", getReadiness);
