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
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/solid-table";
import { createSignal, type Accessor } from "solid-js";
import type { DataTableColumns } from "./types";

type MaybeAccessor<TValue> = TValue | Accessor<TValue>;

export type UseDataTableOptions<TData extends RowData> = {
  columns: MaybeAccessor<DataTableColumns<TData>>;
  data: MaybeAccessor<readonly TData[]>;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  initialState?: {
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    sorting?: SortingState;
  };
  state?: {
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
    pagination?: PaginationState;
    rowSelection?: RowSelectionState;
    sorting?: SortingState;
  };
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSortingChange?: OnChangeFn<SortingState>;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  pageCount?: number;
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
      return [...resolveDataTableOption(options.data)];
    },
    get columns() {
      return resolveDataTableOption(options.columns);
    },
    get state() {
      return {
        columnFilters: options.state?.columnFilters ?? columnFilters(),
        columnVisibility: options.state?.columnVisibility ?? columnVisibility(),
        pagination: options.state?.pagination ?? pagination(),
        rowSelection: options.state?.rowSelection ?? rowSelection(),
        sorting: options.state?.sorting ?? sorting(),
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
    manualFiltering: options.manualFiltering,
    manualPagination: options.manualPagination,
    manualSorting: options.manualSorting,
    pageCount: options.pageCount,
    onSortingChange: (updater) => {
      setSorting((current) => applyUpdater(updater, options.state?.sorting ?? current));
      options.onSortingChange?.(updater);
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters((current) => applyUpdater(updater, options.state?.columnFilters ?? current));
      options.onColumnFiltersChange?.(updater);
    },
    onColumnVisibilityChange: (updater) => {
      setColumnVisibility((current) =>
        applyUpdater(updater, options.state?.columnVisibility ?? current),
      );
      options.onColumnVisibilityChange?.(updater);
    },
    onPaginationChange: (updater) => {
      setPagination((current) => applyUpdater(updater, options.state?.pagination ?? current));
      options.onPaginationChange?.(updater);
    },
    onRowSelectionChange: (updater) => {
      setRowSelection((current) => applyUpdater(updater, options.state?.rowSelection ?? current));
      options.onRowSelectionChange?.(updater);
    },
  });
}

function applyUpdater<TValue>(updater: Updater<TValue>, current: TValue): TValue {
  return typeof updater === "function" ? (updater as (value: TValue) => TValue)(current) : updater;
}

function resolveDataTableOption<TValue>(value: MaybeAccessor<TValue>): TValue {
  return typeof value === "function" ? (value as Accessor<TValue>)() : value;
}
