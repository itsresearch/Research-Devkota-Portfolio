import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise chunk size warning threshold (Three.js is large by design)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — always needed, cache forever
          "vendor-react": ["react", "react-dom", "react-router-dom"],

          // Animation libs — large, change rarely
          "vendor-gsap": ["gsap"],
          "vendor-framer": ["framer-motion"],

          // Three.js — very large, lazy-loaded at runtime anyway
          "vendor-three": ["three"],

          // Supabase — separate chunk so it doesn't bloat the app bundle
          "vendor-supabase": ["@supabase/supabase-js"],

          // Markdown rendering — only used in blog post page
          "vendor-markdown": ["react-markdown", "remark-gfm"],

          // Radix UI — large collection, stable
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-popover",
            "@radix-ui/react-toast",
          ],
        },
      },
    },
  },
}));
