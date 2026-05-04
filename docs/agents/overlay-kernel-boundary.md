# Overlay Kernel Boundary Note

## Status

Preview boundary note for Core overlay internals.

## Boundary

The overlay kernel is private Keystone implementation. It exists to keep Dialog, Popover, Tooltip, HoverCard, Sheet, Menu, Combobox, and Select behavior consistent without making low-level layering APIs public too early.

Current private responsibilities:

- Focus scope and focus restore.
- Dismissable layer behavior.
- Escape-key stack handling.
- Outside pointer and focus dismissal.
- Outside hiding and inert-style behavior.
- Prevent-scroll behavior.
- Layer stack ordering and top-layer metadata.
- Presence and force-mounted transition state.
- Portal lifecycle safety.
- Floating adapter integration for placement metadata and CSS variables.

## Public Surfaces

Public primitives expose overlay behavior through their own parts and state:

- Dialog and Sheet expose dialog-grade modal behavior.
- Popover, Tooltip, and HoverCard expose floating overlay behavior.
- Menu-family primitives expose collection plus overlay behavior.
- Select and Combobox compose collection behavior with popup positioning.
- Popper is the public low-level positioning primitive, but it does not expose dismissal, focus trapping, portals, roles, or overlay stack control.

## Rules

- Do not export `packages/core/src/overlay/*` as public package subpaths without an ADR or RFC.
- Do not let UI import overlay internals.
- Do not duplicate focus trap, dismissable layer, outside hiding, prevent scroll, or floating metadata in UI.
- New overlay primitives should reuse the private kernel or explicitly replace it with a shared deeper kernel.
- Tests should assert public DOM behavior, focus, dismissal, data attributes, and CSS variables rather than private kernel object shape.

## Promotion Criteria

An overlay kernel API can be promoted only when there is a named external use case, a stable Solid-native API shape, SSR and hydration coverage, nested-layer tests, accessibility evidence, and migration notes for future changes.
