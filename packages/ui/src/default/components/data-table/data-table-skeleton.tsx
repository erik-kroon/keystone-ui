import { For } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableSkeleton(props: { columns: number; rows?: number; class?: string }) {
  return (
    <>
      <tr data-scope="ui-data-table" data-part="skeleton-status-row">
        <td
          colSpan={Math.max(props.columns, 1)}
          role="status"
          data-scope="ui-data-table"
          data-part="skeleton-status"
          class="ui-data-table-skeleton-status"
        >
          Loading table rows
        </td>
      </tr>
      <For each={Array.from({ length: props.rows ?? 5 })}>
        {() => (
          <tr data-scope="ui-data-table" data-part="skeleton-row" aria-hidden="true">
            <For each={Array.from({ length: Math.max(props.columns, 1) })}>
              {() => (
                <td
                  data-scope="ui-data-table"
                  data-part="skeleton-cell"
                  class={cn("ui-data-table-skeleton-cell", props.class)}
                />
              )}
            </For>
          </tr>
        )}
      </For>
    </>
  );
}
