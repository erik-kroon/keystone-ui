# UI DataTable Vertical

## Status

Proven for the first-party UI registry item tracked by [#233](https://github.com/erik-kroon/core-ui/issues/233).

## Audit

Existing reusable pieces:

- `packages/ui/src/default/components/data-table/data-table.tsx`: native table renderer around a TanStack Table instance.
- `packages/ui/src/default/components/data-table/use-data-table.ts`: Solid Table setup with sorting, filtering, pagination, column visibility, row selection, faceting, and stable row ID support.
- `packages/ui/src/default/components/data-table/data-table-toolbar.tsx`: filter/search toolbar driven by TanStack column metadata.
- `packages/ui/src/default/components/data-table/data-table-column-header.tsx`: sortable/hideable header controls.
- `packages/ui/src/default/components/data-table/data-table-faceted-filter.tsx`: native checkbox/radio filter controls.
- `packages/ui/src/default/components/data-table/data-table-pagination.tsx`: native pagination controls and page size select.
- `packages/ui/src/default/components/data-table/data-table-view-options.tsx`: column visibility controls.
- `packages/ui/src/default/components/data-table/data-table-row-actions.tsx`: source-owned action slot helper.
- `packages/ui/src/default/components/data-table/data-table-empty-state.tsx`: `DataTableEmpty` empty-state row renderer with `DataTableEmptyState` kept as a compatibility alias.
- `packages/ui/src/default/components/data-table/data-table-search.ts` and `use-data-table-router.ts`: TanStack Router search-param adapter.
- `registry/default/items/data-table.json` and `data-table-tanstack-router.json`: Mason multi-file registry metadata.

Missing before this vertical:

- Explicit DataTable API and state ownership notes in registry metadata.
- Controlled-state callbacks for local DataTable usage outside the router adapter.
- Reactive data/column accessors for frequent row updates.
- Explicit table accessibility/data-attribute contract beyond native implicit semantics.
- Source-contract tests for generated DataTable ARIA, native-control, state, and metadata guarantees.

## End-State Contract

DataTable is a UI-owned TanStack Table source kit. It does not implement a table engine, virtualizer, fetcher, or persistence layer. App behavior comes from `@tanstack/solid-table`; Keystone UI owns readable composition, native controls, styling hooks, and registry metadata.

API:

- `DataTable` receives a TanStack `Table<TData>` instance plus optional `caption`, toolbar/header slot, `empty`, `loading`, `skeletonRows`, `pageSizeOptions`, and `pagination`.
- `useDataTable` accepts `data` and `columns` as values or Solid accessors, `getRowId`, `initialState`, optional controlled `state` slices, matching `on*Change` callbacks, `manualSorting`, `manualFiltering`, `manualPagination`, and `pageCount`.
- `useDataTableRouter` maps TanStack Router search params to pagination, sorting, filters, and visibility while leaving row selection local.

Anatomy and attributes:

- Stable `data-scope="ui-data-table"` appears on all public parts.
- Stable parts include `root`, `header-slot`, `viewport`, `table`, `caption`, `header`, `header-row`, `head`, `body`, `row`, `cell`, `empty-row`, `empty`, `skeleton-status-row`, `skeleton-status`, `skeleton-row`, `skeleton-cell`, `column-header`, `sort-trigger`, `sort-clear`, `column-hide`, `toolbar`, `search`, `reset`, `toolbar-actions`, `faceted-filter`, `faceted-option`, `faceted-control`, `faceted-count`, `faceted-clear`, `view-options`, `view-options-search`, `view-option`, `view-option-control`, `row-actions`, `row-action`, `pagination`, `selected-summary`, `page-summary`, `page-size`, `page-size-select`, `page-buttons`, and `page-button`.
- Root exposes `data-loading` and `data-empty`.
- Header cells expose `data-sort` and `aria-sort`.
- Selected rows expose `data-selected`, `data-state="selected"`, and `aria-selected`.
- Faceted options expose `data-state` and `data-value`; pagination buttons expose `data-page`; row action buttons expose optional `data-action` and `data-variant`.

Accessibility:

- Native table semantics are preferred over ARIA table reimplementation.
- Caption, table, header, body, row, cell, button, search input, checkbox, radio, select, fieldset, legend, and label semantics are used directly.
- Loading sets `aria-busy` on the root.
- Pagination is a labelled navigation region with live page/selection summaries.
- Empty and skeleton loading rows use `role="status"` while decorative skeleton cells are hidden from assistive technology.
- Sorting, clearing, hiding, searching, pagination, and row-action controls are keyboard reachable through native elements.

SSR and hydration:

- Source renders deterministic native markup and does not read browser globals during render.
- Apps should pass `getRowId` when rows can reorder or update frequently so selection and hydration-sensitive row identity do not depend on array index.

Known limitations:

- Virtualization, server fetching orchestration, persisted views, drag column sizing/ordering, and advanced query builders remain future app-code or companion-item work.
- The router adapter validates basic search-param shape but does not own loader integration or debounced URL writes.
