# Keystone And Mason Boundary

## Status

Preview docs page for the current monorepo boundary.

## Summary

Keystone and Mason are separate product layers.

Keystone is the headless, accessible, unstyled primitive layer for Solid. It owns intrinsic behavior: state machines, keyboard interaction, focus management, ARIA relationships, form participation, portals, overlays, collections, and stable DOM contracts.

Mason is the copy-paste styled source layer for Solid apps. It owns installable component source, blocks, templates, registry metadata, CLI lifecycle commands, styling, app-level composition, and integrations with app engines such as TanStack Form, Table, Store, Router, and Hotkeys.

## Dependency Direction

Allowed direction:

```txt
Keystone internals
  -> Keystone primitives
  -> Mason components
  -> Mason blocks
  -> Mason templates
```

Forbidden direction:

- Keystone must not import Mason.
- Keystone must not depend on TanStack app libraries.
- Mason must not reimplement Keystone behavior when a Keystone primitive exists.
- Mason generated source must not reach into Keystone private kernels.

## Keystone Owns

- Public primitive APIs and subpath exports.
- Controlled and uncontrolled primitive state.
- Event composition where user handlers run first and internal handlers skip when `event.defaultPrevented`.
- Stable `data-scope`, `data-part`, state data attributes, and Keystone CSS variables.
- Accessibility behavior for custom widgets.
- Overlay behavior: focus scope, dismissal, outside hiding, prevent scroll, layer stacking, portals, presence, and floating metadata.
- Collection behavior: item registration, disabled item handling, navigation, selection, active descendant state, roving focus, and typeahead.
- Field/FormControl behavior: label, description, error, validation, hidden input, reset, and submission contracts.
- SSR and hydration safety for primitive behavior.

## Mason Owns

- Styled components and blocks installed as user-owned source.
- Registry item metadata, dependency graphs, parity notes, file targets, and install plans.
- CLI commands: `init`, `add`, `diff`, `update`, `remove`, and `doctor`.
- Generated app verification.
- App-level integrations that do not belong in headless primitives.
- Theme tokens, CSS, examples, docs previews, and source readability.

## Boundary Examples

Dialog focus trapping belongs in Keystone. Mason Dialog may style the overlay, compose buttons, and add examples, but it should import Keystone Dialog parts for modal behavior.

Select keyboard navigation, selection, typeahead, hidden input serialization, and popup relationships belong in Keystone. Mason SelectField may compose Keystone Select with a styled Field shell and project-specific CSS.

DataTable sorting, routing, pagination, and app state belong in Mason because they are app-workspace behavior. Keystone should not add table engines or router state to its primitive package.

## Promotion Rule

Private Keystone kernels can become public only after an ADR or RFC names the stable API, use cases, tests, and migration policy. Until then, Mason and docs should describe the behavior through public primitives rather than importing kernel modules directly.
