import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  changePassword,
  deleteAccount,
  exportWorkspace,
  resetWorkspace,
  updateProfile,
} from "../controllers/settingsController.js";

export const settingsRouter = Router();

settingsRouter.use(requireAuth);
settingsRouter.put(
  "/profile",
  validate(
    z.object({
        body: z.object({
          name: z.string().min(2),
          email: z.string().email(),
          dsaProgress: z.number().min(0).max(100).optional(),
          projectCount: z.number().min(0).max(100).optional(),
          resumeStatus: z.enum(["not_started", "in_progress", "done"]).optional(),
          aptitudeStatus: z.enum(["not_started", "in_progress", "done"]).optional(),
        }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  updateProfile
);

settingsRouter.put(
  "/password",
  validate(
    z.object({
      body: z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  changePassword
);

settingsRouter.delete("/account", deleteAccount);
settingsRouter.post("/export", exportWorkspace);
settingsRouter.post("/reset-workspace", resetWorkspace);
