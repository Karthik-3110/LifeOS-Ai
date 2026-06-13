import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Network,
  CalendarRange,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/canvas", label: "Canvas", icon: Network },
  { to: "/planner", label: "Planner", icon: CalendarRange },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppShell({ children, title }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const initials = useMemo(() => {
    const parts = (user?.name || "Alex").trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "A";
  }, [user?.name]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-border bg-sidebar md:flex md:flex-col"
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-foreground text-background">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          {!collapsed && <span className="truncate text-[15px] font-semibold tracking-tight">LifeOS AI</span>}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-foreground"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed((current) => !current)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          {title && <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>}
          <div className="ml-auto flex flex-1 items-center justify-end gap-2">
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search goals, tasks, nodes..."
                className="w-full rounded-md border border-border bg-surface py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <button
              onClick={() => toast.message("No new notifications")}
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1 text-sm transition hover:border-border-strong"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-foreground/80 to-foreground/40 text-[10px] font-semibold text-background">
                  {initials}
                </div>
                <span className="hidden sm:inline">{user?.name || "Alex"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 min-w-48 rounded-lg border border-border bg-background p-1 shadow-elevated">
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-secondary"
                  >
                    Profile settings
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition hover:bg-secondary"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur md:hidden">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
