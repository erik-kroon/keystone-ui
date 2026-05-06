import { describe, expect, test } from "vitest";
import { partDataAttributes } from "../utils/index";
import {
  getDocsMetadata,
  getPartDataAttributes,
  getPartMetadata,
  primitiveMetadata,
  primitiveMaturityLabels,
  type PrimitiveMaturity,
  type PrimitiveScope,
} from "./index";

const expectedParts = {
  "accessible-icon": ["root", "label"],
  accordion: ["root", "item", "header", "trigger", "content"],
  "alert-dialog": [
    "trigger",
    "cancel",
    "action",
    "backdrop",
    "positioner",
    "content",
    "title",
    "description",
  ],
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
  command: [
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
  description: ["root"],
  direction: ["root"],
  dialog: ["trigger", "close", "backdrop", "positioner", "content", "title", "description"],
  drawer: ["trigger", "close", "backdrop", "positioner", "content", "title", "description"],
  "error-message": ["root"],
  field: ["root", "control", "label", "description", "error-message", "hidden-input"],
  fieldset: ["root", "legend", "description", "error-message"],
  "form-control": ["root", "control", "label", "description", "error-message", "hidden-input"],
  "hover-card": ["trigger", "positioner", "arrow", "content"],
  label: ["root"],
  "live-announcer": ["root", "polite", "assertive"],
  locale: [],
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
  "number-field": ["root", "input", "increment-trigger", "decrement-trigger"],
  overlay: ["layer"],
  popover: ["trigger", "positioner", "arrow", "content"],
  popper: ["anchor", "positioner", "arrow"],
  portal: ["root"],
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
  slider: ["root", "track", "range", "thumb", "hidden-input"],
  "spin-button": ["root", "input", "increment-trigger", "decrement-trigger"],
  tabs: ["root", "list", "trigger", "indicator", "content"],
  toast: ["viewport", "root", "title", "description", "action", "close"],
  toolbar: ["root", "button", "link", "separator"],
  switch: ["root", "control", "thumb", "hidden-input"],
  tooltip: ["trigger", "positioner", "arrow", "content"],
  "visually-hidden": ["root"],
} as const satisfies Record<PrimitiveScope, readonly string[]>;

const publicPrimitiveScopes = [
  "accessible-icon",
  "accordion",
  "alert-dialog",
  "autocomplete",
  "calendar",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "date-picker",
  "description",
  "direction",
  "dialog",
  "drawer",
  "dropdown-menu",
  "error-message",
  "field",
  "fieldset",
  "form-control",
  "hover-card",
  "label",
  "live-announcer",
  "locale",
  "menu",
  "menubar",
  "navigation-menu",
  "number-field",
  "popover",
  "popper",
  "portal",
  "radio-group",
  "select",
  "sheet",
  "slider",
  "spin-button",
  "switch",
  "tabs",
  "toast",
  "toolbar",
  "tooltip",
  "visually-hidden",
] as const satisfies readonly PrimitiveScope[];

describe("primitive part metadata", () => {
  test("defines docs-ready part metadata for every current primitive", () => {
    expect(Object.keys(expectedParts).sort()).toEqual(Object.keys(primitiveMetadata).sort());

    for (const [scope, parts] of Object.entries(expectedParts)) {
      const metadata = primitiveMetadata[scope as PrimitiveScope];
      const docsMetadata = getDocsMetadata(scope);

      expect(metadata.scope).toBe(scope);
      expect(docsMetadata?.maturity).toBe(metadata.maturity);
      expect(docsMetadata?.maturityLabel).toBe(primitiveMaturityLabels[metadata.maturity]);
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

  test("covers every public primitive contract scope", () => {
    for (const scope of publicPrimitiveScopes) {
      expect(primitiveMetadata[scope]).toBeDefined();
      expect(getDocsMetadata(scope)).toBeDefined();
    }
  });

  test("labels every primitive with a conservative maturity status", () => {
    const validStatuses = new Set<PrimitiveMaturity>([
      "internal",
      "experimental",
      "beta",
      "stable",
      "deprecated",
    ]);

    for (const metadata of Object.values(primitiveMetadata)) {
      expect(validStatuses.has(metadata.maturity)).toBe(true);
    }

    expect(primitiveMetadata.overlay.maturity).toBe("internal");
    expect(primitiveMetadata.listbox.maturity).toBe("internal");
    expect(primitiveMetadata.dialog.maturity).toBe("beta");
    expect(primitiveMetadata.select.maturity).toBe("beta");
    expect(primitiveMetadata.combobox.maturity).toBe("experimental");
    expect(primitiveMetadata.command.maturity).toBe("experimental");
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
    expect(partDataAttributes("direction", "root")).toEqual({
      "data-scope": "direction",
      "data-part": "root",
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
    expect(attributeNames("fieldset", "root")).toEqual(
      expect.arrayContaining(["data-disabled", "data-invalid", "data-readonly", "data-required"]),
    );
    expect(attributeNames("direction", "root")).toEqual(expect.arrayContaining(["data-dir"]));
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
