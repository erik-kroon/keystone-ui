import { createFileRoute } from "@tanstack/solid-router";

import { DocsOverview } from "@/components/docs-overview";

export const Route = createFileRoute("/_docs/docs/")({
  component: DocsOverview,
});
