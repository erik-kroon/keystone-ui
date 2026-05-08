import type { ColumnDef } from "@tanstack/solid-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { dataTableFacetedFilter } from "@/components/data-table/use-data-table";
import {
  realtimeDataTableStatusOptions,
  type RealtimeDataTableRow,
  type RealtimeDataTableStatus,
} from "./realtime-data-table-data";

const statusVariant: Record<RealtimeDataTableStatus, "muted" | "outline" | "solid"> = {
  degraded: "outline",
  healthy: "solid",
  investigating: "muted",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export const realtimeDataTableColumns: ColumnDef<RealtimeDataTableRow, unknown>[] = [
  {
    accessorKey: "service",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
    cell: ({ row }) => (
      <div class="ui-block-realtime-data-table-service">
        <span>{row.original.service}</span>
        <small>{row.original.id}</small>
      </div>
    ),
    meta: {
      label: "Service",
      placeholder: "Search services",
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
      options: realtimeDataTableStatusOptions,
      variant: "multiSelect",
    },
  },
  {
    accessorKey: "region",
    header: "Region",
    meta: {
      label: "Region",
      placeholder: "Search regions",
      variant: "text",
    },
  },
  {
    accessorKey: "latency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Latency" />,
    cell: ({ row }) => <span class="tabular-nums">{row.original.latency} ms</span>,
  },
  {
    accessorKey: "throughput",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Throughput" />,
    cell: ({ row }) => (
      <span class="tabular-nums">{formatNumber(row.original.throughput)} rpm</span>
    ),
  },
  {
    accessorKey: "errorRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Errors" />,
    cell: ({ row }) => <span class="tabular-nums">{row.original.errorRate.toFixed(2)}%</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
];
