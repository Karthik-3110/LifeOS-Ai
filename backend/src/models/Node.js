import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    type: { type: String, enum: ["goal", "task", "deadline", "resource"], required: true, index: true },
    title: { type: String, required: true, trim: true },
    sub: { type: String, default: "" },
    priority: { type: String, enum: ["low", "med", "high"], default: undefined },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

nodeSchema.index({ user: 1, workspace: 1, updatedAt: -1 });

export const Node = mongoose.model("Node", nodeSchema);
