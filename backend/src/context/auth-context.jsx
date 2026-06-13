import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, clearAllSessionStorage } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [sessionOverride, setSessionOverride] = useState(null);

  const profileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => api.auth.profile({ suppressUnauthorizedEvent: true }),
    retry: false,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleInvalidToken = async () => {
      clearAllSessionStorage();
      await queryClient.clear();
      setSessionOverride("anonymous");
      toast.error("Your session expired. Please sign in again.");
      if (!["/auth", "/login", "/signup"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    };

    window.addEventListener("lifeos:invalid-token", handleInvalidToken);
    return () => {
      window.removeEventListener("lifeos:invalid-token", handleInvalidToken);
    };
  }, [queryClient]);

  const user = profileQuery.data?.user || null;
  const status =
    sessionOverride === "anonymous"
      ? "anonymous"
      : profileQuery.isPending
      ? "loading"
      : user
      ? "authenticated"
      : "anonymous";

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      async login(credentials) {
        const response = await api.auth.login(credentials);
        setSessionOverride(null);
        queryClient.setQueryData(["auth", "profile"], {
          success: true,
          user: response.user,
        });
        await queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
        return response.user;
      },
      async register(payload) {
        const response = await api.auth.register(payload);
        return response;
      },
      async refreshProfile() {
        const response = await api.auth.profile();
        setSessionOverride(null);
        queryClient.setQueryData(["auth", "profile"], response);
        return response.user;
      },
      async logout() {
        try {
          await api.auth.logout();
        } catch {
          // Ignore logout API errors during local cleanup.
        }
        clearAllSessionStorage();
        await queryClient.clear();
        setSessionOverride("anonymous");
        toast.success("Successfully logged out");
        window.location.assign("/login");
      },
    }),
    [queryClient, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
