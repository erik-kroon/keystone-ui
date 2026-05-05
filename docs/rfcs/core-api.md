# RFC: Core API

## Status

Draft

## Date

2026-05-03

## Related

- [ADR 0001: Keystone Core And UI Product Boundary](../adr/0001-keystone-core-ui-boundary.md)
- [ADR 0002: Scope, Names, License, And Governance](../adr/0002-scope-names-license-governance.md)

## Summary

Keystone is the Solid-native primitive layer for accessible, unstyled UI behavior.

The public API should serve three audiences:

- App authors using compound components directly.
- Design-system authors wrapping compound parts.
- Primitive power users using low-level `create*` APIs.

Core should expose predictable Solid APIs without copying React-only patterns. The first implementation milestone should prove the API with kernel utilities, `Dialog`, `AlertDialog`, and a small field/control primitive before moving into `Select` and `Combobox`.

## Goals

- Define the public compound component API shape.
- Define low-level creator APIs and accessor-based inputs.
- Define controlled and uncontrolled state conventions.
- Define polymorphism, event composition, data attributes, and CSS variable contracts.
- Define SSR and hydration requirements.
- Identify the first primitives needed to prove the API.

## Non-Goals

- Styled components, themes, or visual defaults.
- Mason registry source conventions beyond the contracts UI needs to wrap Keystone.
- A large primitive catalog before overlay and form behavior are proven.
- Experimental advanced primitives such as data grids, schedulers, or rich multi-selects.

## Package Posture

Core should publish as one public package with subpath exports:

```ts
import { Dialog } from "@keystone-ui/core/dialog";
import { createDialog } from "@keystone-ui/core/dialog";
import { createControllableSignal } from "@keystone-ui/core/utils";
```

The provisional package scope is `@keystone-ui` until public naming clearance replaces it.

Subpath exports should keep imports explicit and tree-shakable while avoiding one package per primitive. Internal kernel modules may have subpath exports when they are intentional public utilities; private internals should not be reachable through public package exports.

## Compound UI

Every user-facing primitive should expose a namespace object with stable compound parts.

Example target shape:

```tsx
import { Dialog } from "@keystone-ui/core/dialog";

<Dialog.Root open={open()} onOpenChange={setOpen} modal>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Create project</Dialog.Title>
        <Dialog.Description>Configure the project before it is created.</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>;
```

Compound parts should be small and stable. Consumers should be able to wrap only the parts they need without reimplementing behavior.

Part names should describe behavior or anatomy, not visual styling. Examples include `Root`, `Trigger`, `Portal`, `Backdrop`, `Positioner`, `Content`, `Title`, `Description`, `Close`, `Control`, `Input`, `Label`, `Item`, `ItemText`, and `ItemIndicator`.

## Low-Level Creators

Meaningful primitives should expose low-level creators for advanced wrappers and custom composition.

Example target shape:

```ts
import { createDialog } from "@keystone-ui/core/dialog";

const dialog = createDialog({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onOpenChange: props.onOpenChange,
  modal: () => props.modal ?? true,
});
```

Creator inputs should accept accessors for reactive state and options. Creators should return structured APIs, not DOM nodes:

- State accessors, such as `open()`.
- Action methods, such as `setOpen(next, detail)`.
- Part prop getters, such as `getTriggerProps()` and `getContentProps()`.
- IDs and relationship helpers when relevant.

Creators must be usable without Core compound components. Compound components should be built on the same underlying behavior contracts rather than separate logic.

## Controlled And Uncontrolled State

Stateful primitives should support both uncontrolled and controlled usage.

Uncontrolled:

```tsx
<Dialog.Root defaultOpen />
```

Controlled:

```tsx
const [open, setOpen] = createSignal(false);

<Dialog.Root open={open()} onOpenChange={setOpen} />;
```

Low-level controlled state:

```ts
createDialog({
  open: () => open(),
  onOpenChange: (next, detail) => setOpen(next),
});
```

Conventions:

- Controlled props use the current value, such as `open={open()}` or `value={value()}`.
- Uncontrolled props use `default*`, such as `defaultOpen` or `defaultValue`.
- Change handlers use `on*Change`, such as `onOpenChange` or `onValueChange`.
- User callbacks receive the next value and an optional detail object.
- Detail objects may include `event`, `reason`, and primitive-specific metadata.
- A primitive is controlled for a state slot when the controlled prop is not `undefined`.

Internal state must not fight controlled props. In controlled mode, Keystone requests changes through callbacks and derives rendered state from props.

## Event Composition

When Keystone composes user and internal event handlers, user code runs first. Internal behavior must skip when the event is default-prevented.

```ts
function composeEventHandlers<E extends Event>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void,
  options = { checkForDefaultPrevented: true },
) {
  return (event: E) => {
    userHandler?.(event);

    if (options.checkForDefaultPrevented === false || !event.defaultPrevented) {
      internalHandler(event);
    }
  };
}
```

This rule lets consumers intentionally prevent Core behavior without monkey-patching primitive internals.

## Polymorphism

Core should use a Solid-native `as` API.

Basic use:

```tsx
<Dialog.Trigger as="button">Open</Dialog.Trigger>
```

Advanced wrapper use should support callback-style composition when a consumer needs to control the rendered element and merge Keystone props explicitly:

```tsx
<Dialog.Trigger
  as={(triggerProps) => (
    <A href="/settings" {...triggerProps}>
      Settings
    </A>
  )}
/>
```

The polymorphic API must account for Solid-specific constraints:

- JSX props are reactive values, not React render snapshots.
- Refs and directives do not behave like React refs.
- Solid `use:*` directives are not forwarded through user-defined components.
- Callback-style composition should make prop merging explicit for library authors.

## Data Attributes

Every rendered primitive part must expose stable data attributes:

- `data-scope`: primitive namespace, such as `dialog` or `select`.
- `data-part`: part name, such as `trigger` or `content`.

State and configuration attributes should be stable and documented when applicable:

- `data-state`: state such as `open`, `closed`, `checked`, `unchecked`, `on`, `off`.
- `data-disabled`
- `data-invalid`
- `data-required`
- `data-readonly`
- `data-selected`
- `data-highlighted`
- `data-placeholder`
- `data-orientation`
- `data-placement`
- `data-side`
- `data-align`

Attributes are part of the public styling contract for design-system wrappers and UI items.

## CSS Variables

Floating, measured, and animated parts should expose documented CSS variables when Keystone computes geometry.

Expected variables for floating primitives include:

- `--keystone-anchor-width`
- `--keystone-anchor-height`
- `--keystone-available-width`
- `--keystone-available-height`
- `--keystone-transform-origin`
- `--keystone-arrow-x`
- `--keystone-arrow-y`

Variables must be scoped to the relevant part and documented on the primitive page. Core should not require a global theme provider.

## Accessibility Specs

Every stable primitive needs a written accessibility spec before stable release.

Primitive specs must document:

- Anatomy and required parts.
- Roles and ARIA attributes.
- Labeling and description behavior.
- Keyboard behavior.
- Focus entry, containment, restore, and escape behavior.
- Disabled, readonly, required, and invalid behavior.
- Form participation when applicable.
- RTL behavior when applicable.
- SSR and hydration behavior.
- Known limitations.

The spec is a product contract, not only implementation notes.

## SSR And Hydration

Core primitives must be SSR-safe.

Rules:

- No direct `window`, `document`, `HTMLElement`, layout, or media-query access during server render.
- Browser-only work happens after mount or through guarded effects.
- Generated IDs must be hydration-safe.
- Server and client output must match for the same initial props.
- Portals must have predictable behavior in SolidStart.
- Force-mounted content must support animation and SSR-sensitive usage.
- Hidden and presence-managed content must avoid hydration warnings.

SSR tests should cover server rendering, hydration, portals, generated IDs, force-mounted content, and absence of hydration warnings.

## First API-Proving Work

The first implementation milestone should prove the API in this order:

1. Kernel utilities:
   - `createControllableSignal`
   - `composeEventHandlers`
   - stable ID helper
   - presence helper
   - focus scope foundation
   - dismissable layer foundation
2. `Dialog`:
   - controlled and uncontrolled `open`
   - compound parts
   - `createDialog`
   - event composition
   - focus trap, focus restore, escape dismiss, outside interaction, portal, prevent scroll
   - SSR and hydration smoke tests
3. `AlertDialog`:
   - confirms dialog composition can specialize safety-critical behavior
   - validates focus defaults and dismissal constraints
4. A field/control primitive:
   - proves labels, descriptions, invalid state, required state, form semantics, and data attributes

`Select` and `Combobox` should follow after overlays and forms because they depend on collections, typeahead, roving focus, floating, and field semantics.

## Acceptance Checklist

- Public compound component API shape is defined.
- Low-level creator APIs and accessor-based state inputs are defined.
- Controlled and uncontrolled behavior conventions are defined.
- Polymorphism, event composition, data attributes, and CSS variable contracts are defined.
- SSR and hydration requirements are recorded.
- First API-proving primitives are identified.
