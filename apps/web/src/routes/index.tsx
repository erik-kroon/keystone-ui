import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div class="container mx-auto max-w-3xl px-4 py-2">
      <pre class="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div class="grid gap-6"></div>
    </div>
  );
}
