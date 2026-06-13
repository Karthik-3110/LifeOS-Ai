const API_URL = import.meta.env.VITE_API_URL || "/api";

export function clearAllSessionStorage() {
  if (typeof window === "undefined") return;
  window.sessionStorage.clear();
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || "Request failed");
    error.status = response.status;
    error.details = payload.details || null;
    if (response.status === 401 && typeof window !== "undefined" && !options.suppressUnauthorizedEvent) {
      window.dispatchEvent(new CustomEvent("lifeos:invalid-token"));
    }
    throw error;
  }

  return payload;
}

export const api = {
  auth: {
    register: (body) => apiRequest("/auth/register", { method: "POST", body }),
    login: (body) => apiRequest("/auth/login", { method: "POST", body }),
    logout: () => apiRequest("/auth/logout", { method: "POST" }),
    profile: (options = {}) => apiRequest("/auth/profile", options),
  },
  dashboard: {
    stats: () => apiRequest("/dashboard/stats"),
    recent: () => apiRequest("/dashboard/recent"),
    upcoming: () => apiRequest("/dashboard/upcoming"),
  },
  canvas: {
    get: () => apiRequest("/canvas"),
    createNode: (body) => apiRequest("/canvas/node", { method: "POST", body }),
    updateNode: (id, body) => apiRequest(`/canvas/node/${id}`, { method: "PUT", body }),
    deleteNode: (id) => apiRequest(`/canvas/node/${id}`, { method: "DELETE" }),
    connect: (body) => apiRequest("/canvas/connect", { method: "POST", body }),
    save: (body) => apiRequest("/canvas/save", { method: "POST", body }),
  },
  ai: {
    brainDump: (body) => apiRequest("/ai/braindump", { method: "POST", body }),
    youtubeRoadmap: (body) => apiRequest("/ai/youtube-roadmap", { method: "POST", body }),
  },
  planner: {
    get: (weekStart) => apiRequest(`/planner${weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : ""}`),
    create: (body) => apiRequest("/planner", { method: "POST", body }),
    update: (id, body) => apiRequest(`/planner/${id}`, { method: "PUT", body }),
    remove: (id) => apiRequest(`/planner/${id}`, { method: "DELETE" }),
    generate: (body) => apiRequest("/planner/generate", { method: "POST", body }),
  },
  analytics: {
    get: () => apiRequest("/analytics"),
    progress: () => apiRequest("/analytics/progress"),
    readiness: () => apiRequest("/analytics/readiness"),
  },
  settings: {
    updateProfile: (body) => apiRequest("/settings/profile", { method: "PUT", body }),
    changePassword: (body) => apiRequest("/settings/password", { method: "PUT", body }),
    deleteAccount: () => apiRequest("/settings/account", { method: "DELETE" }),
    exportWorkspace: () => apiRequest("/settings/export", { method: "POST" }),
    resetWorkspace: () => apiRequest("/settings/reset-workspace", { method: "POST" }),
  },
  goals: {
    list: () => apiRequest("/goals"),
    create: (body) => apiRequest("/goals", { method: "POST", body }),
    update: (id, body) => apiRequest(`/goals/${id}`, { method: "PUT", body }),
    remove: (id) => apiRequest(`/goals/${id}`, { method: "DELETE" }),
  },
};
