import mongoose from "mongoose";

const edgeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    sourceNode: { type: mongoose.Schema.Types.ObjectId, ref: "Node", required: true },
    targetNode: { type: mongoose.Schema.Types.ObjectId, ref: "Node", required: true },
    label: { type: String, default: "" },
    animated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

edgeSchema.index({ user: 1, workspace: 1 });

export const Edge = mongoose.model("Edge", edgeSchema);
