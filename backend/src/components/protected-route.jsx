import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();

  useEffect(() => {
    if (status === "anonymous") {
      router.navigate({ to: "/login" });
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface-card w-full max-w-md p-6 text-center">
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
