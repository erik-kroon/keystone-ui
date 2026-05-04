import { mkdtempSync, mkdirSync, symlinkSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import button from "./testing/fixtures/registry/default/ui/button.json";
import dialog from "./testing/fixtures/registry/default/ui/dialog.json";
import registry from "./testing/fixtures/registry/default/registry.json";
import {
  isInstallSupportedItemType,
  resolveRegistryDependencyGraph,
  resolveRegistryDependencies,
  validateItem,
  validateRegistry,
  validateRegistryPath,
  type RegistryItem,
} from "./index";

const buttonItem = button as RegistryItem;
const dialogItem = dialog as RegistryItem;
const repoRoot = resolve(import.meta.dir, "../../..");
const defaultRegistryRoot = resolve(import.meta.dir, "../../../registry/default");
const uiPackageSourceRoot = resolve(import.meta.dir, "../../../packages/ui/src/default");

async function listFiles(root: string, directory = ""): Promise<string[]> {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const child = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(root, child) : Promise.resolve([child]);
    }),
  );

  return files.flat().sort();
}

describe("Mason registry validation tracer", () => {
  test("parses a valid root registry document and lists items", () => {
    const result = validateRegistry(registry);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items.map((item) => item.name)).toEqual(["button", "dialog"]);
    }
  });

  test("validates the button item fixture", () => {
    const result = validateItem(button);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("button");
    }
  });

  test("validates docs-ready metadata on the real default button item", async () => {
    const item = await import("../../../registry/default/items/button.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toContain("base");
      expect(result.value.meta?.install).toBe("mason add button");
      expect(result.value.meta?.customization).toBeString();
      expect(result.value.meta?.api).toContain("loading disables");
      expect(result.value.meta?.accessibility).toContain("defaults type to button");
      expect(result.value.meta?.anatomy).toEqual(["root", "loading-indicator", "loading-label"]);
      expect(result.value.meta?.limitations).toContain("LinkButton");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }
  });

  test("captures the real default button generated source contract", async () => {
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/button.tsx"), "utf8");

    expect(source).toContain('type={local.type ?? "button"}');
    expect(source).toContain("disabled={disabled()}");
    expect(source).toContain("aria-busy={loading() || undefined}");
    expect(source).toContain("aria-disabled={loading() || undefined}");
    expect(source).toContain("aria-pressed={local.pressed ?? undefined}");
    expect(source).toContain('data-scope="ui-button"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-part="loading-indicator"');
    expect(source).toContain('data-part="loading-label"');
    expect(source).toContain('data-slot="button-loading-indicator"');
    expect(source).toContain('default: classes("h-9"');
    expect(source).toContain('"px-[calc(--spacing(3)-1px)]"');
    expect(source).toContain('"icon-xl"');
    expect(source).toContain('"destructive-outline"');
    expect(source).toContain("data-loading:text-transparent");
    expect(source).toContain("focus-visible:ring-2");
    expect(source).toContain("pointer-coarse:after:min-h-11");
  });

  test("keeps default registry source descriptors pointed at the UI package source", async () => {
    expect(await listFiles(defaultRegistryRoot)).not.toContain("ui/button.tsx");

    const itemFiles = await readdir(resolve(defaultRegistryRoot, "items"));
    for (const file of itemFiles.sort()) {
      const item = JSON.parse(
        await readFile(resolve(defaultRegistryRoot, "items", file), "utf8"),
      ) as RegistryItem;

      expect(item.meta?.sourceFiles).toEqual(item.files.map((sourceFile) => sourceFile.path));
      for (const sourceFile of item.files) {
        expect(sourceFile.path).toStartWith("packages/ui/src/default/");
        await expect(readFile(resolve(repoRoot, sourceFile.path), "utf8")).resolves.toBeString();
      }
    }
  });

  test("validates every default registry item and its parity metadata contract", async () => {
    const rootRegistry = JSON.parse(
      await readFile(resolve(defaultRegistryRoot, "registry.json"), "utf8"),
    ) as unknown;
    const rootResult = validateRegistry(rootRegistry);
    expect(rootResult.ok).toBe(true);

    const itemFiles = await readdir(resolve(defaultRegistryRoot, "items"));
    const validatedNames: string[] = [];
    for (const file of itemFiles.sort()) {
      const item = JSON.parse(
        await readFile(resolve(defaultRegistryRoot, "items", file), "utf8"),
      ) as unknown;
      const result = validateItem(item, {
        registryRoot: repoRoot,
        requireParityMetadata: true,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        validatedNames.push(result.value.name);
        expect(result.value.meta?.parity).toBeObject();
        expect(Object.values(result.value.meta?.parity ?? {})).toSatisfy(
          (notes) => notes.length > 0 && notes.every((note) => typeof note === "string"),
        );
      }
    }

    expect(validatedNames).toEqual([
      "accordion",
      "account-settings",
      "autocomplete",
      "badge",
      "button",
      "card",
      "checkbox",
      "cn",
      "collapsible",
      "combobox",
      "command-menu",
      "context-menu",
      "data-table-tanstack-router",
      "data-table",
      "date-picker",
      "dialog",
      "dropdown-menu",
      "field",
      "hover-card",
      "input",
      "invoice-dashboard",
      "label",
      "menu",
      "menubar",
      "navigation-menu",
      "popover",
      "radio-group",
      "select-field",
      "select",
      "separator",
      "sheet",
      "slider",
      "switch",
      "tabs",
      "tanstack-field",
      "tanstack-form",
      "tanstack-start-dashboard",
      "text-field",
      "textarea",
      "toast",
      "toolbar",
      "tooltip",
    ]);
  });

  test("can require first-party parity metadata during validation", () => {
    const missing = validateItem(
      {
        ...button,
        meta: {},
      },
      { requireParityMetadata: true },
    );
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.errors.map((error) => error.code)).toContain("parity.missing");
    }

    const empty = validateItem(
      {
        ...button,
        meta: { parity: { baseUi: "" } },
      },
      { requireParityMetadata: true },
    );
    expect(empty.ok).toBe(false);
    if (!empty.ok) {
      expect(empty.errors.map((error) => error.code)).toContain("parity.invalid");
    }
  });

  test("validates docs-ready metadata on the real default data-table item", async () => {
    const item = await import("../../../registry/default/items/data-table.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-table@^8.21.3");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.files.length).toBeGreaterThan(1);
      expect(
        result.value.files.every((file) => file.target?.startsWith("src/components/data-table/")),
      ).toBe(true);
      expect(new Set(result.value.files.map((file) => file.target)).size).toBe(
        result.value.files.length,
      );
      expect(result.value.meta?.columns).toBeString();
      expect(result.value.meta?.api).toContain("accessors");
      expect(result.value.meta?.sorting).toBeString();
      expect(result.value.meta?.filtering).toBeString();
      expect(result.value.meta?.pagination).toBeString();
      expect(result.value.meta?.state).toContain("controlled");
      expect(result.value.meta?.accessibility).toContain("aria-sort");
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-data-table"');
      expect(result.value.meta?.ssr).toContain("getRowId");
      expect(result.value.meta?.rowActions).toBeString();
      expect(result.value.meta?.limitations).toBeString();
    }
  });

  test("captures the real default data-table generated source contract", async () => {
    const sourceRoot = resolve(uiPackageSourceRoot, "components/data-table");
    const [
      table,
      useTable,
      columnHeader,
      toolbar,
      facetedFilter,
      pagination,
      viewOptions,
      rowActions,
    ] = await Promise.all([
      readFile(resolve(sourceRoot, "data-table.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "use-data-table.ts"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-column-header.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-toolbar.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-faceted-filter.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-pagination.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-view-options.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-row-actions.tsx"), "utf8"),
    ]);

    expect(table).toContain('data-scope="ui-data-table"');
    expect(table).toContain('data-part="caption"');
    expect(table).toContain("aria-busy={local.loading || undefined}");
    expect(table).toContain('scope="col"');
    expect(table).toContain("aria-sort={getAriaSort(header.column.getIsSorted())}");
    expect(table).toContain("aria-selected={row.getIsSelected() || undefined}");
    expect(table).toContain('data-selected={row.getIsSelected() ? "" : undefined}');
    expect(table).toContain("function getAriaSort");

    expect(useTable).toContain("type MaybeAccessor");
    expect(useTable).toContain("state?: {");
    expect(useTable).toContain("onSortingChange?: OnChangeFn<SortingState>");
    expect(useTable).toContain("manualPagination?: boolean");
    expect(useTable).toContain("resolveDataTableOption(options.data)");

    expect(columnHeader).toContain("aria-label={`Sort ${label()}`}");
    expect(columnHeader).toContain('data-part="sort-trigger"');
    expect(columnHeader).toContain('data-part="sort-clear"');
    expect(columnHeader).toContain('data-part="column-hide"');

    expect(toolbar).toContain('type="search"');
    expect(toolbar).toContain("aria-label={meta?.placeholder ?? `Search ${label}`}");
    expect(toolbar).toContain("Reset table filters and column visibility");

    expect(facetedFilter).toContain("<fieldset");
    expect(facetedFilter).toContain("<legend>{props.title}</legend>");
    expect(facetedFilter).toContain('type={props.multiple === false ? "radio" : "checkbox"}');
    expect(facetedFilter).toContain("props.table.setPageIndex(0)");

    expect(pagination).toContain('role="navigation"');
    expect(pagination).toContain('aria-label="Table pagination"');
    expect(pagination).toContain('aria-live="polite"');
    expect(pagination).toContain('aria-label="Go to next page"');

    expect(viewOptions).toContain('role="group"');
    expect(viewOptions).toContain('aria-label="Column visibility"');
    expect(rowActions).toContain('role="group"');
    expect(rowActions).toContain('aria-label="Row actions"');
  });

  test("validates docs-ready metadata on the real default data-table router adapter item", async () => {
    const item = await import("../../../registry/default/items/data-table-tanstack-router.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-router@^1.168.20");
      expect(result.value.registryDependencies).toEqual(["data-table"]);
      expect(result.value.meta?.searchParams).toBeString();
      expect(result.value.meta?.stateMapping).toBeString();
      expect(result.value.meta?.limitations).toBeString();
    }
  });

  test("validates docs-ready metadata on the real default invoice-dashboard block", async () => {
    const item = await import("../../../registry/default/items/invoice-dashboard.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:block");
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.dependencies).toContain("@tanstack/solid-table@^8.21.3");
      expect(result.value.registryDependencies).toContain("data-table");
      expect(result.value.registryDependencies).toContain("text-field");
      expect(result.value.registryDependencies).toContain("toast");
      expect(result.value.files).toHaveLength(3);
      expect(
        result.value.files.every((file) =>
          file.target?.startsWith("src/components/blocks/invoice-dashboard/"),
        ),
      ).toBe(true);
      expect(result.value.meta?.fileTree).toContain("invoice-dashboard-columns.tsx");
      expect(result.value.meta?.frameworkAssumptions).toContain("Solid");
      expect(result.value.meta?.interactions).toContain("table sorting");
      expect(result.value.meta?.parity).toMatchObject({
        shadcn: expect.any(String),
        tanstackForm: expect.any(String),
        tanstackTable: expect.any(String),
        sonner: expect.any(String),
      });
    }
  });

  test("captures the real default invoice-dashboard generated source contract", async () => {
    const sourceRoot = resolve(uiPackageSourceRoot, "blocks/invoice-dashboard");
    const [block, columns, data] = await Promise.all([
      readFile(resolve(sourceRoot, "invoice-dashboard.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "invoice-dashboard-columns.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "invoice-dashboard-data.ts"), "utf8"),
    ]);

    expect(block).toContain('data-part="invoice-dashboard"');
    expect(block).toContain("createForm");
    expect(block).toContain("CommandMenu");
    expect(block).toContain("DataTableToolbar");
    expect(block).toContain("TanStackFormSubmit");
    expect(block).toContain("Toaster");
    expect(columns).toContain("DataTableColumnHeader");
    expect(columns).toContain("DataTableRowActions");
    expect(columns).toContain("dataTableFacetedFilter");
    expect(data).toContain("invoiceDashboardRows");
    expect(data).toContain("invoiceDashboardStatusOptions");
  });

  test("validates docs-ready metadata on the real default TanStack Start dashboard template", async () => {
    const item = await import("../../../registry/default/items/tanstack-start-dashboard.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:template");
      expect(result.value.registryDependencies).toEqual(["invoice-dashboard"]);
      expect(result.value.dependencies).toContain("@tanstack/solid-start@^1.167.58");
      expect(result.value.dependencies).toContain("@tanstack/solid-router@^1.168.20");
      expect(result.value.files.length).toBeGreaterThanOrEqual(8);
      expect(result.value.meta?.fileTree).toContain("src/routes/index.tsx");
      expect(result.value.meta?.frameworkAssumptions).toContain("TanStack Start");
      expect(result.value.meta?.verification).toContain("invoice-dashboard block is installed");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackStart: expect.any(String),
        shadcn: expect.any(String),
        mason: expect.any(String),
      });
    }
  });

  test("captures the real default tabs generated source contract", async () => {
    const item = await import("../../../registry/default/items/tabs.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/tabs.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.anatomy).toEqual([
        "Tabs",
        "TabsList",
        "TabsTrigger",
        "TabsIndicator",
        "TabsContent",
      ]);
      expect(result.value.meta?.cssVariables).toEqual([
        "--keystone-tabs-indicator-x",
        "--keystone-tabs-indicator-y",
        "--keystone-tabs-indicator-width",
        "--keystone-tabs-indicator-height",
      ]);
      expect(result.value.meta?.accessibility).toContain("role=tablist/tab/tabpanel");
    }

    expect(source).toContain("tabsRootClass");
    expect(source).toContain("tabsIndicatorClass");
    expect(source).toContain("--keystone-tabs-indicator-x");
    expect(source).toContain("--keystone-tabs-indicator-width");
    expect(source).toContain("data-[orientation=vertical]:flex-col");
    expect(source).toContain("focus-visible:ring-2");
    expect(source).toContain("data-selected:text-foreground");
  });

  test("validates docs-ready metadata on the real default command-menu item", async () => {
    const item = await import("../../../registry/default/items/command-menu.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/command-menu.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-store@^0.11.0");
      expect(result.value.dependencies).toContain("@tanstack/solid-hotkeys@^0.10.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("CommandMenuFooter");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "trigger",
        "portal",
        "backdrop",
        "positioner",
        "content",
        "input-row",
        "input-icon",
        "input",
        "panel",
        "list",
        "group",
        "group-label",
        "item",
        "item-text",
        "item-label",
        "item-description",
        "shortcut",
        "empty",
        "separator",
        "footer",
      ]);
      expect(result.value.meta?.commandItems).toBeString();
      expect(result.value.meta?.searchFiltering).toBeString();
      expect(result.value.meta?.store).toBeString();
      expect(result.value.meta?.shortcutDisplay).toBeString();
      expect(result.value.meta?.hotkeysPreview).toContain("preview");
      expect(result.value.meta?.accessibility).toContain("Keystone Combobox");
      expect(result.value.meta?.customization).toContain("Coss command component");
      expect(result.value.meta?.limitations).toContain("Coss command component");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        tanstackStore: expect.any(String),
        tanstackHotkeys: expect.any(String),
      });
    }

    expect(source).toContain("export function CommandMenuBackdrop");
    expect(source).toContain("export function CommandMenuPanel");
    expect(source).toContain("export function CommandMenuFooter");
    expect(source).toContain("export function CommandMenuSeparator");
    expect(source).toContain('data-slot="command-menu-backdrop"');
    expect(source).toContain('data-slot="command-menu-input-icon"');
    expect(source).toContain('data-slot="command-menu-panel"');
    expect(source).toContain('data-slot="command-menu-shortcut"');
    expect(source).toContain('"max-w-xl"');
    expect(source).toContain('"rounded-2xl"');
    expect(source).toContain('"backdrop-blur-sm"');
  });

  test("captures Field parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/field.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("FieldControl");
      expect(result.value.meta?.accessibility).toContain("Keystone Core Field semantics");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "label",
        "item",
        "control",
        "description",
        "error-message",
        "hidden-input",
      ]);
      expect(result.value.meta?.limitations).toContain("standalone Input");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/form"');
    expect(source).toContain("export function FieldControl");
    expect(source).toContain("export function FieldHiddenInput");
    expect(source).toContain("export const FieldPrimitive = CoreField");
    expect(source).toContain('data-slot="field-label"');
    expect(source).toContain('data-slot="field-control"');
    expect(source).toContain("data-invalid:border-destructive/36");
  });

  test("captures Input parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/input.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/input.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.api).toContain("numeric native size");
      expect(result.value.meta?.accessibility).toContain("native input");
      expect(result.value.meta?.anatomy).toEqual(["root", "input"]);
      expect(result.value.meta?.limitations).toContain("FieldControl");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain("export type InputSize");
    expect(source).toContain('data-scope="ui-input"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-part="input"');
    expect(source).toContain('data-slot="input-control"');
    expect(source).toContain('data-slot="input"');
    expect(source).toContain('local.type === "search"');
    expect(source).toContain('local.type === "file"');
    expect(source).toContain('size={typeof size() === "number" ? size() : undefined}');
    expect(source).toContain("has-focus-visible:ring-[3px]");
  });

  test("captures Checkbox parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/checkbox.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/checkbox.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("CheckboxPrimitive");
      expect(result.value.meta?.accessibility).toContain("aria-checked including mixed state");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "control",
        "indicator",
        "indicator-icon",
        "hidden-input",
      ]);
      expect(result.value.meta?.limitations).toContain("Group-level checkbox coordination");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/checkbox"');
    expect(source).toContain("export function CheckboxControl");
    expect(source).toContain("export function CheckboxIndicatorIcon");
    expect(source).toContain("export function CheckboxHiddenInput");
    expect(source).toContain("export const CheckboxPrimitive = CoreCheckbox");
    expect(source).toContain('data-slot="checkbox"');
    expect(source).toContain('data-slot="checkbox-indicator"');
    expect(source).toContain('data-slot="checkbox-input"');
    expect(source).toContain('"size-4.5"');
    expect(source).toContain("focus-visible:ring-2");
    expect(source).toContain("in-data-[state=indeterminate]");
  });

  test("captures Switch parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/switch.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/switch.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("SwitchPrimitive");
      expect(result.value.meta?.accessibility).toContain("role=switch");
      expect(result.value.meta?.anatomy).toEqual(["root", "control", "thumb", "hidden-input"]);
      expect(result.value.meta?.cssVariables).toContain("--thumb-size");
      expect(result.value.meta?.limitations).toContain("Drag gestures");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/switch"');
    expect(source).toContain("export function SwitchControl");
    expect(source).toContain("export function SwitchThumb");
    expect(source).toContain("export function SwitchHiddenInput");
    expect(source).toContain("export const SwitchPrimitive = CoreSwitch");
    expect(source).toContain('data-slot="switch"');
    expect(source).toContain('data-slot="switch-thumb"');
    expect(source).toContain('data-slot="switch-input"');
    expect(source).toContain("[--thumb-size:--spacing(5)]");
    expect(source).toContain("data-checked:translate-x");
    expect(source).toContain("focus-visible:ring-2");
  });

  test("captures Select parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/select.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/select.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("SelectPrimitive");
      expect(result.value.meta?.accessibility).toContain("hidden form value");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "button",
        "button-label",
        "trigger",
        "value",
        "icon",
        "positioner",
        "content",
        "surface",
        "listbox",
        "group",
        "group-label",
        "label",
        "item",
        "item-text",
        "item-indicator",
        "arrow",
        "separator",
      ]);
      expect(result.value.meta?.limitations).toContain("Scroll arrow affordances");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/select"');
    expect(source).toContain("export function SelectTrigger");
    expect(source).toContain("export function SelectContent");
    expect(source).toContain("export function SelectItem");
    expect(source).toContain("export const SelectPopup = SelectContent");
    expect(source).toContain("export const SelectPrimitive = CoreSelect");
    expect(source).toContain('data-scope="ui-select"');
    expect(source).toContain('data-slot="select-trigger"');
    expect(source).toContain('data-slot="select-content"');
    expect(source).toContain('data-slot="select-item-indicator"');
    expect(source).toContain('"min-w-(--anchor-width)"');
    expect(source).toContain("focus-visible:ring-[3px]");
  });

  test("captures TanStackForm parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/tanstack-form.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/tanstack-form.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("TanStackFormSubmit");
      expect(result.value.meta?.api).toContain("getTanStackFormState");
      expect(result.value.meta?.accessibility).toContain("aria-busy");
      expect(result.value.meta?.accessibility).toContain("submit disabling");
      expect(result.value.meta?.anatomy).toEqual(["root", "submit", "errors"]);
      expect(result.value.meta?.limitations).toContain("server action");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackForm: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain("export function TanStackForm");
    expect(source).toContain("export function TanStackFormSubmit");
    expect(source).toContain("export function TanStackFormErrors");
    expect(source).toContain("export function getTanStackFormState");
    expect(source).toContain("export function formatFieldError");
    expect(source).toContain("form().handleSubmit()");
    expect(source).toContain('data-slot="tanstack-form"');
    expect(source).toContain('data-slot="tanstack-form-submit"');
    expect(source).toContain('data-slot="tanstack-form-errors"');
    expect(source).toContain("aria-busy");
    expect(source).toContain("data-submission-attempts");
    expect(source).toContain("disableWhenCannotSubmit");
    expect(source).toContain("getTanStackFormState(local.form)");
  });

  test("captures TanStackField parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/tanstack-field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/tanstack-field.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.registryDependencies).toEqual(["cn", "tanstack-form"]);
      expect(result.value.meta?.api).toContain("TanStackFieldRenderContext");
      expect(result.value.meta?.api).toContain("controlId");
      expect(result.value.meta?.accessibility).toContain("aria-describedby");
      expect(result.value.meta?.accessibility).toContain("touched/dirty/validating");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "label",
        "control-slot",
        "description",
        "error",
      ]);
      expect(result.value.meta?.limitations).toContain("render-prop adapter");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackForm: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/form"');
    expect(source).toContain('from "@/components/ui/tanstack-form"');
    expect(source).toContain("export function TanStackField");
    expect(source).toContain("createFormControl");
    expect(source).toContain("FormField name={props.name}");
    expect(source).toContain("form: () => local.formId");
    expect(source).toContain("touched,");
    expect(source).toContain("dirty,");
    expect(source).toContain("validating,");
    expect(source).toContain('data-slot="tanstack-field"');
    expect(source).toContain('data-slot="tanstack-field-label"');
    expect(source).toContain('data-slot="tanstack-field-error"');
    expect(source).toContain("data-blurred");
    expect(source).toContain("setFocused");
  });

  test("captures SelectField parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/select-field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/select-field.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.registryDependencies).toEqual(["cn", "select", "tanstack-field"]);
      expect(result.value.meta?.api).toContain("SelectFieldOptionGroup");
      expect(result.value.meta?.api).toContain("textValue");
      expect(result.value.meta?.accessibility).toContain("aria-labelledby");
      expect(result.value.meta?.accessibility).toContain("hidden form value");
      expect(result.value.meta?.anatomy).toEqual([
        "field-root",
        "field-label",
        "trigger",
        "value",
        "content",
        "listbox",
        "group",
        "group-label",
        "item",
        "item-text",
        "item-indicator",
        "empty",
        "field-description",
        "field-error",
      ]);
      expect(result.value.meta?.limitations).toContain("single-value");
      expect(result.value.meta?.limitations).toContain("empty string");
      expect(result.value.meta?.state).toContain("field.handleBlur");
      expect(result.value.meta?.dataAttributes).toContain('data-slot="select-field-empty"');
      expect(result.value.meta?.ssr).toContain("deterministic");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackForm: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@/components/ui/select"');
    expect(source).toContain('from "@/components/ui/tanstack-field"');
    expect(source).toContain("export function SelectField");
    expect(source).toContain("export type SelectFieldOptionGroup");
    expect(source).toContain("<TanStackField<string, HTMLButtonElement>");
    expect(source).toContain("aria-describedby={props.describedBy || undefined}");
    expect(source).toContain("aria-labelledby={props.labelledBy}");
    expect(source).toContain("disabled={props.disabled}");
    expect(source).toContain("readOnly={props.readOnly}");
    expect(source).toContain("required={props.required}");
    expect(source).toContain("form={props.formId}");
    expect(source).toContain("props.value.length > 0 ? props.value : undefined");
    expect(source).toContain("field().handleBlur()");
    expect(source).toContain('field().handleChange(next ?? "")');
    expect(source).toContain("props.selectProps?.onOpenChange?.(open, detail)");
    expect(source).toContain("label={optionText(props.option)}");
    expect(source).toContain('data-slot="select-field-trigger"');
    expect(source).toContain('data-slot="select-field-content"');
    expect(source).toContain('data-slot="select-field-group"');
    expect(source).toContain('data-slot="select-field-group-label"');
    expect(source).toContain('data-slot="select-field-item"');
    expect(source).toContain('data-slot="select-field-empty"');
  });

  test("captures Combobox parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/combobox.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/combobox.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("ComboboxPrimitive");
      expect(result.value.meta?.accessibility).toContain("clear semantics");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "input-group",
        "start-addon",
        "input",
        "chips-input",
        "trigger",
        "clear",
        "icon",
        "positioner",
        "surface",
        "content",
        "listbox",
        "group",
        "group-label",
        "item",
        "item-text",
        "item-indicator",
        "arrow",
        "separator",
        "empty",
        "status",
        "value",
      ]);
      expect(result.value.meta?.limitations).toContain("async loading state");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/combobox"');
    expect(source).toContain("export function ComboboxInput");
    expect(source).toContain("export function ComboboxClear");
    expect(source).toContain("export function ComboboxContent");
    expect(source).toContain("export function ComboboxEmpty");
    expect(source).toContain("export const ComboboxPopup = ComboboxContent");
    expect(source).toContain("export const ComboboxPrimitive = CoreCombobox");
    expect(source).toContain('data-scope="ui-combobox"');
    expect(source).toContain('data-slot="combobox-input-group"');
    expect(source).toContain('data-slot="combobox-clear"');
    expect(source).toContain('"max-w-(--available-width)"');
    expect(source).toContain("focus-visible:ring-[3px]");
  });

  test("captures Card parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/card.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/card.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.api).toContain("CardFrame");
      expect(result.value.meta?.accessibility).toContain("presentational native div");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "header",
        "title",
        "description",
        "action",
        "panel",
        "content",
        "footer",
        "frame",
        "frame-header",
        "frame-title",
        "frame-description",
        "frame-action",
        "frame-footer",
      ]);
      expect(result.value.meta?.limitations).toContain("interactive-card semantics");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('data-scope="ui-card"');
    expect(source).toContain('data-slot={slot ?? (part === "root" ? "card" : `card-${part}`)}');
    expect(source).toContain("export function CardFrame");
    expect(source).toContain("export function CardAction");
    expect(source).toContain("export function CardPanel");
    expect(source).toContain("export function CardContent");
    expect(source).toContain('"rounded-2xl"');
    expect(source).toContain('"bg-card"');
    expect(source).toContain("[--clip-bottom:-1rem]");
    expect(source).toContain("has-data-[slot=card-action]");
    expect(source).toContain("data-[slot=table-container]");
  });

  test("captures Dialog parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/dialog.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/dialog.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("DialogPanel");
      expect(result.value.meta?.accessibility).toContain("focus trap");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "trigger",
        "portal",
        "backdrop",
        "positioner",
        "content",
        "panel",
        "header",
        "footer",
        "title",
        "description",
        "close",
      ]);
      expect(result.value.meta?.limitations).toContain("DialogPanel");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/dialog"');
    expect(source).toContain("export function DialogContent");
    expect(source).toContain("export function DialogPanel");
    expect(source).toContain("export const DialogPrimitive = CoreDialog");
    expect(source).toContain('data-slot="dialog-content"');
    expect(source).toContain('data-slot="dialog-panel"');
    expect(source).toContain('"backdrop-blur-sm"');
    expect(source).toContain('"max-sm:origin-bottom"');
    expect(source).toContain("focus-visible:ring-2");
  });

  test("captures Popover parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/popover.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/popover.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("PopoverArrow");
      expect(result.value.meta?.accessibility).toContain("role=dialog");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "trigger",
        "portal",
        "positioner",
        "content",
        "viewport",
        "arrow",
        "header",
        "footer",
        "title",
        "description",
      ]);
      expect(result.value.meta?.limitations).toContain("Close controls");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/popover"');
    expect(source).toContain("export function PopoverArrow");
    expect(source).toContain("export const PopoverPopup = PopoverContent");
    expect(source).toContain("export const PopoverPrimitive = CorePopover");
    expect(source).toContain('data-slot="popover-viewport"');
    expect(source).toContain('"max-w-(--available-width)"');
    expect(source).toContain('"origin-(--transform-origin)"');
    expect(source).toContain("tooltipStyle");
  });

  test("captures Tooltip parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/tooltip.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/tooltip.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("TooltipProvider");
      expect(result.value.meta?.accessibility).toContain("aria-describedby");
      expect(result.value.meta?.anatomy).toEqual([
        "provider",
        "root",
        "trigger",
        "portal",
        "positioner",
        "content",
        "viewport",
        "arrow",
      ]);
      expect(result.value.meta?.limitations).toContain("custom arrow");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/tooltip"');
    expect(source).toContain("export function TooltipProvider");
    expect(source).toContain("export function TooltipArrow");
    expect(source).toContain("export const TooltipPopup = TooltipContent");
    expect(source).toContain("export const TooltipPrimitive = CoreTooltip");
    expect(source).toContain('data-slot="tooltip-viewport"');
    expect(source).toContain('"text-balance"');
    expect(source).toContain('"data-instant:duration-0"');
  });

  test("captures DropdownMenu parity metadata and generated source contract", async () => {
    const item = await import("../../../registry/default/items/dropdown-menu.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "ui/dropdown-menu.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("DropdownMenuSubContent");
      expect(result.value.meta?.accessibility).toContain("typeahead");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "trigger",
        "portal",
        "positioner",
        "content",
        "viewport",
        "arrow",
        "group",
        "label",
        "separator",
        "item",
        "link",
        "checkbox-item",
        "radio-group",
        "radio-item",
        "item-indicator",
        "item-label",
        "item-description",
        "shortcut",
        "sub",
        "sub-trigger",
        "sub-content",
      ]);
      expect(result.value.meta?.limitations).toContain("Submenu pointer grace");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain('from "@keystone-ui/core/dropdown-menu"');
    expect(source).toContain("export function DropdownMenuCheckboxItem");
    expect(source).toContain("export function DropdownMenuSubTrigger");
    expect(source).toContain("export const DropdownMenuPrimitive = CoreDropdownMenu");
    expect(source).toContain('data-slot="dropdown-menu-viewport"');
    expect(source).toContain('"grid-cols-[1fr_auto]"');
    expect(source).toContain("[--thumb-size:--spacing(4)]");
    expect(source).toContain("ChevronRightIcon");
  });

  test("captures Toast parity metadata against Kobalte, Base UI, and Sonner", async () => {
    const item = await import("../../../registry/default/items/toast.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.parts).toEqual([
        "viewport",
        "root",
        "icon",
        "title",
        "description",
        "action",
        "close",
      ]);
      expect(result.value.meta?.api).toContain("ToastPrimitive");
      expect(result.value.meta?.anatomy).toMatchObject({
        coreParts: expect.arrayContaining(["viewport", "root", "title", "description"]),
        uiSlots: expect.arrayContaining(["toast-viewport", "toast-icon", "toast-close"]),
      });
      expect(result.value.meta?.accessibility).toEqual(
        expect.arrayContaining([expect.any(String)]),
      );
      expect(result.value.meta?.cssVariables).toEqual([
        "--toast-offset",
        "--toast-gap",
        "--toast-width",
      ]);
      expect(result.value.meta?.limitations).toEqual(expect.arrayContaining([expect.any(String)]));
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        sonner: expect.any(String),
      });
    }

    const source = await Bun.file(join(repoRoot, "packages/ui/src/default/ui/toast.tsx")).text();

    expect(source).toContain('from "@keystone-ui/core/toast"');
    expect(source).toContain("export function ToastIcon");
    expect(source).toContain("export const ToastPrimitive = CoreToast");
    expect(source).toContain('data-slot="toast-viewport"');
    expect(source).toContain('data-slot="toast-icon"');
    expect(source).toContain("[--toast-width:24rem]");
    expect(source).toContain("renderToast?: (toast: ToastData) => JSX.Element");
  });

  test("resolves dialog registry dependencies deterministically", () => {
    const result = resolveRegistryDependencies(["dialog"], {
      button: buttonItem,
      dialog: dialogItem,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items.map((item) => item.name)).toEqual(["button", "dialog"]);
    }
  });

  test("resolves and validates dependency graphs through an async registry loader", async () => {
    const items: Record<string, RegistryItem> = {
      button: buttonItem,
      dialog: dialogItem,
    };
    const result = await resolveRegistryDependencyGraph(["dialog"], async (name) => items[name], {
      installSupportedOnly: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.items.map((item) => item.name)).toEqual(["button", "dialog"]);
    }
  });

  test("invalid item metadata returns actionable schema errors", () => {
    const result = validateItem({
      ...button,
      title: "",
      files: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("schema.invalid");
      expect(result.errors.some((error) => error.path?.includes("title"))).toBe(true);
    }
  });

  test.each([
    ["", "path.empty"],
    ["/tmp/button.tsx", "path.absolute"],
    ["../button.tsx", "path.traversal"],
    ["~/button.tsx", "path.home"],
    ["ui//button.tsx", "path.emptySegment"],
    ["C:\\Users\\button.tsx", "path.windowsDrive"],
    ["https://example.com/button.tsx", "path.url"],
  ] as const)("rejects unsafe path %s", (value, code) => {
    const errors = validateRegistryPath(value, { field: "target" });

    expect(errors.map((error) => error.code)).toContain(code);
  });

  test("rejects targets outside the project root after resolution", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "mason-registry-"));
    const errors = validateRegistryPath("../outside.tsx", {
      field: "target",
      projectRoot,
    });

    expect(errors.map((error) => error.code)).toContain("path.traversal");
  });

  test("rejects symlink escapes outside the project root", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "mason-registry-"));
    const outsideRoot = mkdtempSync(join(tmpdir(), "mason-registry-outside-"));
    mkdirSync(join(projectRoot, "src"));
    symlinkSync(outsideRoot, join(projectRoot, "src", "linked"));

    const errors = validateRegistryPath("src/linked/file.tsx", {
      field: "target",
      projectRoot,
      checkSymlinkEscape: true,
    });

    expect(errors.map((error) => error.code)).toContain("path.symlinkEscape");
  });

  test("rejects missing registry dependencies", () => {
    const result = resolveRegistryDependencies(["dialog"], {
      dialog: dialogItem,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("registryDependency.missing");
    }
  });

  test("rejects cyclic registry dependencies with path detail", () => {
    const first: RegistryItem = { ...buttonItem, name: "first", registryDependencies: ["second"] };
    const second: RegistryItem = { ...buttonItem, name: "second", registryDependencies: ["first"] };
    const result = resolveRegistryDependencies(["first"], { first, second });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      const cycle = result.errors.find((error) => error.code === "registryDependency.cycle");
      expect(cycle?.details?.cycle).toEqual(["first", "second", "first"]);
    }
  });

  test("distinguishes schema-valid item types from install-supported item types", () => {
    const pageItem = {
      ...button,
      name: "marketing-page",
      type: "registry:page",
      files: [
        {
          path: "registry/default/pages/home.tsx",
          type: "registry:page",
          target: "src/routes/index.tsx",
        },
      ],
    };

    const schemaResult = validateItem(pageItem);
    const installResult = validateItem(pageItem, { installSupportedOnly: true });

    expect(schemaResult.ok).toBe(true);
    expect(isInstallSupportedItemType("registry:page")).toBe(false);
    expect(installResult.ok).toBe(false);
    if (!installResult.ok) {
      expect(installResult.errors.map((error) => error.code)).toContain(
        "item.unsupportedForInstall",
      );
    }
  });

  test("requires explicit targets for block source files", () => {
    const result = validateItem({
      ...button,
      name: "account-settings",
      type: "registry:block",
      files: [
        {
          path: "blocks/account-settings.tsx",
          type: "registry:block",
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("schema.invalid");
      expect(result.errors.some((error) => error.path?.includes("target"))).toBe(true);
    }
  });

  test("derives multi-file item targets from filesRoot and targetRoot", () => {
    const result = validateItem(
      {
        ...button,
        name: "data-table",
        filesRoot: "packages/ui/src/default/components/data-table",
        targetRoot: "src/components/data-table",
        files: [
          {
            path: "packages/ui/src/default/components/data-table/data-table.tsx",
            type: "registry:ui",
          },
          {
            path: "packages/ui/src/default/components/data-table/use-data-table.ts",
            type: "registry:ui",
          },
        ],
      },
      { registryRoot: repoRoot },
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.files.map((file) => file.target)).toEqual([
        "src/components/data-table/data-table.tsx",
        "src/components/data-table/use-data-table.ts",
      ]);
    }
  });

  test("rejects multi-file source paths outside filesRoot", () => {
    const result = validateItem({
      ...button,
      name: "bad-data-table",
      filesRoot: "components/data-table",
      targetRoot: "src/components/data-table",
      files: [
        {
          path: "components/other/table.tsx",
          type: "registry:ui",
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("file.outsideFilesRoot");
    }
  });

  test("rejects duplicate targets after multi-file root derivation", () => {
    const result = validateItem({
      ...button,
      name: "duplicate-data-table",
      filesRoot: "components/data-table",
      targetRoot: "src/components/data-table",
      files: [
        {
          path: "components/data-table/data-table.tsx",
          type: "registry:ui",
        },
        {
          path: "components/data-table/use-data-table.ts",
          target: "src/components/data-table/data-table.tsx",
          type: "registry:ui",
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("file.duplicateTarget");
    }
  });

  test("rejects invalid package dependency specifiers", () => {
    const result = validateItem({
      ...button,
      dependencies: ["Bad Package@latest"],
      devDependencies: ["@scope/pkg@workspace:*"],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toEqual(
        expect.arrayContaining(["dependency.packageName", "dependency.version"]),
      );
    }
  });

  test("rejects missing registry source files when a registry root is provided", () => {
    const result = validateItem(
      {
        ...button,
        files: [{ path: "ui/missing.tsx", type: "registry:ui" }],
      },
      { registryRoot: repoRoot },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("file.missingSource");
    }
  });

  test("rejects duplicate explicit targets", () => {
    const result = validateItem({
      ...button,
      files: [
        {
          path: "registry/default/ui/button.tsx",
          type: "registry:ui",
          target: "src/components/ui/button.tsx",
        },
        {
          path: "registry/default/ui/dialog.tsx",
          type: "registry:ui",
          target: "src/components/ui/button.tsx",
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.code)).toContain("file.duplicateTarget");
    }
  });
});
