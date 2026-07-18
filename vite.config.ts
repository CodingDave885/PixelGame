import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  // GitHub Pages serves this project from /PixelGame/, not the domain root.
  base: process.env.GITHUB_PAGES ? "/PixelGame/" : "/",
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
