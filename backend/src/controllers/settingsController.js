import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Goal } from "../models/Goal.js";
import { Node } from "../models/Node.js";
import { Edge } from "../models/Edge.js";
import { Planner } from "../models/Planner.js";
import { Workspace } from "../models/Workspace.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { deleteCache } from "../cache/cacheService.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.validated.body.name,
      email: req.validated.body.email,
      profile: {
        ...req.user.profile,
        dsaProgress: req.validated.body.dsaProgress ?? req.user.profile?.dsaProgress ?? 0,
        projectCount: req.validated.body.projectCount ?? req.user.profile?.projectCount ?? 0,
        resumeStatus: req.validated.body.resumeStatus ?? req.user.profile?.resumeStatus ?? "not_started",
        aptitudeStatus: req.validated.body.aptitudeStatus ?? req.user.profile?.aptitudeStatus ?? "not_started",
      },
    },
    { new: true }
  ).select("-password");

  await invalidateUserCaches(req.user._id);
  res.json({ success: true, user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const matches = await bcrypt.compare(req.validated.body.currentPassword, user.password);
  if (!matches) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(req.validated.body.newPassword, 10);
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await Promise.all([
    Goal.deleteMany({ user: req.user._id }),
    Node.deleteMany({ user: req.user._id }),
    Edge.deleteMany({ user: req.user._id }),
    Planner.deleteMany({ user: req.user._id }),
    Notification.deleteMany({ user: req.user._id }),
    Workspace.deleteMany({ user: req.user._id }),
    User.findByIdAndDelete(req.user._id),
  ]);

  await invalidateUserCaches(req.user._id);
  res.json({ success: true, message: "Account deleted successfully" });
});

export const exportWorkspace = asyncHandler(async (req, res) => {
  const [user, goals, nodes, edges, planner, workspaces, notifications] = await Promise.all([
    User.findById(req.user._id).select("-password"),
    Goal.find({ user: req.user._id }),
    Node.find({ user: req.user._id }),
    Edge.find({ user: req.user._id }),
    Planner.find({ user: req.user._id }),
    Workspace.find({ user: req.user._id }),
    Notification.find({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: {
      exportedAt: new Date().toISOString(),
      user,
      goals,
      nodes,
      edges,
      planner,
      workspaces,
      notifications,
    },
  });
});

export const resetWorkspace = asyncHandler(async (req, res) => {
  await Promise.all([
    Goal.deleteMany({ user: req.user._id }),
    Node.deleteMany({ user: req.user._id }),
    Edge.deleteMany({ user: req.user._id }),
    Planner.deleteMany({ user: req.user._id }),
    Notification.deleteMany({ user: req.user._id }),
  ]);

  await invalidateUserCaches(req.user._id);
  res.json({ success: true, message: "Workspace reset successfully" });
});

async function invalidateUserCaches(userId) {
  await deleteCache([
    `dashboard:stats:${userId}`,
    `dashboard:recent:${userId}`,
    `dashboard:upcoming:${userId}`,
    `analytics:overview:${userId}`,
    `analytics:progress:${userId}`,
  ]);
}
