# Keystone Core And UI Boundary

## Status

Preview docs page for the current monorepo boundary.

## Summary

Keystone Core and UI are separate product layers.

Core is the headless, accessible, unstyled primitive layer for Solid. It owns intrinsic behavior: state machines, keyboard interaction, focus management, ARIA relationships, form participation, portals, overlays, collections, and stable DOM contracts.

UI is the copy-paste styled source layer for Solid apps. It owns installable component source, blocks, templates, registry metadata, CLI lifecycle commands, styling, app-level composition, and integrations with app engines such as TanStack Form, Table, Store, Router, and Hotkeys.

## Dependency Direction

Allowed direction:

```txt
Core internals
  -> Core primitives
  -> UI items
  -> UI blocks
  -> UI templates
```

Forbidden direction:

- Core must not import UI.
- Core must not depend on TanStack app libraries.
- UI must not reimplement Core behavior when a Core primitive exists.
- UI generated source must not reach into Core private kernels.

## Core Owns

- Public primitive APIs and subpath exports.
- Controlled and uncontrolled primitive state.
- Event composition where user handlers run first and internal handlers skip when `event.defaultPrevented`.
- Stable `data-scope`, `data-part`, state data attributes, and Core CSS variables.
- Accessibility behavior for custom widgets.
- Overlay behavior: focus scope, dismissal, outside hiding, prevent scroll, layer stacking, portals, presence, and floating metadata.
- Collection behavior: item registration, disabled item handling, navigation, selection, active descendant state, roving focus, and typeahead.
- Field/FormControl behavior: label, description, error, validation, hidden input, reset, and submission contracts.
- SSR and hydration safety for primitive behavior.

## UI Owns

- Styled components and blocks installed as user-owned source.
- Registry item metadata, dependency graphs, parity notes, file targets, and install plans.
- CLI commands: `init`, `add`, `diff`, `update`, `remove`, and `doctor`.
- Generated app verification.
- App-level integrations that do not belong in headless primitives.
- Theme tokens, CSS, examples, docs previews, and source readability.

## Boundary Examples

Dialog focus trapping belongs in Keystone. UI Dialog may style the overlay, compose buttons, and add examples, but it should import Core Dialog parts for modal behavior.

Select keyboard navigation, selection, typeahead, hidden input serialization, and popup relationships belong in Keystone. UI SelectField may compose Core Select with a styled Field shell and project-specific CSS.

DataTable sorting, routing, pagination, and app state belong in UI because they are app-workspace behavior. Core should not add table engines or router state to its primitive package.

## Promotion Rule

Private Core kernels can become public only after an ADR or RFC names the stable API, use cases, tests, and migration policy. Until then, UI and docs should describe the behavior through public primitives rather than importing kernel modules directly.
