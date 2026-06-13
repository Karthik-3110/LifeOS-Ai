import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";
import { useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Network,
  Youtube,
  CalendarRange,
  AlertTriangle,
  Gauge,
  Play,
  Check,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeOS AI — Visualize Your Future. Execute Your Goals." },
      {
        name: "description",
        content:
          "Transform your goals, projects, learning roadmaps, and ambitions into an AI-powered visual second brain.",
      },
    ],
  }),
  component: Landing,
});


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1]  } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

function Nav() {
  return (
    React.createElement('header', { className: "sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl"       ,}
      , React.createElement('div', { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6"      ,}
        , React.createElement(Link, { to: "/", className: "flex items-center gap-2"  ,}
          , React.createElement('div', { className: "grid h-7 w-7 place-items-center rounded-md bg-foreground text-background"      ,}
            , React.createElement(Sparkles, { className: "h-3.5 w-3.5" ,} )
          )
          , React.createElement('span', { className: "text-[15px] font-semibold tracking-tight"  ,}, "LifeOS AI" )
        )
        , React.createElement('nav', { className: "hidden items-center gap-8 text-sm text-muted-foreground md:flex"     ,}
          , React.createElement('a', { href: "#features", className: "transition hover:text-foreground" ,}, "Features")
          , React.createElement('a', { href: "#how", className: "transition hover:text-foreground" ,}, "How it works"  )
          , React.createElement('a', { href: "#testimonials", className: "transition hover:text-foreground" ,}, "Customers")
          , React.createElement(Link, { to: "/dashboard", className: "transition hover:text-foreground" ,}, "Product")
        )
        , React.createElement('div', { className: "flex items-center gap-2"  ,}
          , React.createElement(Link, {
            to: "/auth",
            className: "hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex"         ,}
, "Sign in"

          )
          , React.createElement(Link, {
            to: "/dashboard",
            className: "inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition hover:bg-foreground/90"           ,}
, "Get started "
              , React.createElement(ArrowRight, { className: "h-3.5 w-3.5" ,} )
          )
        )
      )
    )
  );
}

function FloatingNodes() {
  const nodes = [
    { x: "8%", y: "18%", label: "Ship MVP", tone: "accent" },
    { x: "78%", y: "12%", label: "Launch beta", tone: "warning" },
    { x: "14%", y: "70%", label: "User research", tone: "neutral" },
    { x: "70%", y: "62%", label: "Series A prep", tone: "accent" },
    { x: "44%", y: "82%", label: "Hire designer", tone: "neutral" },
  ];
  return (
    React.createElement('div', { className: "pointer-events-none absolute inset-0 overflow-hidden"   ,}
      , React.createElement('div', { className: "absolute inset-0 grid-bg opacity-[0.35]"   ,} )
      , React.createElement('div', { className: "absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background to-transparent"      ,} )
      , React.createElement('div', { className: "absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent"      ,} )
      , nodes.map((n, i) => (
        React.createElement(motion.div, {
          key: i,
          className: "absolute",
          style: { left: n.x, top: n.y },
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
          React.createElement(motion.div, {
            animate: { y: [0, -8, 0] },
            transition: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", type: "tween" },
            className: "surface-card flex items-center gap-2 px-3 py-2 text-xs font-medium",
          },
            React.createElement('span', {
              className: `h-1.5 w-1.5 rounded-full ${
                n.tone === "accent"
                  ? "bg-accent"
                  : n.tone === "warning"
                  ? "bg-warning"
                  : "bg-muted-foreground/50"
              }`,
            }),
            n.label
          )
        )
      ))
    )
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    React.createElement('section', { ref: ref, className: "relative overflow-hidden" ,}
      , React.createElement(FloatingNodes, null )
      , React.createElement(motion.div, { style: { y, opacity }, className: "relative mx-auto max-w-5xl px-6 pb-28 pt-24 text-center sm:pt-32"       ,}
        , React.createElement(motion.div, {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "mb-6 inline-flex" ,}

          , React.createElement('span', { className: "chip",}
            , React.createElement('span', { className: "h-1.5 w-1.5 rounded-full bg-accent"   ,} ), "Now in private beta · Backed by builders"

          )
        )

        , React.createElement(motion.h1, {
          variants: fadeUp,
          initial: "hidden",
          animate: "show",
          className: "heading-display text-balance text-5xl text-foreground sm:text-6xl md:text-7xl"     ,}
, "Visualize your future."

          , React.createElement('br', null )
          , React.createElement('span', { className: "text-muted-foreground",}, "Execute your goals."  )
        )

        , React.createElement(motion.p, {
          variants: fadeUp,
          initial: "hidden",
          animate: "show",
          transition: { delay: 0.15 },
          className: "mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"       ,}
, "Transform your goals, projects, and learning roadmaps into an AI-powered visual second brain — built on an infinite canvas that thinks alongside you."


        )

        , React.createElement(motion.div, {
          variants: fadeUp,
          initial: "hidden",
          animate: "show",
          transition: { delay: 0.25 },
          className: "mt-10 flex flex-wrap items-center justify-center gap-3"     ,}

          , React.createElement(Link, {
            to: "/dashboard",
            className: "group inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background shadow-elevated transition hover:translate-y-[-1px] hover:shadow-float"              ,}
, "Get started — it's free"

            , React.createElement(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5"   ,} )
          )
          , React.createElement('button', {
            onClick: () => document.getElementById("how")?.scrollIntoView({ behavior: "smooth", block: "start" }),
            className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition hover:border-border-strong"             ,}
            , React.createElement(Play, { className: "h-4 w-4" ,} ), " Watch demo"
          )
        )

        , React.createElement(motion.p, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.5 },
          className: "mt-6 text-xs text-muted-foreground"  ,}
, "Free forever for personal use · No credit card required"

        )
      )

      /* Product preview */
      , React.createElement(motion.div, {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        className: "relative mx-auto max-w-6xl px-6 pb-24"    ,}

        , React.createElement('div', { className: "surface-elevated overflow-hidden" ,}
          , React.createElement('div', { className: "flex items-center gap-2 border-b border-border bg-surface px-4 py-3"       ,}
            , React.createElement('span', { className: "h-2.5 w-2.5 rounded-full bg-border"   ,} )
            , React.createElement('span', { className: "h-2.5 w-2.5 rounded-full bg-border"   ,} )
            , React.createElement('span', { className: "h-2.5 w-2.5 rounded-full bg-border"   ,} )
            , React.createElement('div', { className: "ml-3 chip" ,}, "app.lifeos.ai/canvas")
          )
          , React.createElement('div', { className: "relative h-[420px] dot-bg"  ,}
            , React.createElement(PreviewCanvas, null )
          )
        )
      )
    )
  );
}

function PreviewCanvas() {
  const cards = [
    { x: 6, y: 10, title: "Launch LifeOS", sub: "Goal · Q1", tone: "accent" },
    { x: 38, y: 24, title: "Design system v2", sub: "Project", tone: "neutral" },
    { x: 70, y: 14, title: "Hire 2 engineers", sub: "Milestone", tone: "warning" },
    { x: 12, y: 58, title: "Weekly review", sub: "Task · Friday", tone: "neutral" },
    { x: 46, y: 64, title: "Onboarding flow", sub: "Sub-goal", tone: "accent" },
    { x: 74, y: 60, title: "Pitch deck", sub: "Deadline · Mar 12", tone: "danger" },
  ];
  return (
    React.createElement(React.Fragment, null
      , React.createElement('svg', { className: "absolute inset-0 h-full w-full"   , preserveAspectRatio: "none",}
        , React.createElement('defs', null
          , React.createElement('linearGradient', { id: "line", x1: "0", x2: "1",}
            , React.createElement('stop', { offset: "0%", stopColor: "oklch(0.72 0.18 145)"  , stopOpacity: "0.6",} )
            , React.createElement('stop', { offset: "100%", stopColor: "oklch(0.72 0.18 145)"  , stopOpacity: "0.05",} )
          )
        )
        , [
          ["10%", "18%", "44%", "30%"],
          ["44%", "30%", "76%", "20%"],
          ["18%", "66%", "52%", "70%"],
          ["52%", "70%", "80%", "66%"],
          ["44%", "30%", "52%", "70%"],
        ].map(([x1, y1, x2, y2], i) => (
          React.createElement(motion.line, {
            key: i,
            x1: x1, y1: y1, x2: x2, y2: y2,
            stroke: "url(#line)", strokeWidth: "1.5", strokeDasharray: "4 4",
            initial: { pathLength: 0, opacity: 0 },
            whileInView: { pathLength: 1, opacity: 1 },
            viewport: { once: true },
            transition: { duration: 0.8, delay: 0.15 + i * 0.08 },
          })
        ))
      )
      , cards.map((c, i) => (
        React.createElement(motion.div, {
          key: i,
          initial: { opacity: 0, y: 12, scale: 0.96 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true },
          transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          className: "absolute w-52",
          style: { left: `${c.x}%`, top: `${c.y}%` },
        },
          React.createElement('div', { className: "surface-card hover-lift p-3" },
            React.createElement('div', { className: "flex items-center gap-2" },
              React.createElement('span', {
                className: `h-2 w-2 rounded-full ${
                  c.tone === "accent"
                    ? "bg-accent"
                    : c.tone === "warning"
                    ? "bg-warning"
                    : c.tone === "danger"
                    ? "bg-destructive"
                    : "bg-muted-foreground/40"
                }`,
              }),
              React.createElement('p', { className: "text-sm font-medium" }, c.title)
            ),
            React.createElement('p', { className: "mt-1 pl-4 text-xs text-muted-foreground" }, c.sub)
          )
        )
      ))
    )
  );
}

const features = [
  {
    icon: Brain,
    title: "AI Brain Dump",
    desc: "Pour out everything on your mind. LifeOS organizes it into goals, projects, and next actions.",
    span: "md:col-span-2",
  },
  {
    icon: Network,
    title: "Infinite Visual Canvas",
    desc: "An endless workspace for your future. Nodes, connections, and roadmaps that feel tactile.",
    span: "md:row-span-2",
  },
  {
    icon: Youtube,
    title: "YouTube Roadmap Extractor",
    desc: "Paste a tutorial — get a structured learning path on your canvas in seconds.",
    span: "",
  },
  {
    icon: CalendarRange,
    title: "Weekly Planner",
    desc: "A calm, drag-and-drop week that adapts when life shifts.",
    span: "",
  },
  {
    icon: AlertTriangle,
    title: "Conflict Detection",
    desc: "Spot overlapping deadlines and overcommitments before they happen.",
    span: "",
  },
  {
    icon: Gauge,
    title: "Placement Readiness Score",
    desc: "Quantify how prepared you actually are. Track it over time.",
    span: "md:col-span-2",
  },
];

function Features() {
  return (
    React.createElement('section', { id: "features", className: "relative mx-auto max-w-7xl px-6 py-28"    ,}
      , React.createElement('div', { className: "mx-auto max-w-2xl text-center"  ,}
        , React.createElement('span', { className: "chip",}, "Features")
        , React.createElement('h2', { className: "heading-display mt-4 text-balance text-4xl sm:text-5xl"    ,}, "A second brain that "
              , React.createElement('span', { className: "text-muted-foreground",}, "actually thinks back."  )
        )
        , React.createElement('p', { className: "mt-4 text-muted-foreground" ,}, "Every tool built to feel like one product. No bloat, no busywork."

        )
      )

      , React.createElement('div', { className: "mt-16 grid auto-rows-[200px] gap-4 md:grid-cols-3"    ,}
        , features.map((f, i) => (
          React.createElement(motion.div, {
            key: f.title,
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
            className: `surface-card hover-lift group relative flex flex-col justify-between overflow-hidden p-6 ${f.span}`,}

            , React.createElement('div', { className: "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground"         ,}
              , React.createElement(f.icon, { className: "h-4 w-4" ,} )
            )
            , React.createElement('div', null
              , React.createElement('h3', { className: "text-base font-semibold tracking-tight"  ,}, f.title)
              , React.createElement('p', { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground"   ,}, f.desc)
            )
            , React.createElement('div', { className: "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition group-hover:bg-accent/10"          ,} )
          )
        ))
      )
    )
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Dump your mind", desc: "Speak or type your goals, projects, and ideas — no structure required." },
    { n: "02", title: "Let AI map it", desc: "LifeOS organizes everything into a living roadmap with timelines and dependencies." },
    { n: "03", title: "Execute weekly", desc: "Your planner adapts as you go. Conflicts resolved, momentum tracked." },
  ];
  return (
    React.createElement('section', { id: "how", className: "relative border-y border-border bg-surface py-28"    ,}
      , React.createElement('div', { className: "mx-auto max-w-7xl px-6"  ,}
        , React.createElement('div', { className: "mx-auto max-w-2xl text-center"  ,}
          , React.createElement('span', { className: "chip",}, "How it works"  )
          , React.createElement('h2', { className: "heading-display mt-4 text-balance text-4xl sm:text-5xl"    ,}, "From chaos to clarity in three steps."

          )
        )

        , React.createElement('div', { className: "relative mt-16 grid gap-6 md:grid-cols-3"    ,}
          , React.createElement('div', { className: "pointer-events-none absolute left-0 right-0 top-10 hidden h-px md:block"       ,}
            , React.createElement(motion.div, {
              initial: { scaleX: 0 },
              whileInView: { scaleX: 1 },
              viewport: { once: true },
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              style: { originX: 0 },
              className: "h-full bg-gradient-to-r from-transparent via-border-strong to-transparent"    ,}
            )
          )
          , steps.map((s, i) => (
            React.createElement(motion.div, {
              key: s.n,
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5, delay: 0.1 * i },
              className: "relative",}

              , React.createElement('div', { className: "surface-card p-6" ,}
                , React.createElement('div', { className: "flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background"         ,}
                  , s.n
                )
                , React.createElement('h3', { className: "mt-5 text-lg font-semibold tracking-tight"   ,}, s.title)
                , React.createElement('p', { className: "mt-2 text-sm leading-relaxed text-muted-foreground"   ,}, s.desc)
              )
            )
          ))
        )
      )
    )
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "LifeOS replaced four tools for me. The canvas is what every productivity app secretly wants to be.",
      name: "Amelia Cheng",
      role: "Founder, Northwind",
    },
    {
      quote:
        "I run my whole quarter on it. Conflict detection alone saved my launch.",
      name: "Marcus Hale",
      role: "Head of Product, Linear-adjacent",
    },
    {
      quote: "It's the first AI product that doesn't feel like a chatbot. It feels like a co-founder.",
      name: "Priya Natarajan",
      role: "Solo builder",
    },
  ];
  return (
    React.createElement('section', { id: "testimonials", className: "mx-auto max-w-7xl px-6 py-28"   ,}
      , React.createElement('div', { className: "mx-auto max-w-2xl text-center"  ,}
        , React.createElement('span', { className: "chip",}, "Loved by builders"  )
        , React.createElement('h2', { className: "heading-display mt-4 text-balance text-4xl sm:text-5xl"    ,}, "Trusted by people who ship."

        )
      )
      , React.createElement('div', { className: "mt-16 grid gap-6 md:grid-cols-3"   ,}
        , items.map((t, i) => (
          React.createElement(motion.figure, {
            key: i,
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: i * 0.08 },
            className: "surface-card hover-lift p-6"  ,}

            , React.createElement('blockquote', { className: "text-[15px] leading-relaxed text-foreground"  ,}, "\""
              , t.quote, "\""
            )
            , React.createElement('figcaption', { className: "mt-6 flex items-center gap-3"   ,}
              , React.createElement('div', { className: "h-9 w-9 rounded-full bg-gradient-to-br from-foreground/80 to-foreground/40"     ,} )
              , React.createElement('div', null
                , React.createElement('div', { className: "text-sm font-medium" ,}, t.name)
                , React.createElement('div', { className: "text-xs text-muted-foreground" ,}, t.role)
              )
            )
          )
        ))
      )
    )
  );
}

function FinalCTA() {
  return (
    React.createElement('section', { className: "relative overflow-hidden border-t border-border"   ,}
      , React.createElement('div', { className: "absolute inset-0 -z-10"  ,}
        , React.createElement('div', { className: "absolute inset-0 dot-bg opacity-50"   ,} )
        , React.createElement(motion.div, {
          animate: { opacity: [0.4, 0.6, 0.4] },
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          className: "absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"         ,}
        )
      )
      , React.createElement('div', { className: "mx-auto max-w-4xl px-6 py-32 text-center"    ,}
        , React.createElement('h2', { className: "heading-display text-balance text-5xl sm:text-6xl"   ,}, "Build the life you keep promising yourself."

        )
        , React.createElement('p', { className: "mx-auto mt-5 max-w-xl text-muted-foreground"   ,}, "Join thousands of builders, students, and creators using LifeOS to ship what matters."

        )
        , React.createElement('div', { className: "mt-10 flex flex-wrap justify-center gap-3"    ,}
          , React.createElement(Link, {
            to: "/dashboard",
            className: "inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background shadow-elevated transition hover:translate-y-[-1px] hover:shadow-float"             ,}
, "Start free "
              , React.createElement(ArrowRight, { className: "h-4 w-4" ,} )
          )
          , React.createElement(Link, {
            to: "/auth",
            className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition hover:border-border-strong"             ,}
, "Sign in"

          )
        )
        , React.createElement('ul', { className: "mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"       ,}
          , ["Free forever for personal", "No credit card", "Cancel anytime"].map((x) => (
            React.createElement('li', { key: x, className: "inline-flex items-center gap-1.5"  ,}
              , React.createElement(Check, { className: "h-3.5 w-3.5 text-accent"  ,} ), " " , x
            )
          ))
        )
      )
    )
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: [{ label: "Canvas", href: "/canvas" }, { label: "Planner", href: "/planner" }, { label: "Analytics", href: "/analytics" }, { label: "Pricing", href: "/auth" }] },
    { title: "Company", links: [{ label: "About", href: "#features" }, { label: "Careers", href: "#testimonials" }, { label: "Blog", href: "#how" }, { label: "Press", href: "#testimonials" }] },
    { title: "Resources", links: [{ label: "Docs", href: "#how" }, { label: "Changelog", href: "/dashboard" }, { label: "Community", href: "#testimonials" }, { label: "Support", href: "/auth" }] },
    { title: "Legal", links: [{ label: "Privacy", href: "/auth" }, { label: "Terms", href: "/auth" }, { label: "Security", href: "/auth" }, { label: "DPA", href: "/auth" }] },
  ];
  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Github, href: "https://github.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
  ];
  return (
    React.createElement('footer', { className: "border-t border-border bg-surface"  ,}
      , React.createElement('div', { className: "mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-5"      ,}
        , React.createElement('div', { className: "md:col-span-2",}
          , React.createElement('div', { className: "flex items-center gap-2"  ,}
            , React.createElement('div', { className: "grid h-7 w-7 place-items-center rounded-md bg-foreground text-background"      ,}
              , React.createElement(Sparkles, { className: "h-3.5 w-3.5" ,} )
            )
            , React.createElement('span', { className: "text-[15px] font-semibold tracking-tight"  ,}, "LifeOS AI" )
          )
          , React.createElement('p', { className: "mt-4 max-w-xs text-sm text-muted-foreground"   ,}, "An AI-powered visual second brain for your goals and roadmaps."

          )
          , React.createElement('div', { className: "mt-6 flex gap-3 text-muted-foreground"   ,}
            , socialLinks.map(({ icon: Icon, href }, i) => (
              React.createElement('a', {
                key: i,
                href: href,
                target: "_blank",
                rel: "noreferrer",
                className: "grid h-9 w-9 place-items-center rounded-md border border-border transition hover:text-foreground"        ,}

                , React.createElement(Icon, { className: "h-4 w-4" ,} )
              )
            ))
          )
        )
        , cols.map((c) => (
          React.createElement('div', { key: c.title,}
            , React.createElement('h4', { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground"    ,}, c.title)
            , React.createElement('ul', { className: "mt-4 space-y-3 text-sm"  ,}
              , c.links.map((l) => (
                React.createElement('li', { key: l.label,}
                  , React.createElement('a', { href: l.href, className: "text-foreground/80 transition hover:text-foreground"  ,}
                    , l.label
                  )
                )
              ))
            )
          )
        ))
      )
      , React.createElement('div', { className: "border-t border-border" ,}
        , React.createElement('div', { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground"          ,}
          , React.createElement('p', null, "© " , new Date().getFullYear(), " LifeOS AI, Inc."   )
          , React.createElement('p', null, "Made for builders who ship."    )
        )
      )
    )
  );
}

function Landing() {
  return (
    React.createElement('main', { className: "min-h-screen bg-background" ,}
      , React.createElement(Nav, null )
      , React.createElement(Hero, null )
      , React.createElement(Features, null )
      , React.createElement(HowItWorks, null )
      , React.createElement(Testimonials, null )
      , React.createElement(FinalCTA, null )
      , React.createElement(Footer, null )
    )
  );
}
