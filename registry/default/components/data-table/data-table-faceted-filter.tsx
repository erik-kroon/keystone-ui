import type { RowData, Table } from "@tanstack/solid-table";
import { createMemo, For, Show } from "solid-js";
import { cn } from "@/lib/cn";
import type { DataTableOption } from "./types";

export function DataTableFacetedFilter<TData extends RowData>(props: {
  table: Table<TData>;
  columnId: string;
  title: string;
  options: readonly DataTableOption[];
  multiple?: boolean;
  emptyLabel?: string;
  getOptionCount?: (table: Table<TData>, value: string) => number | undefined;
  class?: string;
}) {
  const column = createMemo(() => props.table.getColumn(props.columnId));
  const selectedValues = createMemo(() => {
    const value = column()?.getFilterValue();
    return new Set(
      Array.isArray(value) ? value.map(String) : typeof value === "string" ? [value] : [],
    );
  });
  const optionCount = (option: DataTableOption) =>
    props.getOptionCount?.(props.table, option.value) ??
    option.count ??
    column()?.getFacetedUniqueValues().get(option.value);

  return (
    <fieldset
      data-scope="mason-data-table"
      data-part="faceted-filter"
      class={cn("mason-data-table-faceted-filter", props.class)}
    >
      <legend>{props.title}</legend>
      <Show
        when={props.options.length > 0}
        fallback={<span>{props.emptyLabel ?? "No filters"}</span>}
      >
        <For each={props.options}>
          {(option) => {
            const checked = createMemo(() => selectedValues().has(option.value));
            return (
              <label data-scope="mason-data-table" data-part="faceted-option">
                <input
                  type={props.multiple === false ? "radio" : "checkbox"}
                  checked={checked()}
                  onChange={() => {
                    const next = new Set(selectedValues());
                    if (props.multiple === false) {
                      next.clear();
                      if (!checked()) next.add(option.value);
                    } else if (next.has(option.value)) {
                      next.delete(option.value);
                    } else {
                      next.add(option.value);
                    }

                    const values = Array.from(next);
                    column()?.setFilterValue(values.length > 0 ? values : undefined);
                    props.table.setPageIndex(0);
                  }}
                />
                <span>{option.label}</span>
                <Show when={optionCount(option) !== undefined}>
                  <span data-scope="mason-data-table" data-part="faceted-count">
                    {optionCount(option)}
                  </span>
                </Show>
              </label>
            );
          }}
        </For>
      </Show>
      <Show when={selectedValues().size > 0}>
        <button
          type="button"
          data-scope="mason-data-table"
          data-part="faceted-clear"
          onClick={() => column()?.setFilterValue(undefined)}
        >
          Clear
        </button>
      </Show>
    </fieldset>
  );
}
