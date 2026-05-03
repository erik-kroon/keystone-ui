import { For } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableSkeleton(props: { columns: number; rows?: number; class?: string }) {
  return (
    <For each={Array.from({ length: props.rows ?? 5 })}>
      {(_, rowIndex) => (
        <tr data-scope="mason-data-table" data-part="skeleton-row">
          <For each={Array.from({ length: Math.max(props.columns, 1) })}>
            {(_, columnIndex) => (
              <td
                data-scope="mason-data-table"
                data-part="skeleton-cell"
                class={cn("mason-data-table-skeleton-cell", props.class)}
              >
                <span>{`Loading row ${rowIndex() + 1}, column ${columnIndex() + 1}`}</span>
              </td>
            )}
          </For>
        </tr>
      )}
    </For>
  );
}
