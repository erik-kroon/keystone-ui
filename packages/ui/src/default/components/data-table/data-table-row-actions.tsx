import { For } from "solid-js";
import type { Row, RowData } from "@tanstack/solid-table";
import { cn } from "@/lib/cn";
import type { DataTableRowAction } from "./types";

export function DataTableRowActions<TData extends RowData>(props: {
  row: Row<TData>;
  actions: readonly DataTableRowAction<TData>[];
  class?: string;
}) {
  return (
    <div
      data-scope="ui-data-table"
      data-part="row-actions"
      class={cn("ui-data-table-row-actions", props.class)}
    >
      <For each={props.actions}>
        {(action) => (
          <button
            type="button"
            disabled={action.disabled?.(props.row)}
            onClick={() => action.onSelect(props.row)}
          >
            {action.label}
          </button>
        )}
      </For>
    </div>
  );
}
