# Workspace Product Pattern Notes

## Purpose

This note records the app-shell and data-dense workspace patterns Keystone should treat as first-party UI source patterns. The reviewed scheduling workspace example is a product-pattern reference only. Do not copy implementation source, framework-specific routing, brand/domain labels, or app-specific business objects.

Relevant workspace direction: [Data-dense workspace verticals](./data-dense-workspace-verticals.md), [UI CommandMenu vertical](./ui-command-menu-vertical.md), [UI Store and Hotkeys vertical](./ui-store-hotkeys-vertical.md), and [Keystone pattern backlog](./keystone-pattern-backlog.md).

## App Shell And Product Navigation

Useful pattern:

- Persistent desktop sidebar with compact navigation groups, product switcher area, secondary navigation, user menu, and a main inset that owns scroll and workspace padding.
- Mobile header and footer navigation that preserve fast movement between primary product areas without forcing the desktop rail onto small screens.
- Navigation data separated from shell composition so generated source can be replaced with route-aware app data.
- Settings area that reuses the shell mental model but switches to section navigation, back affordance, and mobile drawer behavior.

Keystone extraction target:

- `resizable-workspace-shell` remains a UI block or multi-file component, not a Core primitive.
- UI may provide sidebar source, sidebar state helpers, and shell composition. Product routes, labels, account menus, and settings sections stay in generated app source.
- Use Core-backed Dialog/Sheet/Drawer, Tooltip, Menu, Popover, and NavigationMenu behavior for focus, dismissal, overlay layering, and keyboard interaction.
- Use TanStack Router examples where routing is needed, but keep the generated source portable enough for SolidStart or Vite Solid apps.

Implementation cautions:

- Do not introduce app-shell state into Core.
- Do not bake product-specific route names, account concepts, or scheduling terminology into Keystone registry items.
- Do not make collapsed sidebar tooltips a private sidebar behavior when the same behavior belongs to Core Tooltip or UI Tooltip.

## Command Surface

Useful pattern:

- Grouped command inventory with keywords, shortcuts, dense rows, empty state, footer hints, and a global `Mod+K` entry point.
- Search mode can hand off to a secondary help or ask mode when there is no direct command result.
- Async request lifecycle is app-owned: abort stale requests, clear state on close, restore focus when returning to search, and render loading/error/result states within the command surface.
- Keyboard handling distinguishes app-level opening from input editing contexts.

Keystone extraction target:

- Keep `command-menu` as the reusable UI component and use richer command surfaces as blocks/templates.
- Future command-surface blocks can compose `CommandMenu`, `CommandStore`, `KeyboardShortcuts`, and `ShortcutDisplay` with generated command data.
- Async search, permissions, route discovery, help mode, and result rendering remain app-owned source.

Implementation cautions:

- Keystone Core should not gain a command primitive unless the behavior cannot be composed from Combobox/Listbox plus app-layer state.
- Do not copy React state/effect structure or framework-specific route discovery.
- Keep TanStack Hotkeys integration removable while the upstream API is preview-level.

## Booking-Style Filters And Saved Views

Useful pattern:

- Dense toolbar that combines search, add-filter menu, active filter chips, clear actions, and saved views.
- Filter fields modeled as typed metadata: option filters, text filters, and date-range filters.
- Newly added filters open their editor immediately, which makes filter construction direct without instructional copy.
- Saved views use Combobox for selection and Menu for rename, duplicate, and delete actions.

Keystone extraction target:

- `saved-view-filter-bar` should be a UI block layered on existing `data-table`, `combobox`, `menu`, `date-picker`, and form field items.
- Filter metadata and serialization belong in UI source or app code. Core owns only the accessible primitives used by menus, comboboxes, date pickers, and fields.
- Prefer TanStack Table column/filter state when connected to tables.
- Prefer TanStack Form when filters become editable rule rows with validation, not for simple chip toggles.

Implementation cautions:

- Do not treat scheduling-specific fields as Keystone concepts.
- Do not make URL query serialization a Keystone framework contract.
- Date range editing should wait for the date picker and field story to be mature enough for a first-party block.

## Settings Surfaces

Useful pattern:

- Desktop settings sidebar with stable section groups and a content pane for repeated forms.
- Mobile settings header and drawer that preserve section navigation without overcrowding the page.
- Settings toggles, image-backed radio/checkbox options, copyable fields, and destructive sections as repeated app-layer compositions.

Keystone extraction target:

- `settings-shell` should be a UI block variant after the base workspace shell exists.
- Repeated settings rows can use UI Field, TanStack Form field adapters, Switch, Checkbox, RadioGroup, CopyButton, Dialog, AlertDialog, and Sheet.
- Settings data remains user-owned source so applications can attach permissions, billing state, team state, and persistence.

## Suggested Implementation Sequence

1. **Workspace shell tracer**: ship a multi-file UI block with left rail, main workspace, optional inspector/sidebar area, mobile header/footer, and `sidebar-store` wiring.
2. **Saved-view filter bar**: add a UI block layered on `data-table`, `combobox`, `menu`, and field items. Include typed filter metadata, active chips, add-filter menu, clear action, and saved-view combobox.
3. **Richer command surface block**: keep `command-menu` lean, then provide a block that demonstrates route-scoped command groups, shortcut display, no-result handoff, async loading/error states, and optional app-store integration.
4. **Settings shell variant**: add a settings-specific layout with back navigation, section sidebar, mobile drawer, and source-owned settings data.

## Boundary Rules

- UI may depend on Keystone Core primitives and TanStack app libraries. Core must not depend on UI, TanStack Store, TanStack Table, TanStack Form, or Hotkeys.
- Shell, filter, saved-view, command discovery, and settings state are app-layer concerns.
- Focus management, dismissal, overlay layering, tooltip behavior, menu keyboard behavior, combobox navigation, and date picker accessibility stay in Core-backed primitives.
- Generated source should remain readable and replaceable. Product data, route labels, filters, and async request functions should be plain user-owned code.

## Open Questions

- Should Keystone add a reusable `sidebar` UI component alongside `sidebar-store`, or keep the first shell as a block only?
- Should filter chips be table-specific, or a standalone UI pattern that can also drive event feeds and rule builders?
- Should saved views be persisted through a generic app store example, router search params, or left to app code in the first tracer?
