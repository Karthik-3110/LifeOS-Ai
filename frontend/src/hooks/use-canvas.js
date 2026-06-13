import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";

export function useCanvasData() {
  return useQuery({
    queryKey: ["canvas"],
    queryFn: () => api.canvas.get().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCanvasMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["canvas"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  return {
    createNode: useMutation({
      mutationFn: (payload) => api.canvas.createNode(payload).then((response) => response.data),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    updateNode: useMutation({
      mutationFn: ({ id, payload }) =>
        api.canvas.updateNode(id, payload).then((response) => response.data),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    deleteNode: useMutation({
      mutationFn: (id) => api.canvas.deleteNode(id),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    connect: useMutation({
      mutationFn: (payload) => api.canvas.connect(payload).then((response) => response.data),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    save: useMutation({
      mutationFn: (payload) => api.canvas.save(payload),
      onError: (error) => toast.error(error.message),
    }),
    brainDump: useMutation({
      mutationFn: (payload) => api.ai.brainDump(payload).then((response) => response.data),
      onSuccess: (roadmap) => {
        mergeRoadmapIntoCanvas(queryClient, roadmap);
        invalidate();
        toast.success("Roadmap generated");
      },
      onError: (error) => toast.error(error.message),
    }),
    youtubeRoadmap: useMutation({
      mutationFn: (payload) => api.ai.youtubeRoadmap(payload).then((response) => response.data),
      onSuccess: (roadmap) => {
        mergeRoadmapIntoCanvas(queryClient, roadmap);
        invalidate();
        toast.success("YouTube roadmap generated");
      },
      onError: (error) => toast.error(error.message),
    }),
  };
}

export function mergeRoadmapIntoCanvas(queryClient, roadmap) {
  if (!roadmap?.nodes?.length && !roadmap?.edges?.length) return;

  queryClient.setQueryData(["canvas"], (current) => {
    const nodesById = new Map((current?.nodes || []).map((node) => [String(node.id), node]));
    const edgesById = new Map((current?.edges || []).map((edge) => [String(edge.id), edge]));

    for (const node of roadmap.nodes || []) {
      nodesById.set(String(node.id), node);
    }

    for (const edge of roadmap.edges || []) {
      edgesById.set(String(edge.id), edge);
    }

    return {
      workspace: roadmap.workspace || current?.workspace || null,
      nodes: Array.from(nodesById.values()),
      edges: Array.from(edgesById.values()),
    };
  });
}
