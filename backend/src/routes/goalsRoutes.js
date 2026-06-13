import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createGoal, deleteGoal, listGoals, updateGoal } from "../controllers/goalsController.js";

export const goalsRouter = Router();

goalsRouter.use(requireAuth);
goalsRouter.get("/", listGoals);
goalsRouter.post(
  "/",
  validate(
    z.object({
      body: z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        progress: z.number().min(0).max(100).optional(),
        dueDate: z.string().nullable().optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  createGoal
);
goalsRouter.put(
  "/:id",
  validate(
    z.object({
      body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        progress: z.number().min(0).max(100).optional(),
        dueDate: z.string().nullable().optional(),
        status: z.enum(["active", "completed", "paused"]).optional(),
      }),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  updateGoal
);
goalsRouter.delete(
  "/:id",
  validate(
    z.object({
      body: z.object({}).optional(),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  deleteGoal
);
