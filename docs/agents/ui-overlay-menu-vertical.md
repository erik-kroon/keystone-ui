# UI Overlay And Menu Vertical

## Scope

Issues #212, #216, #218, and #219 cover the UI-layer Dialog, Popover, Tooltip, and
DropdownMenu generated source items.

These are styled copy-paste UI components. Core owns primitive behavior, ARIA, focus,
dismissal, positioning, presence, collection navigation, typeahead, and state data
attributes. UI owns app-readable wrappers, visual classes, neutral `data-slot` hooks,
local composition helpers, and registry metadata.

## Current UI Contract

Dialog:

- Wraps Core `Dialog.Root`, `Trigger`, `Portal`, `Backdrop`, `Positioner`, `Content`,
  `Title`, `Description`, and `Close`.
- `DialogContent` composes the portal, backdrop, positioner, popup surface, optional close
  button, mobile bottom-stick layout, and class escape hatches.
- `DialogPanel`, `DialogHeader`, and `DialogFooter` provide layout parts for readable
  generated source without adding primitive behavior.

Popover:

- Wraps Core `Popover.Root`, `Trigger`, `Portal`, `Positioner`, `Content`, and `Arrow`.
- `PopoverContent` composes the portal, positioner, popup surface, viewport, tooltip-style
  density option, and class escape hatches.
- Header, footer, title, and description are UI composition helpers only; Core Popover does
  not automatically wire those helpers into ARIA relationships.

Tooltip:

- Wraps Core `Tooltip.Provider`, `Root`, `Trigger`, `Portal`, `Positioner`, `Content`,
  and `Arrow`.
- `TooltipContent` composes the portal, positioner, popup surface, viewport, and class
  escape hatches while Core owns hover/focus timing, skip-delay groups, hoverable content,
  pointer grace area, Escape dismissal, and `aria-describedby`.

DropdownMenu:

- Wraps Core `DropdownMenu.Root`, `Trigger`, `Portal`, `Positioner`, `Content`, `Arrow`,
  `Group`, `GroupLabel`, `Separator`, `Item`, `Link`, `CheckboxItem`, `RadioGroup`,
  `RadioItem`, `ItemIndicator`, `ItemLabel`, `ItemDescription`, `SubRoot`,
  `SubTrigger`, and `SubContent`.
- Generated source adds dense menu styling, inset/destructive item variants, check/radio
  indicators, switch-style checkbox rows, shortcut text, viewport padding, and submenu
  affordances without reimplementing menu interaction.

## Registry Status

- Each item carries `meta.api`, `meta.accessibility`, `meta.anatomy`,
  `meta.cssVariables`, `meta.limitations`, and `meta.parity` notes.
- Registry metadata describes the visual reference generically and does not name the
  inspiration package.

## Verification

Focused coverage lives in `packages/mason-registry/src/registry-validation.test.ts`,
which validates item metadata and generated source contracts for the four UI items.
Core behavior coverage remains in the Core dialog, popover, tooltip, overlay, and menu
tests.
