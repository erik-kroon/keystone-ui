import {
  createContext,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";
import { cn } from "@/lib/cn";

export type TableVariant = "default" | "card";

type KeystoneTableDataAttributes = {
  "data-part"?: string;
  "data-scope"?: string;
  "data-slot"?: string;
  "data-variant"?: string;
};

export type TableContainerProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> &
    KeystoneTableDataAttributes & {
      variant?: TableVariant;
    }
>;
export type TableProps = ParentProps<
  JSX.HTMLAttributes<HTMLTableElement> &
    KeystoneTableDataAttributes & {
      variant?: TableVariant;
    }
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
const defaultTableVariant: Accessor<TableVariant> = () => "default";
const TableVariantContext = createContext<Accessor<TableVariant>>(defaultTableVariant);

export function TableContainer(props: TableContainerProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "data-part",
    "data-scope",
    "data-slot",
    "data-variant",
    "variant",
  ]);
  const variant = () => local.variant ?? "default";

  return (
    <TableVariantContext.Provider value={variant}>
      <div
        {...rest}
        data-scope={local["data-scope"] ?? "ui-table"}
        data-part={local["data-part"] ?? "container"}
        data-slot={local["data-slot"] ?? "table-container"}
        data-variant={local["data-variant"] ?? variant()}
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
            "data-[variant=card]:rounded-2xl",
            "data-[variant=card]:border-border/72",
            "data-[variant=card]:bg-card",
            "data-[variant=card]:text-card-foreground",
            "data-[variant=card]:shadow-xs/5",
          ),
          local.class,
        )}
      />
    </TableVariantContext.Provider>
  );
}

export function Table(props: TableProps) {
  const containerVariant = useContext(TableVariantContext);
  const [local, rest] = splitProps(props, [
    "class",
    "data-part",
    "data-scope",
    "data-slot",
    "data-variant",
    "variant",
  ]);
  const variant = () => local.variant ?? containerVariant();

  return (
    <table
      {...rest}
      data-scope={local["data-scope"] ?? "ui-table"}
      data-part={local["data-part"] ?? "root"}
      data-slot={local["data-slot"] ?? "table"}
      data-variant={local["data-variant"] ?? variant()}
      class={cn(
        classes(
          "ui-table",
          "w-full",
          "caption-bottom",
          "border-collapse",
          "text-sm",
          "tabular-nums",
          "data-[variant=card]:border-separate",
          "data-[variant=card]:border-spacing-0",
        ),
        local.class,
      )}
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
      class={cn(
        "ui-table-header [&_tr]:border-b in-data-[variant=card]:[&_tr]:border-0",
        local.class,
      )}
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
      class={cn(
        classes(
          "ui-table-body",
          "[&_tr:last-child]:border-0",
          "in-data-[variant=card]:relative",
          "in-data-[variant=card]:rounded-xl",
          "in-data-[variant=card]:shadow-xs/5",
          "in-data-[variant=card]:[&_tr]:border-0",
          "in-data-[variant=card]:[&_tr>td]:border-b",
          "in-data-[variant=card]:[&_tr>td]:border-border/72",
          "in-data-[variant=card]:[&_tr>td]:bg-card",
          "in-data-[variant=card]:[&_tr:first-child>td]:border-t",
          "in-data-[variant=card]:[&_tr>td:first-child]:border-s",
          "in-data-[variant=card]:[&_tr>td:last-child]:border-e",
          "in-data-[variant=card]:[&_tr:first-child>td:first-child]:rounded-ss-xl",
          "in-data-[variant=card]:[&_tr:first-child>td:last-child]:rounded-se-xl",
          "in-data-[variant=card]:[&_tr:last-child>td:first-child]:rounded-es-xl",
          "in-data-[variant=card]:[&_tr:last-child>td:last-child]:rounded-ee-xl",
          "in-data-[variant=card]:[&_tr:hover>td]:bg-muted/28",
          "in-data-[variant=card]:[&_tr[data-state=selected]>td]:bg-muted/48",
          "in-data-[variant=card]:[&_tr[data-selected]>td]:bg-muted/48",
        ),
        local.class,
      )}
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
        classes(
          "ui-table-footer",
          "border-t",
          "bg-muted/40",
          "font-medium",
          "[&>tr]:last:border-b-0",
          "in-data-[variant=card]:border-0",
          "in-data-[variant=card]:bg-transparent",
          "in-data-[variant=card]:[&_td]:border-0",
          "in-data-[variant=card]:[&_td]:bg-transparent",
          "in-data-[variant=card]:[&_td]:pt-4",
          "in-data-[variant=card]:[&_td]:pb-3.5",
        ),
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
          "in-data-[variant=card]:border-0",
          "in-data-[variant=card]:hover:bg-transparent",
          "in-data-[variant=card]:data-[state=selected]:bg-transparent",
          "in-data-[variant=card]:data-selected:bg-transparent",
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
          "whitespace-nowrap",
          "text-left",
          "align-middle",
          "font-medium",
          "leading-none",
          "text-muted-foreground",
          "[&:has([role=checkbox])]:pe-0",
          "in-data-[variant=card]:h-10",
          "in-data-[variant=card]:px-4",
          "in-data-[variant=card]:text-muted-foreground/88",
          "has-[[role=checkbox]]:w-px",
          "first:has-[[role=checkbox]]:pe-0",
          "last:has-[[role=checkbox]]:ps-0",
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
      class={cn(
        classes(
          "ui-table-cell",
          "bg-clip-padding",
          "p-3",
          "align-middle",
          "[&:has([role=checkbox])]:pe-0",
          "in-data-[variant=card]:px-4",
          "in-data-[variant=card]:py-3.5",
          "in-data-[variant=card]:leading-tight",
          "in-data-[variant=card]:whitespace-nowrap",
          "in-data-[slot=table-footer]:py-3.5",
          "has-[[role=checkbox]]:w-px",
          "first:has-[[role=checkbox]]:pe-0",
          "last:has-[[role=checkbox]]:ps-0",
        ),
        local.class,
      )}
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
      class={cn(
        "ui-table-caption mt-0 border-border/64 border-t px-3 py-3 text-center text-muted-foreground text-sm leading-none in-data-[variant=card]:border-t-0 in-data-[variant=card]:pt-2 in-data-[variant=card]:pb-3.5",
        local.class,
      )}
    />
  );
}
