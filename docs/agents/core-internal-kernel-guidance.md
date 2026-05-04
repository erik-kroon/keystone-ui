# Keystone Internal Kernel Guidance

## Scope

Core internals should deepen shared primitive behavior before new component breadth. Dialog and Select are the proving primitives for the first kernel pass.

The durable API boundary is [ADR 0004: Core Kernel API Boundary](../adr/0004-core-kernel-api-boundary.md). This note is operational guidance for contributors; ADR 0004 wins if the two documents conflict.

## Current Kernel Modules

- `packages/core/src/utils/*`: controllable state, event composition, stable IDs, environment guards, polymorphic rendering, and state/data helpers.
- `packages/core/src/overlay/index.tsx`: focus scope, dismissable layer, layer stack, and the lightweight floating adapter.
- `packages/core/src/collection/*`: collection registration, active descendant state, list navigation, typeahead, selection, and listbox-style interaction contracts.
- `packages/core/src/form/*`: form-control ARIA relationships, state data attributes, hidden input props, description/error registration, field validity, and form reset hooks.
- `packages/core/src/i18n/*`: locale, message, text-direction inference, and direction provider internals used by primitives.

These modules are implementation kernels for the 0.1.0 preview. They are used by public primitives but are not exported as public package subpaths unless ADR 0004 explicitly classifies the surface as public.

## Public Surface Boundary

The preview package exposes primitive and utility subpaths, including:

- `@keystone-ui/core`
- Primitive subpaths such as `@keystone-ui/core/dialog`, `@keystone-ui/core/select`, `@keystone-ui/core/combobox`, `@keystone-ui/core/menu`, `@keystone-ui/core/tabs`, and other current primitive exports.
- Utility primitive subpaths such as `@keystone-ui/core/portal`, `@keystone-ui/core/popper`, `@keystone-ui/core/direction`, `@keystone-ui/core/locale`, and `@keystone-ui/core/live-announcer`.
- `@keystone-ui/core/form` for native-form and ARIA-focused form-control support.

The `./overlay`, `./collection`, and `./utils` subpaths stay private until a later ADR or accepted RFC promotes specific utilities. `./popper` is the public low-level positioning primitive; it wraps the private floating adapter without exposing the full overlay kernel. Metadata getters and types are public support APIs for docs and UI validation, but metadata helper internals remain implementation detail.

The goal is to let public primitives and narrow utility primitives prove kernel behavior without freezing every helper as public API.

## Implementation Rules

- Prefer Solid accessors and effects over React-shaped render snapshots.
- Keep kernel APIs small and behavior-heavy. Primitive parts should delegate to kernels instead of duplicating keyboard, form, floating, focus, or dismissal logic.
- Keep user handlers first. Internal handlers must skip when `event.defaultPrevented`.
- Keep reason details on the shared controllable-state setter path. Use `CoreChangeDetail`-shaped details and `defaultDetail` for programmatic changes instead of controller-local `lastDetail` or `pendingDetail` side channels.
- Keep `data-scope` and `data-part` on every public primitive part. State attributes and floating CSS variables are styling contracts.
- Do not add UI dependencies to Core internals.
- Avoid public subpath exports for private kernels until a later ADR or accepted RFC explicitly promotes them.
- Treat private kernel file paths, function names, and return shapes as non-contractual. Public contracts are primitive subpaths, namespace parts, creator APIs, exported types, data attributes, CSS variables, documented ARIA/form behavior, and explicitly public utility primitives.

See also:

- [ADR 0004: Core Kernel API Boundary](../adr/0004-core-kernel-api-boundary.md)
- [Overlay Kernel Boundary Note](overlay-kernel-boundary.md)
- [Collection And Typeahead Kernel Boundary Note](collection-typeahead-kernel-boundary.md)

## Select Baseline

Select should stay on the shared kernels:

- Form value and reset behavior should go through the private form kernel.
- Item order, disabled checks, highlighted movement, and printable-key search should go through the private collection, navigation, and typeahead kernel.
- Floating content should use `createFloatingAdapter` through `Select.Positioner` when present, with `Select.Content` retaining compatibility as a directly positioned part.

## Floating Contracts

The floating adapter currently provides first-pass geometry without committing to a final Floating UI dependency surface. It exposes:

- `data-side`
- `data-align`
- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-transform-origin`

Future Popover, Menu, Tooltip, Combobox, and Select work should reuse this adapter or deliberately replace it with a deeper adapter, not add local positioning code.

`@keystone-ui/core/popper` is the public composition surface for code that needs positioning without disclosure state, dismissal, focus management, portals, or roles. Its anatomy is:

- `Popper.Root`: provider only; no DOM and no controlled/uncontrolled state.
- `Popper.Anchor`: measured reference element.
- `Popper.Positioner`: measured floating element with `data-side`, `data-align`, and geometry CSS variables.
- `Popper.Arrow`: optional arrow element with side/align metadata and arrow offset CSS variables.

## Testing Guidance

Kernel tests should assert observable behavior: DOM attributes, focus, keyboard outcomes, form data, reset behavior, and CSS variables. Avoid tests that freeze private signal names or incidental file layout.
