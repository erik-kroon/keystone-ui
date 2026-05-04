import {
  getDocsMetadata,
  primitiveMetadata,
  type PrimitiveMaturity,
  type PrimitiveScope,
} from "@keystone-ui/core";

export type PrimitiveContract = {
  scope: PrimitiveScope;
  title: string;
  importPath: string;
  roleNotes: readonly string[];
  keyboardNotes: readonly string[];
  ariaNotes: readonly string[];
  ssrNotes: readonly string[];
  example: string;
};

export type PrimitiveMaturityContract = {
  label: string;
  summary: string;
};

export const primitiveMaturityContracts = {
  internal: {
    label: "Internal",
    summary: "Private implementation detail. Tested through consuming primitives.",
  },
  experimental: {
    label: "Experimental",
    summary: "Preview surface for feedback. API and behavior may still change.",
  },
  beta: {
    label: "Beta",
    summary: "Mostly stable preview surface with core behavior tests and known gaps.",
  },
  stable: {
    label: "Stable",
    summary: "Public contract candidate. Changes need migration notes.",
  },
  deprecated: {
    label: "Deprecated",
    summary: "Public surface with a documented replacement path.",
  },
} as const satisfies Record<PrimitiveMaturity, PrimitiveMaturityContract>;

export function getPrimitiveMaturityContract(
  maturity: PrimitiveMaturity,
): PrimitiveMaturityContract {
  return primitiveMaturityContracts[maturity];
}

const overlayNotes = {
  keyboardNotes: [
    "Escape dismisses the topmost dismissable layer when dismissal is enabled.",
    "Focus entry, trap, and restore are owned by Core overlay internals where the primitive is modal.",
  ],
  ssrNotes: [
    "Portal and layer behavior runs behind Solid lifecycle guards so server rendering does not touch document APIs.",
    "Force-mounted content should keep stable data attributes for animation and hydration checks.",
  ],
};

const collectionNotes = {
  keyboardNotes: [
    "Arrow keys move through enabled items.",
    "Home and End target collection boundaries where the primitive exposes roving or active-descendant focus.",
    "Typeahead is shared by listbox, select, combobox, and menu-derived primitives where applicable.",
  ],
  ssrNotes: [
    "Collection registration is DOM-backed after mount and should not require browser globals during SSR.",
  ],
};

export const primitiveContracts = [
  {
    scope: "accessible-icon",
    title: "AccessibleIcon",
    importPath: "@keystone-ui/core/accessible-icon",
    roleNotes: ["Root renders a named image wrapper for icon-only visual content."],
    keyboardNotes: ["AccessibleIcon owns no keyboard behavior and does not add focusability."],
    ariaNotes: [
      "The required label becomes the root accessible name while the label part remains visually hidden.",
    ],
    ssrNotes: ["Output is deterministic and does not read browser globals."],
    example: `<AccessibleIcon.Root label="Close"><CloseIcon /></AccessibleIcon.Root>`,
  },
  {
    scope: "accordion",
    title: "Accordion",
    importPath: "@keystone-ui/core/accordion",
    roleNotes: ["Headers wrap button triggers; content panels expose disclosure state."],
    keyboardNotes: [
      "Arrow keys move between triggers for the configured orientation.",
      "Home and End move to the first and last enabled trigger.",
    ],
    ariaNotes: ["Triggers expose expanded state and control relationships to content panels."],
    ssrNotes: ["Disclosure state is serializable through stable data attributes."],
    example: `<Accordion.Root defaultValue="details"><Accordion.Item value="details"><Accordion.Trigger>Details</Accordion.Trigger><Accordion.Content>Content</Accordion.Content></Accordion.Item></Accordion.Root>`,
  },
  {
    scope: "autocomplete",
    title: "Autocomplete",
    importPath: "@keystone-ui/core/autocomplete",
    roleNotes: ["Input, listbox, option, group, and popup parts follow the combobox contract."],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: ["Input and popup relationships are owned by Keystone combobox behavior."],
    ssrNotes: collectionNotes.ssrNotes,
    example: `<Autocomplete.Root items={items}><Autocomplete.Input /><Autocomplete.Content><Autocomplete.Listbox /></Autocomplete.Content></Autocomplete.Root>`,
  },
  {
    scope: "calendar",
    title: "Calendar",
    importPath: "@keystone-ui/core/date-picker",
    roleNotes: ["Grid, row, column header, cell, and cell trigger parts model a date grid."],
    keyboardNotes: [
      "Arrow keys move by day or week; month navigation triggers move visible range.",
    ],
    ariaNotes: [
      "Selected, today, outside-month, disabled, and value state are exposed on date cells.",
    ],
    ssrNotes: [
      "Calendar grid generation is deterministic from value, month, min, max, and locale options.",
    ],
    example: `<Calendar.Root><Calendar.Header /><Calendar.Grid /></Calendar.Root>`,
  },
  {
    scope: "checkbox",
    title: "Checkbox",
    importPath: "@keystone-ui/core/checkbox",
    roleNotes: [
      "Root/control parts expose checkbox state and a hidden native input participates in forms.",
    ],
    keyboardNotes: ["Space toggles checked state unless the interaction is disabled or prevented."],
    ariaNotes: [
      "Checked, indeterminate, required, invalid, readonly, and disabled state are reflected in data and ARIA contracts.",
    ],
    ssrNotes: ["Hidden input output is stable for SSR and native form submission."],
    example: `<Checkbox.Root name="terms"><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Checkbox.HiddenInput /></Checkbox.Root>`,
  },
  {
    scope: "collapsible",
    title: "Collapsible",
    importPath: "@keystone-ui/core/collapsible",
    roleNotes: ["Trigger and content parts expose disclosure state."],
    keyboardNotes: ["Button activation toggles open state unless disabled or prevented."],
    ariaNotes: ["Trigger expanded state and content visibility stay coordinated."],
    ssrNotes: [
      "Hidden-until-found and open state are represented through stable content attributes.",
    ],
    example: `<Collapsible.Root><Collapsible.Trigger>Toggle</Collapsible.Trigger><Collapsible.Content>Panel</Collapsible.Content></Collapsible.Root>`,
  },
  {
    scope: "combobox",
    title: "Combobox",
    importPath: "@keystone-ui/core/combobox",
    roleNotes: [
      "Input owns text entry while listbox and item parts own option navigation and selection.",
    ],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: [
      "Highlighted, selected, required, invalid, readonly, placeholder, and disabled state are exposed for wrappers.",
    ],
    ssrNotes: collectionNotes.ssrNotes,
    example: `<Combobox.Root items={items}><Combobox.Input /><Combobox.Content><Combobox.Listbox /></Combobox.Content></Combobox.Root>`,
  },
  {
    scope: "context-menu",
    title: "ContextMenu",
    importPath: "@keystone-ui/core/context-menu",
    roleNotes: ["Menu, group, separator, item, and indicator parts use the shared menu kernel."],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: ["Disabled, highlighted, checked, and value metadata are exposed on menu items."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<ContextMenu.Root><ContextMenu.Trigger>Open</ContextMenu.Trigger><ContextMenu.Content><ContextMenu.Item value="copy">Copy</ContextMenu.Item></ContextMenu.Content></ContextMenu.Root>`,
  },
  {
    scope: "date-picker",
    title: "DatePicker",
    importPath: "@keystone-ui/core/date-picker",
    roleNotes: [
      "Root, trigger, content, and nested calendar parts compose date selection with popup behavior.",
    ],
    keyboardNotes: [
      "Trigger opens the calendar popup; calendar keys handle date movement and selection.",
    ],
    ariaNotes: [
      "Open, placeholder, selected value, and disabled state are exposed on public parts.",
    ],
    ssrNotes: [
      "Popup behavior is lifecycle guarded and calendar output is deterministic from date options.",
    ],
    example: `<DatePicker.Root><DatePicker.Trigger>Choose date</DatePicker.Trigger><DatePicker.Content><DatePicker.Calendar /></DatePicker.Content></DatePicker.Root>`,
  },
  {
    scope: "description",
    title: "Description",
    importPath: "@keystone-ui/core/description",
    roleNotes: ["Root renders descriptive text without adding widget semantics."],
    keyboardNotes: ["Description owns no keyboard behavior and should not add focusability."],
    ariaNotes: [
      "Use the root id from consuming controls or Fieldset.Description for automatic aria-describedby wiring.",
    ],
    ssrNotes: ["Output is deterministic and does not read browser globals."],
    example: `<Description.Root id="email-help">Use your work email.</Description.Root>`,
  },
  {
    scope: "direction",
    title: "Direction",
    importPath: "@keystone-ui/core/direction",
    roleNotes: [
      "Root provides document direction context to descendant Core primitives without adding widget roles.",
    ],
    keyboardNotes: [
      "Direction-aware primitives use the nearest provider for horizontal arrow-key order unless their own dir prop overrides it.",
    ],
    ariaNotes: [
      "The rendered root sets the native dir attribute and mirrors it through data-dir for styling and tests.",
    ],
    ssrNotes: [
      "Direction defaults to ltr without reading browser globals, and explicit/default values produce deterministic server output.",
    ],
    example: `<Direction.Root dir="rtl"><Tabs.Root><Tabs.List /></Tabs.Root></Direction.Root>`,
  },
  {
    scope: "dialog",
    title: "Dialog",
    importPath: "@keystone-ui/core/dialog",
    roleNotes: [
      "Content owns dialog semantics while title and description provide accessible naming hooks.",
    ],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: [
      "Title and description IDs are coordinated with content; open state is exposed on overlay parts.",
    ],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Dialog.Root><Dialog.Trigger>Open</Dialog.Trigger><Dialog.Content><Dialog.Title>Title</Dialog.Title></Dialog.Content></Dialog.Root>`,
  },
  {
    scope: "dropdown-menu",
    title: "DropdownMenu",
    importPath: "@keystone-ui/core/dropdown-menu",
    roleNotes: [
      "Trigger, content, group, separator, item, and indicator parts use menu semantics.",
    ],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: ["Open, highlighted, disabled, checked, and value state are exposed to wrappers."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<DropdownMenu.Root><DropdownMenu.Trigger>Actions</DropdownMenu.Trigger><DropdownMenu.Content><DropdownMenu.Item value="edit">Edit</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Root>`,
  },
  {
    scope: "error-message",
    title: "ErrorMessage",
    importPath: "@keystone-ui/core/error-message",
    roleNotes: ["Root renders validation feedback with alert semantics by default."],
    keyboardNotes: ["ErrorMessage owns no keyboard behavior and should not add focusability."],
    ariaNotes: [
      "Use the root id from consuming controls or Fieldset.ErrorMessage for automatic invalid-state description wiring.",
    ],
    ssrNotes: ["Output is deterministic and does not read browser globals."],
    example: `<ErrorMessage.Root id="email-error">Use a work email.</ErrorMessage.Root>`,
  },
  {
    scope: "field",
    title: "Field",
    importPath: "@keystone-ui/core/form",
    roleNotes: [
      "Root, label, control, description, error, and hidden-input parts compose native field relationships.",
    ],
    keyboardNotes: ["Keyboard behavior remains native to the rendered control."],
    ariaNotes: [
      "Controls receive label, description, error, required, invalid, readonly, and disabled ARIA contracts from the field context.",
    ],
    ssrNotes: [
      "Generated IDs and form-owned hidden inputs are deterministic and avoid direct browser access during render.",
    ],
    example: `<Field.Root name="email" required><Field.Label>Email</Field.Label><Field.Control type="email" /><Field.Description>Use your work email.</Field.Description></Field.Root>`,
  },
  {
    scope: "fieldset",
    title: "Fieldset",
    importPath: "@keystone-ui/core/fieldset",
    roleNotes: [
      "Root renders a native fieldset and Legend supplies the grouped controls' accessible name.",
    ],
    keyboardNotes: ["Keyboard behavior remains native to descendant controls."],
    ariaNotes: [
      "Description and error-message ids are registered into aria-describedby, with errors included when invalid.",
    ],
    ssrNotes: [
      "Generated legend, description, and error ids are deterministic and avoid browser access during render.",
    ],
    example: `<Fieldset.Root required><Fieldset.Legend>Notifications</Fieldset.Legend><Fieldset.Description>Choose channels.</Fieldset.Description></Fieldset.Root>`,
  },
  {
    scope: "form-control",
    title: "FormControl",
    importPath: "@keystone-ui/core/form",
    roleNotes: [
      "Root, label, control, description, error, and hidden input parts describe form-control relationships.",
    ],
    keyboardNotes: ["Keyboard behavior remains native to the rendered control."],
    ariaNotes: [
      "Required, invalid, readonly, disabled, dirty, touched, filled, focused, and validating state are exposed.",
    ],
    ssrNotes: [
      "Generated IDs and hidden input props should remain stable across server and client renders.",
    ],
    example: `<FormControl.Root name="plan"><FormControl.Label>Plan</FormControl.Label><FormControl.Control /><FormControl.HiddenInput /></FormControl.Root>`,
  },
  {
    scope: "hover-card",
    title: "HoverCard",
    importPath: "@keystone-ui/core/hover-card",
    roleNotes: ["Trigger, positioner, and content parts expose non-modal preview behavior."],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: ["Open state, side, align, and geometry variables are exposed for preview content."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<HoverCard.Root><HoverCard.Trigger>Preview</HoverCard.Trigger><HoverCard.Content>Details</HoverCard.Content></HoverCard.Root>`,
  },
  {
    scope: "listbox",
    title: "Listbox",
    importPath: "@keystone-ui/core/select",
    roleNotes: ["Listbox, option, group, and group-label parts expose collection state."],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: ["Options expose selected, highlighted, disabled, and group metadata."],
    ssrNotes: collectionNotes.ssrNotes,
    example: `<Select.Listbox><Select.Item value="team">Team</Select.Item></Select.Listbox>`,
  },
  {
    scope: "live-announcer",
    title: "LiveAnnouncer",
    importPath: "@keystone-ui/core/live-announcer",
    roleNotes: ["Live regions announce queued messages without adding interactive widget roles."],
    keyboardNotes: ["LiveAnnouncer owns no keyboard behavior and does not add focusability."],
    ariaNotes: [
      "Polite and assertive regions expose status and alert semantics for screen reader announcements.",
    ],
    ssrNotes: [
      "Announcements are client-owned; live-region containers render deterministic markup.",
    ],
    example: `const announcer = createLiveAnnouncer(); announcer.announce("Saved");`,
  },
  {
    scope: "label",
    title: "Label",
    importPath: "@keystone-ui/core/label",
    roleNotes: ["Root renders a native label for native or custom control association."],
    keyboardNotes: ["Label activation follows native browser behavior for the associated control."],
    ariaNotes: [
      "Use the native for/id relationship or compose with Field.Label when context is needed.",
    ],
    ssrNotes: ["Output is deterministic and does not read browser globals."],
    example: `<Label.Root for="email">Email</Label.Root>`,
  },
  {
    scope: "locale",
    title: "Locale",
    importPath: "@keystone-ui/core/locale",
    roleNotes: [
      "Provider supplies locale and text direction context to descendants without rendering wrapper DOM or adding widget roles.",
    ],
    keyboardNotes: [
      "Locale does not handle keys directly; direction-aware primitives read the provider for horizontal navigation.",
    ],
    ariaNotes: [
      "Applications remain responsible for native lang and dir attributes on their document or app shell.",
    ],
    ssrNotes: [
      "Locale and direction defaults are deterministic and do not require browser globals during render.",
    ],
    example: `<Locale.Provider locale="sv-SE" direction="ltr"><DatePicker.Root /></Locale.Provider>`,
  },
  {
    scope: "menu",
    title: "Menu",
    importPath: "@keystone-ui/core/menu",
    roleNotes: [
      "Menu item, group, separator, checkbox/radio item, and indicator behavior share one kernel.",
    ],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: ["Checked, highlighted, disabled, and value states are reflected on item parts."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Menu.Root><Menu.Trigger>Open</Menu.Trigger><Menu.Content><Menu.Item value="copy">Copy</Menu.Item></Menu.Content></Menu.Root>`,
  },
  {
    scope: "menubar",
    title: "Menubar",
    importPath: "@keystone-ui/core/menubar",
    roleNotes: ["Menubar composes menu parts with horizontal top-level navigation behavior."],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: [
      "Open, highlighted, disabled, checked, and value metadata follow the shared menu contract.",
    ],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Menubar.Root><Menubar.Trigger>File</Menubar.Trigger><Menubar.Content><Menubar.Item value="new">New</Menubar.Item></Menubar.Content></Menubar.Root>`,
  },
  {
    scope: "navigation-menu",
    title: "NavigationMenu",
    importPath: "@keystone-ui/core/navigation-menu",
    roleNotes: [
      "Navigation menu uses menu-derived trigger, content, group, separator, and item parts.",
    ],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: [
      "Open, highlighted, disabled, checked, and value state are exposed through navigation-menu scope.",
    ],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<NavigationMenu.Root><NavigationMenu.Trigger>Docs</NavigationMenu.Trigger><NavigationMenu.Content><NavigationMenu.Item value="guide">Guide</NavigationMenu.Item></NavigationMenu.Content></NavigationMenu.Root>`,
  },
  {
    scope: "overlay",
    title: "Overlay",
    importPath: "@keystone-ui/core/overlay",
    roleNotes: ["Layer parts expose modal and top-layer metadata for overlay coordination."],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: [
      "Layer id, index, modal, and top-layer data expose stack state for tests and wrappers.",
    ],
    ssrNotes: overlayNotes.ssrNotes,
    example: `createOverlayLayerStack();`,
  },
  {
    scope: "popover",
    title: "Popover",
    importPath: "@keystone-ui/core/popover",
    roleNotes: [
      "Trigger, positioner, and content parts expose non-modal floating disclosure behavior.",
    ],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: ["Open state, side, align, and geometry variables are exposed on floating parts."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Popover.Root><Popover.Trigger>Open</Popover.Trigger><Popover.Content>Panel</Popover.Content></Popover.Root>`,
  },
  {
    scope: "popper",
    title: "Popper",
    importPath: "@keystone-ui/core/popper",
    roleNotes: [
      "Anchor, positioner, and arrow parts provide headless geometry without disclosure, dismissal, or focus behavior.",
    ],
    keyboardNotes: [
      "Popper does not add keyboard behavior; composed primitives own trigger and content interactions.",
    ],
    ariaNotes: [
      "Positioning metadata is exposed through side, align, anchor size, available size, arrow offset, and transform-origin contracts.",
    ],
    ssrNotes: [
      "Browser measurement is guarded behind Solid effects and no document or window APIs are required during server render.",
    ],
    example: `<Popper.Root placement="bottom-start"><Popper.Anchor>Anchor</Popper.Anchor><Popper.Positioner><Popper.Arrow />Content</Popper.Positioner></Popper.Root>`,
  },
  {
    scope: "portal",
    title: "Portal",
    importPath: "@keystone-ui/core/portal",
    roleNotes: [
      "Root moves rendered children to the configured mount point without changing their semantic roles.",
    ],
    keyboardNotes: [
      "Portal does not own keyboard behavior; composed overlay content remains responsible for focus and dismissal.",
    ],
    ariaNotes: [
      "Portal preserves child ARIA relationships and should be paired with stable IDs on content primitives.",
    ],
    ssrNotes: [
      "Portal output is lifecycle guarded so server rendering and hydration can render deterministic fallback markup.",
    ],
    example: `<Portal><Dialog.Content /></Portal>`,
  },
  {
    scope: "radio-group",
    title: "RadioGroup",
    importPath: "@keystone-ui/core/radio-group",
    roleNotes: ["Root, item, indicator, and hidden input parts expose one selected value."],
    keyboardNotes: [
      "Arrow keys move and select enabled radio items; horizontal movement follows LTR/RTL direction; Home and End target collection boundaries.",
    ],
    ariaNotes: [
      "Required, invalid, readonly, disabled, orientation, checked, and state metadata are exposed.",
    ],
    ssrNotes: ["Hidden input output is stable for native form submission."],
    example: `<RadioGroup.Root name="plan"><RadioGroup.Item value="team"><RadioGroup.ItemIndicator /></RadioGroup.Item></RadioGroup.Root>`,
  },
  {
    scope: "select",
    title: "Select",
    importPath: "@keystone-ui/core/select",
    roleNotes: [
      "Trigger, value, popup, listbox, group, item, item text, and indicator parts expose single selection.",
    ],
    keyboardNotes: collectionNotes.keyboardNotes,
    ariaNotes: [
      "Placeholder, required, invalid, readonly, selected, highlighted, and disabled state are exposed.",
    ],
    ssrNotes: collectionNotes.ssrNotes,
    example: `<Select.Root items={items}><Select.Trigger><Select.Value /></Select.Trigger><Select.Content><Select.Listbox /></Select.Content></Select.Root>`,
  },
  {
    scope: "sheet",
    title: "Sheet",
    importPath: "@keystone-ui/core/sheet",
    roleNotes: ["Sheet composes dialog-grade content semantics with side-aware overlay parts."],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: ["Title, description, open state, and side metadata are exposed for wrappers."],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Sheet.Root side="right"><Sheet.Trigger>Open</Sheet.Trigger><Sheet.Content><Sheet.Title>Panel</Sheet.Title></Sheet.Content></Sheet.Root>`,
  },
  {
    scope: "slider",
    title: "Slider",
    importPath: "@keystone-ui/core/slider",
    roleNotes: ["Root, track, range, and thumb parts expose range input behavior."],
    keyboardNotes: [
      "Arrow keys step values with RTL-aware horizontal direction; Page, Home, and End keys adjust larger increments and bounds.",
    ],
    ariaNotes: [
      "Thumb ARIA value metadata is paired with direction, orientation, disabled, min-distance, and range CSS variables.",
    ],
    ssrNotes: [
      "Value-derived CSS variables are deterministic from current value, min, max, and orientation.",
    ],
    example: `<Slider.Root defaultValue={[40]}><Slider.Track><Slider.Range /><Slider.Thumb index={0} /></Slider.Track></Slider.Root>`,
  },
  {
    scope: "switch",
    title: "Switch",
    importPath: "@keystone-ui/core/switch",
    roleNotes: ["Root, control, thumb, and hidden input parts expose switch state."],
    keyboardNotes: ["Space toggles checked state unless disabled, readonly, or prevented."],
    ariaNotes: ["Checked, required, invalid, readonly, disabled, and state metadata are exposed."],
    ssrNotes: ["Hidden input output is stable for native form submission."],
    example: `<Switch.Root name="notifications"><Switch.Control><Switch.Thumb /></Switch.Control><Switch.HiddenInput /></Switch.Root>`,
  },
  {
    scope: "tabs",
    title: "Tabs",
    importPath: "@keystone-ui/core/tabs",
    roleNotes: [
      "Root, list, trigger, indicator, and content parts expose tablist and tabpanel relationships.",
    ],
    keyboardNotes: ["Arrow keys move between triggers; activation may be automatic or manual."],
    ariaNotes: ["Selected, highlighted, disabled, and orientation state are exposed on tab parts."],
    ssrNotes: ["Selected content state is deterministic from controlled or default value."],
    example: `<Tabs.Root defaultValue="overview"><Tabs.List><Tabs.Trigger value="overview">Overview</Tabs.Trigger></Tabs.List><Tabs.Content value="overview">Panel</Tabs.Content></Tabs.Root>`,
  },
  {
    scope: "toast",
    title: "Toast",
    importPath: "@keystone-ui/core/toast",
    roleNotes: [
      "Viewport, root, title, description, action, and close parts expose live notification behavior.",
    ],
    keyboardNotes: [
      "Close and action controls use native button behavior; timers pause on hover/focus where configured.",
    ],
    ariaNotes: [
      "Priority maps to live-region behavior while type and status are exposed as data attributes.",
    ],
    ssrNotes: ["Toast manager state is client-owned; rendered parts keep stable data attributes."],
    example: `toaster.success("Saved");`,
  },
  {
    scope: "toolbar",
    title: "Toolbar",
    importPath: "@keystone-ui/core/toolbar",
    roleNotes: [
      "Root, button, link, and separator parts expose toolbar orientation and item state.",
    ],
    keyboardNotes: [
      "Arrow keys move through enabled toolbar items for the configured orientation.",
    ],
    ariaNotes: ["Orientation, pressed, disabled, and separator metadata are exposed."],
    ssrNotes: [
      "Roving focus setup is lifecycle-bound and data attributes are stable for SSR output.",
    ],
    example: `<Toolbar.Root><Toolbar.Button>Bold</Toolbar.Button><Toolbar.Separator /><Toolbar.Link href="/docs">Docs</Toolbar.Link></Toolbar.Root>`,
  },
  {
    scope: "tooltip",
    title: "Tooltip",
    importPath: "@keystone-ui/core/tooltip",
    roleNotes: ["Trigger, positioner, and content parts expose descriptive overlay behavior."],
    keyboardNotes: overlayNotes.keyboardNotes,
    ariaNotes: [
      "Trigger and content IDs support description relationships; floating parts expose geometry data.",
    ],
    ssrNotes: overlayNotes.ssrNotes,
    example: `<Tooltip.Root><Tooltip.Trigger>Help</Tooltip.Trigger><Tooltip.Content>More detail</Tooltip.Content></Tooltip.Root>`,
  },
  {
    scope: "visually-hidden",
    title: "VisuallyHidden",
    importPath: "@keystone-ui/core/visually-hidden",
    roleNotes: [
      "Root renders text or elements that remain in the accessibility tree while being visually clipped.",
    ],
    keyboardNotes: ["VisuallyHidden owns no keyboard behavior and does not add focusability."],
    ariaNotes: [
      "Content remains available to assistive technology; callers should avoid aria-hidden on the root.",
    ],
    ssrNotes: ["Output is deterministic and does not read browser globals."],
    example: `<VisuallyHidden.Root>Unread notifications</VisuallyHidden.Root>`,
  },
] as const satisfies readonly PrimitiveContract[];

export function getPrimitiveContract(scope: PrimitiveScope): PrimitiveContract {
  const contract = primitiveContracts.find((candidate) => candidate.scope === scope);

  if (!contract) {
    throw new Error(`Missing primitive docs contract for ${scope}`);
  }

  return contract;
}

export function getPrimitiveDocs(scope: PrimitiveScope) {
  const metadata = getDocsMetadata(scope);

  if (!metadata) {
    throw new Error(`Missing primitive metadata for ${scope}`);
  }

  return {
    contract: getPrimitiveContract(scope),
    metadata,
    maturity: getPrimitiveMaturityContract(metadata.maturity),
  };
}

export const primitiveScopes = Object.keys(primitiveMetadata).sort() as PrimitiveScope[];

export const primitiveMaturityCounts = primitiveScopes.reduce(
  (counts, scope) => {
    const maturity = primitiveMetadata[scope].maturity;
    counts[maturity] += 1;
    return counts;
  },
  {
    internal: 0,
    experimental: 0,
    beta: 0,
    stable: 0,
    deprecated: 0,
  } satisfies Record<PrimitiveMaturity, number>,
);
