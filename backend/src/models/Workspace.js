import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, default: "My Workspace", trim: true },
    description: { type: String, default: "" },
    lastSavedAt: { type: Date },
  },
  { timestamps: true }
);

workspaceSchema.index({ user: 1, updatedAt: -1 });

export const Workspace = mongoose.model("Workspace", workspaceSchema);
