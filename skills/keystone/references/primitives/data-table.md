# Data Table

Use this guide for data-dense tabular views with sorting, filtering, pagination, column visibility, row actions, skeletons, and empty states.

## Source

- Component source root: `packages/ui/src/components/data-table/`
- Presentational table source: `packages/ui/src/ui/table.tsx`
- Main table: `data-table.tsx`
- Hook: `use-data-table.ts`
- Types: `types.ts`
- Registry item: `registry/default/items/data-table.json`
- Shadcn registry install: `shadcn add https://keystone-ui.dev/r/data-table.json`

## Boundary

TanStack Table owns row models, column definitions, sorting, filtering, pagination, row selection, column visibility, and controlled/uncontrolled table state.

Keystone UI owns the source kit: presentational Table anatomy, native table markup, toolbar, search, faceted filters, view options, column header controls, row actions, pagination controls, empty state, skeleton rows, classes, and data attributes.

Keystone Core is not involved in table state. Do not move table behavior into Core.

## Composition

```tsx
import { createColumnHelper } from "@tanstack/solid-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTable } from "@/components/data-table/use-data-table";

export function ProjectsTable(props: { projects: readonly Project[] }) {
  const column = createColumnHelper<Project>();
  const columns = [
    column.accessor("name", {
      header: (context) => <DataTableColumnHeader column={context.column} title="Name" />,
      cell: (context) => context.getValue(),
    }),
  ];
  const table = useDataTable({ data: () => props.projects, columns });

  return <DataTable table={table} caption="Projects" />;
}
```

Pass `getRowId` whenever rows can reorder, update frequently, or come from server data. Use controlled state plus `manualSorting`, `manualFiltering`, `manualPagination`, and `pageCount` when the server owns row models.

## Accessibility

- Keep native `table`, `caption`, `thead`, `tbody`, `th`, `tr`, and `td` markup intact.
- Headers expose `scope="col"` and `aria-sort`; preserve these when customizing header cells.
- Loading states should set `aria-busy` and render a status row.
- Empty states should be announced through status text.
- Pagination must remain a labelled navigation region with named controls.
- Row action buttons need row-specific accessible names when the visible label is ambiguous.

## Pitfalls

- Do not use row index as identity for mutable or server-backed data; pass `getRowId`.
- Do not put interactive controls in cells without testing keyboard order and focus visibility.
- Do not mix local and server state accidentally. If the server owns sorting, filtering, or pagination, set the matching manual flag.
- Do not add custom table engines; extend the TanStack composition kit.
- Do not hide all columns without an empty or recovery path.

## Verification

- Run `bun run check-types` after table source, columns, or registry metadata changes.
- Keyboard check: sort buttons, filters, view options, row actions, and pagination are reachable in order.
- State check: sorting, filtering, pagination, row selection, and column visibility survive updates as intended.
- Responsive check: dense content scrolls inside the table viewport without breaking page layout.
- SSR/hydration check: row identity is stable between server and client when rendered in app routes.
