import { flexRender, type RowData, type Table } from "@tanstack/solid-table";
import { For, Show, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import { DataTableEmptyState } from "./data-table-empty-state";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";

type DataTableRootProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children">;

export type DataTableProps<TData extends RowData> = DataTableRootProps & {
  table: Table<TData>;
  children?: JSX.Element;
  empty?: JSX.Element;
  loading?: boolean;
  pageSizeOptions?: readonly number[];
  skeletonRows?: number;
  pagination?: boolean;
};

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const [local, rootProps] = splitProps(props, [
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
      data-scope="mason-data-table"
      data-part="root"
      class={cn("mason-data-table", local.class)}
    >
      <Show when={local.children}>
        <div data-scope="mason-data-table" data-part="header-slot">
          {local.children}
        </div>
      </Show>
      <div data-scope="mason-data-table" data-part="viewport" class="mason-data-table-viewport">
        <table data-scope="mason-data-table" data-part="table" class="mason-data-table-table">
          <thead data-scope="mason-data-table" data-part="header" class="mason-data-table-header">
            <For each={local.table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr data-scope="mason-data-table" data-part="header-row">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        colSpan={header.colSpan}
                        data-scope="mason-data-table"
                        data-part="head"
                        class="mason-data-table-head"
                      >
                        <Show when={!header.isPlaceholder}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Show>
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody data-scope="mason-data-table" data-part="body" class="mason-data-table-body">
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
                  <DataTableEmptyState
                    colSpan={local.table.getVisibleLeafColumns().length}
                    label={local.empty}
                  />
                }
              >
                <For each={local.table.getRowModel().rows}>
                  {(row) => (
                    <tr
                      data-scope="mason-data-table"
                      data-part="row"
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      class="mason-data-table-row"
                    >
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td
                            data-scope="mason-data-table"
                            data-part="cell"
                            class="mason-data-table-cell"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </Show>
            </Show>
          </tbody>
        </table>
      </div>
      <Show when={local.pagination !== false}>
        <DataTablePagination table={local.table} pageSizeOptions={local.pageSizeOptions} />
      </Show>
    </div>
  );
}
