import type { RowData, Table } from "@tanstack/solid-table";
import { createMemo, For } from "solid-js";
import { cn } from "@/lib/cn";

export function DataTablePagination<TData extends RowData>(props: {
  table: Table<TData>;
  pageSizeOptions?: readonly number[];
  class?: string;
}) {
  const pageSizeOptions = createMemo(() => props.pageSizeOptions ?? [10, 20, 50]);

  return (
    <div
      data-scope="ui-data-table"
      data-part="pagination"
      class={cn("ui-data-table-pagination", props.class)}
    >
      <span data-scope="ui-data-table" data-part="selected-summary">
        {props.table.getFilteredSelectedRowModel().rows.length} of{" "}
        {props.table.getFilteredRowModel().rows.length} selected
      </span>
      <span data-scope="ui-data-table" data-part="page-summary">
        Page {props.table.getState().pagination.pageIndex + 1} of {props.table.getPageCount() || 1}
      </span>
      <label data-scope="ui-data-table" data-part="page-size">
        <span>Rows</span>
        <select
          value={String(props.table.getState().pagination.pageSize)}
          onChange={(event) => props.table.setPageSize(Number(event.currentTarget.value))}
        >
          <For each={pageSizeOptions()}>
            {(pageSize) => <option value={pageSize}>{pageSize}</option>}
          </For>
        </select>
      </label>
      <div data-scope="ui-data-table" data-part="page-buttons">
        <button
          type="button"
          onClick={() => props.table.setPageIndex(0)}
          disabled={!props.table.getCanPreviousPage()}
        >
          First
        </button>
        <button
          type="button"
          onClick={() => props.table.previousPage()}
          disabled={!props.table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => props.table.nextPage()}
          disabled={!props.table.getCanNextPage()}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => props.table.setPageIndex(props.table.getPageCount() - 1)}
          disabled={!props.table.getCanNextPage()}
        >
          Last
        </button>
      </div>
    </div>
  );
}
