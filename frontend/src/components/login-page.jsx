import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function LoginPage() {
  const { login, isAuthenticated, status } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, navigate]);

  const canSubmit = useMemo(
    () => formData.email.trim() && formData.password.length >= 1 && !submitting && status !== "loading",
    [formData.email, formData.password, status, submitting]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: formData.email.trim(), password: formData.password });
      toast.success("Signed in successfully");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to sign in");
      setErrors({ form: error.message || "Unable to sign in" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border bg-surface lg:block">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">LifeOS AI</span>
          </Link>
          <div>
            <p className="heading-display text-4xl text-balance">
              &quot;It&apos;s the first AI product that doesn&apos;t feel like a chatbot. It feels like a co-founder.&quot;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Priya N. - Solo builder</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6"
      >
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">LifeOS AI</span>
          </Link>
          <h1 className="heading-display text-3xl">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your second brain.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@work.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            {errors.form && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {errors.form}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms &amp; Privacy.
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground transition hover:text-foreground/80">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
