import {
  createSolidTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/solid-table";
import { createMemo, createSignal, type Accessor } from "solid-js";
import { dataTableFacetedFilter } from "./use-data-table";
import type { DataTableSearch } from "./data-table-search";
import type { DataTableColumns } from "./types";

type MaybeAccessor<TValue> = TValue | Accessor<TValue>;

export type DataTableRouterNavigate = (options: {
  replace?: boolean;
  search: (previous: DataTableSearch) => DataTableSearch;
}) => void | Promise<void>;

export type UseDataTableRouterOptions<TData extends RowData> = {
  columns: MaybeAccessor<DataTableColumns<TData>>;
  data: MaybeAccessor<readonly TData[]>;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  navigate: DataTableRouterNavigate;
  search: Accessor<DataTableSearch> | DataTableSearch;
};

export function useDataTableRouter<TData extends RowData>(
  options: UseDataTableRouterOptions<TData>,
) {
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({});
  const search = createMemo(() =>
    typeof options.search === "function" ? options.search() : options.search,
  );
  const pagination = createMemo<PaginationState>(() => ({
    pageIndex: Math.max((search().page ?? 1) - 1, 0),
    pageSize: search().perPage ?? 10,
  }));
  const sorting = createMemo<SortingState>(() => search().sort ?? []);
  const columnFilters = createMemo<ColumnFiltersState>(() => search().filters ?? []);
  const columnVisibility = createMemo<VisibilityState>(() => search().visibility ?? {});

  return createSolidTable<TData>({
    get data() {
      return [...resolveDataTableOption(options.data)];
    },
    get columns() {
      return resolveDataTableOption(options.columns);
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
    onPaginationChange: (updater) => {
      options.navigate({
        replace: true,
        search: (previous) => {
          const next = applyUpdater(updater, {
            pageIndex: Math.max((previous.page ?? 1) - 1, 0),
            pageSize: previous.perPage ?? 10,
          });
          return { ...previous, page: next.pageIndex + 1, perPage: next.pageSize };
        },
      });
    },
    onSortingChange: (updater) => {
      options.navigate({
        replace: true,
        search: (previous) => ({
          ...previous,
          page: 1,
          sort: applyUpdater(updater, previous.sort ?? []),
        }),
      });
    },
    onColumnFiltersChange: (updater) => {
      options.navigate({
        replace: true,
        search: (previous) => ({
          ...previous,
          page: 1,
          filters: applyUpdater(updater, previous.filters ?? []),
        }),
      });
    },
    onColumnVisibilityChange: (updater) => {
      options.navigate({
        replace: true,
        search: (previous) => ({
          ...previous,
          visibility: applyUpdater(updater, previous.visibility ?? {}),
        }),
      });
    },
    onRowSelectionChange: (updater) => setRowSelection((current) => applyUpdater(updater, current)),
  });
}

function applyUpdater<TValue>(updater: Updater<TValue>, current: TValue): TValue {
  return typeof updater === "function" ? (updater as (value: TValue) => TValue)(current) : updater;
}

function resolveDataTableOption<TValue>(value: MaybeAccessor<TValue>): TValue {
  return typeof value === "function" ? (value as Accessor<TValue>)() : value;
}
