import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [tanstackStart(), solidPlugin({ ssr: true }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@keystone-ui/ui/default": path.resolve(__dirname, "../../packages/ui/src/default"),
    },
  },
  server: {
    port: 3001,
  },
});
