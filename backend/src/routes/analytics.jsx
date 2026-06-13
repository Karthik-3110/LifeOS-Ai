import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/protected-route";
import { useAnalyticsData } from "@/hooks/use-analytics";

export const Route = createFileRoute("/analytics")({
  ssr: false,
  head: () => ({ meta: [{ title: "Analytics - LifeOS AI" }] }),
  component: Analytics,
});

const card = "surface-card p-6";

function Analytics() {
  const { analytics, progress, readiness } = useAnalyticsData();
  const completion = analytics.data?.completion || [];
  const weekly = analytics.data?.weekly || [];
  const readinessChart = analytics.data?.readiness || [{ name: "Score", value: 0, fill: "oklch(0.72 0.18 145)" }];
  const heat = analytics.data?.heat || [];
  const readinessDetail = readiness.data || analytics.data?.readinessDetail || { score: 0, recommendations: [] };
  const progressData = progress.data || { goalCompletionPercent: 0 };

  return (
    <ProtectedRoute>
      <AppShell title="Analytics">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="heading-display text-3xl">Your momentum, in numbers.</h2>
            <p className="mt-1 text-sm text-muted-foreground">Last 6 months across goals, tasks, and focus.</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`${card} lg:col-span-2`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Goal completion</p>
                  <p className="mt-1 text-3xl font-semibold">{progressData.goalCompletionPercent}%</p>
                </div>
                <span className="chip text-accent">Live data</span>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer>
                  <AreaChart data={completion}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.92 0.004 256)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="oklch(0.55 0.015 257)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.55 0.015 257)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.004 256)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="value" stroke="oklch(0.205 0.018 264)" strokeWidth={2} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={card}
            >
              <p className="text-sm text-muted-foreground">Readiness score</p>
              <div className="mt-2 h-56">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={readinessChart} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" background={{ fill: "oklch(0.92 0.004 256)" }} cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="-mt-32 text-center">
                <p className="text-4xl font-semibold">{readinessDetail.score || 0}</p>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
              <p className="mt-28 text-center text-xs text-muted-foreground">
                {readinessDetail.recommendations?.[0] || "You're ready for your next milestone."}
              </p>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${card} lg:col-span-2`}
            >
              <p className="text-sm text-muted-foreground">Weekly progress</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer>
                  <BarChart data={weekly}>
                    <CartesianGrid stroke="oklch(0.92 0.004 256)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" stroke="oklch(0.55 0.015 257)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.55 0.015 257)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.004 256)", fontSize: 12 }} />
                    <Bar dataKey="planned" fill="oklch(0.92 0.004 256)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="done" fill="oklch(0.205 0.018 264)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={card}
            >
              <p className="text-sm text-muted-foreground">Deadline heatmap</p>
              <p className="mt-1 text-xs text-muted-foreground">12 weeks - density of due items</p>
              <div className="mt-5 grid grid-cols-12 gap-1.5">
                {heat.map((cell, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.008 }}
                    className="aspect-square rounded-[3px]"
                    style={{
                      backgroundColor:
                        cell.v === 0
                          ? "oklch(0.95 0.004 256)"
                          : `oklch(0.72 0.18 145 / ${0.2 + cell.v * 0.18})`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                less
                {[0.2, 0.4, 0.6, 0.8].map((opacity, index) => (
                  <span
                    key={index}
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ backgroundColor: `oklch(0.72 0.18 145 / ${opacity})` }}
                  />
                ))}
                more
              </div>
            </motion.div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
