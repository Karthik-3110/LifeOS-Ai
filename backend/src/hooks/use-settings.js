import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";

export function useSettingsMutations() {
  const queryClient = useQueryClient();

  return {
    updateProfile: useMutation({
      mutationFn: (payload) => api.settings.updateProfile(payload),
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        toast.success("Profile updated");
      },
      onError: (error) => toast.error(error.message),
    }),
    changePassword: useMutation({
      mutationFn: (payload) => api.settings.changePassword(payload),
      onSuccess: () => toast.success("Password updated"),
      onError: (error) => toast.error(error.message),
    }),
    exportWorkspace: useMutation({
      mutationFn: () => api.settings.exportWorkspace(),
      onSuccess: (response) => {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "lifeos-workspace-export.json";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Workspace exported");
      },
      onError: (error) => toast.error(error.message),
    }),
    resetWorkspace: useMutation({
      mutationFn: () => api.settings.resetWorkspace(),
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        toast.success("Workspace reset");
      },
      onError: (error) => toast.error(error.message),
    }),
    deleteAccount: useMutation({
      mutationFn: () => api.settings.deleteAccount(),
      onError: (error) => toast.error(error.message),
    }),
  };
}
