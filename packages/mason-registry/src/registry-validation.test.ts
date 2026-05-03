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
const defaultRegistryRoot = resolve(import.meta.dir, "../../../registry/default");

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
    const result = validateItem(item.default, { registryRoot: defaultRegistryRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.categories).toContain("base");
      expect(result.value.meta?.install).toBe("mason add button");
      expect(result.value.meta?.customization).toBeString();
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
      const result = validateItem(item, { registryRoot: defaultRegistryRoot });
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
      "context-menu",
      "data-table-tanstack-router",
      "data-table",
      "date-picker",
      "dialog",
      "dropdown-menu",
      "field",
      "hover-card",
      "input",
      "label",
      "menu",
      "menubar",
      "navigation-menu",
      "popover",
      "radio-group",
      "select-field",
      "separator",
      "sheet",
      "slider",
      "switch",
      "tabs",
      "text-field",
      "textarea",
      "toast",
      "toolbar",
      "tooltip",
    ]);
  });

  test("validates docs-ready metadata on the real default data-table item", async () => {
    const item = await import("../../../registry/default/items/data-table.json");
    const result = validateItem(item.default, { registryRoot: defaultRegistryRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-table@^8.21.3");
      expect(result.value.registryDependencies).toEqual(["cn"]);
      expect(result.value.meta?.columns).toBeString();
      expect(result.value.meta?.sorting).toBeString();
      expect(result.value.meta?.filtering).toBeString();
      expect(result.value.meta?.pagination).toBeString();
      expect(result.value.meta?.rowActions).toBeString();
      expect(result.value.meta?.limitations).toBeString();
    }
  });

  test("validates docs-ready metadata on the real default data-table router adapter item", async () => {
    const item = await import("../../../registry/default/items/data-table-tanstack-router.json");
    const result = validateItem(item.default, { registryRoot: defaultRegistryRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dependencies).toContain("@tanstack/solid-router@^1.168.20");
      expect(result.value.registryDependencies).toEqual(["data-table"]);
      expect(result.value.meta?.searchParams).toBeString();
      expect(result.value.meta?.stateMapping).toBeString();
      expect(result.value.meta?.limitations).toBeString();
    }
  });

  test("captures Toast parity metadata against Kobalte, Base UI, and Sonner", async () => {
    const item = await import("../../../registry/default/items/toast.json");
    const result = validateItem(item.default, { registryRoot: defaultRegistryRoot });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.meta?.parts).toEqual([
        "viewport",
        "root",
        "title",
        "description",
        "action",
        "close",
      ]);
      expect(result.value.meta?.parity).toMatchObject({
        baseUi: expect.any(String),
        kobalte: expect.any(String),
        sonner: expect.any(String),
      });
    }
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
      { registryRoot: defaultRegistryRoot },
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
