import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/docs/")({
  ssr: true,
  beforeLoad: () => {
    throw redirect({ to: "/docs/introduction" });
  },
});
