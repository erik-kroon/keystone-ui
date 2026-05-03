import type { JSX } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableEmptyState(props: {
  colSpan: number;
  label?: JSX.Element;
  class?: string;
}) {
  return (
    <tr data-scope="mason-data-table" data-part="empty-row">
      <td
        colSpan={Math.max(props.colSpan, 1)}
        data-scope="mason-data-table"
        data-part="empty"
        class={cn("mason-data-table-empty", props.class)}
      >
        {props.label ?? "No results."}
      </td>
    </tr>
  );
}
