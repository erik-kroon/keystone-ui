# Command Primitive

Status: accepted as an experimental Core primitive.

## Audit

- No dedicated Core Command primitive existed before this RFC.
- `packages/ui/src/default/ui/command-menu.tsx` already composed command-palette behavior from Core Combobox plus UI-owned TanStack Store and Hotkeys.
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
- `name`, `form`, `defaultValue`, and controlled `value` serialize through the Core form-control hidden input kernel and reset with the owning form.
- `open`, `inputValue`, and `value` support controlled and uncontrolled usage with change details.

DOM contract:

- All public parts use `data-scope="command"` and a stable `data-part`.
- State attributes match the Combobox contract: `data-state`, `data-disabled`, `data-invalid`, `data-placeholder`, `data-readonly`, `data-required`, `data-highlighted`, `data-selected`, and `data-group` where applicable.
- Floating parts expose the standard Keystone floating CSS variables: `--keystone-anchor-width`, `--keystone-anchor-height`, `--keystone-available-width`, `--keystone-available-height`, `--keystone-arrow-x`, `--keystone-arrow-y`, and `--keystone-transform-origin`.

## Boundaries

Core Command owns intrinsic accessible command-list selection behavior. UI CommandMenu owns palette filtering, ranking, shortcut registration, command stores, visual styling, app navigation, and action execution.

This keeps Core independent from TanStack Store and Hotkeys while letting UI build command surfaces on a dedicated Core primitive contract.
