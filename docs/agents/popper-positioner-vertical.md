# Popper/Positioner Vertical

## Issue

- GitHub: #81, "Reach optimal end-state for Keystone Popper/positioner"
- Layer: Keystone
- Category: Overlay And Positioning

## Audit

Current reusable code before this vertical:

- `packages/keystone/src/overlay/floating.ts` already wraps `@floating-ui/dom` with Solid accessors, SSR guards, auto-update, collision handling, flip/shift, optional arrow middleware, same-width and fit-viewport sizing, sticky hide metadata, and Keystone CSS variables.
- `packages/keystone/src/overlay/controller.ts` already consumes that floating adapter for overlay primitives and supports trigger/content or trigger/positioner geometry.
- Popover, Tooltip, HoverCard, Select, Combobox, and menu-derived primitives already expose positioner/content geometry through their own parts.
- Metadata and docs contracts already document floating state attributes and geometry variables for higher-level overlay primitives.

Missing before this vertical:

- No public `@keystone-ui/keystone/popper` subpath for low-level positioning without disclosure, dismissal, focus, portal, or ARIA role behavior.
- No public compound anatomy for `Anchor`, `Positioner`, and `Arrow`.
- No user-visible tests proving that low-level Popper parts expose Keystone `data-scope`, `data-part`, `data-side`, `data-align`, and geometry CSS variables directly.
- No docs contract entry for the low-level Popper surface.

## End-State Contract

`@keystone-ui/keystone/popper` is the public headless positioning primitive. It intentionally does not own controlled/uncontrolled open state, keyboard behavior, focus management, dismissal, portals, or roles. Higher-level primitives such as Popover and Tooltip compose those behaviors separately.

Public API:

- `createPopper(options)`: low-level Solid creator with accessor options.
- `Popper.Root`: provider-only component.
- `Popper.Anchor`: measured reference element.
- `Popper.Positioner`: measured floating element.
- `Popper.Arrow`: optional arrow element.

Supported options:

- `anchor`
- `enabled`
- `placement`
- `strategy`
- `gutter`
- `collisionBoundary`
- `collisionPadding`
- `rootBoundary`
- `sameWidth`
- `fitViewport`
- `sticky`
- `arrowPadding`

Public styling and state contract:

- `data-scope="popper"` and `data-part` on every rendered part.
- `data-side="top|right|bottom|left"` and `data-align="start|center|end"` on positioned parts.
- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-arrow-x`
- `--keystone-arrow-y`
- `--keystone-transform-origin`

SSR and hydration:

- Server rendering emits deterministic part attributes without measuring layout.
- Browser globals are only reached inside guarded floating updates after mount.

## Status

Implemented as a first-class Keystone primitive surface backed by the existing private floating adapter. Known intentional limitation: Popper is geometry only; disclosure, focus, dismissal, portal, role, and form behavior belong to composed primitives rather than this low-level surface.
