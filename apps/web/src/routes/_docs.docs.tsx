import { Outlet, createFileRoute } from "@tanstack/solid-router";

import { overviewPage } from "@/lib/docs-data";
import { seo } from "@/lib/utils";

export const Route = createFileRoute("/_docs/docs")({
  component: Outlet,
  head: () => ({
    meta: seo({
      title: "Keystone UI · Solid Components and Primitives",
      description: overviewPage.description,
    }),
  }),
});
