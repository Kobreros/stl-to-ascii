import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  rollupOptions: {
    output: {
      manualChunks: false,
      inlineDynamicImports: true,
      entryFileNames: "[name].js", // currently does not work for the legacy bundle
      assetFileNames: "[name].[ext]", // currently does not work for images
    },
  },
});
