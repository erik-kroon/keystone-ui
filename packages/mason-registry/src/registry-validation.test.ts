import { mkdtempSync, mkdirSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import button from "./testing/fixtures/registry/default/ui/button.json";
import dialog from "./testing/fixtures/registry/default/ui/dialog.json";
import registry from "./testing/fixtures/registry/default/registry.json";
import {
  isInstallSupportedItemType,
  resolveRegistryDependencies,
  validateItem,
  validateRegistry,
  validateRegistryPath,
  type RegistryItem,
} from "./index";

const buttonItem = button as RegistryItem;
const dialogItem = dialog as RegistryItem;

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
});
