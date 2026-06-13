import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    profile: {
      dsaProgress: { type: Number, default: 0 },
      projectCount: { type: Number, default: 0 },
      resumeStatus: { type: String, enum: ["not_started", "in_progress", "done"], default: "not_started" },
      aptitudeStatus: { type: String, enum: ["not_started", "in_progress", "done"], default: "not_started" },
      role: { type: String, default: "builder" },
    },
    activeWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
