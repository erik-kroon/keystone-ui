import type { ColumnDef } from "@tanstack/solid-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { dataTableFacetedFilter } from "@/components/data-table/use-data-table";
import {
  invoiceDashboardStatusOptions,
  type InvoiceDashboardRow,
  type InvoiceDashboardStatus,
} from "./invoice-dashboard-data";

const statusVariant: Record<InvoiceDashboardStatus, "muted" | "outline" | "solid"> = {
  draft: "muted",
  open: "outline",
  paid: "solid",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export const invoiceDashboardColumns: ColumnDef<InvoiceDashboardRow, unknown>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => (
      <div class="ui-block-invoice-dashboard-customer">
        <span>{row.original.customer}</span>
        <small>{row.original.id}</small>
      </div>
    ),
    meta: {
      label: "Customer",
      placeholder: "Search customers",
      variant: "text",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
    filterFn: dataTableFacetedFilter,
    meta: {
      label: "Status",
      options: invoiceDashboardStatusOptions,
      variant: "multiSelect",
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    meta: {
      label: "Owner",
      placeholder: "Search owner",
      variant: "text",
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => formatCurrency(row.original.total),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          { label: "Open invoice", onSelect: (current) => current.original.id },
          { label: "Mark paid", onSelect: (current) => current.original.status },
        ]}
      />
    ),
  },
];
