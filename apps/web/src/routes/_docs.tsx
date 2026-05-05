import { Outlet, createFileRoute, useRouterState } from "@tanstack/solid-router";
import { Show } from "solid-js";

import { DocsChrome } from "@/components/docs-shell";
import { DocsOverview } from "@/components/docs-overview";

export const Route = createFileRoute("/_docs")({
  component: DocsLayoutRoute,
});

function DocsLayoutRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <DocsChrome>
      <Show when={pathname() === "/"} fallback={<Outlet />}>
        <DocsOverview />
      </Show>
    </DocsChrome>
  );
}
