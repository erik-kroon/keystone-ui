export type PartStateAttributeMetadata = {
  name: `data-${string}`;
  values?: readonly string[];
};

export type PartCssVarMetadata = {
  name: `--keystone-${string}`;
};

export type PrimitivePartMetadata = {
  part: string;
  dataAttributes: readonly PartStateAttributeMetadata[];
  cssVars: readonly PartCssVarMetadata[];
};

export type PrimitiveMaturity = "internal" | "experimental" | "beta" | "stable" | "deprecated";

export type PrimitiveMaturityLabel = "Internal" | "Experimental" | "Beta" | "Stable" | "Deprecated";

export type PrimitiveMetadata = {
  maturity: PrimitiveMaturity;
  scope: string;
  parts: readonly PrimitivePartMetadata[];
};

export type DocsPartMetadata = PrimitivePartMetadata & {
  selector: `[data-scope="${string}"][data-part="${string}"]`;
};

export type DocsPrimitiveMetadata = Omit<PrimitiveMetadata, "parts"> & {
  maturityLabel: PrimitiveMaturityLabel;
  parts: readonly DocsPartMetadata[];
};

const basePartAttributes = [
  { name: "data-scope" },
  { name: "data-part" },
] as const satisfies readonly PartStateAttributeMetadata[];

const overlayStateAttributes = [
  { name: "data-state", values: ["open", "closed"] },
  { name: "data-transition-status", values: ["closed", "closing", "opening", "open"] },
  { name: "data-starting-style" },
  { name: "data-ending-style" },
] as const satisfies readonly PartStateAttributeMetadata[];

const floatingAttributes = [
  { name: "data-side", values: ["top", "right", "bottom", "left"] },
  { name: "data-align", values: ["start", "center", "end"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const floatingCssVars = [
  { name: "--keystone-anchor-width" },
  { name: "--keystone-anchor-height" },
  { name: "--keystone-available-width" },
  { name: "--keystone-available-height" },
  { name: "--keystone-arrow-x" },
  { name: "--keystone-arrow-y" },
  { name: "--keystone-transform-origin" },
] as const satisfies readonly PartCssVarMetadata[];

const floatingArrowAttributes = floatingAttributes;

const disclosureStateAttributes = [
  { name: "data-disabled" },
  { name: "data-state", values: ["open", "closed"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const accordionStateAttributes = [
  { name: "data-disabled" },
  { name: "data-orientation", values: ["horizontal", "vertical"] },
  { name: "data-state", values: ["open", "closed"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const formStateAttributes = [
  { name: "data-dirty" },
  { name: "data-disabled" },
  { name: "data-filled" },
  { name: "data-focused" },
  { name: "data-invalid" },
  { name: "data-readonly" },
  { name: "data-required" },
  { name: "data-touched" },
  { name: "data-validating" },
] as const satisfies readonly PartStateAttributeMetadata[];

const fieldsetStateAttributes = [
  { name: "data-disabled" },
  { name: "data-invalid" },
  { name: "data-readonly" },
  { name: "data-required" },
] as const satisfies readonly PartStateAttributeMetadata[];

const directionStateAttributes = [
  { name: "data-dir", values: ["ltr", "rtl"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const selectStateAttributes = [
  { name: "data-disabled" },
  { name: "data-highlighted" },
  { name: "data-invalid" },
  { name: "data-placeholder" },
  { name: "data-readonly" },
  { name: "data-required" },
  { name: "data-selected" },
  { name: "data-state", values: ["open", "closed"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const comboboxStateAttributes = [
  { name: "data-disabled" },
  { name: "data-highlighted" },
  { name: "data-invalid" },
  { name: "data-placeholder" },
  { name: "data-readonly" },
  { name: "data-required" },
  { name: "data-selected" },
  { name: "data-state", values: ["open", "closed"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const menuItemAttributes = [
  { name: "data-checked" },
  { name: "data-disabled" },
  { name: "data-hidden" },
  { name: "data-highlighted" },
  { name: "data-value" },
] as const satisfies readonly PartStateAttributeMetadata[];

const groupAttributes = [
  { name: "data-disabled" },
  { name: "data-value" },
] as const satisfies readonly PartStateAttributeMetadata[];

const sideAttributes = [
  { name: "data-side", values: ["top", "right", "bottom", "left"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const toastStateAttributes = [
  { name: "data-status", values: ["open", "closed"] },
  { name: "data-type", values: ["default", "success", "info", "warning", "error", "loading"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const tabsStateAttributes = [
  { name: "data-active" },
  { name: "data-disabled" },
  { name: "data-highlighted" },
  { name: "data-orientation", values: ["horizontal", "vertical"] },
  { name: "data-selected" },
] as const satisfies readonly PartStateAttributeMetadata[];

const sliderStateAttributes = [
  { name: "data-dir", values: ["ltr", "rtl"] },
  { name: "data-disabled" },
  { name: "data-invalid" },
  { name: "data-orientation", values: ["horizontal", "vertical"] },
  { name: "data-readonly" },
  { name: "data-required" },
] as const satisfies readonly PartStateAttributeMetadata[];

const sliderCssVars = [
  { name: "--keystone-slider-range-start" },
  { name: "--keystone-slider-range-end" },
  { name: "--keystone-slider-thumb-percent" },
] as const satisfies readonly PartCssVarMetadata[];

const numericInputStateAttributes = [
  { name: "data-at-max" },
  { name: "data-at-min" },
  { name: "data-disabled" },
  { name: "data-invalid" },
  { name: "data-readonly" },
  { name: "data-required" },
] as const satisfies readonly PartStateAttributeMetadata[];

const toolbarStateAttributes = [
  { name: "data-disabled" },
  { name: "data-dir", values: ["ltr", "rtl"] },
  { name: "data-orientation", values: ["horizontal", "vertical"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const calendarStateAttributes = [
  { name: "data-disabled" },
  { name: "data-outside-month" },
  { name: "data-selected" },
  { name: "data-today" },
  { name: "data-value" },
] as const satisfies readonly PartStateAttributeMetadata[];

const datePickerStateAttributes = [
  { name: "data-disabled" },
  { name: "data-placeholder" },
  { name: "data-state", values: ["open", "closed"] },
  { name: "data-value" },
] as const satisfies readonly PartStateAttributeMetadata[];

const selectionControlStateAttributes = [
  { name: "data-checked" },
  { name: "data-disabled" },
  { name: "data-invalid" },
  { name: "data-readonly" },
  { name: "data-required" },
  { name: "data-state", values: ["checked", "unchecked", "indeterminate"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const radioGroupStateAttributes = [
  { name: "data-dir", values: ["ltr", "rtl"] },
  { name: "data-disabled" },
  { name: "data-invalid" },
  { name: "data-orientation", values: ["horizontal", "vertical"] },
  { name: "data-readonly" },
  { name: "data-required" },
] as const satisfies readonly PartStateAttributeMetadata[];

const radioItemStateAttributes = [
  { name: "data-checked" },
  { name: "data-disabled" },
  { name: "data-state", values: ["checked", "unchecked"] },
] as const satisfies readonly PartStateAttributeMetadata[];

const primitiveMaturityByScope: Record<string, PrimitiveMaturity> = {
  "accessible-icon": "beta",
  accordion: "beta",
  "alert-dialog": "beta",
  autocomplete: "experimental",
  calendar: "experimental",
  checkbox: "beta",
  collapsible: "experimental",
  combobox: "experimental",
  command: "experimental",
  "context-menu": "experimental",
  "date-picker": "experimental",
  description: "beta",
  dialog: "beta",
  drawer: "beta",
  direction: "stable",
  "dropdown-menu": "experimental",
  "error-message": "beta",
  field: "beta",
  fieldset: "beta",
  "form-control": "beta",
  "hover-card": "experimental",
  label: "beta",
  listbox: "internal",
  "live-announcer": "beta",
  locale: "beta",
  menu: "experimental",
  menubar: "experimental",
  "navigation-menu": "experimental",
  "number-field": "experimental",
  overlay: "internal",
  popover: "experimental",
  popper: "beta",
  portal: "beta",
  "radio-group": "experimental",
  select: "beta",
  sheet: "experimental",
  slider: "experimental",
  "spin-button": "experimental",
  switch: "beta",
  tabs: "beta",
  toast: "experimental",
  toolbar: "experimental",
  tooltip: "experimental",
  "visually-hidden": "stable",
};

export const primitiveMaturityLabels = {
  internal: "Internal",
  experimental: "Experimental",
  beta: "Beta",
  stable: "Stable",
  deprecated: "Deprecated",
} as const satisfies Record<PrimitiveMaturity, PrimitiveMaturityLabel>;

export const primitiveMetadata = {
  "accessible-icon": definePrimitive("accessible-icon", [part("root"), part("label")]),
  accordion: definePrimitive("accordion", [
    part("root", [
      { name: "data-disabled" },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
    ]),
    part("item", accordionStateAttributes),
    part("header", disclosureStateAttributes),
    part("trigger", accordionStateAttributes),
    part("content", accordionStateAttributes),
  ]),
  "alert-dialog": definePrimitive("alert-dialog", [
    part("trigger", overlayStateAttributes),
    part("cancel", overlayStateAttributes),
    part("action", overlayStateAttributes),
    part("backdrop", overlayStateAttributes),
    part("positioner", overlayStateAttributes),
    part("content", overlayStateAttributes),
    part("title"),
    part("description"),
  ]),
  autocomplete: comboboxPrimitive("autocomplete"),
  checkbox: definePrimitive("checkbox", [
    part("root", selectionControlStateAttributes),
    part("control", selectionControlStateAttributes),
    part("indicator", selectionControlStateAttributes),
    part("hidden-input", selectionControlStateAttributes),
  ]),
  collapsible: definePrimitive("collapsible", [
    part("root", disclosureStateAttributes),
    part("trigger", disclosureStateAttributes),
    part("content", disclosureStateAttributes),
  ]),
  combobox: comboboxPrimitive("combobox"),
  command: comboboxPrimitive("command"),
  calendar: definePrimitive("calendar", [
    part("root", [{ name: "data-disabled" }, { name: "data-value" }]),
    part("header", [{ name: "data-disabled" }]),
    part("prev-trigger", [{ name: "data-disabled" }]),
    part("next-trigger", [{ name: "data-disabled" }]),
    part("heading"),
    part("grid", [{ name: "data-disabled" }]),
    part("grid-header"),
    part("grid-body"),
    part("row"),
    part("column-header"),
    part("cell", calendarStateAttributes),
    part("cell-trigger", calendarStateAttributes),
  ]),
  "date-picker": definePrimitive("date-picker", [
    part("root", datePickerStateAttributes),
    part("trigger", datePickerStateAttributes),
    part("content", [{ name: "data-state", values: ["open", "closed"] }]),
  ]),
  description: definePrimitive("description", [part("root")]),
  direction: definePrimitive("direction", [part("root", directionStateAttributes)]),
  dialog: definePrimitive("dialog", [
    part("trigger", overlayStateAttributes),
    part("close", overlayStateAttributes),
    part("backdrop", overlayStateAttributes),
    part("positioner", overlayStateAttributes),
    part("content", overlayStateAttributes),
    part("title"),
    part("description"),
  ]),
  drawer: definePrimitive("drawer", [
    part("trigger", [...overlayStateAttributes, ...sideAttributes]),
    part("close", [...overlayStateAttributes, ...sideAttributes]),
    part("backdrop", [...overlayStateAttributes, ...sideAttributes]),
    part("positioner", [...overlayStateAttributes, ...sideAttributes]),
    part("content", [...overlayStateAttributes, ...sideAttributes]),
    part("title"),
    part("description"),
  ]),
  "error-message": definePrimitive("error-message", [part("root")]),
  field: definePrimitive("field", [
    part("root", formStateAttributes),
    part("control", formStateAttributes),
    part("label", formStateAttributes),
    part("description", formStateAttributes),
    part("error-message", formStateAttributes),
    part("hidden-input"),
  ]),
  fieldset: definePrimitive("fieldset", [
    part("root", fieldsetStateAttributes),
    part("legend", fieldsetStateAttributes),
    part("description", fieldsetStateAttributes),
    part("error-message", fieldsetStateAttributes),
  ]),
  "form-control": definePrimitive("form-control", [
    part("root", formStateAttributes),
    part("control", formStateAttributes),
    part("label", formStateAttributes),
    part("description", formStateAttributes),
    part("error-message", formStateAttributes),
    part("hidden-input"),
  ]),
  "hover-card": definePrimitive("hover-card", [
    part("trigger", overlayStateAttributes),
    part("positioner", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("arrow", [...overlayStateAttributes, ...floatingArrowAttributes]),
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
  ]),
  "live-announcer": definePrimitive("live-announcer", [
    part("root"),
    part("polite"),
    part("assertive"),
  ]),
  label: definePrimitive("label", [part("root")]),
  locale: definePrimitive("locale", []),
  listbox: definePrimitive("listbox", [
    part("listbox"),
    part("option", [
      { name: "data-disabled" },
      { name: "data-hidden" },
      { name: "data-highlighted" },
      { name: "data-selected" },
      { name: "data-group" },
      { name: "data-value" },
    ]),
    part("group", groupAttributes),
    part("group-label"),
  ]),
  "context-menu": menuPrimitive("context-menu"),
  "dropdown-menu": menuPrimitive("dropdown-menu"),
  menu: menuPrimitive("menu"),
  menubar: menuPrimitive("menubar"),
  "navigation-menu": menuPrimitive("navigation-menu"),
  "number-field": numericInputPrimitive("number-field"),
  overlay: definePrimitive("overlay", [
    part("layer", [
      { name: "data-layer-id" },
      { name: "data-layer-index" },
      { name: "data-modal" },
      { name: "data-top-layer" },
    ]),
  ]),
  popover: definePrimitive("popover", [
    part("trigger", overlayStateAttributes),
    part("positioner", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("arrow", [...overlayStateAttributes, ...floatingArrowAttributes]),
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
  ]),
  popper: definePrimitive("popper", [
    part("anchor"),
    part("positioner", floatingAttributes, floatingCssVars),
    part("arrow", floatingArrowAttributes),
  ]),
  portal: definePrimitive("portal", [part("root")]),
  "radio-group": definePrimitive("radio-group", [
    part("root", radioGroupStateAttributes),
    part("item", [...radioItemStateAttributes, { name: "data-dir", values: ["ltr", "rtl"] }]),
    part("item-indicator", radioItemStateAttributes),
    part("hidden-input", [
      ...radioItemStateAttributes,
      { name: "data-dir", values: ["ltr", "rtl"] },
      { name: "data-invalid" },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
      { name: "data-readonly" },
      { name: "data-required" },
    ]),
  ]),
  select: definePrimitive("select", [
    part("trigger", selectStateAttributes),
    part("value", [{ name: "data-placeholder" }]),
    part(
      "positioner",
      [...floatingAttributes, { name: "data-state", values: ["open", "closed"] }],
      floatingCssVars,
    ),
    part("arrow", [...floatingArrowAttributes, { name: "data-state", values: ["open", "closed"] }]),
    part(
      "content",
      [...floatingAttributes, { name: "data-state", values: ["open", "closed"] }],
      floatingCssVars,
    ),
    part("listbox"),
    part("group", groupAttributes),
    part("group-label"),
    part("item", [
      { name: "data-disabled" },
      { name: "data-group" },
      { name: "data-hidden" },
      { name: "data-highlighted" },
      { name: "data-selected" },
      { name: "data-value" },
    ]),
    part("item-text"),
    part("item-indicator"),
  ]),
  sheet: definePrimitive("sheet", [
    part("trigger", [...overlayStateAttributes, ...sideAttributes]),
    part("close", [...overlayStateAttributes, ...sideAttributes]),
    part("backdrop", [...overlayStateAttributes, ...sideAttributes]),
    part("positioner", [...overlayStateAttributes, ...sideAttributes]),
    part("content", [...overlayStateAttributes, ...sideAttributes]),
    part("title"),
    part("description"),
  ]),
  slider: definePrimitive("slider", [
    part("root", sliderStateAttributes),
    part("track", sliderStateAttributes),
    part("range", sliderStateAttributes, sliderCssVars.slice(0, 2)),
    part("thumb", [...sliderStateAttributes, { name: "data-index" }], sliderCssVars.slice(2)),
    part("hidden-input", [...sliderStateAttributes, { name: "data-index" }]),
  ]),
  "spin-button": numericInputPrimitive("spin-button"),
  tabs: definePrimitive("tabs", [
    part("root", [
      { name: "data-disabled" },
      { name: "data-dir", values: ["ltr", "rtl"] },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
    ]),
    part("list", [
      { name: "data-disabled" },
      { name: "data-dir", values: ["ltr", "rtl"] },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
    ]),
    part("trigger", tabsStateAttributes),
    part("indicator", [
      { name: "data-disabled" },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
    ]),
    part("content", [
      { name: "data-disabled" },
      { name: "data-orientation", values: ["horizontal", "vertical"] },
      { name: "data-active" },
      { name: "data-selected" },
    ]),
  ]),
  toast: definePrimitive("toast", [
    part("viewport"),
    part("root", toastStateAttributes),
    part("title"),
    part("description"),
    part("action"),
    part("close", [{ name: "data-disabled" }]),
  ]),
  toolbar: definePrimitive("toolbar", [
    part("root", toolbarStateAttributes),
    part("button", [...toolbarStateAttributes, { name: "data-pressed" }]),
    part("link", toolbarStateAttributes),
    part("separator", [{ name: "data-orientation", values: ["horizontal", "vertical"] }]),
  ]),
  switch: definePrimitive("switch", [
    part("root", selectionControlStateAttributes),
    part("control", selectionControlStateAttributes),
    part("thumb", selectionControlStateAttributes),
    part("hidden-input", selectionControlStateAttributes),
  ]),
  tooltip: definePrimitive("tooltip", [
    part("trigger", overlayStateAttributes),
    part("positioner", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("arrow", [...overlayStateAttributes, ...floatingArrowAttributes]),
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
  ]),
  "visually-hidden": definePrimitive("visually-hidden", [part("root")]),
} as const satisfies Record<string, PrimitiveMetadata>;

export type PrimitiveScope = keyof typeof primitiveMetadata;

export function getPrimitiveMetadata(scope: string): PrimitiveMetadata | undefined {
  return primitiveMetadata[scope as PrimitiveScope];
}

export function getPartMetadata(
  scope: string,
  partName: string,
): PrimitivePartMetadata | undefined {
  return getPrimitiveMetadata(scope)?.parts.find((candidate) => candidate.part === partName);
}

export function getPartDataAttributes(scope: string, partName: string): Record<string, string> {
  return {
    "data-scope": scope,
    "data-part": partName,
  };
}

export function getDocsMetadata(scope: string): DocsPrimitiveMetadata | undefined {
  const metadata = getPrimitiveMetadata(scope);

  if (!metadata) {
    return undefined;
  }

  return {
    maturity: metadata.maturity,
    maturityLabel: primitiveMaturityLabels[metadata.maturity],
    scope: metadata.scope,
    parts: metadata.parts.map((metadataPart) => ({
      ...metadataPart,
      selector: `[data-scope="${metadata.scope}"][data-part="${metadataPart.part}"]`,
    })),
  };
}

function definePrimitive(
  scope: string,
  parts: readonly PrimitivePartMetadata[],
  maturity: PrimitiveMaturity = primitiveMaturityByScope[scope] ?? "experimental",
): PrimitiveMetadata {
  return { maturity, scope, parts };
}

function part(
  partName: string,
  stateAttributes: readonly PartStateAttributeMetadata[] = [],
  cssVars: readonly PartCssVarMetadata[] = [],
): PrimitivePartMetadata {
  return {
    part: partName,
    dataAttributes: dedupeStateAttributes([...basePartAttributes, ...stateAttributes]),
    cssVars,
  };
}

function menuPrimitive(scope: string): PrimitiveMetadata {
  return definePrimitive(scope, [
    part("trigger", overlayStateAttributes),
    part("positioner", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("arrow", [...overlayStateAttributes, ...floatingArrowAttributes]),
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("group"),
    part("group-label"),
    part("separator"),
    part("item", menuItemAttributes),
    part("item-indicator"),
  ]);
}

function comboboxPrimitive(scope: string): PrimitiveMetadata {
  return definePrimitive(scope, [
    part("input", comboboxStateAttributes),
    part("trigger", comboboxStateAttributes),
    part("clear", comboboxStateAttributes),
    part(
      "positioner",
      [...floatingAttributes, { name: "data-state", values: ["open", "closed"] }],
      floatingCssVars,
    ),
    part("arrow", [...floatingArrowAttributes, { name: "data-state", values: ["open", "closed"] }]),
    part(
      "content",
      [...floatingAttributes, { name: "data-state", values: ["open", "closed"] }],
      floatingCssVars,
    ),
    part("listbox"),
    part("group", groupAttributes),
    part("group-label"),
    part("item", [
      { name: "data-disabled" },
      { name: "data-group" },
      { name: "data-hidden" },
      { name: "data-highlighted" },
      { name: "data-selected" },
      { name: "data-value" },
    ]),
    part("item-text"),
    part("item-indicator"),
  ]);
}

function numericInputPrimitive(scope: string): PrimitiveMetadata {
  return definePrimitive(scope, [
    part("root", numericInputStateAttributes),
    part("input", numericInputStateAttributes),
    part("increment-trigger", numericInputStateAttributes),
    part("decrement-trigger", numericInputStateAttributes),
  ]);
}

function dedupeStateAttributes(
  attributes: readonly PartStateAttributeMetadata[],
): readonly PartStateAttributeMetadata[] {
  const seen = new Set<string>();
  return attributes.filter((attribute) => {
    if (seen.has(attribute.name)) {
      return false;
    }

    seen.add(attribute.name);
    return true;
  });
}
