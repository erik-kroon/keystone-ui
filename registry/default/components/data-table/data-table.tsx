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
      data-scope="ui-data-table"
      data-part="root"
      class={cn("ui-data-table", local.class)}
    >
      <Show when={local.children}>
        <div data-scope="ui-data-table" data-part="header-slot">
          {local.children}
        </div>
      </Show>
      <div data-scope="ui-data-table" data-part="viewport" class="ui-data-table-viewport">
        <table data-scope="ui-data-table" data-part="table" class="ui-data-table-table">
          <thead data-scope="ui-data-table" data-part="header" class="ui-data-table-header">
            <For each={local.table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr data-scope="ui-data-table" data-part="header-row">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        colSpan={header.colSpan}
                        data-scope="ui-data-table"
                        data-part="head"
                        class="ui-data-table-head"
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
          <tbody data-scope="ui-data-table" data-part="body" class="ui-data-table-body">
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
                      data-scope="ui-data-table"
                      data-part="row"
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      class="ui-data-table-row"
                    >
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td
                            data-scope="ui-data-table"
                            data-part="cell"
                            class="ui-data-table-cell"
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
