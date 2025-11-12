import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/js")
    }
  },
  server: {
    port: 5173,
    cors: true,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: path.resolve(__dirname, "assets/js"),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/js/main.jsx"),
      output: {
        entryFileNames: "react.compiled.js"
      }
    }
  }
});
