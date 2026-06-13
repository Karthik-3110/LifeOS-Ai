import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    dbName: "lifeos_ai",
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });
  return mongoose.connection;
}
