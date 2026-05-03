import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import { primitiveMetadata } from "@keystone-ui/keystone";
import { primitiveContracts, primitiveScopes } from "./primitive-contracts";
import { registryItemContracts } from "./registry-contracts";

describe("docs metadata contracts", () => {
  test("covers every Keystone primitive metadata scope", () => {
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
      expect(metadata.parts.length).toBeGreaterThan(0);
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

    for (const item of registryItemContracts) {
      expect(item.install).toStartWith("mason add ");
      expect(item.files.length).toBeGreaterThan(0);
      expect(item.customization).toBeString();
      expect(item.caveats).toBeString();
      expect(Object.keys(item.parity).length).toBeGreaterThan(0);
      expect(Object.values(item.parity).every((note) => note.length > 0)).toBe(true);
    }
  });

  test("includes the required preview docs surfaces", () => {
    expect(primitiveScopes).toEqual(
      expect.arrayContaining(["dialog", "popover", "tooltip", "sheet", "select"]),
    );
    expect(registryItemContracts.map((item) => item.name)).toEqual(
      expect.arrayContaining(["text-field", "select-field", "account-settings"]),
    );
  });
});
