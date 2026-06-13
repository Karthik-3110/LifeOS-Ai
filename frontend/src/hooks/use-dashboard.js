import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useDashboardData() {
  const stats = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.dashboard.stats().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  const recent = useQuery({
    queryKey: ["dashboard", "recent"],
    queryFn: () => api.dashboard.recent().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  const upcoming = useQuery({
    queryKey: ["dashboard", "upcoming"],
    queryFn: () => api.dashboard.upcoming().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  return { stats, recent, upcoming };
}
