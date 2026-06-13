import { Router } from "express";
import { z } from "zod";
import {
  createPlannerItem,
  deletePlannerItem,
  generatePlanner,
  getPlanner,
  updatePlannerItem,
} from "../controllers/plannerController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const plannerRouter = Router();

plannerRouter.use(requireAuth);
plannerRouter.get("/", getPlanner);
plannerRouter.post(
  "/",
  validate(
    z.object({
      body: z.object({
        weekStart: z.string().optional(),
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        title: z.string().min(1),
        tag: z.string().optional(),
        tone: z.enum(["accent", "warning", "neutral"]).optional(),
        completed: z.boolean().optional(),
        order: z.number().optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  createPlannerItem
);

plannerRouter.put(
  "/:id",
  validate(
    z.object({
      body: z.object({
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).optional(),
        title: z.string().min(1).optional(),
        tag: z.string().optional(),
        tone: z.enum(["accent", "warning", "neutral"]).optional(),
        completed: z.boolean().optional(),
        order: z.number().optional(),
      }),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  updatePlannerItem
);

plannerRouter.delete(
  "/:id",
  validate(
    z.object({
      body: z.object({}).optional(),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  deletePlannerItem
);

plannerRouter.post(
  "/generate",
  validate(
    z.object({
      body: z.object({
        prompt: z.string().optional(),
        weekStart: z.string().optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  generatePlanner
);
