import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["browser", "development"]
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "https://solid-themes.test/"
      }
    },
    include: ["test/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**", "references/**"],
    globals: true,
    restoreMocks: true
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "solid-js"
  }
});
