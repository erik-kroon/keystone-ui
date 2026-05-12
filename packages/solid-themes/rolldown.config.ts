import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
    "adapters/solid-start": "src/adapters/solid-start.ts",
    "adapters/tanstack-start": "src/adapters/tanstack-start.ts"
  },
  external: ["solid-js", "solid-js/web"],
  plugins: [],
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "[name].js",
    sourcemap: true
  },
  treeshake: true
});
