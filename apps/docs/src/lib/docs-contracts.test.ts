import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import { primitiveMetadata } from "@keystone-ui/core";
import {
  getPrimitiveDocs,
  primitiveContracts,
  primitiveMaturityContracts,
  primitiveMaturityCounts,
  primitiveScopes,
} from "./primitive-contracts";
import { defaultRegistry, defaultRegistryItems } from "./default-registry-items.gen";
import { registryItemContracts } from "./registry-contracts";

describe("docs metadata contracts", () => {
  test("covers every Core primitive metadata scope", () => {
    expect(primitiveContracts.map((contract) => contract.scope).sort()).toEqual(
      Object.keys(primitiveMetadata).sort(),
    );

    for (const contract of primitiveContracts) {
      expect(contract.title).toBeString();
      expect(contract.importPath).toBeString();
      expect(contract.roleNotes.length).toBeGreaterThan(0);
      expect(contract.keyboardNotes.length).toBeGreaterThan(0);
      expect(contract.ariaNotes.length).toBeGreaterThan(0);
      expect(contract.ssrNotes.length).toBeGreaterThan(0);
      expect(contract.example).toBeString();

      const metadata = primitiveMetadata[contract.scope];
      const docs = getPrimitiveDocs(contract.scope);
      const maturity = primitiveMaturityContracts[metadata.maturity];

      expect(docs.maturity).toEqual(maturity);
      expect(docs.metadata.maturityLabel).toBe(maturity.label);
      expect(maturity.label).toBeString();
      expect(maturity.summary).toBeString();
      for (const part of metadata.parts) {
        expect(part.dataAttributes.map((attribute) => attribute.name)).toContain("data-scope");
        expect(part.dataAttributes.map((attribute) => attribute.name)).toContain("data-part");
      }
    }
  });

  test("covers every default Mason registry item", () => {
    const registryItemsDir = resolve(import.meta.dir, "../../../../registry/default/items");
    const itemNames = readdirSync(registryItemsDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""))
      .sort();

    expect(registryItemContracts.map((item) => item.name).sort()).toEqual(itemNames);
    expect(defaultRegistryItems.map((item) => item.name)).toEqual(
      defaultRegistry.items.map((item) => item.name),
    );

    for (const item of registryItemContracts) {
      expect(item.install).toStartWith("mason add ");
      expect(item.files.length).toBeGreaterThan(0);
      expect(item.sourceFiles.length).toBeGreaterThan(0);
      expect(item.sourcePreview).toContain("registry/default/");
      expect(item.sourcePreview).toContain("export ");
      expect(item.customization).toBeString();
      expect(item.caveats).toBeString();
      expect(Object.keys(item.parity).length).toBeGreaterThan(0);
      expect(Object.values(item.parity).every((note) => note.length > 0)).toBe(true);
    }
  });

  test("surfaces conservative primitive maturity counts", () => {
    const counted = Object.values(primitiveMaturityCounts).reduce(
      (total, count) => total + count,
      0,
    );

    expect(counted).toBe(primitiveScopes.length);
    expect(primitiveMaturityCounts.stable).toBeGreaterThan(0);
    expect(primitiveMaturityCounts.beta).toBeGreaterThan(0);
    expect(primitiveMaturityCounts.experimental).toBeGreaterThan(0);
    expect(primitiveMaturityCounts.internal).toBeGreaterThan(0);
  });

  test("includes the required preview docs surfaces", () => {
    expect(primitiveScopes).toEqual(
      expect.arrayContaining(["dialog", "popover", "tooltip", "sheet", "select"]),
    );
    expect(registryItemContracts.map((item) => item.name)).toEqual(
      expect.arrayContaining(["text-field", "select-field", "account-settings"]),
    );
  });

  test("documents manual accessibility release gates", () => {
    const checklistPath = resolve(
      import.meta.dir,
      "../../../../docs/core/accessibility-verification.md",
    );

    expect(existsSync(checklistPath)).toBe(true);

    const checklist = readFileSync(checklistPath, "utf8");
    expect(checklist).toContain("Keyboard");
    expect(checklist).toContain("Screen reader");
    expect(checklist).toContain("Focus");
    expect(checklist).toContain("Forms");
    expect(checklist).toContain("SSR");
    expect(checklist).toContain("forced colors");
  });
});
