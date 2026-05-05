import type { RowData, Table } from "@tanstack/solid-table";
import { createMemo, For, Show, type JSX } from "solid-js";
import { cn } from "@/lib/cn";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export function DataTableToolbar<TData extends RowData>(props: {
  table: Table<TData>;
  children?: JSX.Element;
  class?: string;
}) {
  const filterableColumns = createMemo(() =>
    props.table
      .getAllLeafColumns()
      .filter((column) => column.getCanFilter())
      .filter((column) => column.columnDef.meta?.variant),
  );
  const hasFilters = createMemo(
    () =>
      props.table.getState().columnFilters.length > 0 ||
      Object.values(props.table.getState().columnVisibility).some((visible) => visible === false),
  );

  return (
    <div
      data-scope="ui-data-table"
      data-part="toolbar"
      class={cn("ui-data-table-toolbar", props.class)}
    >
      <For each={filterableColumns()}>
        {(column) => {
          const meta = column.columnDef.meta;
          const label = meta?.label ?? column.columnDef.header?.toString() ?? column.id;
          return (
            <Show
              when={meta?.variant === "select" || meta?.variant === "multiSelect"}
              fallback={
                <input
                  type="search"
                  value={String(column.getFilterValue() ?? "")}
                  placeholder={meta?.placeholder ?? `Search ${label.toLowerCase()}...`}
                  aria-label={meta?.placeholder ?? `Search ${label}`}
                  data-scope="ui-data-table"
                  data-part="search"
                  data-column={column.id}
                  class="ui-data-table-search"
                  onInput={(event) => {
                    column.setFilterValue(event.currentTarget.value);
                    props.table.setPageIndex(0);
                  }}
                />
              }
            >
              <DataTableFacetedFilter
                table={props.table}
                columnId={column.id}
                title={label}
                multiple={meta?.variant !== "select"}
                options={meta?.options ?? []}
              />
            </Show>
          );
        }}
      </For>
      <Show when={hasFilters()}>
        <button
          type="button"
          aria-label="Reset table filters and column visibility"
          data-scope="ui-data-table"
          data-part="reset"
          class="ui-data-table-reset"
          onClick={() => {
            props.table.resetColumnFilters();
            props.table.resetColumnVisibility();
          }}
        >
          Reset
        </button>
      </Show>
      <DataTableViewOptions table={props.table} />
      <Show when={props.children}>
        <div data-scope="ui-data-table" data-part="toolbar-actions">
          {props.children}
        </div>
      </Show>
    </div>
  );
}
