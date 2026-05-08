import type { Column, RowData } from "@tanstack/solid-table";
import { createMemo, Show, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableColumnHeader<TData extends RowData, TValue>(props: {
  column: Column<TData, TValue>;
  label?: string;
  title: JSX.Element;
  class?: string;
}) {
  const sorted = createMemo(() => props.column.getIsSorted());
  const label = createMemo(
    () => props.label ?? props.column.columnDef.meta?.label ?? props.column.id,
  );

  return (
    <div
      data-scope="ui-data-table"
      data-part="column-header"
      data-sort={sorted() || "none"}
      class={cn("ui-data-table-column-header", props.class)}
    >
      <button
        type="button"
        disabled={!props.column.getCanSort()}
        aria-label={`Sort ${label()}`}
        data-scope="ui-data-table"
        data-part="sort-trigger"
        class="cursor-pointer disabled:pointer-events-none"
        onClick={props.column.getToggleSortingHandler()}
      >
        <span>{props.title}</span>
        <span aria-hidden="true">
          {sorted() === "asc" ? "Asc" : sorted() === "desc" ? "Desc" : "Sort"}
        </span>
      </button>
      <Show when={props.column.getCanSort() && sorted()}>
        <button
          type="button"
          aria-label={`Clear ${label()} sorting`}
          data-scope="ui-data-table"
          data-part="sort-clear"
          class="cursor-pointer"
          onClick={() => props.column.clearSorting()}
        >
          Clear
        </button>
      </Show>
      <Show when={props.column.getCanHide()}>
        <button
          type="button"
          aria-label={`Hide ${label()} column`}
          data-scope="ui-data-table"
          data-part="column-hide"
          class="cursor-pointer"
          onClick={() => props.column.toggleVisibility(false)}
        >
          Hide
        </button>
      </Show>
    </div>
  );
}
