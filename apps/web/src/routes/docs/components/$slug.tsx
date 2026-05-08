import { createFileRoute } from "@tanstack/solid-router";

import { RegistryDocPage } from "@/components/registry-doc-page";
import { findDocItem } from "@/lib/docs-data";
import { seo } from "@/lib/utils";

export const Route = createFileRoute("/docs/components/$slug")({
  component: ComponentDocRoute,
  head: ({ params }) => {
    const item = findDocItem(params.slug);
    const title = item ? `${item.title} · Keystone UI` : "Component Not Found · Keystone UI";

    return {
      meta: seo({
        title,
        description: item?.description ?? "Keystone UI component documentation.",
      }),
    };
  },
});

function ComponentDocRoute() {
  const params = Route.useParams();

  return <RegistryDocPage slug={params().slug} />;
}
