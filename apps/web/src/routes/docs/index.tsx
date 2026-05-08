import { createFileRoute } from "@tanstack/solid-router";

import { DocsOverview } from "@/components/docs-overview";
import { overviewPage } from "@/lib/docs-data";
import { seo } from "@/lib/utils";

export const Route = createFileRoute("/docs/")({
  component: DocsOverview,
  head: () => ({
    meta: seo({
      title: "Keystone UI · Solid Components and Primitives",
      description: overviewPage.description,
    }),
  }),
});
