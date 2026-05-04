# ADR 0003: UI TanStack App Layer

## Status

Accepted

## Date

2026-05-03

## Context

UI is intended to be the copy-paste app layer for Solid, not only a styled wrapper catalog. The recent primitive/component inventory clarified that Core should stay focused on accessible primitive behavior, while UI should provide the app-ready source patterns that teams need for forms, tables, shared state, command surfaces, shortcuts, and templates.

The relevant inspiration points are:

- shadcn UI's TanStack Form guide combines field shell components, invalid state attributes, control `aria-invalid`, and schema validation examples.
- TanStack Form, Table, Store, and Hotkeys all have Solid-facing documentation or adapters.
- TanStack Hotkeys is still alpha, so it should be used deliberately and with preview caveats until its API stabilizes.

## Decision

UI first-party app components should be TanStack-native where TanStack provides the app behavior:

- Forms use `@tanstack/solid-form` as the preferred first-party form state and validation integration.
- Data tables use `@tanstack/solid-table` as the preferred first-party table engine.
- Shared app state helpers may use TanStack Store when local signals/context are not enough.
- App-level shortcuts, shortcut display, command shortcuts, and shortcut recording may use `@tanstack/solid-hotkeys`.

Keystone remains independent from TanStack app libraries. Core owns intrinsic widget behavior, accessibility semantics, focus, keyboard interaction inside primitives, form-control ARIA relationships, hidden input/native form hooks for primitives, data attributes, and CSS variables.

UI generated source may depend on both Keystone and TanStack packages. UI must still install readable user-owned Solid source and must not hide TanStack behavior behind opaque runtime packages.

## Consequences

- UI form fields should be designed as TanStack Form adapters around UI/Keystone controls, not as a custom form state system.
- UI data-table components should wrap TanStack Table patterns instead of inventing a table engine.
- UI hotkey features are app-level convenience, not a replacement for Core primitive keyboard behavior.
- Core form work should stay library-agnostic: `Field`, `FormControl`, `Label`, `Description`, `ErrorMessage`, reset/submission helpers, and hidden input helpers.
- UI examples and templates should prefer TanStack Router/Start-compatible app structures when showing these integrations.
- Hotkeys features should be marked preview until the TanStack Hotkeys API is stable enough for first-party UI guarantees.

## References

- shadcn UI TanStack Form guide: https://ui.shadcn.com/docs/forms/tanstack-form
- TanStack Form Solid docs: https://tanstack.com/form/latest/docs/framework/solid
- TanStack Table Solid docs: https://tanstack.com/table/latest/docs/framework/solid/solid-table
- TanStack Store Solid docs: https://tanstack.com/store/latest/docs/framework/solid
- TanStack Hotkeys Solid docs: https://tanstack.com/hotkeys/latest/docs/framework/solid
