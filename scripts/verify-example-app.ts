import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { addCommand } from "../packages/mason-cli/src/commands/add";
import { initCommand } from "../packages/mason-cli/src/commands/init";

const repoRoot = path.resolve(import.meta.dir, "..");
const fixtureRoot = path.join(repoRoot, "packages/mason-cli/src/testing/fixtures");
const registry = path.join(repoRoot, "registry/default");

async function runCommand(cwd: string, args: string[]): Promise<void> {
  const proc = Bun.spawn(args, {
    cwd,
    env: { ...process.env, CI: "1" },
    stderr: "pipe",
    stdout: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(
      [`${args.join(" ")} failed with exit code ${exitCode}`, stdout.trim(), stderr.trim()]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(`${filePath}`, `${JSON.stringify(value, null, 2)}\n`);
}

async function linkDependency(app: string, name: string, target: string): Promise<void> {
  const segments = name.split("/");
  const parent = path.join(app, "node_modules", ...segments.slice(0, -1));
  await mkdir(parent, { recursive: true });
  await symlink(target, path.join(app, "node_modules", ...segments), "dir");
}

async function main() {
  const tempRoot = await mkdtemp(path.join(repoRoot, "apps/.example-app-verification-"));
  const app = tempRoot;

  try {
    await cp(path.join(fixtureRoot, "solid-vite-app"), app, { recursive: true });

    const packageJsonPath = path.join(app, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      dependencies: Record<string, string>;
    };
    packageJson.name = "example-app-verification";
    packageJson.dependencies["@keystone-ui/keystone"] = "workspace:*";
    await writeJson(packageJsonPath, packageJson);
    await linkDependency(app, "@keystone-ui/keystone", path.join(repoRoot, "packages/keystone"));
    for (const dependency of [
      "@tanstack/devtools-event-client",
      "@tanstack/form-core",
      "@tanstack/pacer-lite",
      "@tanstack/solid-form",
      "@tanstack/solid-router",
      "@tanstack/solid-table",
      "@tanstack/solid-store",
      "@tanstack/router-core",
      "@tanstack/router-utils",
      "@tanstack/store",
      "@tanstack/table-core",
      "@types/node",
      "solid-js",
      "typescript",
      "vite",
      "vite-plugin-solid",
    ]) {
      await linkDependency(
        app,
        dependency,
        path.join(repoRoot, "node_modules/.bun/node_modules", dependency),
      );
    }
    await mkdir(path.join(app, "node_modules/.bin"), { recursive: true });
    await symlink("../typescript/bin/tsc", path.join(app, "node_modules/.bin/tsc"));
    await symlink("../vite/bin/vite.js", path.join(app, "node_modules/.bin/vite"));

    await initCommand({ cwd: app, yes: true });
    await addCommand({ cwd: app, item: "dialog", registry });
    await addCommand({ cwd: app, item: "popover", registry });
    await addCommand({ cwd: app, item: "tooltip", registry });
    await addCommand({ cwd: app, item: "sheet", registry });
    await addCommand({ cwd: app, item: "text-field", registry });
    await addCommand({ cwd: app, item: "select-field", registry });
    await addCommand({ cwd: app, item: "data-table", registry });
    await addCommand({ cwd: app, item: "data-table-tanstack-router", registry });
    await writeFile(
      path.join(app, "vite.config.ts"),
      `import { fileURLToPath, URL } from "node:url";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ ssr: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
`,
    );

    await writeFile(
      path.join(app, "src/main.tsx"),
      `import { render } from "solid-js/web";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createForm } from "@tanstack/solid-form";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { dataTableFacetedFilter, useDataTable } from "@/components/data-table/use-data-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import "./styles.css";

type Invoice = {
  id: string;
  customer: string;
  status: "paid" | "open";
  total: number;
};

const invoices: Invoice[] = [
  { id: "inv-1", customer: "Ada Lovelace", status: "paid", total: 4200 },
  { id: "inv-2", customer: "Grace Hopper", status: "open", total: 3100 },
  { id: "inv-3", customer: "Katherine Johnson", status: "paid", total: 2900 },
];

const invoiceColumns: ColumnDef<Invoice, unknown>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => row.original.customer,
    meta: {
      label: "Customer",
      placeholder: "Search customers",
      variant: "text",
    },
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
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => \`$\${row.original.total}\`,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions row={row} actions={[{ label: "Open", onSelect: (current) => current.original.id }]} />
    ),
  },
];

function App() {
  const form = createForm(() => ({
    defaultValues: {
      email: "",
      plan: "team",
    },
    onSubmit: ({ value }) => value,
  }));
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 2 },
    },
  });

  return (
    <main>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <TextField
          form={form}
          name="email"
          label="Email"
          description="Verified through TanStack Form and Keystone form-control."
          validators={{
            onChange: ({ value }) => (value.includes("@") ? undefined : "Enter an email address."),
          }}
        />
        <SelectField
          form={form}
          name="plan"
          label="Plan"
          placeholder="Choose plan"
          description="Verified through TanStack Form and Keystone Select."
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <button type="submit">Save</button>
      </form>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <Dialog>
        <DialogTrigger>Open Mason dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              Mason Dialog renders through Keystone behavior in one Solid app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Generated Mason popover</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent>Generated Mason tooltip</TooltipContent>
      </Tooltip>
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Generated Mason sheet</SheetTitle>
          <SheetDescription>Backed by Keystone modal overlay behavior.</SheetDescription>
        </SheetContent>
      </Sheet>
    </main>
  );
}

render(() => <App />, document.getElementById("root")!);
`,
    );

    await writeFile(
      path.join(app, "src/ssr.tsx"),
      `import { renderToString } from "solid-js/web";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createForm } from "@tanstack/solid-form";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { dataTableFacetedFilter, useDataTable } from "@/components/data-table/use-data-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Invoice = {
  id: string;
  customer: string;
  status: "paid" | "open";
  total: number;
};

const invoices: Invoice[] = [
  { id: "inv-1", customer: "Ada Lovelace", status: "paid", total: 4200 },
  { id: "inv-2", customer: "Grace Hopper", status: "open", total: 3100 },
  { id: "inv-3", customer: "Katherine Johnson", status: "paid", total: 2900 },
];

const invoiceColumns: ColumnDef<Invoice, unknown>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => row.original.customer,
    meta: {
      label: "Customer",
      placeholder: "Search customers",
      variant: "text",
    },
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
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => \`$\${row.original.total}\`,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions row={row} actions={[{ label: "Open", onSelect: (current) => current.original.id }]} />
    ),
  },
];

function App() {
  const form = createForm(() => ({
    defaultValues: {
      email: "team@example.com",
      plan: "team",
    },
    onSubmit: ({ value }) => value,
  }));
  const table = useDataTable({
    data: invoices,
    columns: invoiceColumns,
    getRowId: (row) => row.id,
    initialState: {
      columnFilters: [{ id: "status", value: ["paid"] }],
      pagination: { pageIndex: 0, pageSize: 2 },
      sorting: [{ id: "total", desc: true }],
    },
  });

  return (
    <main>
      <form>
        <TextField
          form={form}
          name="email"
          label="Email"
          description="SSR verifies the TanStack Form TextField vertical."
        />
        <SelectField
          form={form}
          name="plan"
          label="Plan"
          placeholder="Choose plan"
          description="SSR verifies the TanStack Form SelectField vertical."
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
          ]}
        />
      </form>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <Dialog defaultOpen>
        <DialogTrigger>Open Mason dialog</DialogTrigger>
        <DialogContent portal={{ forceMount: true }}>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              Mason Dialog and Keystone behavior server-render together.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover defaultOpen>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent portal={{ forceMount: true }}>Generated Mason popover</PopoverContent>
      </Popover>
      <Tooltip defaultOpen>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent portal={{ forceMount: true }}>Generated Mason tooltip</TooltipContent>
      </Tooltip>
      <Sheet defaultOpen>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent portal={{ forceMount: true }}>
          <SheetTitle>Generated Mason sheet</SheetTitle>
          <SheetDescription>Backed by Keystone modal overlay behavior.</SheetDescription>
        </SheetContent>
      </Sheet>
    </main>
  );
}

const html = renderToString(() => <App />);

for (const expected of [
  "mason-dialog-trigger",
  "mason-popover-trigger",
  "mason-tooltip-trigger",
  "mason-sheet-trigger",
  "mason-text-field-input",
  "mason-select-field-trigger",
  "mason-data-table-table",
  "mason-data-table-pagination",
  "Ada Lovelace",
  "Katherine Johnson",
  'data-scope="mason-text-field"',
  'data-scope="mason-data-table"',
  'data-scope="select"',
  'data-part="input"',
  'data-scope="dialog"',
  'data-part="trigger"',
  'aria-expanded="true"',
]) {
  if (!html.includes(expected)) {
    throw new Error(\`SSR output did not include \${expected}\`);
  }
}

if (html.includes("Grace Hopper")) {
  throw new Error("SSR output included a row excluded by the DataTable faceted filter");
}

if (html.indexOf("Ada Lovelace") > html.indexOf("Katherine Johnson")) {
  throw new Error("SSR output did not preserve the initial DataTable sorting state");
}
`,
    );

    await mkdir(path.join(app, "src/routes"), { recursive: true });
    await writeFile(
      path.join(app, "src/routes/users.tsx"),
      `import { createMemoryHistory } from "@tanstack/solid-router";
import type { ColumnDef } from "@tanstack/solid-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { validateDataTableSearch, type DataTableSearch } from "@/components/data-table/data-table-search";
import { useDataTableRouter, type DataTableRouterNavigate } from "@/components/data-table/use-data-table-router";
import { dataTableFacetedFilter } from "@/components/data-table/use-data-table";

type User = {
  id: string;
  email: string;
  status: "active" | "paused";
};

const users: User[] = [
  { id: "user-1", email: "ada@example.com", status: "active" },
  { id: "user-2", email: "grace@example.com", status: "paused" },
];

const history = createMemoryHistory({ initialEntries: ["/users?page=1&perPage=10"] });
let currentSearch = validateDataTableSearch({ page: 1, perPage: 10 });
const navigate: DataTableRouterNavigate = (options) => {
  currentSearch = options.search(currentSearch);
  history.replace("/users");
};
const search = (): DataTableSearch => currentSearch;

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    meta: { label: "Email", placeholder: "Search email", variant: "text" },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: dataTableFacetedFilter,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "active" },
        { label: "Paused", value: "paused" },
      ],
    },
  },
];

export function UsersPage() {
  const table = useDataTableRouter({
    data: users,
    columns,
    getRowId: (row) => row.id,
    search,
    navigate,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
`,
    );

    await runCommand(app, [
      "bun",
      "node_modules/vite/bin/vite.js",
      "build",
      "--ssr",
      "src/ssr.tsx",
    ]);
    await runCommand(app, ["bun", "dist/ssr.js"]);
    await runCommand(app, ["bun", "run", "check-types"]);
    await runCommand(app, ["bun", "run", "build"]);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();
