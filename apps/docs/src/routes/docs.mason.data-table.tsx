import { createFileRoute, Link } from "@tanstack/solid-router";
import { ArrowLeft, BookOpen, FileJson2, Layers3, Table2 } from "lucide-solid";
import { For } from "solid-js";

export const Route = createFileRoute("/docs/mason/data-table")({
  component: MasonDataTableDocs,
});

const capabilities = [
  "Core, sorted, filtered, faceted, and paginated row models are TanStack Table concerns.",
  "Mason owns readable toolbar, header, faceted filter, empty, skeleton, pagination, and row action source.",
  "TanStack Router URL state ships as an optional adapter instead of a generic query-state dependency.",
  "Server pagination, virtualization, saved views, and advanced filters remain separate verticals.",
];

function MasonDataTableDocs() {
  return (
    <main class="doc-page mason-doc-page">
      <div class="doc-shell">
        <Link to="/" class="back-link">
          <ArrowLeft size={17} />
          Overview
        </Link>

        <section class="doc-hero">
          <div>
            <p class="eyebrow">Mason component</p>
            <h1>DataTable</h1>
            <p class="doc-lede">
              A TanStack Table data grid starter for Solid apps. It proves Mason can ship serious
              app components as editable source without adding table behavior to Keystone.
            </p>
          </div>

          <div class="doc-fact-panel" aria-label="Mason DataTable registry facts">
            <span>Registry type</span>
            <strong>registry:ui</strong>
            <span>App behavior</span>
            <strong>@tanstack/solid-table</strong>
            <span>Generated parts</span>
            <strong>toolbar, filters, pagination</strong>
          </div>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<FileJson2 size={19} />} title="Install">
            <pre>
              <code>{`bunx mason add data-table
bunx mason add data-table --dry-run`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="Usage">
            <pre>
              <code>{`import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { dataTableFacetedFilter, useDataTable } from "~/components/data-table/use-data-table";

type Invoice = { id: string; customer: string; status: "paid" | "open"; total: number };

const columns: ColumnDef<Invoice, unknown>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    meta: { label: "Customer", placeholder: "Search customers", variant: "text" },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: dataTableFacetedFilter,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Open", value: "open" },
      ],
    },
  },
  { accessorKey: "total", header: "Total" },
];

const table = useDataTable({ data: invoices, columns });

<DataTable table={table}>
  <DataTableToolbar table={table} />
</DataTable>;`}</code>
            </pre>
          </DocSection>

          <DocSection icon={<BookOpen size={19} />} title="TanStack Router">
            <pre>
              <code>{`import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { validateDataTableSearch } from "~/components/data-table/data-table-search";
import { useDataTableRouter } from "~/components/data-table/use-data-table-router";

export const Route = createFileRoute("/invoices")({
  validateSearch: validateDataTableSearch,
  component: InvoicesPage,
});

function InvoicesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const table = useDataTableRouter({ data: invoices, columns, search, navigate });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}`}</code>
            </pre>
          </DocSection>
        </section>

        <section class="doc-panel-grid">
          <article class="doc-panel">
            <h2>Behavior Surface</h2>
            <ul class="doc-list">
              <For each={capabilities}>{(note) => <li>{note}</li>}</For>
            </ul>
          </article>

          <article class="doc-panel">
            <h2>Registry Item</h2>
            <pre>
              <code>{`{
  "name": "data-table",
  "type": "registry:ui",
  "dependencies": ["@tanstack/solid-table@^8.21.3"],
  "registryDependencies": ["cn"]
}
{
  "name": "data-table-tanstack-router",
  "dependencies": ["@tanstack/solid-router@^1.168.20"],
  "registryDependencies": ["data-table"]
}`}</code>
            </pre>
          </article>
        </section>

        <section class="doc-two-column">
          <DocSection icon={<Table2 size={19} />} title="Customization">
            <p>
              Use the generated classes and data parts for root, toolbar, search, faceted-filter,
              table, head, row, cell, empty, skeleton, row-actions, and pagination. The table
              remains ordinary source so teams can swap controls, persist visibility, or wire server
              data.
            </p>
          </DocSection>

          <DocSection icon={<Layers3 size={19} />} title="Limitations">
            <p>
              The default source is a local client-side table. Server-side pagination, virtualized
              rows, remote filters, and async cache ownership belong in the consuming app.
            </p>
          </DocSection>
        </section>
      </div>
    </main>
  );
}

function DocSection(props: { icon: Element; title: string; children: Element }) {
  return (
    <article class="doc-section">
      <div class="doc-section-title">
        {props.icon}
        <h2>{props.title}</h2>
      </div>
      {props.children}
    </article>
  );
}
