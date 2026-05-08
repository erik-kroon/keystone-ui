import { createFileRoute } from "@tanstack/solid-router";

import { DocsChrome } from "@/components/docs-shell";
import { DocsOverview } from "@/components/docs-overview";
import { overviewPage } from "@/lib/docs-data";
import { seo } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomeRoute,
  head: () => ({
    meta: seo({
      title: "Keystone UI · Solid Components and Primitives",
      description: overviewPage.description,
    }),
  }),
});

function HomeRoute() {
  return (
    <DocsChrome>
      <DocsOverview />
    </DocsChrome>
  );
}
