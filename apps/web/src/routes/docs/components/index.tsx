import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/docs/components/")({
  ssr: true,
  beforeLoad: () => {
    throw redirect({ to: "/docs/introduction" });
  },
});
