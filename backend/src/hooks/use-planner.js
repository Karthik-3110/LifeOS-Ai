import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";

export function usePlannerData(weekStart) {
  return useQuery({
    queryKey: ["planner", weekStart],
    queryFn: () => api.planner.get(weekStart).then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePlannerMutations(weekStart) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["planner", weekStart] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  return {
    create: useMutation({
      mutationFn: (payload) => api.planner.create(payload).then((response) => response.data),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }) => api.planner.update(id, payload).then((response) => response.data),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    remove: useMutation({
      mutationFn: (id) => api.planner.remove(id),
      onSuccess: invalidate,
      onError: (error) => toast.error(error.message),
    }),
    generate: useMutation({
      mutationFn: (payload) => api.planner.generate(payload).then((response) => response.data),
      onSuccess: () => {
        invalidate();
        toast.success("Weekly plan generated");
      },
      onError: (error) => toast.error(error.message),
    }),
  };
}
