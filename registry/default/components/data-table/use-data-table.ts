import {
  createSolidTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type FilterFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/solid-table";
import { createSignal } from "solid-js";
import type { DataTableColumns } from "./types";

export type UseDataTableOptions<TData extends RowData> = {
  columns: DataTableColumns<TData>;
  data: readonly TData[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  initialState?: {
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    sorting?: SortingState;
  };
};

export const dataTableFacetedFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const selected = Array.isArray(filterValue) ? filterValue : [];
  if (selected.length === 0) return true;
  return selected.includes(String(row.getValue(columnId)));
};

export function useDataTable<TData extends RowData>(options: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = createSignal<SortingState>(options.initialState?.sorting ?? []);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    options.initialState?.columnFilters ?? [],
  );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    options.initialState?.columnVisibility ?? {},
  );
  const [pagination, setPagination] = createSignal<PaginationState>(
    options.initialState?.pagination ?? { pageIndex: 0, pageSize: 10 },
  );
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>(
    options.initialState?.rowSelection ?? {},
  );

  return createSolidTable<TData>({
    get data() {
      return [...options.data];
    },
    get columns() {
      return options.columns;
    },
    get state() {
      return {
        sorting: sorting(),
        columnFilters: columnFilters(),
        columnVisibility: columnVisibility(),
        pagination: pagination(),
        rowSelection: rowSelection(),
      };
    },
    filterFns: {
      dataTableFaceted: dataTableFacetedFilter,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: options.getRowId,
    onSortingChange: (updater) => setSorting((current) => applyUpdater(updater, current)),
    onColumnFiltersChange: (updater) =>
      setColumnFilters((current) => applyUpdater(updater, current)),
    onColumnVisibilityChange: (updater) =>
      setColumnVisibility((current) => applyUpdater(updater, current)),
    onPaginationChange: (updater) => setPagination((current) => applyUpdater(updater, current)),
    onRowSelectionChange: (updater) => setRowSelection((current) => applyUpdater(updater, current)),
  });
}

function applyUpdater<TValue>(updater: Updater<TValue>, current: TValue): TValue {
  return typeof updater === "function" ? (updater as (value: TValue) => TValue)(current) : updater;
}
