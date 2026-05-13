import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// On GitHub Pages a project site lives at https://<user>.github.io/<repo>/
// so we need a base path that matches the repo name in CI builds.
const isCI = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: isCI ? "/raijin/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
