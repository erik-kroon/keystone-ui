import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cn } from "@/lib/cn";

type KeystoneTableDataAttributes = {
  "data-part"?: string;
  "data-scope"?: string;
  "data-slot"?: string;
};

export type TableContainerProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & KeystoneTableDataAttributes
>;
export type TableProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableElement> & KeystoneTableDataAttributes
>;
export type TableHeaderProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableSectionElement> & KeystoneTableDataAttributes
>;
export type TableBodyProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableSectionElement> & KeystoneTableDataAttributes
>;
export type TableFooterProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableSectionElement> & KeystoneTableDataAttributes
>;
export type TableRowProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableRowElement> & KeystoneTableDataAttributes
>;
export type TableHeadProps = ParentProps<
  JSX.ThHTMLAttributes<HTMLTableCellElement> & KeystoneTableDataAttributes
>;
export type TableCellProps = ParentProps<
  JSX.TdHTMLAttributes<HTMLTableCellElement> & KeystoneTableDataAttributes
>;
export type TableCaptionProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableCaptionElement> & KeystoneTableDataAttributes
>;

const classes = (...tokens: string[]) => tokens.join(" ");

export function TableContainer(props: TableContainerProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <div
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "container"}
      data-slot={local["data-slot"] ?? "table-container"}
      class={cn(
        classes(
          "ui-table-container",
          "relative",
          "w-full",
          "overflow-x-auto",
          "rounded-lg",
          "border",
          "bg-background",
          "not-dark:bg-clip-padding",
          "shadow-xs/5",
        ),
        local.class,
      )}
    />
  );
}

export function Table(props: TableProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <table
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "root"}
      data-slot={local["data-slot"] ?? "table"}
      class={cn("ui-table w-full caption-bottom border-collapse text-sm tabular-nums", local.class)}
    />
  );
}

export function TableHeader(props: TableHeaderProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <thead
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "header"}
      data-slot={local["data-slot"] ?? "table-header"}
      class={cn("ui-table-header [&_tr]:border-b", local.class)}
    />
  );
}

export function TableBody(props: TableBodyProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <tbody
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "body"}
      data-slot={local["data-slot"] ?? "table-body"}
      class={cn("ui-table-body [&_tr:last-child]:border-0", local.class)}
    />
  );
}

export function TableFooter(props: TableFooterProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <tfoot
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "footer"}
      data-slot={local["data-slot"] ?? "table-footer"}
      class={cn(
        "ui-table-footer border-t bg-muted/40 font-medium [&>tr]:last:border-b-0",
        local.class,
      )}
    />
  );
}

export function TableRow(props: TableRowProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <tr
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "row"}
      data-slot={local["data-slot"] ?? "table-row"}
      class={cn(
        classes(
          "ui-table-row",
          "border-b",
          "transition-colors",
          "hover:bg-muted/40",
          "data-[state=selected]:bg-muted/64",
          "data-selected:bg-muted/64",
        ),
        local.class,
      )}
    />
  );
}

export function TableHead(props: TableHeadProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <th
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "head"}
      data-slot={local["data-slot"] ?? "table-head"}
      class={cn(
        classes(
          "ui-table-head",
          "h-9",
          "px-3",
          "text-left",
          "align-middle",
          "font-medium",
          "text-muted-foreground",
          "[&:has([role=checkbox])]:pe-0",
        ),
        local.class,
      )}
    />
  );
}

export function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <td
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "cell"}
      data-slot={local["data-slot"] ?? "table-cell"}
      class={cn("ui-table-cell p-3 align-middle [&:has([role=checkbox])]:pe-0", local.class)}
    />
  );
}

export function TableCaption(props: TableCaptionProps) {
  const [local, rest] = splitProps(props, ["class", "data-part", "data-scope", "data-slot"]);

  return (
    <caption
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "caption"}
      data-slot={local["data-slot"] ?? "table-caption"}
      class={cn("ui-table-caption mt-3 text-muted-foreground text-sm", local.class)}
    />
  );
}
