import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table";

export type DataTableSearch = {
  page?: number;
  perPage?: number;
  sort?: SortingState;
  filters?: ColumnFiltersState;
  visibility?: VisibilityState;
};

export function validateDataTableSearch(search: Record<string, unknown>): DataTableSearch {
  return {
    page: positiveNumber(search.page, 1),
    perPage: positiveNumber(search.perPage, 10),
    sort: sortingState(search.sort),
    filters: columnFiltersState(search.filters),
    visibility: visibilityState(search.visibility),
  };
}

function positiveNumber(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function sortingState(value: unknown): SortingState {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const sort = item as { desc?: unknown; id?: unknown };
    return typeof sort.id === "string" ? [{ id: sort.id, desc: sort.desc === true }] : [];
  });
}

function columnFiltersState(value: unknown): ColumnFiltersState {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const filter = item as { id?: unknown; value?: unknown };
    return typeof filter.id === "string" ? [{ id: filter.id, value: filter.value }] : [];
  });
}

function visibilityState(value: unknown): VisibilityState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, visible]) =>
      typeof visible === "boolean" ? [[key, visible]] : [],
    ),
  );
}

export function dataTableSearchToInitialState(search: DataTableSearch): {
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  sorting: SortingState;
} {
  return {
    columnFilters: search.filters ?? [],
    columnVisibility: search.visibility ?? {},
    pagination: {
      pageIndex: Math.max((search.page ?? 1) - 1, 0),
      pageSize: search.perPage ?? 10,
    },
    sorting: search.sort ?? [],
  };
}
