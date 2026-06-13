import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Target,
  CheckCircle2,
  Clock,
  Zap,
  Plus,
  Network,
  CalendarRange,
  Sparkles,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { CardSkeleton } from "@/components/loading-skeleton";
import { useDashboardData } from "@/hooks/use-dashboard";
import { mergeRoadmapIntoCanvas } from "@/hooks/use-canvas";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/services/api";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard - LifeOS AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { stats, recent, upcoming } = useDashboardData();

  const createGoal = useMutation({
    mutationFn: (payload) => api.goals.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Goal created");
    },
    onError: (error) => toast.error(error.message),
  });

  const brainDump = useMutation({
    mutationFn: (payload) => api.ai.brainDump(payload),
    onSuccess: async (response) => {
      mergeRoadmapIntoCanvas(queryClient, response.data);
      await queryClient.invalidateQueries();
      toast.success("Roadmap generated and saved to your canvas");
      navigate({ to: "/canvas" });
    },
    onError: (error) => toast.error(error.message),
  });

  const statsData = stats.data || {
    totalGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    readinessScore: 0,
  };

  const cards = [
    {
      label: "Total goals",
      value: statsData.totalGoals,
      delta: "Tracked in MongoDB",
      icon: Target,
    },
    {
      label: "Total tasks",
      value: statsData.totalTasks,
      delta: "Across your workspace",
      icon: Clock,
    },
    {
      label: "Completed tasks",
      value: statsData.completedTasks,
      delta: "Execution momentum",
      icon: CheckCircle2,
    },
    {
      label: "Readiness score",
      value: statsData.readinessScore,
      delta: "Updated automatically",
      icon: Zap,
    },
  ];

  const recentGoals = recent.data || [];
  const upcomingItems = upcoming.data || [];

  return (
    <ProtectedRoute>
      <AppShell title="Dashboard">
        <div className="mx-auto max-w-7xl space-y-8 p-6">
          {stats.isLoading || recent.isLoading || upcoming.isLoading ? (
            <CardSkeleton count={4} />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-end justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground">
                    Good morning, {user?.name?.split(" ")[0] || "Alex"}.
                  </p>
                  <h2 className="heading-display mt-1 text-3xl">
                    Here&apos;s what&apos;s on your plate.
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const title = window.prompt("New goal title");
                      if (!title) return;
                      const dueDate = window.prompt("Optional due date (YYYY-MM-DD)");
                      createGoal.mutate({
                        title,
                        dueDate: dueDate || null,
                        progress: 0,
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-border-strong"
                  >
                    <Plus className="h-4 w-4" /> New goal
                  </button>
                  <button
                    disabled={brainDump.isPending}
                    onClick={() => {
                      const prompt = window.prompt("Describe your goals and projects");
                      if (!prompt) return;
                      brainDump.mutate({ prompt });
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" />{" "}
                    {brainDump.isPending ? "Thinking..." : "Brain dump"}
                  </button>
                </div>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className="surface-card hover-lift p-5"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <card.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight">{card.value}</p>
                    <p className="mt-1 text-xs text-accent">{card.delta}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="surface-card p-6 lg:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Recent goals</h3>
                    <Link
                      to="/canvas"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Open canvas <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  {recent.isLoading ? (
                    <div className="mt-5 space-y-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
                      ))}
                    </div>
                  ) : recentGoals.length ? (
                    <ul className="mt-5 divide-y divide-border">
                      {recentGoals.map((goal, index) => (
                        <li key={goal.id} className="flex items-center gap-4 py-3">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{goal.title}</p>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress || 0}%` }}
                                transition={{
                                  duration: 0.9,
                                  delay: 0.3 + index * 0.08,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full rounded-full bg-foreground"
                              />
                            </div>
                          </div>
                          <span className="hidden w-12 text-right text-xs tabular-nums text-muted-foreground sm:inline">
                            {goal.progress || 0}%
                          </span>
                          <span className="hidden w-20 text-right text-xs text-muted-foreground md:inline">
                            {goal.due ? new Date(goal.due).toLocaleDateString() : "No due date"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-5 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                      No goals yet. Use{" "}
                      <span className="font-medium text-foreground">New goal</span> or{" "}
                      <span className="font-medium text-foreground">Brain dump</span> to get
                      started.
                    </div>
                  )}
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="surface-card p-6"
                >
                  <h3 className="text-base font-semibold">Upcoming</h3>
                  <div className="mt-5 space-y-5">
                    {upcoming.isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-10 animate-pulse rounded-lg bg-muted" />
                      ))
                    ) : upcomingItems.length ? (
                      upcomingItems.map((item) => (
                        <div key={item.id}>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {item.day}
                          </p>
                          <ul className="mt-2 space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                              {item.title}
                            </li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No upcoming tasks scheduled yet.
                      </p>
                    )}
                  </div>
                </motion.section>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid gap-4 sm:grid-cols-3"
              >
                {[
                  {
                    icon: Network,
                    title: "Open infinite canvas",
                    desc: "Map a new goal visually.",
                    to: "/canvas",
                  },
                  {
                    icon: CalendarRange,
                    title: "Plan your week",
                    desc: "Drag tasks across days.",
                    to: "/planner",
                  },
                  {
                    icon: Sparkles,
                    title: "Ask LifeOS AI",
                    desc: "Get a roadmap in seconds.",
                    to: "/canvas",
                  },
                ].map((quick) => (
                  <Link
                    key={quick.title}
                    to={quick.to}
                    className="surface-card hover-lift group flex items-center gap-4 p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                      <quick.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{quick.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{quick.desc}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </Link>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
