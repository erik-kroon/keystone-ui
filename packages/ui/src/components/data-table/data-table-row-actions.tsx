import { createMemo, For } from "solid-js";
import type { Row, RowData } from "@tanstack/solid-table";
import { cn } from "@/lib/cn";
import type { DataTableRowAction } from "./types";

export function DataTableRowActions<TData extends RowData>(props: {
  row: Row<TData>;
  actions: readonly DataTableRowAction<TData>[];
  class?: string;
  label?: string;
}) {
  const actions = createMemo(() =>
    props.actions.filter((action) => !resolveRowActionState(action.hidden, props.row)),
  );

  return (
    <div
      data-scope="ui-data-table"
      data-part="row-actions"
      role="group"
      aria-label={props.label ?? "Row actions"}
      class={cn("ui-data-table-row-actions", props.class)}
    >
      <For each={actions()}>
        {(action) => (
          <button
            type="button"
            disabled={resolveRowActionState(action.disabled, props.row)}
            aria-label={action.ariaLabel}
            data-scope="ui-data-table"
            data-part="row-action"
            data-action={action.id}
            data-variant={action.variant}
            onClick={(event) => action.onSelect(props.row, event)}
          >
            {action.label}
          </button>
        )}
      </For>
    </div>
  );
}

function resolveRowActionState<TData extends RowData>(
  value: boolean | ((row: Row<TData>) => boolean) | undefined,
  row: Row<TData>,
) {
  return typeof value === "function" ? value(row) : value;
}
