
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { startAnalyticsSnapshotJob } from "./jobs/analyticsJob.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://lifeosai.onrender.com",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan("dev"));

app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "LifeOS AI Backend",
  });
});
app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  startAnalyticsSnapshotJob();
  app.listen(env.PORT, () => {
    console.log(`LifeOS backend listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

