# Cal.com Workspace Pattern Notes

## Purpose

This note records the selective lessons worth mining from `inspo/coss/apps/examples/calcom`. Treat the example as a product-pattern reference for Keystone UI's data-dense app layer, not as source to copy wholesale.

Relevant workspace direction: [Data-dense workspace verticals](./data-dense-workspace-verticals.md), [UI CommandMenu vertical](./ui-command-menu-vertical.md), and [UI Store and Hotkeys vertical](./ui-store-hotkeys-vertical.md).

## Highest-Value Source Areas

### App Shell And Sidebar

Reference files:

- `inspo/coss/apps/examples/calcom/app/(dashboard)/layout.tsx`
- `inspo/coss/apps/examples/calcom/components/app/app-sidebar.tsx`
- `inspo/coss/apps/examples/calcom/components/ui/sidebar.tsx`
- `inspo/coss/apps/examples/calcom/components/settings/settings-sidebar.tsx`
- `inspo/coss/apps/examples/calcom/components/settings/settings-drawer.tsx`

What is useful:

- A product shell with persistent desktop sidebar, mobile header/footer, and a main inset that owns responsive padding and scrollable workspace space.
- Sidebar anatomy that is source-owned UI, not Core primitive behavior: provider, sidebar, inset, header, content, groups, menu items, menu actions, submenus, skeleton rows, and tooltip behavior for collapsed labels.
- A settings variant that reuses the sidebar model but swaps navigation density, back affordance, and mobile drawer behavior.
- Clear separation between app navigation data and shell composition.

Keystone extraction target:

- `Resizable Workspace Shell` should start as a UI block or multi-file component, not a Core primitive.
- Reuse existing `sidebar-store` for open/collapsed/mobile state where it helps, but keep route data, product labels, and settings sections in generated source.
- Use Core-backed overlays for drawer, tooltip, menu, and popover behavior instead of implementing focus, dismissal, or layering inside the sidebar source.

Do not copy:

- React `useRender` and `mergeProps` patterns.
- Next.js routing assumptions.
- Coss-specific color tokens such as `sidebar-*` until Keystone's token contract intentionally supports them.
- Tooltip singleton handle shape unless Keystone adopts an equivalent through UI source.

### Command Surface

Reference file:

- `inspo/coss/apps/examples/calcom/components/app/app-command.tsx`

What is useful:

- Grouped command inventory with shortcuts, keywords, dense rows, empty state, footer hints, and a clear global `Mod+K` entry point.
- Command mode switching: normal command search can transition into an "ask" mode when no result exists or the user presses `Tab`.
- Async request lifecycle is app-owned: abort previous request, clear state on close, restore focus when returning to search, and render loading/error/result states within the command surface.
- Keyboard handling distinguishes app-level opening from input editing contexts.

Keystone extraction target:

- Keep `command-menu` as the reusable UI component and use this example as a richer block/template reference.
- Future command-surface block can compose `CommandMenu`, `CommandStore`, `KeyboardShortcuts`, and `ShortcutDisplay` with generated command data.
- Async search, AI/help mode, route discovery, permissions, and result rendering remain app-owned source.

Do not copy:

- AI response mock details.
- React state/effect code.
- Command primitive internals. Keystone Core should not gain a command primitive unless the behavior cannot be composed from Combobox/Listbox plus app-layer state.

### Booking Filters And Saved Views

Reference files:

- `inspo/coss/apps/examples/calcom/components/app/bookings-filters.tsx`
- `inspo/coss/apps/examples/calcom/components/app/filter-add-menu.tsx`
- `inspo/coss/apps/examples/calcom/components/app/filter-chip-*.tsx`
- `inspo/coss/apps/examples/calcom/components/app/filter-saved-combobox.tsx`
- `inspo/coss/apps/examples/calcom/components/app/filter-chip-types.ts`

What is useful:

- A dense toolbar that combines search, add-filter menu, active filter chips, clear actions, and saved filter views.
- Filter fields are modeled as typed metadata: options, text, and date range. This is the right direction for generated source because apps can replace it with server-backed schema.
- Newly added filters auto-open their chip editor, which makes filter construction direct without adding instructional copy.
- Saved views use Combobox for selection and Menu for rename/duplicate/delete actions instead of inventing a new control.

Keystone extraction target:

- `Condition Builder And Event Feed Patterns` and future data-table blocks should use this as a filter-bar reference.
- Filter metadata and serialization should live in UI source or app code. Core owns only the accessible primitives used by the menus, comboboxes, date picker, and fields.
- Prefer TanStack Table column/filter state when connected to tables, and TanStack Form only when filter rows need validation/editing flows beyond simple chips.

Do not copy:

- Booking-specific fields or Cal.com domain names.
- Ad hoc string query serialization as a framework contract.
- Date-range behavior until Keystone's date picker and field story is mature enough for the target block.

## Suggested Implementation Sequence

1. **Workspace shell tracer**: ship a multi-file UI block with left rail, main workspace, optional inspector/sidebar area, mobile header/footer, and `sidebar-store` wiring. Parity notes should cite Cal.com shell/sidebar, shadcn sidebar ergonomics, and Keystone's Core overlay boundary.
2. **Saved-view filter bar**: add a UI block layered on the existing `data-table` and `combobox` items. Include typed filter metadata, active chips, add-filter menu, clear action, saved-view combobox, and router/table integration hooks where useful.
3. **Richer command surface block**: keep `command-menu` lean, then provide a block that demonstrates route-scoped command groups, shortcut display, no-result handoff, async loading/error states, and optional app-store integration.
4. **Settings shell variant**: after the base shell exists, add a settings-specific layout variant with back navigation, section sidebar, mobile drawer, and source-owned settings data.

## Boundary Rules

- UI may depend on Keystone Core primitives and TanStack app libraries. Core must not depend on UI, TanStack Store, TanStack Table, TanStack Form, or Hotkeys.
- Shell, filter, saved-view, and command discovery state are app-layer concerns.
- Focus management, dismissal, overlay layering, tooltip behavior, menu keyboard behavior, combobox list navigation, and date picker accessibility stay in Core-backed primitives.
- Keep generated source readable and replaceable. Product data, route labels, filters, and async request functions should be plain user-owned code.

## Open Questions

- Should the first workspace shell be a generic block only, or should Keystone also add a reusable `sidebar` UI component alongside `sidebar-store`?
- Should filter chips be table-specific, or should they be a standalone UI pattern that can also drive event feeds and rule builders?
- Should saved views be persisted through a generic app store example, router search params, or left to app code in the first tracer?
