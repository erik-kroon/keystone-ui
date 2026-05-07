import { createFileRoute } from "@tanstack/solid-router";

import { DocsChrome } from "@/components/docs-shell";
import { DocsOverview } from "@/components/docs-overview";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <DocsChrome>
      <DocsOverview />
    </DocsChrome>
  );
}
