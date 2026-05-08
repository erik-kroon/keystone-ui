import { createFileRoute } from "@tanstack/solid-router";
import { InvoiceDashboardBlock } from "@/components/blocks/invoice-dashboard/invoice-dashboard";

export const Route = createFileRoute("/")({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <main class="min-h-screen bg-background px-6 py-8 text-foreground">
      <InvoiceDashboardBlock />
    </main>
  );
}
