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

export type PrimitiveMetadata = {
  scope: string;
  parts: readonly PrimitivePartMetadata[];
};

export type DocsPartMetadata = PrimitivePartMetadata & {
  selector: `[data-scope="${string}"][data-part="${string}"]`;
};

export type DocsPrimitiveMetadata = Omit<PrimitiveMetadata, "parts"> & {
  parts: readonly DocsPartMetadata[];
};

const basePartAttributes = [
  { name: "data-scope" },
  { name: "data-part" },
] as const satisfies readonly PartStateAttributeMetadata[];

const overlayStateAttributes = [
  { name: "data-state", values: ["open", "closed"] },
  { name: "data-transition-status", values: ["idle", "starting", "ending"] },
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

const menuItemAttributes = [
  { name: "data-checked" },
  { name: "data-disabled" },
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

export const primitiveMetadata = {
  dialog: definePrimitive("dialog", [
    part("trigger", overlayStateAttributes),
    part("close", overlayStateAttributes),
    part("backdrop", overlayStateAttributes),
    part("positioner", overlayStateAttributes),
    part("content", overlayStateAttributes),
    part("title"),
    part("description"),
  ]),
  "form-control": definePrimitive("form-control", [
    part("root", formStateAttributes),
    part("control", formStateAttributes),
    part("label", formStateAttributes),
    part("description", formStateAttributes),
    part("error-message", formStateAttributes),
    part("hidden-input"),
  ]),
  listbox: definePrimitive("listbox", [
    part("listbox"),
    part("option", [
      { name: "data-disabled" },
      { name: "data-highlighted" },
      { name: "data-selected" },
      { name: "data-group" },
    ]),
    part("group", groupAttributes),
    part("group-label"),
  ]),
  "context-menu": menuPrimitive("context-menu"),
  "dropdown-menu": menuPrimitive("dropdown-menu"),
  menu: menuPrimitive("menu"),
  menubar: menuPrimitive("menubar"),
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
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
  ]),
  select: definePrimitive("select", [
    part("trigger", selectStateAttributes),
    part("value", [{ name: "data-placeholder" }]),
    part(
      "positioner",
      [...floatingAttributes, { name: "data-state", values: ["open", "closed"] }],
      floatingCssVars,
    ),
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
      { name: "data-highlighted" },
      { name: "data-selected" },
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
  tooltip: definePrimitive("tooltip", [
    part("trigger", overlayStateAttributes),
    part("positioner", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
  ]),
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
): PrimitiveMetadata {
  return { scope, parts };
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
    part("content", [...overlayStateAttributes, ...floatingAttributes], floatingCssVars),
    part("group"),
    part("group-label"),
    part("separator"),
    part("item", menuItemAttributes),
    part("item-indicator"),
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
