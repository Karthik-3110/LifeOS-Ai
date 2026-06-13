import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, X, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign up - LifeOS AI" }] }),
  component: SignUp,
});

function validatePassword(password) {
  return {
    length: password.length >= 6,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

function SignUp() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, navigate]);

  const passwordValidations = useMemo(() => validatePassword(formData.password), [formData.password]);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const formIsValid =
    formData.name.trim().length >= 2 &&
    emailIsValid &&
    passwordValidations.length &&
    passwordValidations.specialChar &&
    passwordsMatch;

  const validateForm = (nextFormData) => {
    const nextErrors = {};

    if (nextFormData.name && nextFormData.name.trim().length < 2) {
      nextErrors.name = "Full name must be at least 2 characters";
    }
    if (nextFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextFormData.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    const validations = validatePassword(nextFormData.password);
    if (nextFormData.password) {
      nextErrors.password = {
        length: !validations.length ? "Password must be at least 6 characters long" : "",
        specialChar: !validations.specialChar ? "Password must contain at least 1 special character" : "",
      };
      if (!nextErrors.password.length && !nextErrors.password.specialChar) {
        delete nextErrors.password;
      }
    }

    if (nextFormData.confirmPassword && nextFormData.password !== nextFormData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    return nextErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setErrors(validateForm(nextFormData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);
    if (!formData.name.trim()) nextErrors.name = "Full name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.password) {
      nextErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    }

    setErrors(nextErrors);
    if (!formIsValid || Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      toast.success("Account created successfully");
      navigate({ to: "/login", replace: true });
    } catch (error) {
      toast.error(error.message || "Failed to create account");
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

          <h1 className="heading-display text-3xl">Create account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Start building your second brain.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email Address
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <ValidationLine valid={passwordValidations.length}>
                    {passwordValidations.length
                      ? "Password is at least 6 characters long"
                      : "Password must be at least 6 characters long"}
                  </ValidationLine>
                  <ValidationLine valid={passwordValidations.specialChar}>
                    {passwordValidations.specialChar
                      ? "Password contains a special character"
                      : "Password must contain at least 1 special character"}
                  </ValidationLine>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {formData.confirmPassword && (
                <ValidationLine valid={passwordsMatch}>
                  {passwordsMatch ? "Password is valid" : "Passwords do not match"}
                </ValidationLine>
              )}
            </div>

            <button
              type="submit"
              disabled={!formIsValid || submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground transition hover:text-foreground/80">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms &amp; Privacy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ValidationLine({ valid, children }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      {valid ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-destructive" />}
      <span className={valid ? "text-green-500" : "text-destructive"}>{children}</span>
    </div>
  );
}
