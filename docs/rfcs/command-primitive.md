# Command Primitive

Status: accepted as an experimental Core primitive.

## Audit

- No dedicated Core Command primitive existed before this RFC.
- `packages/ui/src/components/command-menu.tsx` already composed command-palette behavior from Core Combobox plus UI-owned TanStack Store and Hotkeys.
- The reusable Core behavior is the combobox/listbox popup kernel: controlled and uncontrolled input, value, and open state; keyboard highlight and selection; disabled and grouped items; portal/floating geometry; form hidden input serialization; reset behavior; and stable part attributes.
- UI-owned behavior remains outside Core: command filtering, ranking, shortcuts, command stores, visual sections, previews, and app-level routing or action dispatch.

## End-State Contract

`@keystone-ui/core/command` exposes `Command` compound parts and `createCommand`. Command is intentionally a command-scoped specialization of the Combobox kernel, not a separate app command engine.

Anatomy:

- `Command.Root`
- `Command.Input`
- `Command.Trigger`
- `Command.Clear`
- `Command.Portal`
- `Command.Positioner`
- `Command.Arrow`
- `Command.Content`
- `Command.Listbox`
- `Command.Group`
- `Command.GroupLabel`
- `Command.Item`
- `Command.ItemText`
- `Command.ItemIndicator`

Accessibility and behavior:

- `Input` uses `role="combobox"`, `aria-autocomplete="list"`, `aria-controls`, `aria-expanded`, and `aria-activedescendant`.
- `Listbox` uses `role="listbox"` with grouped options and single selection.
- Arrow keys open and move highlight, `Enter` selects the highlighted item, and `Escape` closes or clears.
- Pointer selection, disabled items, grouped items, selected/highlighted states, and read-only/disabled guards follow Combobox behavior.
- Hidden items stay registered for collection lookup but are omitted from active-descendant navigation and typeahead through the shared collection kernel.
- `name`, `form`, `defaultValue`, and controlled `value` serialize through the Core form-control hidden input kernel and reset with the owning form.
- `open`, `inputValue`, and `value` support controlled and uncontrolled usage with change details.

DOM contract:

- All public parts use `data-scope="command"` and a stable `data-part`.
- State attributes match the Combobox contract: `data-state`, `data-disabled`, `data-hidden`, `data-invalid`, `data-placeholder`, `data-readonly`, `data-required`, `data-highlighted`, `data-selected`, `data-group`, and `data-value` where applicable.
- Floating parts expose the standard Keystone floating CSS variables: `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`, `--keystone-available-height`, `--keystone-arrow-x`, `--keystone-arrow-y`, and `--keystone-transform-origin`.

## Boundaries

Core Command owns intrinsic accessible command-list selection behavior. UI CommandMenu owns palette filtering, ranking, shortcut registration, command stores, visual styling, app navigation, and action execution.

This keeps Core independent from TanStack Store and Hotkeys while letting UI build command surfaces on a dedicated Core primitive contract.

## UI CommandMenu End-State Status

Issue #226 audited the UI Command surface after Core Command became credible. The current first-party UI outcome is `command-menu`, backed by `packages/ui/src/components/command-menu.tsx`, `packages/ui/src/components/command-store.ts`, registry metadata in `registry/default/items/command-menu.json`, and the workspace block in `packages/ui/src/blocks/keyboard-command-surface.tsx`.

End-state contract:

- `CommandMenu` is the high-level copy-paste palette source for grouped command data, query filtering, shortcut display, app-level hotkey registration, shared command-store coordination, and selection callbacks.
- Compound exports (`CommandMenuRoot`, `CommandMenuTrigger`, `CommandMenuPortal`, `CommandMenuPositioner`, `CommandMenuBackdrop`, `CommandMenuContent`, `CommandMenuInput`, `CommandMenuPanel`, `CommandMenuList`, `CommandMenuGroup`, `CommandMenuGroupLabel`, `CommandMenuItem`, `CommandMenuItemText`, `CommandMenuShortcut`, `CommandMenuEmpty`, `CommandMenuSeparator`, and `CommandMenuFooter`) remain available for source-owned composition.
- Accessibility, keyboard navigation, highlighted item state, disabled item skipping, controlled/uncontrolled primitive state, portal positioning, dismissal, SSR-safe primitive construction, and form serialization stay delegated to Core Command.
- UI data hooks use `data-scope="ui-command-menu"` plus stable `data-part`/`data-slot` values for trigger, backdrop, positioner, content, input row, icon, input, panel, list, group, label, item, item text, item label, item description, shortcut, empty state, separator, and footer.
- The registry item carries parity metadata for Base UI-style primitive behavior, Kobalte-style Solid composition, shadcn-style source ownership, TanStack Store command state, and preview TanStack Hotkeys integration.

Intentional exceptions and follow-ups:

- UI CommandMenu ships ranked local matching for labels, values, descriptions, groups, and keywords, plus `filter` and `filteredItems` escape hatches for app-owned search. Nested command pages, async command discovery, route-aware command registration, persisted history, virtualization, and shortcut conflict policy remain app-owned or later specialized UI items unless repeated use proves a durable source pattern.
- TanStack Hotkeys remains a preview integration. Generated source keeps the integration easy to remove or adapt if upstream APIs change.
