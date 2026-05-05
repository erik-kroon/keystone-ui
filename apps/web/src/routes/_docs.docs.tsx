import { Outlet, createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_docs/docs")({
  component: Outlet,
});
