import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useSettingsMutations } from "@/hooks/use-settings";
import { toast } from "sonner";
import { clearAllSessionStorage } from "@/services/api";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings - LifeOS AI" }] }),
  component: Settings,
});

const sections = ["Profile", "Workspace", "Notifications", "Billing", "Integrations"];

function Settings() {
  const { user, refreshProfile, logout } = useAuth();
  const queryClient = useQueryClient();
  const mutations = useSettingsMutations();
  const [active, setActive] = useState("Profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    workspace: "",
    dsaProgress: 0,
    projectCount: 0,
    resumeStatus: "not_started",
    aptitudeStatus: "not_started",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: user?.name || "",
      email: user?.email || "",
      workspace: user?.activeWorkspace?.name || "My Workspace",
      dsaProgress: user?.profile?.dsaProgress || 0,
      projectCount: user?.profile?.projectCount || 0,
      resumeStatus: user?.profile?.resumeStatus || "not_started",
      aptitudeStatus: user?.profile?.aptitudeStatus || "not_started",
    }));
  }, [user]);

  const saveSection = async () => {
    if (active === "Profile") {
      await mutations.updateProfile.mutateAsync({
        name: form.name,
        email: form.email,
        dsaProgress: form.dsaProgress,
        projectCount: form.projectCount,
        resumeStatus: form.resumeStatus,
        aptitudeStatus: form.aptitudeStatus,
      });
      await refreshProfile();
      return;
    }

    if (active === "Workspace") {
      await mutations.updateProfile.mutateAsync({
        name: form.name,
        email: form.email,
        dsaProgress: Number(form.dsaProgress),
        projectCount: Number(form.projectCount),
        resumeStatus: form.resumeStatus,
        aptitudeStatus: form.aptitudeStatus,
      });
      await refreshProfile();
      return;
    }

    if (active === "Notifications") {
      await mutations.updateProfile.mutateAsync({
        name: form.name,
        email: form.email,
        dsaProgress: Number(form.dsaProgress),
        projectCount: Number(form.projectCount),
        resumeStatus: form.resumeStatus,
        aptitudeStatus: form.aptitudeStatus,
      });
      await refreshProfile();
      return;
    }

    if (active === "Billing") {
      if (!form.currentPassword || !form.newPassword) {
        toast.error("Enter both current and new password");
        return;
      }
      await mutations.changePassword.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm((current) => ({ ...current, currentPassword: "", newPassword: "" }));
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Settings">
        <div className="mx-auto grid max-w-5xl gap-8 p-6 md:grid-cols-[200px_1fr]">
          <aside>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActive(section)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    active === section
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {section}
                </button>
              ))}
            </nav>
          </aside>

          <motion.section
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="surface-card p-6"
          >
            <h2 className="text-lg font-semibold">{active}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage your {active.toLowerCase()} preferences.</p>

            <div className="mt-6 space-y-5">
              {active === "Profile" && (
                <>
                  <Field label="Full name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
                  <Field label="Email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
                  <Field
                    label="Workspace"
                    value={form.workspace}
                    onChange={(value) => setForm((current) => ({ ...current, workspace: value }))}
                    disabled
                  />
                </>
              )}

              {active === "Workspace" && (
                <>
                  <Field
                    label="Workspace"
                    value={form.workspace}
                    onChange={(value) => setForm((current) => ({ ...current, workspace: value }))}
                    disabled
                  />
                  <Field
                    label="DSA progress"
                    value={String(form.dsaProgress)}
                    onChange={(value) => setForm((current) => ({ ...current, dsaProgress: Number(value) || 0 }))}
                  />
                  <Field
                    label="Project count"
                    value={String(form.projectCount)}
                    onChange={(value) => setForm((current) => ({ ...current, projectCount: Number(value) || 0 }))}
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => mutations.exportWorkspace.mutate()}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                    >
                      Export workspace
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Reset your workspace? This clears goals, planner items, and canvas data.")) {
                          mutations.resetWorkspace.mutate();
                        }
                      }}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                    >
                      Reset workspace
                    </button>
                  </div>
                </>
              )}

              {active === "Notifications" && (
                <>
                  <SelectField
                    label="Resume status"
                    value={form.resumeStatus}
                    onChange={(value) => setForm((current) => ({ ...current, resumeStatus: value }))}
                  />
                  <SelectField
                    label="Aptitude status"
                    value={form.aptitudeStatus}
                    onChange={(value) => setForm((current) => ({ ...current, aptitudeStatus: value }))}
                  />
                  <Field
                    label="Workspace"
                    value={form.workspace}
                    onChange={(value) => setForm((current) => ({ ...current, workspace: value }))}
                    disabled
                  />
                </>
              )}

              {active === "Billing" && (
                <>
                  <Field
                    label="Current password"
                    value={form.currentPassword}
                    onChange={(value) => setForm((current) => ({ ...current, currentPassword: value }))}
                    type="password"
                  />
                  <Field
                    label="New password"
                    value={form.newPassword}
                    onChange={(value) => setForm((current) => ({ ...current, newPassword: value }))}
                    type="password"
                  />
                  <Field label="Workspace" value={form.workspace} onChange={() => {}} disabled />
                </>
              )}

              {active === "Integrations" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm font-medium">Account actions</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Export your data, sign out safely, or permanently delete your account.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => mutations.exportWorkspace.mutate()}
                        className="rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                      >
                        Export workspace
                      </button>
                      <button
                        onClick={() => logout()}
                        className="rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                      >
                        Logout
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete your account permanently?")) return;
                          await mutations.deleteAccount.mutateAsync();
                          clearAllSessionStorage();
                          await queryClient.clear();
                          toast.success("Account deleted successfully");
                          window.location.assign("/auth");
                        }}
                        className="rounded-md bg-destructive px-3 py-2 text-sm font-medium text-white"
                      >
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {active !== "Integrations" && (
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => refreshProfile()}
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSection}
                    className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:bg-foreground/90"
                  >
                    Save changes
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-70"
      />
    </label>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        <option value="not_started">Not started</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </label>
  );
}
