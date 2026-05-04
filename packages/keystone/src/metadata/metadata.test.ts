import { describe, expect, test } from "vitest";
import { partDataAttributes } from "../utils/index";
import {
  getDocsMetadata,
  getPartDataAttributes,
  getPartMetadata,
  primitiveMetadata,
  type PrimitiveScope,
} from "./index";

const expectedParts = {
  accordion: ["root", "item", "header", "trigger", "content"],
  autocomplete: [
    "input",
    "trigger",
    "clear",
    "positioner",
    "arrow",
    "content",
    "listbox",
    "group",
    "group-label",
    "item",
    "item-text",
    "item-indicator",
  ],
  calendar: [
    "root",
    "header",
    "prev-trigger",
    "next-trigger",
    "heading",
    "grid",
    "grid-header",
    "grid-body",
    "row",
    "column-header",
    "cell",
    "cell-trigger",
  ],
  checkbox: ["root", "control", "indicator", "hidden-input"],
  combobox: [
    "input",
    "trigger",
    "clear",
    "positioner",
    "arrow",
    "content",
    "listbox",
    "group",
    "group-label",
    "item",
    "item-text",
    "item-indicator",
  ],
  collapsible: ["root", "trigger", "content"],
  "date-picker": ["root", "trigger", "content"],
  dialog: ["trigger", "close", "backdrop", "positioner", "content", "title", "description"],
  "form-control": ["root", "control", "label", "description", "error-message", "hidden-input"],
  "hover-card": ["trigger", "positioner", "arrow", "content"],
  listbox: ["listbox", "option", "group", "group-label"],
  "context-menu": [
    "trigger",
    "positioner",
    "arrow",
    "content",
    "group",
    "group-label",
    "separator",
    "item",
    "item-indicator",
  ],
  "dropdown-menu": [
    "trigger",
    "positioner",
    "arrow",
    "content",
    "group",
    "group-label",
    "separator",
    "item",
    "item-indicator",
  ],
  menu: [
    "trigger",
    "positioner",
    "arrow",
    "content",
    "group",
    "group-label",
    "separator",
    "item",
    "item-indicator",
  ],
  menubar: [
    "trigger",
    "positioner",
    "arrow",
    "content",
    "group",
    "group-label",
    "separator",
    "item",
    "item-indicator",
  ],
  "navigation-menu": [
    "trigger",
    "positioner",
    "arrow",
    "content",
    "group",
    "group-label",
    "separator",
    "item",
    "item-indicator",
  ],
  overlay: ["layer"],
  popover: ["trigger", "positioner", "arrow", "content"],
  popper: ["anchor", "positioner", "arrow"],
  "radio-group": ["root", "item", "item-indicator", "hidden-input"],
  select: [
    "trigger",
    "value",
    "positioner",
    "arrow",
    "content",
    "listbox",
    "group",
    "group-label",
    "item",
    "item-text",
    "item-indicator",
  ],
  sheet: ["trigger", "close", "backdrop", "positioner", "content", "title", "description"],
  slider: ["root", "track", "range", "thumb"],
  tabs: ["root", "list", "trigger", "indicator", "content"],
  toast: ["viewport", "root", "title", "description", "action", "close"],
  toolbar: ["root", "button", "link", "separator"],
  switch: ["root", "control", "thumb", "hidden-input"],
  tooltip: ["trigger", "positioner", "arrow", "content"],
} as const satisfies Record<PrimitiveScope, readonly string[]>;

describe("primitive part metadata", () => {
  test("defines docs-ready part metadata for every current primitive", () => {
    for (const [scope, parts] of Object.entries(expectedParts)) {
      const metadata = primitiveMetadata[scope as PrimitiveScope];
      const docsMetadata = getDocsMetadata(scope);

      expect(metadata.scope).toBe(scope);
      expect(metadata.parts.map((part) => part.part)).toEqual(parts);
      expect(docsMetadata?.parts.map((part) => part.selector)).toEqual(
        parts.map((part) => `[data-scope="${scope}"][data-part="${part}"]`),
      );

      for (const part of metadata.parts) {
        expect(part.dataAttributes.map((attribute) => attribute.name)).toContain("data-scope");
        expect(part.dataAttributes.map((attribute) => attribute.name)).toContain("data-part");
      }
    }
  });

  test("routes runtime part attributes through the metadata helper", () => {
    expect(getPartDataAttributes("select", "trigger")).toEqual({
      "data-scope": "select",
      "data-part": "trigger",
    });
    expect(partDataAttributes("form-control", "hidden-input")).toEqual({
      "data-scope": "form-control",
      "data-part": "hidden-input",
    });
  });

  test("captures styling states and floating css variables on relevant parts", () => {
    expect(attributeNames("select", "trigger")).toEqual(
      expect.arrayContaining([
        "data-disabled",
        "data-invalid",
        "data-placeholder",
        "data-readonly",
        "data-required",
        "data-state",
      ]),
    );
    expect(attributeNames("form-control", "control")).toEqual(
      expect.arrayContaining([
        "data-dirty",
        "data-filled",
        "data-focused",
        "data-invalid",
        "data-touched",
        "data-validating",
      ]),
    );
    expect(cssVarNames("popover", "positioner")).toEqual(
      expect.arrayContaining([
        "--keystone-anchor-width",
        "--keystone-anchor-height",
        "--keystone-available-width",
        "--keystone-available-height",
        "--keystone-transform-origin",
      ]),
    );
  });
});

function attributeNames(scope: PrimitiveScope, part: string) {
  return getPartMetadata(scope, part)?.dataAttributes.map((attribute) => attribute.name) ?? [];
}

function cssVarNames(scope: PrimitiveScope, part: string) {
  return getPartMetadata(scope, part)?.cssVars.map((cssVar) => cssVar.name) ?? [];
}
