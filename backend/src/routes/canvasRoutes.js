import { Router } from "express";
import { z } from "zod";
import {
  connectNodes,
  createNode,
  deleteNode,
  getCanvas,
  saveCanvas,
  updateNode,
} from "../controllers/canvasController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const canvasRouter = Router();

canvasRouter.use(requireAuth);
canvasRouter.get("/", getCanvas);
canvasRouter.post(
  "/node",
  validate(
    z.object({
      body: z.object({
        type: z.enum(["goal", "task", "deadline", "resource"]),
        title: z.string().min(1),
        sub: z.string().optional(),
        priority: z.enum(["low", "med", "high"]).nullable().optional(),
        position: positionSchema,
        status: z.enum(["todo", "in_progress", "done"]).optional(),
        metadata: z.record(z.any()).optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  createNode
);

canvasRouter.put(
  "/node/:id",
  validate(
    z.object({
      body: z.object({
        type: z.enum(["goal", "task", "deadline", "resource"]).optional(),
        title: z.string().min(1).optional(),
        sub: z.string().optional(),
        priority: z.enum(["low", "med", "high"]).nullable().optional(),
        position: positionSchema.optional(),
        status: z.enum(["todo", "in_progress", "done"]).optional(),
        metadata: z.record(z.any()).optional(),
      }),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  updateNode
);

canvasRouter.delete(
  "/node/:id",
  validate(
    z.object({
      body: z.object({}).optional(),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}).optional(),
    })
  ),
  deleteNode
);

canvasRouter.post(
  "/connect",
  validate(
    z.object({
      body: z.object({
        sourceNode: z.string().min(1),
        targetNode: z.string().min(1),
        label: z.string().optional(),
        animated: z.boolean().optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  connectNodes
);

canvasRouter.post(
  "/save",
  validate(
    z.object({
      body: z.object({
        nodes: z
          .array(
            z.object({
              id: z.string().optional(),
              type: z.enum(["goal", "task", "deadline", "resource"]),
              title: z.string(),
              sub: z.string().optional(),
              priority: z.enum(["low", "med", "high"]).nullable().optional(),
              position: positionSchema,
              status: z.enum(["todo", "in_progress", "done"]).optional(),
              metadata: z.record(z.any()).optional(),
            })
          )
          .optional(),
        edges: z
          .array(
            z.object({
              sourceNode: z.string(),
              targetNode: z.string(),
              label: z.string().optional(),
              animated: z.boolean().optional(),
            })
          )
          .optional(),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  saveCanvas
);
