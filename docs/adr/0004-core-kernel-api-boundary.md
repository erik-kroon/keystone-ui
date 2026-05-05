# ADR 0004: Core Kernel API Boundary

## Status

Accepted

## Date

2026-05-04

## Context

The Core internals parity work has moved the package beyond shallow primitive
tracers. The shared kernel now covers controllable state, event composition,
IDs, polymorphic rendering, state/data helpers, portal, overlay layering,
focus, dismissal, outside hiding, scroll locking, presence, floating geometry,
collection registration, active descendant state, roving focus, typeahead,
selection, form-control ARIA, hidden inputs, and field validity.

That depth creates an API boundary risk. If every proven internal helper becomes
public API, Keystone freezes implementation detail too early and makes future
primitive work harder. If too little is public, design-system authors and UI
components may have to duplicate behavior or depend on private source modules.

The boundary must preserve the Keystone Core/UI product split from ADR 0001:

- Core owns intrinsic primitive behavior.
- UI owns styled source, registry workflow, blocks, templates, and app-level
  integrations.
- Core must not depend on UI or TanStack app libraries.
- UI must build wrappers from Core public primitive behavior, not private
  kernel imports.

## Decision

Keep Core kernels private by default. Public API is promoted only through
primitive subpath exports, primitive-specific low-level creators, or explicitly
named utility primitives.

The end-state boundary is:

1. Public primitive surface:
   - Public subpath exports such as `@keystone-ui/core/dialog`,
     `@keystone-ui/core/select`, `@keystone-ui/core/form`, and other
     primitive subpaths.
   - Namespace compound components such as `Dialog.Root` and `Select.Item`.
   - Primitive-specific creators such as `createDialog`, `createSelect`,
     `createPopover`, `createCombobox`, and `createFieldValidity`.
   - Public primitive props, change details, part prop types, data attributes,
     CSS variables, and ARIA/form behavior documented for those primitives.

2. Public low-level utility primitives:
   - `Portal` for DOM placement only.
   - `Popper` and `createPopper` for low-level positioning without disclosure
     state, dismissal, focus management, portals, roles, or overlay stack APIs.
   - `Direction`, `Locale`, and `LiveAnnouncer` provider/creator surfaces.
   - Metadata getters and metadata types used by docs and Mason registry
     validation.

3. Public low-level form support:
   - `FormControl`, `Field`, `createFormControl`, `createFieldValidity`, and
     `createHiddenInputDescriptors` are public through the form subpath.
   - These APIs remain native-form and ARIA focused. They are not app-form
     engines and must not depend on TanStack Form.

4. Private implementation kernels:
   - Generic utility kernels: controllable signal internals, event composition
     helpers, stable ID stores, environment guards, polymorphic rendering
     helpers, and data-attribute helpers.
   - Overlay kernels: overlay controllers, layer stack, dismissable layer, focus
     scope, outside hiding/inert behavior, prevent scroll, presence, floating
     adapter internals, arrow positioning, dismissal policy, and DOM guards.
   - Collection kernels: collection registry, collection manager, interaction
     kernel, keyboard delegate, active descendant state, roving focus, typeahead,
     selection manager, popup-field glue, and listbox facade.
   - Primitive adapter kernels: disclosure controllers, selection-control
     controllers, select controllers, slider controllers, menu context,
     menu-family adapters, and similar shared implementation files.

5. Deferred public surfaces:
   - `@keystone-ui/core/utils`.
   - Standalone public `Listbox`.
   - Public overlay stack, dismissable layer, focus scope, scroll lock,
     outside-hiding, presence, collection, typeahead, or Floating UI adapter
     APIs.
   - Public virtualization or large-list adapters.

## Classification

| Kernel capability                                                          | Boundary                                   | Notes                                                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllable state                                                         | Private kernel                             | Public only through primitive state props, change handlers, and primitive creators. A generic `createControllableSignal` export remains deferred. |
| Event composition                                                          | Private kernel                             | Public cancellation contract is DOM `preventDefault()` on documented events.                                                                      |
| Stable IDs and SSR guards                                                  | Private kernel                             | Public proof is stable ARIA relationships and SSR-safe primitive output.                                                                          |
| Polymorphic rendering                                                      | Public through parts, private helper       | `as` is public on parts; renderer internals are private.                                                                                          |
| State/data attributes                                                      | Public contract, private helper            | Attribute names are public styling API; helper implementation is private.                                                                         |
| Metadata                                                                   | Public support API                         | Metadata getters/types are public because docs and UI validation consume them.                                                                    |
| Portal                                                                     | Public utility primitive                   | DOM placement only. Focus, dismissal, and ARIA stay with content primitives.                                                                      |
| Popper/floating                                                            | Public Popper, private floating adapter    | Popper is the stable low-level positioning primitive; direct Floating UI adapter internals stay private.                                          |
| Overlay controller, layer stack, dismissal, focus, inert, scroll, presence | Private kernel                             | Exposed through Dialog, Sheet, Popover, Tooltip, HoverCard, Menu, Select, Combobox, and future overlay primitives.                                |
| Collection registration, navigation, typeahead, selection, listbox facade  | Private kernel                             | Exposed through Select, Combobox, Menu, Tabs, Toolbar, RadioGroup, and future Listbox only after promotion.                                       |
| Form-control ARIA, hidden input, validity                                  | Public form subpath plus private internals | Public form APIs stay native and library-agnostic; UI owns TanStack Form integration.                                                             |
| Direction, locale, live announcer                                          | Public utility primitives                  | Provider and creator APIs are stable-candidate cross-primitive support surfaces.                                                                  |
| Primitive controllers and adapters                                         | Private kernel                             | Public wrapper authors use primitive creators and part components instead.                                                                        |

## Promotion Criteria

A private kernel capability can become public only when all of these are true:

- There is a named external use case that cannot be met by compound parts,
  primitive creators, UI source wrappers, or a small new primitive.
- At least two public primitives have proven the same internal contract without
  primitive-specific leakage.
- The API shape is Solid-native and does not expose React-specific clone,
  render-snapshot, or store assumptions.
- SSR, hydration, keyboard, focus, accessibility, and form behavior are covered
  where relevant.
- Public naming, types, and examples are documented in an RFC or ADR.
- Semver and migration implications are explicit.

Promotion should prefer a narrow utility primitive over exporting raw kernel
objects. For example, Popper is the public positioning utility; the full floating
adapter remains private.

## Compatibility And Semver

Before public package release:

- Private kernel file paths, function names, and internal return shapes may
  change without compatibility guarantees.
- Public primitive subpaths, compound parts, creator inputs/outputs, exported
  types, data attributes, CSS variables, and documented behavior are treated as
  stable-candidate contracts.

After public package release:

- Breaking changes to public primitive subpaths, public creators, exported
  types, data attributes, CSS variables, or documented behavior require normal
  semver treatment.
- Changes to private kernels do not require semver treatment unless they change
  observable public behavior.
- Adding a new public low-level kernel API requires an ADR or accepted RFC.

## Consequences

- Keystone can continue deepening internals without locking every helper into
  public API.
- Design-system authors get stable wrapper points through compound parts,
  primitive creators, metadata, data attributes, and CSS variables.
- UI can style and compose Core primitives without importing private
  internals or reimplementing behavior.
- Public `utils`, public `Listbox`, and public overlay/collection kernel APIs
  remain deliberate future decisions instead of accidental exports.
- TanStack app libraries stay out of Keystone. UI remains the app-layer home
  for TanStack Form, Table, Store, Router, and Hotkeys integrations.

## References

- [ADR 0001: Keystone Core And UI Product Boundary](0001-keystone-core-ui-boundary.md)
- [ADR 0003: UI TanStack App Layer](0003-ui-tanstack-app-layer.md)
- [RFC: Core API](../rfcs/core-api.md)
