import type { Column, RowData } from "@tanstack/solid-table";
import { createMemo, Show, type JSX } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableColumnHeader<TData extends RowData, TValue>(props: {
  column: Column<TData, TValue>;
  title: JSX.Element;
  class?: string;
}) {
  const sorted = createMemo(() => props.column.getIsSorted());

  return (
    <div
      data-scope="mason-data-table"
      data-part="column-header"
      data-sort={sorted() || "none"}
      class={cn("mason-data-table-column-header", props.class)}
    >
      <button
        type="button"
        disabled={!props.column.getCanSort()}
        onClick={props.column.getToggleSortingHandler()}
      >
        <span>{props.title}</span>
        <span aria-hidden="true">
          {sorted() === "asc" ? "Asc" : sorted() === "desc" ? "Desc" : "Sort"}
        </span>
      </button>
      <Show when={props.column.getCanSort() && sorted()}>
        <button type="button" onClick={() => props.column.clearSorting()}>
          Clear
        </button>
      </Show>
      <Show when={props.column.getCanHide()}>
        <button type="button" onClick={() => props.column.toggleVisibility(false)}>
          Hide
        </button>
      </Show>
    </div>
  );
}
