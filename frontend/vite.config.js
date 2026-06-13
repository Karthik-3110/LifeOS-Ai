import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-router",
        "@tanstack/react-query",
        "framer-motion",
        "lucide-react",
      ],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/recharts")) {
              return "recharts";
            }
            if (id.includes("node_modules/reactflow") || id.includes("@reactflow")) {
              return "reactflow";
            }
            if (id.includes("node_modules/framer-motion")) {
              return "framer-motion";
            }
          },
        },
      },
    },
  },
});
