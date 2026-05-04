import { createForm } from "@tanstack/solid-form";
import { For } from "solid-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuItemData,
} from "@/components/ui/command-menu";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/components/data-table/use-data-table";
import { SelectField } from "@/components/ui/select-field";
import { Separator } from "@/components/ui/separator";
import { TanStackForm, TanStackFormSubmit } from "@/components/ui/tanstack-form";
import { TextField } from "@/components/ui/text-field";
import { Toaster, toaster } from "@/components/ui/toast";
import { invoiceDashboardColumns } from "./invoice-dashboard-columns";
import {
  invoiceDashboardMetrics,
  invoiceDashboardRows,
  invoiceDashboardStatusOptions,
} from "./invoice-dashboard-data";

const commandItems: CommandMenuItemData[] = [
  {
    value: "new-invoice",
    label: "Create invoice",
    description: "Start a draft from the command menu.",
    group: "Invoices",
    shortcut: "Mod+I",
    shortcutLabel: "Mod+I",
  },
  {
    value: "review-open",
    label: "Review open invoices",
    description: "Filter the table to outstanding work.",
    group: "Invoices",
    shortcut: "Mod+R",
    shortcutLabel: "Mod+R",
  },
];

export type InvoiceDashboardBlockProps = {
  title?: string;
  description?: string;
};

export function InvoiceDashboardBlock(props: InvoiceDashboardBlockProps) {
  const form = createForm(() => ({
    defaultValues: {
      customer: "",
      status: "draft",
    },
    onSubmit: ({ value }) => {
      toaster.success({
        title: "Invoice queued",
        description: `${value.customer || "New customer"} is ready for review.`,
      });
      return value;
    },
  }));
  const table = useDataTable({
    data: invoiceDashboardRows,
    columns: invoiceDashboardColumns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 3 },
      sorting: [{ id: "total", desc: true }],
    },
  });
  const commandMenuStore = createCommandMenuStore({ open: false });

  return (
    <section data-scope="ui-block" data-part="invoice-dashboard" class="ui-block-invoice-dashboard">
      <div class="ui-block-invoice-dashboard-header">
        <div>
          <Badge variant="outline">App block</Badge>
          <h1>{props.title ?? "Invoice workspace"}</h1>
          <p>{props.description ?? "Create, review, filter, and act on invoices in one route."}</p>
        </div>
        <div class="ui-block-invoice-dashboard-actions">
          <CommandMenu items={commandItems} store={commandMenuStore} trigger="Open command menu" />
          <Button
            type="button"
            onClick={() =>
              toaster.info({
                title: "Draft created",
                description: "Wire this action to your app mutation.",
              })
            }
          >
            New invoice
          </Button>
        </div>
      </div>

      <div class="ui-block-invoice-dashboard-metrics">
        <For each={invoiceDashboardMetrics}>
          {(metric) => (
            <Card>
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle>{metric.value}</CardTitle>
              </CardHeader>
              <CardContent>{metric.detail}</CardContent>
            </Card>
          )}
        </For>
      </div>

      <div class="ui-block-invoice-dashboard-grid">
        <Card>
          <CardHeader>
            <CardTitle>Create draft</CardTitle>
            <CardDescription>
              TanStack Form fields composed from Keystone UI source.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TanStackForm form={form}>
              <TextField
                form={form}
                name="customer"
                label="Customer"
                placeholder="Acme Corp"
                description="Required before the draft can be sent."
                validators={{
                  onSubmit: ({ value }) => (value.length > 0 ? undefined : "Enter a customer."),
                }}
              />
              <SelectField
                form={form}
                name="status"
                label="Initial status"
                placeholder="Choose status"
                options={invoiceDashboardStatusOptions}
              />
              <TanStackFormSubmit>Create draft</TanStackFormSubmit>
            </TanStackForm>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice management</CardTitle>
            <CardDescription>TanStack Table state with Keystone UI controls.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable table={table}>
              <DataTableToolbar table={table} />
            </DataTable>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <Toaster viewport={{ position: "bottom-right" }} />
    </section>
  );
}
