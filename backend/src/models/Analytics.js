import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    tasksCompleted: { type: Number, default: 0 },
    tasksPlanned: { type: Number, default: 0 },
    goalsCompleted: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

analyticsSchema.index({ user: 1, date: -1 }, { unique: true });

export const Analytics = mongoose.model("Analytics", analyticsSchema);
