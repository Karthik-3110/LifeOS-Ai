import { Workspace } from "../models/Workspace.js";
import { User } from "../models/User.js";

export async function getOrCreateWorkspace(userId) {
  const user = await User.findById(userId);
  if (user?.activeWorkspace) {
    const existing = await Workspace.findById(user.activeWorkspace);
    if (existing) {
      return existing;
    }
  }

  const workspace = await Workspace.create({
    user: userId,
    name: "My Workspace",
    description: "Primary LifeOS workspace",
    lastSavedAt: new Date(),
  });

  if (user) {
    user.activeWorkspace = workspace._id;
    await user.save();
  }

  return workspace;
}
