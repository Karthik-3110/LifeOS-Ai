import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Workspace } from "../models/Workspace.js";
import { ApiError } from "../utils/apiError.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOrCreateWorkspace } from "../services/workspaceService.js";

const AUTH_COOKIE_NAME = "lifeos_auth";
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  const secure = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/",
  };
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}

function clearAuthCookie(res) {
  const { maxAge, ...options } = getCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}

export const register = asyncHandler(async (req, res) => {
  const { name, password } = req.validated.body;
  const email = req.validated.body.email.trim().toLowerCase();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: passwordHash,
  });

  const workspace = await getOrCreateWorkspace(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: sanitizeUser(user, workspace),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { password } = req.validated.body;
  const email = req.validated.body.email.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const workspace = await getOrCreateWorkspace(user._id);
  const token = signToken({ userId: user._id });
  setAuthCookie(res, token);

  res.json({
    success: true,
    user: sanitizeUser(user, workspace),
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);

  res.json({
    success: true,
    message: "Successfully logged out",
  });
});

export const profile = asyncHandler(async (req, res) => {
  const workspace = req.user.activeWorkspace ? await Workspace.findById(req.user.activeWorkspace) : null;
  res.json({
    success: true,
    user: sanitizeUser(req.user, workspace),
  });
});

function sanitizeUser(user, workspace) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    activeWorkspace: workspace
      ? {
          id: workspace._id,
          name: workspace.name,
          description: workspace.description,
        }
      : null,
  };
}
