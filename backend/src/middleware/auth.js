import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { verifyToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AUTH_COOKIE_NAME = "lifeos_auth";

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  return cookieHeader.split(";").reduce((match, cookie) => {
    if (match) return match;
    const [rawKey, ...rawValue] = cookie.trim().split("=");
    if (rawKey !== name) return null;
    return decodeURIComponent(rawValue.join("="));
  }, null);
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = getCookie(req, AUTH_COOKIE_NAME) || bearerToken;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.userId).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  req.token = token;
  next();
});
