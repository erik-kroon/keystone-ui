import type { JSX } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTableEmptyState(props: {
  colSpan: number;
  label?: JSX.Element;
  class?: string;
}) {
  return <DataTableEmpty {...props} />;
}

export function DataTableEmpty(props: { colSpan: number; label?: JSX.Element; class?: string }) {
  return (
    <tr data-scope="ui-data-table" data-part="empty-row">
      <td
        colSpan={Math.max(props.colSpan, 1)}
        role="status"
        data-scope="ui-data-table"
        data-part="empty"
        class={cn("ui-data-table-empty", props.class)}
      >
        {props.label ?? "No results."}
      </td>
    </tr>
  );
}
