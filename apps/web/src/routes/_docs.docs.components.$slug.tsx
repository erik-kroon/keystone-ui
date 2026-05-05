import { createFileRoute } from "@tanstack/solid-router";

import { RegistryDocPage } from "@/components/registry-doc-page";

export const Route = createFileRoute("/_docs/docs/components/$slug")({
  component: ComponentDocRoute,
});

function ComponentDocRoute() {
  const params = Route.useParams();

  return <RegistryDocPage slug={params().slug} />;
}
