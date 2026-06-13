import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  GROQ_API_KEY: z.string().optional(),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  REDIS_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
