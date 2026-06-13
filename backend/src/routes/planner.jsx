import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { usePlannerData, usePlannerMutations } from "@/hooks/use-planner";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  ssr: false,
  head: () => ({ meta: [{ title: "Planner - LifeOS AI" }] }),
  component: Planner,
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Planner() {
  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  }, []);

  const plannerQuery = usePlannerData(weekStart);
  const mutations = usePlannerMutations(weekStart);
  const [columns, setColumns] = useState(createEmptyColumns());
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    if (!plannerQuery.data) return;
    setColumns(normalizeColumns(plannerQuery.data));
  }, [plannerQuery.data]);

  const weekLabel = useMemo(() => {
    const start = new Date(weekStart);
    return start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }, [weekStart]);

  const persistDayOrder = (day, items) => {
    items.forEach((item, index) => {
      mutations.update.mutate({
        id: item._id,
        payload: {
          day,
          order: index,
          completed: item.completed,
          title: item.title,
          tag: item.tag,
          tone: item.tone,
        },
      });
    });
  };

  return (
    <ProtectedRoute>
      <AppShell title="Planner">
        <div className="mx-auto max-w-[1600px] space-y-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-end justify-between gap-3"
          >
            <div>
              <h2 className="heading-display text-3xl">Week of {weekLabel}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag tasks across the week. We&apos;ll re-balance the rest.
              </p>
            </div>
            <button
              onClick={() => {
                const title = window.prompt("Add a task title or type /ai to generate your week");
                if (!title) return;
                if (title.trim().toLowerCase() === "/ai") {
                  const prompt = window.prompt("Any instructions for the AI planner?");
                  mutations.generate.mutate({ prompt: prompt || "", weekStart });
                  return;
                }
                mutations.create.mutate({
                  weekStart,
                  day: "Monday",
                  title,
                  tone: "neutral",
                  order: columns.Monday.length,
                });
              }}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:bg-foreground/90"
            >
              <Plus className="h-4 w-4" /> Add task
            </button>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day, index) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="surface-card flex h-full min-h-[360px] flex-col p-4"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!dragging) return;
                  setColumns((current) => {
                    const sourceItems = current[dragging.day].filter((item) => item._id !== dragging.item._id);
                    const targetItems = [...current[day], { ...dragging.item, day }];
                    const next = { ...current, [dragging.day]: sourceItems, [day]: targetItems };
                    persistDayOrder(dragging.day, sourceItems);
                    persistDayOrder(day, targetItems);
                    return next;
                  });
                  setDragging(null);
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{day}</p>
                    <p className="text-sm font-semibold">{formatWeekDate(weekStart, index)}</p>
                  </div>
                  <span className="chip">{columns[day].length}</span>
                </div>

                <div className="flex-1 space-y-2">
                  {plannerQuery.isLoading ? (
                    Array.from({ length: 2 }).map((_, skeletonIndex) => (
                      <div key={skeletonIndex} className="h-16 animate-pulse rounded-lg bg-muted" />
                    ))
                  ) : (
                    columns[day].map((task) => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={() => setDragging({ day, item: task })}
                        onDoubleClick={() =>
                          mutations.update.mutate({
                            id: task._id,
                            payload: {
                              completed: !task.completed,
                              day,
                              order: columns[day].findIndex((item) => item._id === task._id),
                              title: task.title,
                              tag: task.tag,
                              tone: task.tone,
                            },
                          })
                        }
                        onContextMenu={(event) => {
                          event.preventDefault();
                          if (window.confirm(`Delete "${task.title}"?`)) {
                            mutations.remove.mutate(task._id);
                          }
                        }}
                        className={`group cursor-grab rounded-lg border border-border bg-background p-3 active:cursor-grabbing ${
                          task.completed ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60 opacity-0 transition group-hover:opacity-100" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  task.tone === "accent"
                                    ? "bg-accent"
                                    : task.tone === "warning"
                                      ? "bg-warning"
                                      : "bg-muted-foreground/40"
                                }`}
                              />
                              <p className="truncate text-sm font-medium">{task.title}</p>
                            </div>
                            {task.tag && <p className="mt-0.5 pl-3 text-[11px] text-muted-foreground">{task.tag}</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    const title = window.prompt(`Add a task for ${day}`);
                    if (!title) return;
                    mutations.create.mutate({
                      weekStart,
                      day,
                      title,
                      tone: "neutral",
                      order: columns[day].length,
                    });
                  }}
                  className="mt-3 flex items-center justify-center gap-1 rounded-md border border-dashed border-border py-1.5 text-xs text-muted-foreground transition hover:border-border-strong hover:text-foreground"
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Double-click a task to mark it complete. Right-click a task to delete it.
          </p>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}

function createEmptyColumns() {
  return DAYS.reduce((accumulator, day) => {
    accumulator[day] = [];
    return accumulator;
  }, {});
}

function normalizeColumns(items) {
  const columns = createEmptyColumns();
  items.forEach((item) => {
    columns[item.day].push(item);
  });
  return columns;
}

function formatWeekDate(weekStart, index) {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + index);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
