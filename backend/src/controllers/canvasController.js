import { Edge } from "../models/Edge.js";
import { Node } from "../models/Node.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOrCreateWorkspace } from "../services/workspaceService.js";
import { deleteCache } from "../cache/cacheService.js";
import { ApiError } from "../utils/apiError.js";

export const getCanvas = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);
  const [nodes, edges] = await Promise.all([
    Node.find({ user: req.user._id, workspace: workspace._id }).sort({ updatedAt: -1 }),
    Edge.find({ user: req.user._id, workspace: workspace._id }),
  ]);

  res.json({
    success: true,
    data: {
      workspace: {
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        lastSavedAt: workspace.lastSavedAt,
      },
      nodes: nodes.map(serializeNode),
      edges: edges.map(serializeEdge),
    },
  });
});

export const createNode = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);
  const node = await Node.create({
    user: req.user._id,
    workspace: workspace._id,
    type: req.validated.body.type,
    title: req.validated.body.title,
    sub: req.validated.body.sub || "",
    priority: req.validated.body.priority || null,
    position: req.validated.body.position,
    status: req.validated.body.status || "todo",
    metadata: req.validated.body.metadata || {},
  });

  workspace.lastSavedAt = new Date();
  await workspace.save();
  await invalidateCanvasCaches(req.user._id);

  res.status(201).json({ success: true, data: serializeNode(node) });
});

export const updateNode = asyncHandler(async (req, res) => {
  const node = await Node.findOneAndUpdate(
    { _id: req.validated.params.id, user: req.user._id },
    { ...req.validated.body, ...(req.validated.body.type ? { type: req.validated.body.type } : {}) },
    { new: true }
  );

  if (!node) {
    throw new ApiError(404, "Node not found");
  }

  await invalidateCanvasCaches(req.user._id);
  res.json({ success: true, data: serializeNode(node) });
});

export const deleteNode = asyncHandler(async (req, res) => {
  const node = await Node.findOneAndDelete({ _id: req.validated.params.id, user: req.user._id });
  if (!node) {
    throw new ApiError(404, "Node not found");
  }

  await Edge.deleteMany({
    user: req.user._id,
    $or: [{ sourceNode: node._id }, { targetNode: node._id }],
  });

  await invalidateCanvasCaches(req.user._id);
  res.json({ success: true, message: "Node deleted" });
});

export const connectNodes = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);
  const edge = await Edge.create({
    user: req.user._id,
    workspace: workspace._id,
    sourceNode: req.validated.body.sourceNode,
    targetNode: req.validated.body.targetNode,
    label: req.validated.body.label || "",
    animated: Boolean(req.validated.body.animated),
  });

  await invalidateCanvasCaches(req.user._id);
  res.status(201).json({ success: true, data: serializeEdge(edge) });
});

export const saveCanvas = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);
  const { nodes = [], edges = [] } = req.validated.body;

  for (const item of nodes) {
    if (item.id) {
      await Node.findOneAndUpdate(
        { _id: item.id, user: req.user._id },
        {
          type: item.type,
          title: item.title,
          sub: item.sub || "",
          priority: item.priority || null,
          position: item.position,
          status: item.status || "todo",
          metadata: item.metadata || {},
        },
        { upsert: false }
      );
    }
  }

  await Edge.deleteMany({ user: req.user._id, workspace: workspace._id });
  if (edges.length) {
    await Edge.insertMany(
      edges.map((edge) => ({
        user: req.user._id,
        workspace: workspace._id,
        sourceNode: edge.sourceNode,
        targetNode: edge.targetNode,
        label: edge.label || "",
        animated: Boolean(edge.animated),
      }))
    );
  }

  workspace.lastSavedAt = new Date();
  await workspace.save();
  await invalidateCanvasCaches(req.user._id);

  res.json({ success: true, message: "Workspace saved" });
});

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

async function invalidateCanvasCaches(userId) {
  await deleteCache([
    `dashboard:stats:${userId}`,
    `analytics:overview:${userId}`,
    `analytics:progress:${userId}`,
  ]);
}
