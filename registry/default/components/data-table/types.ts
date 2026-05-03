import type { ColumnDef, Row, RowData, Table } from "@tanstack/solid-table";
import type { JSX } from "solid-js";

export type DataTableFilterVariant = "text" | "select" | "multiSelect";

export type DataTableOption = {
  label: string;
  value: string;
  count?: number;
};

export type DataTableColumnMeta = {
  label?: string;
  placeholder?: string;
  variant?: DataTableFilterVariant;
  options?: readonly DataTableOption[];
};

export type DataTableFacetedFilterConfig<TData extends RowData> = {
  columnId: string;
  title: string;
  options: readonly DataTableOption[];
  multiple?: boolean;
  emptyLabel?: string;
  getOptionCount?: (table: Table<TData>, value: string) => number | undefined;
};

export type DataTableRowAction<TData extends RowData> = {
  label: string;
  onSelect: (row: Row<TData>) => void;
  disabled?: (row: Row<TData>) => boolean;
};

export type DataTableColumns<TData extends RowData> = ColumnDef<TData, unknown>[];

export type DataTableSlot = JSX.Element;

declare module "@tanstack/solid-table" {
  interface ColumnMeta<TData extends RowData, TValue> extends DataTableColumnMeta {}
}
