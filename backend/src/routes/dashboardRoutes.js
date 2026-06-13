import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { recent, stats, upcoming } from "../controllers/dashboardController.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/stats", stats);
dashboardRouter.get("/recent", recent);
dashboardRouter.get("/upcoming", upcoming);
