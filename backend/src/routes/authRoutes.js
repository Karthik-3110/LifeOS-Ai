import { Router } from "express";
import { z } from "zod";
import { register, login, logout, profile } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6).regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character"),
        confirmPassword: z.string(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  register
);

authRouter.post(
  "/login",
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
      params: z.object({}).optional(),
      query: z.object({}).optional(),
    })
  ),
  login
);

authRouter.post("/logout", logout);
authRouter.get("/profile", requireAuth, profile);
