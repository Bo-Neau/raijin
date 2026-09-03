import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Served from a domain root (raijinstudio.co), so base is "/".
// (Previously "/raijin/" in CI for GitHub Pages project-site hosting.)
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
