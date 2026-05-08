import { Outlet, createFileRoute } from "@tanstack/solid-router";

import { DocsChrome } from "@/components/docs-shell";

export const Route = createFileRoute("/docs")({
  component: DocsLayoutRoute,
});

function DocsLayoutRoute() {
  return (
    <DocsChrome>
      <Outlet />
    </DocsChrome>
  );
}
