import { flexRender, type RowData, type Table as TanStackTable } from "@tanstack/solid-table";
import { For, Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import {
  Table as UITable,
  TableBody as UITableBody,
  TableCaption as UITableCaption,
  TableCell as UITableCell,
  TableContainer as UITableContainer,
  TableHead as UITableHead,
  TableHeader as UITableHeader,
  TableRow as UITableRow,
} from "@/components/ui/table";
import { DataTableEmpty } from "./data-table-empty-state";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";

type DataTableRootProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children">;

export type DataTableProps<TData extends RowData> = DataTableRootProps & {
  table: TanStackTable<TData>;
  caption?: JSX.Element;
  children?: JSX.Element;
  empty?: JSX.Element;
  loading?: boolean;
  pageSizeOptions?: readonly number[];
  skeletonRows?: number;
  pagination?: boolean;
};

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const [local, rootProps] = splitProps(props, [
    "caption",
    "children",
    "class",
    "empty",
    "loading",
    "pageSizeOptions",
    "pagination",
    "skeletonRows",
    "table",
  ]);

  return (
    <div
      {...rootProps}
      data-scope="ui-data-table"
      data-part="root"
      data-empty={local.table.getRowModel().rows.length === 0 ? "" : undefined}
      data-loading={local.loading ? "" : undefined}
      aria-busy={local.loading || undefined}
      class={cn("ui-data-table tabular-nums", local.class)}
    >
      <Show when={local.children}>
        <div data-scope="ui-data-table" data-part="header-slot">
          {local.children}
        </div>
      </Show>
      <UITableContainer
        data-scope="ui-data-table"
        data-part="viewport"
        class="ui-data-table-viewport"
      >
        <UITable data-scope="ui-data-table" data-part="table" class="ui-data-table-table">
          <Show when={local.caption}>
            <UITableCaption data-scope="ui-data-table" data-part="caption">
              {local.caption}
            </UITableCaption>
          </Show>
          <UITableHeader data-scope="ui-data-table" data-part="header" class="ui-data-table-header">
            <For each={local.table.getHeaderGroups()}>
              {(headerGroup) => (
                <UITableRow data-scope="ui-data-table" data-part="header-row">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <UITableHead
                        colSpan={header.colSpan}
                        scope="col"
                        aria-sort={getAriaSort(header.column.getIsSorted())}
                        data-scope="ui-data-table"
                        data-part="head"
                        data-sort={header.column.getIsSorted() || "none"}
                        class="ui-data-table-head"
                      >
                        <Show when={!header.isPlaceholder}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Show>
                      </UITableHead>
                    )}
                  </For>
                </UITableRow>
              )}
            </For>
          </UITableHeader>
          <UITableBody data-scope="ui-data-table" data-part="body" class="ui-data-table-body">
            <Show
              when={!local.loading}
              fallback={
                <DataTableSkeleton
                  columns={local.table.getVisibleLeafColumns().length}
                  rows={local.skeletonRows}
                />
              }
            >
              <Show
                when={local.table.getRowModel().rows.length > 0}
                fallback={
                  <DataTableEmpty
                    colSpan={local.table.getVisibleLeafColumns().length}
                    label={local.empty}
                  />
                }
              >
                <For each={local.table.getRowModel().rows}>
                  {(row) => (
                    <UITableRow
                      data-scope="ui-data-table"
                      data-part="row"
                      aria-selected={row.getIsSelected() || undefined}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      data-selected={row.getIsSelected() ? "" : undefined}
                      class="ui-data-table-row"
                    >
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <UITableCell
                            data-scope="ui-data-table"
                            data-part="cell"
                            class="ui-data-table-cell"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </UITableCell>
                        )}
                      </For>
                    </UITableRow>
                  )}
                </For>
              </Show>
            </Show>
          </UITableBody>
        </UITable>
      </UITableContainer>
      <Show when={local.pagination !== false}>
        <DataTablePagination table={local.table} pageSizeOptions={local.pageSizeOptions} />
      </Show>
    </div>
  );
}

function getAriaSort(sort: false | "asc" | "desc"): "ascending" | "descending" | "none" {
  if (sort === "asc") return "ascending";
  if (sort === "desc") return "descending";
  return "none";
}
