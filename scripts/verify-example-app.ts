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
    packageJson.dependencies["@keystone-ui/core"] = "workspace:*";
    await writeJson(packageJsonPath, packageJson);
    await linkDependency(app, "@keystone-ui/core", path.join(repoRoot, "packages/core"));
    for (const dependency of [
      "@tanstack/devtools-event-client",
      "@tanstack/form-core",
      "@tanstack/pacer-lite",
      "@tanstack/solid-form",
      "@tanstack/solid-hotkeys",
      "@tanstack/solid-router",
      "@tanstack/solid-table",
      "@tanstack/solid-store",
      "@tanstack/hotkeys",
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
    await addCommand({ cwd: app, item: "tanstack-form", registry });
    await addCommand({ cwd: app, item: "tanstack-field", registry });
    await addCommand({ cwd: app, item: "text-field", registry });
    await addCommand({ cwd: app, item: "textarea-field", registry });
    await addCommand({ cwd: app, item: "select-field", registry });
    await addCommand({ cwd: app, item: "checkbox-field", registry });
    await addCommand({ cwd: app, item: "radio-group-field", registry });
    await addCommand({ cwd: app, item: "switch-field", registry });
    await addCommand({ cwd: app, item: "command-menu", registry });
    await addCommand({ cwd: app, item: "keyboard-shortcuts", registry });
    await addCommand({ cwd: app, item: "shortcut-display", registry });
    await addCommand({ cwd: app, item: "shortcut-recorder", registry });
    await addCommand({ cwd: app, item: "shortcut-sequence-recorder", registry });
    await addCommand({ cwd: app, item: "data-table", registry });
    await addCommand({ cwd: app, item: "data-table-tanstack-router", registry });
    await addCommand({ cwd: app, item: "invoice-dashboard", registry });
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
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuItemData,
} from "@/components/ui/command-menu";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { ShortcutDisplay } from "@/components/ui/shortcut-display";
import { ShortcutRecorder } from "@/components/ui/shortcut-recorder";
import { ShortcutSequenceRecorder } from "@/components/ui/shortcut-sequence-recorder";
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
import { InvoiceDashboardBlock } from "@/components/blocks/invoice-dashboard/invoice-dashboard";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroupField } from "@/components/ui/radio-group-field";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SwitchField } from "@/components/ui/switch-field";
import { TanStackForm, TanStackFormSubmit } from "@/components/ui/tanstack-form";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
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

const commandItems: CommandMenuItemData[] = [
  {
    value: "open-dashboard",
    label: "Open dashboard",
    description: "Navigate to the dashboard overview.",
    group: "Navigation",
    shortcut: "Mod+D",
    shortcutLabel: "Mod+D",
    onSelect: (item) => item.value,
  },
  {
    value: "create-invoice",
    label: "Create invoice",
    description: "Start a new invoice draft.",
    group: "Actions",
    shortcut: "Mod+I",
    shortcutLabel: "Mod+I",
  },
];

function App() {
  const form = createForm(() => ({
    defaultValues: {
      accepted: false,
      email: "",
      notes: "",
      plan: "team",
      role: "admin",
      updates: true,
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
  const commandMenuStore = createCommandMenuStore({ open: true, query: "invoice" });

  return (
    <main>
      <TanStackForm form={form}>
        <TextField
          form={form}
          name="email"
          label="Email"
          description="Verified through TanStack Form and Core form-control."
          validators={{
            onChange: ({ value }) => (value.includes("@") ? undefined : "Enter an email address."),
          }}
        />
        <SelectField
          form={form}
          name="plan"
          label="Plan"
          placeholder="Choose plan"
          description="Verified through TanStack Form and Core Select."
          options={[
            { value: "starter", label: "Starter" },
            { value: "team", label: "Team" },
            { value: "enterprise", label: "Enterprise" },
          ]}
        />
        <TextareaField
          form={form}
          name="notes"
          label="Notes"
          description="Verified through TanStack Form and Core form-control multiline wiring."
        />
        <CheckboxField
          form={form}
          name="accepted"
          label="Accept terms"
          description="Verified through TanStack Form and Core Checkbox."
        />
        <RadioGroupField
          form={form}
          name="role"
          label="Role"
          description="Verified through TanStack Form and Core RadioGroup."
          options={[
            { value: "admin", label: "Admin" },
            { value: "viewer", label: "Viewer" },
          ]}
        />
        <SwitchField
          form={form}
          name="updates"
          label="Updates"
          description="Verified through TanStack Form and Core Switch."
        />
        <TanStackFormSubmit>Save</TanStackFormSubmit>
      </TanStackForm>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <InvoiceDashboardBlock />
      <CommandMenu
        items={commandItems}
        store={commandMenuStore}
        hotkeys={false}
        portal={{ forceMount: true }}
        trigger="Open command menu"
      />
      <KeyboardShortcuts
        disabled
        shortcuts={[
          {
            id: "open-command-menu",
            hotkey: "Mod+K",
            label: "Open command menu",
            onTrigger: () => commandMenuStore.open(),
          },
        ]}
      />
      <ShortcutDisplay hotkey="Mod+K" />
      <ShortcutRecorder value="Mod+K" onValueChange={(value) => value}>
        Command menu shortcut
      </ShortcutRecorder>
      <ShortcutSequenceRecorder value={["G", "G"]} onValueChange={(value) => value}>
        Go top sequence
      </ShortcutSequenceRecorder>
      <Dialog>
        <DialogTrigger>Open UI dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              UI Dialog renders through Core behavior in one Solid app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Generated UI popover</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent>Generated UI tooltip</TooltipContent>
      </Tooltip>
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Generated UI sheet</SheetTitle>
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
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuItemData,
} from "@/components/ui/command-menu";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { ShortcutDisplay } from "@/components/ui/shortcut-display";
import { ShortcutRecorder } from "@/components/ui/shortcut-recorder";
import { ShortcutSequenceRecorder } from "@/components/ui/shortcut-sequence-recorder";
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
import { InvoiceDashboardBlock } from "@/components/blocks/invoice-dashboard/invoice-dashboard";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroupField } from "@/components/ui/radio-group-field";
import { SelectField } from "@/components/ui/select-field";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SwitchField } from "@/components/ui/switch-field";
import { TanStackForm } from "@/components/ui/tanstack-form";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
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

const commandItems: CommandMenuItemData[] = [
  {
    value: "open-dashboard",
    label: "Open dashboard",
    description: "Navigate to the dashboard overview.",
    group: "Navigation",
    shortcut: "Mod+D",
    shortcutLabel: "Mod+D",
  },
  {
    value: "create-invoice",
    label: "Create invoice",
    description: "Start a new invoice draft.",
    group: "Actions",
    shortcut: "Mod+I",
    shortcutLabel: "Mod+I",
  },
];

function App() {
  const form = createForm(() => ({
    defaultValues: {
      accepted: true,
      email: "team@example.com",
      notes: "SSR notes",
      plan: "team",
      role: "admin",
      updates: true,
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
  const commandMenuStore = createCommandMenuStore({ open: true, query: "invoice" });

  return (
    <main>
      <TanStackForm form={form}>
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
        <TextareaField
          form={form}
          name="notes"
          label="Notes"
          description="SSR verifies the TanStack Form TextareaField vertical."
        />
        <CheckboxField
          form={form}
          name="accepted"
          label="Accept terms"
          description="SSR verifies the TanStack Form CheckboxField vertical."
        />
        <RadioGroupField
          form={form}
          name="role"
          label="Role"
          description="SSR verifies the TanStack Form RadioGroupField vertical."
          options={[
            { value: "admin", label: "Admin" },
            { value: "viewer", label: "Viewer" },
          ]}
        />
        <SwitchField
          form={form}
          name="updates"
          label="Updates"
          description="SSR verifies the TanStack Form SwitchField vertical."
        />
      </TanStackForm>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <InvoiceDashboardBlock />
      <CommandMenu
        items={commandItems}
        store={commandMenuStore}
        hotkeys={false}
        portal={{ forceMount: true }}
        trigger="Open command menu"
      />
      <KeyboardShortcuts
        disabled
        shortcuts={[
          {
            id: "open-command-menu",
            hotkey: "Mod+K",
            label: "Open command menu",
            onTrigger: () => commandMenuStore.open(),
          },
        ]}
      />
      <ShortcutDisplay hotkey="Mod+K" />
      <ShortcutRecorder value="Mod+K" onValueChange={(value) => value}>
        Command menu shortcut
      </ShortcutRecorder>
      <ShortcutSequenceRecorder value={["G", "G"]} onValueChange={(value) => value}>
        Go top sequence
      </ShortcutSequenceRecorder>
      <Dialog defaultOpen>
        <DialogTrigger>Open UI dialog</DialogTrigger>
        <DialogContent portal={{ forceMount: true }}>
          <DialogHeader>
            <DialogTitle>Verified example app</DialogTitle>
            <DialogDescription>
              UI Dialog and Core behavior server-render together.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover defaultOpen>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent portal={{ forceMount: true }}>Generated UI popover</PopoverContent>
      </Popover>
      <Tooltip defaultOpen>
        <TooltipTrigger>More info</TooltipTrigger>
        <TooltipContent portal={{ forceMount: true }}>Generated UI tooltip</TooltipContent>
      </Tooltip>
      <Sheet defaultOpen>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent portal={{ forceMount: true }}>
          <SheetTitle>Generated UI sheet</SheetTitle>
          <SheetDescription>Backed by Keystone modal overlay behavior.</SheetDescription>
        </SheetContent>
      </Sheet>
    </main>
  );
}

const html = renderToString(() => <App />);

for (const expected of [
  "ui-dialog-trigger",
  "ui-popover-trigger",
  "ui-tooltip-trigger",
  "ui-sheet-trigger",
  "ui-text-field-input",
  "ui-select-field-trigger",
  "ui-textarea-field-control",
  "ui-radio-group-field-control",
  "ui-command-menu-trigger",
  "ui-shortcut-display",
  "ui-shortcut-recorder",
  "ui-shortcut-sequence-recorder",
  "ui-block-invoice-dashboard",
  "ui-data-table-table",
  "ui-data-table-pagination",
  "Invoice workspace",
  "Create draft",
  "Northstar Labs",
  "Accept terms",
  "Role",
  "Updates",
  "Notes",
  "Ada Lovelace",
  "Katherine Johnson",
  'data-scope="ui-text-field"',
  'data-scope="ui-textarea-field"',
  'data-scope="ui-data-table"',
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
