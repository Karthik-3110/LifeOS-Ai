import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useAnalyticsData() {
  const analytics = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => api.analytics.get().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  const progress = useQuery({
    queryKey: ["analytics", "progress"],
    queryFn: () => api.analytics.progress().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  const readiness = useQuery({
    queryKey: ["analytics", "readiness"],
    queryFn: () => api.analytics.readiness().then((response) => response.data),
    staleTime: 1000 * 60 * 5,
  });

  return { analytics, progress, readiness };
}
