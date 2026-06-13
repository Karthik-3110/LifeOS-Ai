import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckSquare,
  Calendar,
  BookOpen,
  Sparkles,
  Send,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { useCanvasData, useCanvasMutations } from "@/hooks/use-canvas";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export const Route = createFileRoute("/canvas")({
  ssr: false,
  head: () => ({ meta: [{ title: "Canvas - LifeOS AI" }] }),
  component: CanvasPage,
});

const NODE_META = {
  goal: { icon: Target, tone: "bg-accent", label: "Goal" },
  task: { icon: CheckSquare, tone: "bg-foreground/50", label: "Task" },
  deadline: { icon: Calendar, tone: "bg-destructive", label: "Deadline" },
  resource: { icon: BookOpen, tone: "bg-warning", label: "Resource" },
};

function LifeNode({ data }) {
  const meta = NODE_META[data.kind];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="surface-card group min-w-[200px] p-3 transition hover:shadow-float"
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-border !bg-background" />
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 grid h-7 w-7 place-items-center rounded-md ${meta.tone} text-background`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{data.title}</p>
            {data.priority && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  data.priority === "high"
                    ? "bg-destructive/10 text-destructive"
                    : data.priority === "med"
                      ? "bg-warning/15 text-warning"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {data.priority}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{data.sub || meta.label}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-border !bg-background" />
    </motion.div>
  );
}

const nodeTypes = { life: LifeNode };

function CanvasPage() {
  const canvasQuery = useCanvasData();
  const mutations = useCanvasMutations();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [assistantInput, setAssistantInput] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const debouncedCanvas = useDebouncedValue(JSON.stringify({ nodes, edges }), 900);

  useEffect(() => {
    if (!canvasQuery.data) return;
    setNodes(canvasQuery.data.nodes.map(toReactFlowNode));
    setEdges(canvasQuery.data.edges.map(toReactFlowEdge));
    setCanvasReady(true);
  }, [canvasQuery.data]);

  useEffect(() => {
    if (!canvasReady || canvasQuery.isLoading) return;
    if (!nodes.length && !edges.length) return;

    const parsed = JSON.parse(debouncedCanvas);
    mutations.save.mutate({
      nodes: parsed.nodes.map((node) => ({
        id: node.id,
        type: node.data.kind,
        title: node.data.title,
        sub: node.data.sub,
        priority: node.data.priority || null,
        position: node.position,
        status: node.data.status || "todo",
        metadata: node.data.metadata || {},
      })),
      edges: parsed.edges.map((edge) => ({
        sourceNode: edge.source,
        targetNode: edge.target,
        label: edge.label || "",
        animated: Boolean(edge.animated),
      })),
    });
  }, [canvasReady, canvasQuery.isLoading, debouncedCanvas]);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!selectedNodeId) return;

      if (event.key === "Delete") {
        setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
        setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
        mutations.deleteNode.mutate(selectedNodeId);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        const node = nodes.find((item) => item.id === selectedNodeId);
        if (!node) return;
        const duplicated = await mutations.createNode.mutateAsync({
          type: node.data.kind,
          title: `${node.data.title} copy`,
          sub: node.data.sub,
          priority: node.data.priority || null,
          position: { x: node.position.x + 40, y: node.position.y + 40 },
          status: node.data.status || "todo",
          metadata: node.data.metadata || {},
        });
        setNodes((current) => [...current, toReactFlowNode(duplicated)]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mutations.createNode, mutations.deleteNode, nodes, selectedNodeId]);

  const quickActions = useMemo(
    () => ["Generate roadmap", "Find conflicts", "Score readiness", "YouTube roadmap"],
    []
  );

  return (
    <ProtectedRoute>
      <AppShell title="Canvas">
        <div className="relative flex h-[calc(100vh-4rem)] w-full">
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            {Object.keys(NODE_META).map((kind) => {
              const Icon = NODE_META[kind].icon;
              return (
                <button
                  key={kind}
                  onClick={async () => {
                    const created = await mutations.createNode.mutateAsync({
                      type: kind,
                      title: `New ${NODE_META[kind].label.toLowerCase()}`,
                      sub: NODE_META[kind].label,
                      position: { x: 200 + Math.random() * 300, y: 120 + Math.random() * 300 },
                    });
                    setNodes((current) => [...current, toReactFlowNode(created)]);
                  }}
                  className="surface-card hover-lift group flex items-center gap-2 px-3 py-2 text-xs font-medium"
                  title={`Add ${NODE_META[kind].label}`}
                >
                  <span className={`grid h-5 w-5 place-items-center rounded ${NODE_META[kind].tone} text-background`}>
                    <Icon className="h-3 w-3" />
                  </span>
                  {NODE_META[kind].label}
                  <Plus className="h-3 w-3 text-muted-foreground transition group-hover:text-foreground" />
                </button>
              );
            })}
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => setNodes((current) => applyNodeChanges(changes, current))}
            onEdgesChange={(changes) => setEdges((current) => applyEdgeChanges(changes, current))}
            onConnect={async (params) => {
              setEdges((current) => addEdge({ ...params, animated: true }, current));
              if (params.source && params.target) {
                await mutations.connect.mutateAsync({
                  sourceNode: params.source,
                  targetNode: params.target,
                  animated: true,
                });
              }
            }}
            onNodeDoubleClick={(_event, node) => {
              const title = window.prompt("Edit node title", node.data.title);
              if (!title) return;
              const sub = window.prompt("Edit node subtitle", node.data.sub || "") ?? node.data.sub;
              const priority = window.prompt("Priority: low, med, high", node.data.priority || "") || null;
              setNodes((current) =>
                current.map((item) =>
                  item.id === node.id
                    ? {
                        ...item,
                        data: {
                          ...item.data,
                          title,
                          sub,
                          priority,
                        },
                      }
                    : item
                )
              );
              mutations.updateNode.mutate({
                id: node.id,
                payload: {
                  title,
                  sub,
                  priority,
                  position: node.position,
                  status: node.data.status || "todo",
                  metadata: node.data.metadata || {},
                },
              });
            }}
            onSelectionChange={({ nodes: selectedNodes }) => {
              setSelectedNodeId(selectedNodes[0]?.id || null);
            }}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={["Delete", "Backspace"]}
            defaultEdgeOptions={{
              style: { stroke: "oklch(0.72 0.18 145 / 0.7)", strokeWidth: 1.5 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="oklch(0.205 0.018 264 / 0.12)" />
            <Controls className="!rounded-lg !border !border-border !bg-surface !shadow-soft" showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              className="!rounded-lg !border !border-border !bg-surface"
              nodeColor={() => "oklch(0.205 0.018 264 / 0.6)"}
              maskColor="oklch(0.987 0.003 95 / 0.85)"
            />
          </ReactFlow>

          <AnimatePresence>
            {assistantOpen && (
              <motion.aside
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-4 top-4 z-10 flex h-[calc(100%-2rem)] w-80 flex-col surface-elevated"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">LifeOS Assistant</p>
                      <p className="text-[11px] text-muted-foreground">Always on this canvas</p>
                    </div>
                  </div>
                  <button onClick={() => setAssistantOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
                    Close
                  </button>
                </div>
                <div className="flex-1 space-y-3 overflow-auto p-4">
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    Ask for a roadmap, paste a YouTube URL, or refine the nodes already on your board.
                  </div>
                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                    Autosave {mutations.save.isPending ? "running..." : "enabled"}
                  </div>
                  {canvasQuery.isLoading && <div className="rounded-lg bg-muted px-3 py-2 text-sm">Loading your workspace...</div>}
                </div>
                <div className="border-t border-border p-3">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {quickActions.map((label) => (
                      <button
                        key={label}
                        onClick={() => setAssistantInput(label === "YouTube roadmap" ? "https://www.youtube.com/" : label)}
                        className="chip transition hover:border-border-strong hover:text-foreground"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5">
                    <input
                      value={assistantInput}
                      onChange={(event) => setAssistantInput(event.target.value)}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        if (!assistantInput.trim()) {
                          toast.error("Enter a prompt or YouTube URL");
                          return;
                        }

                        if (assistantInput.includes("youtube.com") || assistantInput.includes("youtu.be")) {
                          await mutations.youtubeRoadmap.mutateAsync({ youtubeUrl: assistantInput.trim() });
                        } else {
                          await mutations.brainDump.mutateAsync({ prompt: assistantInput.trim() });
                        }
                        setAssistantInput("");
                      }}
                      className="grid h-7 w-7 place-items-center rounded bg-foreground text-background"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
          {!assistantOpen && (
            <button
              onClick={() => setAssistantOpen(true)}
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm text-background shadow-elevated"
            >
              <Sparkles className="h-3.5 w-3.5" /> Assistant
            </button>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function toReactFlowNode(node) {
  return {
    id: String(node.id),
    type: "life",
    position: node.position,
    data: {
      kind: node.type,
      title: node.title,
      sub: node.sub,
      priority: node.priority,
      status: node.status,
      metadata: node.metadata,
    },
  };
}

function toReactFlowEdge(edge) {
  return {
    id: String(edge.id),
    source: String(edge.sourceNode),
    target: String(edge.targetNode),
    animated: edge.animated,
    label: edge.label,
  };
}
