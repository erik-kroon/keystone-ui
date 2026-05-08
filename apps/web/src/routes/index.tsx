import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  ssr: true,
  beforeLoad: () => {
    throw redirect({ to: "/docs" });
  },
});
