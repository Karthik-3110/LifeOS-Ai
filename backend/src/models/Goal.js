import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "completed", "paused"], default: "active", index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    dueDate: { type: Date, index: true },
    source: { type: String, enum: ["manual", "braindump", "youtube"], default: "manual" },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, dueDate: 1 });

export const Goal = mongoose.model("Goal", goalSchema);
