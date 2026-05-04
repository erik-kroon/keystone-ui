# Keystone Internal Kernel Guidance

## Scope

Keystone internals should deepen shared primitive behavior before new component breadth. Dialog and Select are the proving primitives for the first kernel pass.

## Current Kernel Modules

- `packages/keystone/src/utils/index.ts`: controllable state, event composition, stable IDs, polymorphic rendering, state/data helpers, collection registration, list navigation, and typeahead.
- `packages/keystone/src/form/index.tsx`: form-control ARIA relationships, state data attributes, hidden input props, description/error registration, and form reset hooks.
- `packages/keystone/src/overlay/index.tsx`: focus scope, dismissable layer, layer stack, and the lightweight floating adapter.

These modules are implementation kernels for the 0.1.0 preview. They are used by public primitives but are not exported as public package subpaths.

## 0.1.0 Public Surface

The 0.1.0 preview exposes:

- `@keystone-ui/keystone`
- `@keystone-ui/keystone/dialog`
- `@keystone-ui/keystone/form`
- `@keystone-ui/keystone/select`

The `./overlay` and `./utils` subpaths stay private until a later API decision promotes specific utilities. `./popper` is the public low-level positioning primitive; it wraps the private floating adapter without exposing the full overlay kernel. The goal is to let Dialog, Select, and Popper prove kernel behavior without freezing every helper as public API.

## Implementation Rules

- Prefer Solid accessors and effects over React-shaped render snapshots.
- Keep kernel APIs small and behavior-heavy. Primitive parts should delegate to kernels instead of duplicating keyboard, form, floating, focus, or dismissal logic.
- Keep user handlers first. Internal handlers must skip when `event.defaultPrevented`.
- Keep reason details on the shared controllable-state setter path. Use `KeystoneChangeDetail`-shaped details and `defaultDetail` for programmatic changes instead of controller-local `lastDetail` or `pendingDetail` side channels.
- Keep `data-scope` and `data-part` on every public primitive part. State attributes and floating CSS variables are styling contracts.
- Do not add Mason dependencies to Keystone internals.
- Avoid public subpath exports for private kernels until a later ADR/RFC explicitly promotes them.

## Select Baseline

Select should stay on the shared kernels:

- Form value and reset behavior should go through `createFormControl`.
- Item order, disabled checks, highlighted movement, and printable-key search should go through collection, navigation, and typeahead helpers.
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

`@keystone-ui/keystone/popper` is the public composition surface for code that needs positioning without disclosure state, dismissal, focus management, portals, or roles. Its anatomy is:

- `Popper.Root`: provider only; no DOM and no controlled/uncontrolled state.
- `Popper.Anchor`: measured reference element.
- `Popper.Positioner`: measured floating element with `data-side`, `data-align`, and geometry CSS variables.
- `Popper.Arrow`: optional arrow element with side/align metadata and arrow offset CSS variables.

## Testing Guidance

Kernel tests should assert observable behavior: DOM attributes, focus, keyboard outcomes, form data, reset behavior, and CSS variables. Avoid tests that freeze private signal names or incidental file layout.
