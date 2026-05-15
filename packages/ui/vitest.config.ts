import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@/components/ui",
        replacement: fileURLToPath(new URL("./src/components", import.meta.url)),
      },
      {
        find: "@/components/data-table",
        replacement: fileURLToPath(new URL("./src/components/data-table", import.meta.url)),
      },
      {
        find: "@/lib",
        replacement: fileURLToPath(new URL("./src/lib", import.meta.url)),
      },
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/`,
      },
    ],
  },
  plugins: [solid()],
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
