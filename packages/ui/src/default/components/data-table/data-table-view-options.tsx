import type { RowData, Table } from "@tanstack/solid-table";
import { createSignal, For, Show } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableViewOptions<TData extends RowData>(props: {
  table: Table<TData>;
  class?: string;
}) {
  const [query, setQuery] = createSignal("");
  const columns = () =>
    props.table
      .getAllLeafColumns()
      .filter((column) => column.getCanHide())
      .filter((column) => {
        const label =
          column.columnDef.meta?.label ?? column.columnDef.header?.toString() ?? column.id;
        return label.toLowerCase().includes(query().toLowerCase());
      });

  return (
    <div
      data-scope="ui-data-table"
      data-part="view-options"
      role="group"
      aria-label="Column visibility"
      class={cn("ui-data-table-view-options", props.class)}
    >
      <input
        type="search"
        value={query()}
        placeholder="Search columns..."
        aria-label="Search columns"
        data-scope="ui-data-table"
        data-part="view-options-search"
        onInput={(event) => setQuery(event.currentTarget.value)}
      />
      <Show when={columns().length > 0} fallback={<span>No hideable columns</span>}>
        <For each={columns()}>
          {(column) => (
            <label data-scope="ui-data-table" data-part="view-option">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              <span>
                {column.columnDef.meta?.label ?? column.columnDef.header?.toString() ?? column.id}
              </span>
            </label>
          )}
        </For>
      </Show>
    </div>
  );
}
