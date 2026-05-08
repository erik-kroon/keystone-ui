import { createFileRoute } from "@tanstack/solid-router";

import { DocsOverview } from "@/components/docs-overview";
import { seo } from "@/lib/utils";

const overviewDescription =
  "Solid primitives, source-owned UI components, shadcn-compatible registry metadata, and app-layer registry guidance.";

export const Route = createFileRoute("/docs/")({
  ssr: true,
  component: DocsOverview,
  head: () => ({
    meta: seo({
      title: "Introduction · Keystone UI",
      description: overviewDescription,
    }),
  }),
});
