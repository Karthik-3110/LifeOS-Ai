import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { brainDump, youtubeRoadmap } from "../controllers/aiController.js";

export const aiRouter = Router();

aiRouter.use(requireAuth);
aiRouter.post(
  "/braindump",
  validate(
    z.object({
      body: z.object({
        prompt: z.string().trim().min(1),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  brainDump
);

aiRouter.post(
  "/youtube-roadmap",
  validate(
    z.object({
      body: z.object({
        youtubeUrl: z.string().url(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  youtubeRoadmap
);
