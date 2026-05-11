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
const repoRoot = resolve(import.meta.dir, "../../../..");
const defaultRegistryRoot = resolve(import.meta.dir, "../../../../registry/default");
const uiPackageSourceRoot = resolve(import.meta.dir, "../../../../packages/ui/src");

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
    const item = await import("../../../../registry/default/items/button.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toContain("base");
      expect(result.value.meta?.install).toBe("shadcn add https://keystone-ui.dev/r/button.json");
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
    const source = await readFile(resolve(uiPackageSourceRoot, "components/button.tsx"), "utf8");

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

  test("validates docs-ready metadata on the real default badge item", async () => {
    const item = await import("../../../../registry/default/items/badge.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toContain("base");
      expect(result.value.meta?.install).toBe("shadcn add https://keystone-ui.dev/r/badge.json");
      expect(result.value.meta?.customization).toContain("badgeClass");
      expect(result.value.meta?.api).toContain("variant default");
      expect(result.value.meta?.accessibility).toContain("presentational by default");
      expect(result.value.meta?.anatomy).toEqual(["root"]);
      expect(result.value.meta?.limitations).toContain("non-interactive");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        visualReference: expect.any(String),
        kobalte: expect.any(String),
      });
    }
  });

  test("captures the real default badge generated source contract", async () => {
    const source = await readFile(resolve(uiPackageSourceRoot, "components/badge.tsx"), "utf8");

    expect(source).toContain("export type BadgeVariant");
    expect(source).toContain("export type BadgeSize");
    expect(source).toContain("export function badgeClass");
    expect(source).toContain('"success"');
    expect(source).toContain('"warning"');
    expect(source).toContain('"error"');
    expect(source).toContain('"solid"');
    expect(source).toContain('data-scope="ui-badge"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-slot="badge"');
    expect(source).toContain("data-size={size()}");
    expect(source).toContain("data-variant={variant()}");
    expect(source).toContain("inline-flex");
    expect(source).toContain("rounded-sm");
    expect(source).toContain("[&_svg:not([class*='size-'])]:size-3.5");
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
        expect(sourceFile.path).toStartWith("packages/ui/src/");
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
      "alert",
      "app-shell",
      "app-store-provider",
      "autocomplete",
      "badge",
      "breadcrumb",
      "button",
      "card",
      "checkbox-field",
      "checkbox",
      "cn",
      "code-block",
      "collapsible",
      "combobox-field",
      "combobox",
      "command-menu",
      "command-store",
      "context-menu",
      "copy-button",
      "data-table-tanstack-router",
      "data-table",
      "date-picker-field",
      "date-picker",
      "dialog",
      "dropdown-menu",
      "empty",
      "field-array",
      "field",
      "file-field",
      "form-message",
      "form-submit",
      "frame",
      "group",
      "hover-card",
      "input",
      "invoice-dashboard",
      "kbd",
      "keyboard-command-surface",
      "keyboard-shortcuts",
      "label",
      "menu",
      "menubar",
      "nav-list",
      "navigation-menu",
      "number-field",
      "popover",
      "radio-group-field",
      "radio-group",
      "realtime-data-table",
      "resizable-workspace-shell",
      "scroll-area",
      "search-input",
      "select-field",
      "select",
      "separator",
      "sheet",
      "shortcut-display",
      "shortcut-recorder",
      "shortcut-sequence-recorder",
      "sidebar-store",
      "sidebar",
      "slider-field",
      "slider",
      "switch-field",
      "switch",
      "table",
      "tabs",
      "tanstack-field",
      "tanstack-form",
      "tanstack-start-dashboard",
      "text-field",
      "textarea-field",
      "textarea",
      "theme-store",
      "toast",
      "toolbar",
      "tooltip",
      "topbar",
      "use-copy-to-clipboard",
      "use-media-query",
    ]);
  });

  test("validates docs-ready metadata on the real default kbd item", async () => {
    const item = await import("../../../../registry/default/items/kbd.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/kbd.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("Kbd renders a native kbd element");
      expect(result.value.meta?.accessibility).toContain("native kbd semantics");
      expect(result.value.meta?.anatomy).toEqual(["root", "group", "separator"]);
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-kbd"');
      expect(result.value.meta?.ssr).toContain("deterministic passive markup");
      expect(result.value.meta?.limitations).toContain("display-only");
      expect(result.value.meta?.parity).toMatchObject({
        html: expect.any(String),
        shadcn: expect.any(String),
        keystoneCore: expect.any(String),
      });
    }

    expect(source).toContain("export function Kbd");
    expect(source).toContain("export function KbdGroup");
    expect(source).toContain("export function KbdSeparator");
    expect(source).toContain("<kbd");
    expect(source).toContain('data-scope="ui-kbd"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-slot="kbd"');
    expect(source).toContain('aria-hidden="true"');
  });

  test("validates docs-ready metadata on the real default table item", async () => {
    const item = await import("../../../../registry/default/items/table.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/table.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("TableContainer");
      expect(result.value.meta?.accessibility).toContain("native table");
      expect(result.value.meta?.anatomy).toEqual([
        "container",
        "root",
        "caption",
        "header",
        "body",
        "footer",
        "row",
        "head",
        "cell",
      ]);
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-table"');
      expect(result.value.meta?.state).toContain("No controlled or uncontrolled state");
      expect(result.value.meta?.ssr).toContain("deterministic native markup");
      expect(result.value.meta?.limitations).toContain("not a grid engine");
      expect(result.value.meta?.parity).toMatchObject({
        html: expect.any(String),
        shadcn: expect.any(String),
        tanstackTable: expect.any(String),
      });
    }

    expect(source).toContain("export function TableContainer");
    expect(source).toContain("export function Table");
    expect(source).toContain("export function TableHeader");
    expect(source).toContain("export function TableBody");
    expect(source).toContain("export function TableFooter");
    expect(source).toContain("export function TableRow");
    expect(source).toContain("export function TableHead");
    expect(source).toContain("export function TableCell");
    expect(source).toContain("export function TableCaption");
    expect(source).toContain('data-scope={local["data-scope"] ?? "ui-table"}');
    expect(source).toContain('data-slot={local["data-slot"] ?? "table-container"}');
    expect(source).toContain('data-slot={local["data-slot"] ?? "table"}');
    expect(source).toContain("caption-bottom");
    expect(source).toContain("data-[state=selected]:bg-muted/64");
  });

  test("validates docs-ready metadata on the real default alert item", async () => {
    const item = await import("../../../../registry/default/items/alert.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/alert.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("variant default|info|success|warning|error");
      expect(result.value.meta?.accessibility).toContain("role=status");
      expect(result.value.meta?.accessibility).toContain("role=alert");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "icon",
        "title",
        "description",
        "action",
      ]);
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-alert"');
      expect(result.value.meta?.state).toContain("No controlled or uncontrolled state");
      expect(result.value.meta?.ssr).toContain("deterministic native elements");
      expect(result.value.meta?.cssVariables).toContain("No component-specific CSS variables");
      expect(result.value.meta?.limitations).toContain("does not manage dismissal");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain("export function Alert");
    expect(source).toContain("export function AlertIcon");
    expect(source).toContain("export function AlertTitle");
    expect(source).toContain("export function AlertDescription");
    expect(source).toContain("export function AlertAction");
    expect(source).toContain('data-scope="ui-alert"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-slot="alert"');
    expect(source).toContain("data-variant={variant()}");
    expect(source).toContain('variant() === "error" ? "alert" : "status"');
    expect(source).toContain(
      'aria-live={local["aria-live"] ?? (role() === "status" ? "polite" : undefined)}',
    );
    expect(source).toContain('"has-data-[slot=alert-icon]:grid-cols-[calc(var(--spacing)*4)_1fr]"');
    expect(source).toContain(
      '"has-data-[slot=alert-icon]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]"',
    );
    expect(source).toContain('"border-success/28"');
    expect(source).toContain('"border-warning/28"');
  });

  test("validates docs-ready metadata on the real default separator item", async () => {
    const item = await import("../../../../registry/default/items/separator.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/separator.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("orientation horizontal|vertical");
      expect(result.value.meta?.accessibility).toContain("role=presentation");
      expect(result.value.meta?.accessibility).toContain("role=separator");
      expect(result.value.meta?.anatomy).toEqual(["root"]);
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-separator"');
      expect(result.value.meta?.state).toContain("No controlled or uncontrolled state");
      expect(result.value.meta?.ssr).toContain("deterministic native markup");
      expect(result.value.meta?.cssVariables).toContain("No component-specific CSS variables");
      expect(result.value.meta?.limitations).toContain("does not implement resizable splitters");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain("export function separatorClass");
    expect(source).toContain("export function Separator");
    expect(source).toContain('role={decorative() ? "presentation" : "separator"}');
    expect(source).toContain("aria-orientation={decorative() ? undefined : orientation()}");
    expect(source).toContain('data-scope="ui-separator"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-slot="separator"');
    expect(source).toContain('data-decorative={decorative() ? "" : undefined}');
    expect(source).toContain("data-orientation={orientation()}");
    expect(source).toContain('"data-[orientation=horizontal]:h-px"');
    expect(source).toContain('"data-[orientation=horizontal]:w-full"');
    expect(source).toContain(
      "\"data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch\"",
    );
    expect(source).toContain('"data-[orientation=vertical]:w-px"');
    expect(source).toContain('"bg-border"');
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

  test("validates docs-ready metadata on the real default group item", async () => {
    const item = await import("../../../../registry/default/items/group.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/group.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.api).toContain("GroupItem");
      expect(result.value.meta?.accessibility).toContain("role=group");
      expect(result.value.meta?.anatomy).toEqual(["root", "item", "label", "description"]);
      expect(result.value.meta?.statePassThrough).toContain("do not disable");
      expect(result.value.meta?.composition).toContain("FieldGroup");
      expect(result.value.meta?.composition).toContain("Toolbar");
      expect(result.value.meta?.composition).toContain("Card");
      expect(result.value.meta?.limitations).toContain("no Core primitive behavior");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
      });
    }

    expect(source).toContain("export function Group");
    expect(source).toContain("export function GroupItem");
    expect(source).toContain("export function GroupLabel");
    expect(source).toContain("export function GroupDescription");
    expect(source).toContain('data-scope="ui-group"');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-slot="group"');
    expect(source).toContain("data-variant={variant()}");
    expect(source).toContain("data-orientation={orientation()}");
    expect(source).toContain('data-disabled={local.disabled ? "" : undefined}');
    expect(source).toContain('data-invalid={local.invalid ? "" : undefined}');
    expect(source).toContain('data-selected={local.selected ? "" : undefined}');
    expect(source).toContain('"attached"');
    expect(source).toContain('"inset"');
    expect(source).toContain("[&>[data-slot=button]:not(:first-child)]:rounded-s-none");
    expect(source).toContain("[&>[data-slot=input-control]:not(:last-child)]:rounded-e-none");
  });

  test("validates docs-ready metadata on the real default data-table item", async () => {
    const item = await import("../../../../registry/default/items/data-table.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-table@^8.21.3");
      expect(result.value.registryDependencies).toEqual(["table", "cn"]);
      expect(result.value.files.length).toBeGreaterThan(1);
      expect(
        result.value.files.every((file) => file.target?.startsWith("@components/data-table/")),
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
      empty,
      skeleton,
    ] = await Promise.all([
      readFile(resolve(sourceRoot, "data-table.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "use-data-table.ts"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-column-header.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-toolbar.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-faceted-filter.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-pagination.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-view-options.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-row-actions.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-empty-state.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "data-table-skeleton.tsx"), "utf8"),
    ]);

    expect(table).toContain('data-scope="ui-data-table"');
    expect(table).toContain("@/components/ui/table");
    expect(table).toContain("<UITableContainer");
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
    expect(facetedFilter).toContain('data-part="faceted-control"');
    expect(facetedFilter).toContain('data-state={checked() ? "checked" : "unchecked"}');
    expect(facetedFilter).toContain("props.table.setPageIndex(0)");

    expect(pagination).toContain('role="navigation"');
    expect(pagination).toContain('aria-label="Table pagination"');
    expect(pagination).toContain('aria-live="polite"');
    expect(pagination).toContain('aria-label="Go to next page"');
    expect(pagination).toContain('data-part="page-size-select"');
    expect(pagination).toContain('data-part="page-button"');
    expect(pagination).toContain('data-page="last"');

    expect(viewOptions).toContain('role="group"');
    expect(viewOptions).toContain('aria-label="Column visibility"');
    expect(viewOptions).toContain('data-part="view-option-control"');
    expect(rowActions).toContain('role="group"');
    expect(rowActions).toContain('aria-label={props.label ?? "Row actions"}');
    expect(rowActions).toContain('data-part="row-action"');
    expect(rowActions).toContain("data-variant={action.variant}");
    expect(rowActions).toContain("hidden");

    expect(empty).toContain("export function DataTableEmpty");
    expect(empty).toContain('role="status"');
    expect(skeleton).toContain('data-part="skeleton-status"');
    expect(skeleton).toContain('role="status"');
    expect(skeleton).toContain('aria-hidden="true"');
  });

  test("validates docs-ready metadata on the real default data-table router adapter item", async () => {
    const item = await import("../../../../registry/default/items/data-table-tanstack-router.json");
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
    const item = await import("../../../../registry/default/items/invoice-dashboard.json");
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

  test("validates docs-ready metadata on the real default realtime-data-table block", async () => {
    const item = await import("../../../../registry/default/items/realtime-data-table.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:block");
      expect(result.value.dependencies).toContain("@tanstack/solid-table@^8.21.3");
      expect(result.value.registryDependencies).toEqual(["badge", "button", "data-table"]);
      expect(result.value.files).toHaveLength(3);
      expect(
        result.value.files.every((file) =>
          file.target?.startsWith("src/components/blocks/realtime-data-table/"),
        ),
      ).toBe(true);
      expect(result.value.meta?.realtimeBehavior).toContain("accessor");
      expect(result.value.meta?.sorting).toContain("latency");
      expect(result.value.meta?.rowIdentity).toContain("getRowId");
      expect(result.value.meta?.states).toContain("empty state");
      expect(result.value.meta?.accessibility).toContain("keyboard reachable");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackTable: expect.any(String),
        dataDenseWorkspace: expect.any(String),
        shadcn: expect.any(String),
      });
    }
  });

  test("captures the real default realtime-data-table generated source contract", async () => {
    const sourceRoot = resolve(uiPackageSourceRoot, "blocks/realtime-data-table");
    const [block, columns, data] = await Promise.all([
      readFile(resolve(sourceRoot, "realtime-data-table.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "realtime-data-table-columns.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "realtime-data-table-data.ts"), "utf8"),
    ]);

    expect(block).toContain("export function RealtimeDataTableBlock");
    expect(block).toContain('data-part="realtime-data-table"');
    expect(block).toContain('data-part="realtime-controls"');
    expect(block).toContain('role="group"');
    expect(block).toContain('aria-live="polite"');
    expect(block).toContain("data: rows");
    expect(block).toContain("getRowId: (row) => row.id");
    expect(block).toContain("DataTableToolbar");
    expect(block).toContain("loading={loading()}");
    expect(block).toContain("setRows([])");
    expect(block).toContain("window.setInterval");

    expect(columns).toContain("DataTableColumnHeader");
    expect(columns).toContain("dataTableFacetedFilter");
    expect(columns).toContain("realtimeDataTableStatusOptions");
    expect(columns).toContain('accessorKey: "latency"');
    expect(columns).toContain('accessorKey: "throughput"');
    expect(data).toContain("nextRealtimeDataTableRows");
    expect(data).toContain("realtimeDataTableRows");
    expect(data).toContain("RealtimeDataTableRow");
  });

  test("validates docs-ready metadata on the real default keyboard-command-surface block", async () => {
    const item = await import("../../../../registry/default/items/keyboard-command-surface.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:block");
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn", "command-menu", "shortcut-display"]);
      expect(result.value.files).toHaveLength(1);
      expect(result.value.files[0]?.target).toBe(
        "src/components/blocks/keyboard-command-surface.tsx",
      );
      expect(result.value.meta?.composition).toContain("Core Command-backed focus");
      expect(result.value.meta?.keyboardInspectability).toContain("description-list semantics");
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        tanstackHotkeys: expect.any(String),
        shadcn: expect.any(String),
        dataDenseWorkspace: expect.any(String),
      });
    }
  });

  test("captures the real default keyboard-command-surface generated source contract", async () => {
    const source = await readFile(
      resolve(uiPackageSourceRoot, "blocks/keyboard-command-surface.tsx"),
      "utf8",
    );

    expect(source).toContain("export function KeyboardCommandSurfaceBlock");
    expect(source).toContain("CommandMenu");
    expect(source).toContain("ShortcutDisplay");
    expect(source).toContain('data-part="keyboard-command-surface"');
    expect(source).toContain('data-part="command-row"');
    expect(source).toContain('data-part="command-surface-shortcuts"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("createCommandMenuStore");
    expect(source).toContain("CommandMenuItemData");
  });

  test("validates docs-ready metadata on the real default resizable-workspace-shell block", async () => {
    const item = await import("../../../../registry/default/items/resizable-workspace-shell.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:block");
      expect(result.value.registryDependencies).toEqual(["button", "cn"]);
      expect(result.value.files).toHaveLength(1);
      expect(result.value.files[0]?.target).toBe(
        "src/components/blocks/resizable-workspace-shell.tsx",
      );
      expect(result.value.meta?.layout).toContain("left rail");
      expect(result.value.meta?.keyboardReachability).toContain("role=separator");
      expect(result.value.meta?.responsiveConstraints).toContain("panels stack");
      expect(result.value.meta?.primitiveBoundary).toContain("does not introduce Core behavior");
      expect(result.value.meta?.parity).toMatchObject({
        shadcn: expect.any(String),
        dataDenseWorkspace: expect.any(String),
        coreBoundary: expect.any(String),
      });
    }
  });

  test("captures the real default resizable-workspace-shell generated source contract", async () => {
    const source = await readFile(
      resolve(uiPackageSourceRoot, "blocks/resizable-workspace-shell.tsx"),
      "utf8",
    );

    expect(source).toContain("export function ResizableWorkspaceShellBlock");
    expect(source).toContain('data-part="resizable-workspace-shell"');
    expect(source).toContain('data-part="left-rail"');
    expect(source).toContain('data-part="work-surface"');
    expect(source).toContain('data-part="inspector-panel"');
    expect(source).toContain('role="separator"');
    expect(source).toContain("aria-valuenow={props.value}");
    expect(source).toContain('case "ArrowLeft"');
    expect(source).toContain('case "ArrowRight"');
    expect(source).toContain('case "Home"');
    expect(source).toContain('case "End"');
    expect(source).toContain(
      "lg:grid-cols-[var(--workspace-left)_12px_minmax(0,1fr)_12px_var(--workspace-inspector)]",
    );
    expect(source).toContain('document.addEventListener("pointermove"');
    expect(source).toContain("leftRail?: JSX.Element");
    expect(source).toContain("workSurface?: JSX.Element");
    expect(source).toContain("inspector?: JSX.Element");
  });

  test("validates docs-ready metadata on the real default TanStack Start dashboard template", async () => {
    const item = await import("../../../../registry/default/items/tanstack-start-dashboard.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("registry:item");
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
        registryTooling: expect.any(String),
      });
    }
  });

  test("captures the real default tabs generated source contract", async () => {
    const item = await import("../../../../registry/default/items/tabs.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/tabs.tsx"), "utf8");

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
        "--active-tab-left",
        "--active-tab-top",
        "--active-tab-width",
        "--active-tab-height",
        "--active-tab-bottom",
      ]);
      expect(result.value.meta?.accessibility).toContain("role=tablist/tab/tabpanel");
    }

    expect(source).toContain("tabsRootClass");
    expect(source).toContain("tabsIndicatorClass");
    expect(source).toContain("data-selected:[anchor-name:--keystone-tabs-active]");
    expect(source).toContain("--active-tab-left");
    expect(source).toContain("--active-tab-width");
    expect(source).toContain("data-[orientation=vertical]:flex-col");
    expect(source).toContain("focus-visible:ring-2");
    expect(source).toContain("data-active:text-foreground");
  });

  test("validates docs-ready metadata on the real default command-menu item", async () => {
    const item = await import("../../../../registry/default/items/command-menu.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/command-menu.tsx"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-store@^0.11.0");
      expect(result.value.dependencies).toContain("@tanstack/solid-hotkeys@^0.10.0");
      expect(result.value.registryDependencies).toEqual(["cn", "command-store"]);
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
        "item-icon",
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
      expect(result.value.meta?.accessibility).toContain("Keystone Command");
      expect(result.value.meta?.customization).toContain("docs-search-style command palette");
      expect(result.value.meta?.limitations).toContain("local command palette pattern");
      expect(result.value.meta?.parity).toMatchObject({
        visualReference: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        tanstackStore: expect.any(String),
        tanstackHotkeys: expect.any(String),
      });
    }

    expect(source).toContain("export function CommandMenuBackdrop");
    expect(source).toContain("createCommandStore");
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

  test("validates docs-ready metadata on the real default command-store item", async () => {
    const item = await import("../../../../registry/default/items/command-store.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/command-store.ts"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-store@^0.11.0");
      expect(result.value.meta?.api).toContain("createCommandStore");
      expect(result.value.meta?.state).toContain("recentlyUsedCommandIds");
      expect(result.value.meta?.behavior).toContain("does not own combobox roles");
      expect(result.value.meta?.controlledUsage).toContain("onRegister");
      expect(result.value.meta?.ssr).toContain("does not read window");
      expect(result.value.meta?.limitations).toContain("not a Core primitive");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackStore: expect.any(String),
        tanstackHotkeys: expect.any(String),
        shadcn: expect.any(String),
        keystoneCore: expect.any(String),
      });
    }

    expect(source).toContain("export function createCommandStore");
    expect(source).toContain("selectedCommandId");
    expect(source).toContain("recentlyUsedCommandIds");
    expect(source).toContain("registerCommands");
    expect(source).toContain("getScopedCommands");
    expect(source).toContain("options.onRegister?.(commandStore)");
  });

  test("validates docs-ready metadata on the real default theme-store item", async () => {
    const item = await import("../../../../registry/default/items/theme-store.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "stores/theme-store.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-store@^0.11.0");
      expect(result.value.meta?.api).toContain("createThemeStore");
      expect(result.value.meta?.state).toContain("light, dark, and system");
      expect(result.value.meta?.controlled).toContain("ThemeProvider accepts theme");
      expect(result.value.meta?.ssr).toContain("No browser globals are read");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackStore: expect.any(String),
        shadcn: expect.any(String),
      });
    }

    expect(source).toContain("export function createThemeStore");
    expect(source).toContain("export function mountThemeStore");
    expect(source).toContain("export function ThemeProvider");
    expect(source).toContain("export function ThemeScript");
    expect(source).toContain("data-ui-resolved-theme");
  });

  test("validates docs-ready metadata on the real default sidebar-store item", async () => {
    const item = await import("../../../../registry/default/items/sidebar-store.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "stores/sidebar-store.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-store@^0.11.0");
      expect(result.value.meta?.api).toContain("createSidebarStore");
      expect(result.value.meta?.state).toContain("desktop open state");
      expect(result.value.meta?.keyboard).toContain("Mod+B");
      expect(result.value.meta?.ssr).toContain("No browser globals are read");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackStore: expect.any(String),
        shadcn: expect.any(String),
      });
    }

    expect(source).toContain("export function createSidebarStore");
    expect(source).toContain("export function mountSidebarStore");
    expect(source).toContain("export function SidebarProvider");
    expect(source).toContain("openMobile");
    expect(source).toContain('defaultKeyboardShortcut = "b"');
  });

  test("validates docs-ready metadata on the real default keyboard-shortcuts item", async () => {
    const item = await import("../../../../registry/default/items/keyboard-shortcuts.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/keyboard-shortcuts.tsx"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-hotkeys@^0.10.0");
      expect(result.value.meta?.api).toContain("KeyboardShortcuts");
      expect(result.value.meta?.behavior).toContain("scope");
      expect(result.value.meta?.ssr).toContain("no DOM target");
      expect(result.value.meta?.limitations).toContain("preview/alpha");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackHotkeys: expect.any(String),
        tanstackStore: expect.any(String),
        shadcn: expect.any(String),
        keystoneCore: expect.any(String),
      });
    }

    expect(source).toContain("export function KeyboardShortcuts");
    expect(source).toContain("export function getKeyboardShortcutConflicts");
    expect(source).toContain("createHotkeys");
    expect(source).toContain("activeScope");
  });

  test("validates docs-ready metadata on the real default shortcut-display item", async () => {
    const item = await import("../../../../registry/default/items/shortcut-display.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/shortcut-display.tsx"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-hotkeys@^0.10.0");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "step",
        "key",
        "separator",
        "sequence-separator",
      ]);
      expect(result.value.meta?.api).toContain("display-only");
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-shortcut-display"');
      expect(result.value.meta?.parity).toMatchObject({
        tanstackHotkeys: expect.any(String),
        shadcn: expect.any(String),
        keystoneCore: expect.any(String),
      });
    }

    expect(source).toContain("export function ShortcutDisplay");
    expect(source).toContain("formatForDisplay");
    expect(source).toContain('data-part="key"');
    expect(source).toContain("data-key={token}");
  });

  test("validates docs-ready metadata on the real default shortcut recorder items", async () => {
    const recorder = await import("../../../../registry/default/items/shortcut-recorder.json");
    const sequence =
      await import("../../../../registry/default/items/shortcut-sequence-recorder.json");
    const recorderResult = validateItem(recorder.default, { registryRoot: repoRoot });
    const sequenceResult = validateItem(sequence.default, { registryRoot: repoRoot });
    const [recorderSource, sequenceSource] = await Promise.all([
      readFile(resolve(uiPackageSourceRoot, "components/shortcut-recorder.tsx"), "utf8"),
      readFile(resolve(uiPackageSourceRoot, "components/shortcut-sequence-recorder.tsx"), "utf8"),
    ]);

    expect(recorderResult.ok).toBe(true);
    expect(sequenceResult.ok).toBe(true);
    if (recorderResult.ok && sequenceResult.ok) {
      expect(recorderResult.value.registryDependencies).toEqual(["cn", "shortcut-display"]);
      expect(sequenceResult.value.registryDependencies).toEqual(["cn", "shortcut-display"]);
      expect(recorderResult.value.meta?.behavior).toContain("createHotkeyRecorder");
      expect(sequenceResult.value.meta?.behavior).toContain("createHotkeySequenceRecorder");
      expect(recorderResult.value.meta?.dataAttributes).toContain("data-recording");
      expect(sequenceResult.value.meta?.dataAttributes).toContain("data-recording");
    }

    expect(recorderSource).toContain("export function ShortcutRecorder");
    expect(recorderSource).toContain("createHotkeyRecorder");
    expect(recorderSource).toContain('data-scope="ui-shortcut-recorder"');
    expect(sequenceSource).toContain("export function ShortcutSequenceRecorder");
    expect(sequenceSource).toContain("createHotkeySequenceRecorder");
    expect(sequenceSource).toContain('data-scope="ui-shortcut-sequence-recorder"');
  });

  test("captures Field parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/field.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/input.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/input.tsx"), "utf8");

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
    expect(source).toContain('"data-scope"');
    expect(source).toContain('data-scope={local["data-scope"] ?? "ui-input"}');
    expect(source).toContain('data-part="root"');
    expect(source).toContain('data-part={local["data-part"] ?? "input"}');
    expect(source).toContain('data-slot="input-control"');
    expect(source).toContain('data-slot={local["data-slot"] ?? "input"}');
    expect(source).toContain('local.type === "search"');
    expect(source).toContain('local.type === "file"');
    expect(source).toContain('size={typeof size() === "number" ? size() : undefined}');
    expect(source).toContain("has-focus-visible:ring-[3px]");
  });

  test("captures Checkbox parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/checkbox.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/checkbox.tsx"), "utf8");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@keystone-ui/core@^0.0.0");
      expect(result.value.registryDependencies).toEqual(["cn", "label"]);
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
    const item = await import("../../../../registry/default/items/switch.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/switch.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/select.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/select.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/tanstack-form.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/tanstack-form.tsx"),
      "utf8",
    );

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
    const item = await import("../../../../registry/default/items/tanstack-field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/tanstack-field.tsx"),
      "utf8",
    );

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

  test("captures FormMessage parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/form-message.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/form-message.tsx"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.registryDependencies).toEqual(["cn", "tanstack-form"]);
      expect(result.value.meta?.api).toContain("forceMount");
      expect(result.value.meta?.accessibility).toContain("role=alert");
      expect(result.value.meta?.anatomy).toEqual(["root"]);
      expect(result.value.meta?.state).toContain("TanStack Form owns");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackForm: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        shadcn: expect.any(String),
      });
    }

    expect(source).toContain("export function FormMessage");
    expect(source).toContain("formatFieldError");
    expect(source).toContain("getTanStackFormState(local.form)");
    expect(source).toContain('role={invalid() && hasMessage() ? "alert" : undefined}');
    expect(source).toContain('aria-live={invalid() && hasMessage() ? "polite" : undefined}');
    expect(source).toContain('data-scope="ui-form-message"');
    expect(source).toContain('data-slot="form-message"');
    expect(source).toContain("data-validating");
  });

  test("captures FieldArray parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/field-array.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/field-array.tsx"),
      "utf8",
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-form@^1.29.1");
      expect(result.value.registryDependencies).toEqual(["cn", "form-message"]);
      expect(result.value.meta?.api).toContain('mode="array"');
      expect(result.value.meta?.accessibility).toContain("role=group");
      expect(result.value.meta?.anatomy).toEqual([
        "root",
        "label",
        "items",
        "item",
        "empty",
        "description",
        "error",
        "add",
        "remove",
        "move",
      ]);
      expect(result.value.meta?.state).toContain("pushValue");
      expect(result.value.meta?.dataAttributes).toContain('data-scope="ui-field-array"');
      expect(result.value.meta?.ssr).toContain("Solid Index");
      expect(result.value.meta?.parity).toMatchObject({
        tanstackForm: expect.any(String),
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        shadcn: expect.any(String),
      });
    }

    expect(source).toContain("export function FieldArray");
    expect(source).toContain('mode="array"');
    expect(source).toContain("export function FieldArrayItems");
    expect(source).toContain("<Index each={props.context.items()}");
    expect(source).toContain("export function FieldArrayAdd");
    expect(source).toContain("export function FieldArrayRemove");
    expect(source).toContain("export function FieldArrayMove");
    expect(source).toContain("local.field().pushValue");
    expect(source).toContain("local.field().removeValue");
    expect(source).toContain("local.field().moveValue");
    expect(source).toContain("local.field().swapValues");
    expect(source).toContain('role="group"');
    expect(source).toContain('data-slot="field-array-items"');
    expect(source).toContain('data-slot="field-array-error"');
    expect(source).toContain('type={local.type ?? "button"}');
  });

  test("captures SelectField parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/select-field.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/select-field.tsx"),
      "utf8",
    );

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
    const item = await import("../../../../registry/default/items/combobox.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/combobox.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/card.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/card.tsx"), "utf8");

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
    expect(source).toContain("export const CardContent = CardPanel");
    expect(source).toContain('"rounded-2xl"');
    expect(source).toContain('"bg-card"');
    expect(source).toContain("[--clip-bottom:-1rem]");
    expect(source).toContain("has-data-[slot=card-action]");
    expect(source).toContain("data-[slot=table-container]");
  });

  test("captures Dialog parity metadata and generated source contract", async () => {
    const item = await import("../../../../registry/default/items/dialog.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/dialog.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/popover.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/popover.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/tooltip.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(resolve(uiPackageSourceRoot, "components/tooltip.tsx"), "utf8");

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
    const item = await import("../../../../registry/default/items/dropdown-menu.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });
    const source = await readFile(
      resolve(uiPackageSourceRoot, "components/dropdown-menu.tsx"),
      "utf8",
    );

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
    const item = await import("../../../../registry/default/items/toast.json");
    const result = validateItem(item.default, { registryRoot: repoRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.parts).toEqual([
        "viewport",
        "root",
        "content",
        "icon",
        "title",
        "description",
        "action",
        "close",
      ]);
      expect(result.value.meta?.api).toContain("ToastPrimitive");
      expect(result.value.meta?.anatomy).toMatchObject({
        coreParts: expect.arrayContaining(["viewport", "root", "title", "description"]),
        uiSlots: expect.arrayContaining(["toast-viewport", "toast-content", "toast-icon"]),
      });
      expect(result.value.meta?.accessibility).toEqual(
        expect.arrayContaining([expect.any(String)]),
      );
      expect(result.value.meta?.cssVariables).toEqual([
        "--toast-offset",
        "--toast-gap",
        "--toast-peek",
        "--toast-width",
        "--toast-calc-height",
        "--toast-height",
        "--toast-index",
        "--toast-scale",
        "--toast-shrink",
        "--toast-swipe-movement-x",
        "--toast-swipe-movement-y",
        "--toast-stack-offset",
      ]);
      expect(result.value.meta?.limitations).toEqual(expect.arrayContaining([expect.any(String)]));
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        sonner: expect.any(String),
      });
    }

    const source = await Bun.file(join(repoRoot, "packages/ui/src/components/toast.tsx")).text();

    expect(source).toContain('from "@keystone-ui/core/toast"');
    expect(source).toContain("export function ToastIcon");
    expect(source).toContain("export function ToastContent");
    expect(source).toContain("export const ToastPrimitive = CoreToast");
    expect(source).toContain('data-slot="toast-viewport"');
    expect(source).toContain('data-slot="toast-icon"');
    expect(source).toContain("DEFAULT_VISIBLE_TOASTS = 3");
    expect(source).toContain(
      "renderToast?: (toast: ToastData, info: ToastRenderInfo) => JSX.Element",
    );
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
    const projectRoot = mkdtempSync(join(tmpdir(), "mason-"));
    const errors = validateRegistryPath("../outside.tsx", {
      field: "target",
      projectRoot,
    });

    expect(errors.map((error) => error.code)).toContain("path.traversal");
  });

  test("rejects symlink escapes outside the project root", () => {
    const projectRoot = mkdtempSync(join(tmpdir(), "mason-"));
    const outsideRoot = mkdtempSync(join(tmpdir(), "mason-outside-"));
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
        filesRoot: "packages/ui/src/components/data-table",
        targetRoot: "src/components/data-table",
        files: [
          {
            path: "packages/ui/src/components/data-table/data-table.tsx",
            type: "registry:ui",
          },
          {
            path: "packages/ui/src/components/data-table/use-data-table.ts",
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
