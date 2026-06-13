import mongoose from "mongoose";

const plannerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStart: { type: Date, required: true, index: true },
    day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    title: { type: String, required: true, trim: true },
    tag: { type: String, default: "" },
    tone: { type: String, enum: ["accent", "warning", "neutral"], default: "neutral" },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

plannerSchema.index({ user: 1, weekStart: 1, day: 1, order: 1 });

export const Planner = mongoose.model("Planner", plannerSchema);
