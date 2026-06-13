import { Goal } from "../models/Goal.js";
import { Node } from "../models/Node.js";
import { Edge } from "../models/Edge.js";
import { getOrCreateWorkspace } from "./workspaceService.js";
import { generateStructuredRoadmap } from "./groqService.js";

export async function createRoadmapFromInput({ userId, input, mode }) {
  const workspace = await getOrCreateWorkspace(userId);
  const roadmap = await generateStructuredRoadmap({ input, mode });

  const createdGoals = await Goal.insertMany(
    (roadmap.goals || []).map((goal) => ({
      user: userId,
      title: goal.title || "Untitled goal",
      description: goal.description || "",
      progress: clampProgress(goal.progress),
      dueDate: normalizeDueDate(goal.dueDate),
      source: mode === "youtube" ? "youtube" : "braindump",
    }))
  );

  const nodeIdMap = new Map();
  const createdNodes = [];
  for (const [index, item] of (roadmap.nodes || []).entries()) {
    const node = await Node.create({
      user: userId,
      workspace: workspace._id,
      type: normalizeNodeType(item.kind || item.type),
      title: item.title || "Untitled node",
      sub: item.sub || "",
      priority: normalizePriority(item.priority),
      position: normalizePosition(item.position, index),
      metadata: { source: mode },
    });

    nodeIdMap.set(item.id || `n${index + 1}`, node._id);
    createdNodes.push(node);
  }

  const createdEdges = [];
  for (const edge of roadmap.edges || []) {
    const sourceNode = nodeIdMap.get(edge.source);
    const targetNode = nodeIdMap.get(edge.target);
    if (!sourceNode || !targetNode) continue;

    const created = await Edge.create({
      user: userId,
      workspace: workspace._id,
      sourceNode,
      targetNode,
      label: edge.label || "",
      animated: edge.animated !== false,
    });
    createdEdges.push(created);
  }

  workspace.lastSavedAt = new Date();
  await workspace.save();

  return {
    workspace: {
      id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      lastSavedAt: workspace.lastSavedAt,
    },
    summary: roadmap.summary || "",
    goals: createdGoals.map(serializeGoal),
    nodes: createdNodes.map(serializeNode),
    edges: createdEdges.map(serializeEdge),
  };
}

function normalizeNodeType(value) {
  const normalized = String(value || "").toLowerCase();
  return ["goal", "task", "deadline", "resource"].includes(normalized) ? normalized : "task";
}

function normalizePriority(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "medium") return "med";
  return ["low", "med", "high"].includes(normalized) ? normalized : null;
}

function normalizePosition(position, index) {
  const x = Number(position?.x);
  const y = Number(position?.y);

  if (Number.isFinite(x) && Number.isFinite(y)) {
    return { x, y };
  }

  const column = index % 3;
  const row = Math.floor(index / 3);
  return { x: 180 + column * 280, y: 120 + row * 180 };
}

function clampProgress(value) {
  const progress = Number(value);
  if (!Number.isFinite(progress)) return 0;
  return Math.min(100, Math.max(0, progress));
}

function normalizeDueDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function serializeGoal(goal) {
  return {
    id: goal._id,
    title: goal.title,
    description: goal.description,
    status: goal.status,
    progress: goal.progress,
    dueDate: goal.dueDate,
    source: goal.source,
  };
}

function serializeNode(node) {
  return {
    id: node._id,
    type: node.type,
    title: node.title,
    sub: node.sub,
    priority: node.priority,
    status: node.status,
    position: node.position,
    metadata: node.metadata,
    updatedAt: node.updatedAt,
  };
}

function serializeEdge(edge) {
  return {
    id: edge._id,
    sourceNode: edge.sourceNode,
    targetNode: edge.targetNode,
    label: edge.label,
    animated: edge.animated,
  };
}
