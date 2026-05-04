# Core Internals Inspiration Map

## Area

This maps the Base UI and Kobalte internals that should guide Keystone's first kernel modules. It supports the first step from [PRD: Core Internals Inspiration Parity](../prd/core-internals-inspiration-parity.md): map Base UI and Kobalte internals before refactoring Dialog, Overlay, Form, and Select onto shared behavior.

Core should use Base UI as the runtime-depth reference and Kobalte as the Solid-native API/composition reference. Radix remains secondary precedent, mainly through the parts already adapted by Kobalte and Floating UI.

## Domain Terms

- `kernel`: private Core internals shared by primitives.
- `part`: public primitive anatomy exposed with `data-part`.
- `scope`: primitive namespace exposed with `data-scope`.
- `controllable state`: state derived from a controlled prop when present, otherwise from internal state.
- `event detail`: structured reason/event metadata passed to user callbacks.
- `polymorphism`: Solid-native rendering override through `as` and advanced callback composition.
- `collection`: ordered item registry used by Select, Combobox, Listbox, Menu, and composite widgets.
- `dismissable layer`: overlay unit that handles outside pointer/focus, Escape, nested layers, and topmost checks.
- `focus scope`: overlay focus entry, containment, pausing, and restore.
- `presence`: mounted/unmounted lifecycle that supports animations and `forceMount`.
- `floating adapter`: shared positioning layer around Floating UI plus public CSS geometry variables.

## Current Core Baseline

- [packages/core/src/utils/index.ts](../../packages/core/src/utils/index.ts): `createControllableSignal` and `composeEventHandlers` are the shared kernel helpers for controlled/uncontrolled state, updater setters, `Object.is` equality skips, explicit controlled presence, and typed change details.
- [packages/core/src/dialog/index.tsx](../../packages/core/src/dialog/index.tsx): Dialog has local IDs, portal rendering, basic Escape close, and stable data attributes. It lacks focus scope, dismissable layer, scroll lock, outside hiding/inert behavior, nested layer coordination, and presence lifecycle.
- [packages/core/src/overlay/index.tsx](../../packages/core/src/overlay/index.tsx): Overlay has a simple reactive stack. It does not yet coordinate pointer blocking, nested layers, top-layer exceptions, global listeners, or body pointer-event restoration.
- [packages/core/src/form/index.tsx](../../packages/core/src/form/index.tsx): Form control tracer wires labels, descriptions, errors, state attributes, and hidden input props. It does not yet register controls with a form context, track touched/dirty/filled/focused state, or validate through a shared field system.
- [packages/core/src/select/index.tsx](../../packages/core/src/select/index.tsx): Select has controlled value/open state, basic hidden input, basic item registration, simple keyboard navigation, and stable data attributes. It lacks DOM-order registration cleanup, typeahead, robust list navigation, floating positioning, focus management, reset semantics, and collection abstractions.

## Module Map

| Core kernel module            | Base UI reference                                                                                       | Kobalte reference                                                                                                                  | Keystone target                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllable state            | Stores in `dialog/store`, `select/store`, event details in `internals/createBaseUIEventDetails.ts`      | `primitives/create-controllable-signal`, `primitives/create-disclosure-state`                                                      | Keep Solid accessors, updater setters, `Object.is` equality, explicit controlled presence for `undefined` values, boolean wrappers only when used, and detail-aware change dispatch.                       |
| Event composition and reasons | `internals/createBaseUIEventDetails.ts`, `internals/reasons.ts`, `merge-props`                          | `@kobalte/utils` compose usage in outside interaction and layer code                                                               | Preserve RFC rule: user handler first, skip internal behavior when default-prevented. Add shared reason constants and cancellable detail objects only where callbacks need more than DOM `preventDefault`. |
| Polymorphic rendering         | `internals/useRenderElement.tsx` with render function/element, state attributes, ref merging            | `polymorphic/Polymorphic.tsx` and typed `PolymorphicProps`                                                                         | Use Solid `as` as default. Add callback-style advanced API from the RFC for explicit prop merging; do not port React clone/render-prop behavior.                                                           |
| IDs and SSR guards            | `internals/useBaseUiId.ts`, `utils/useIsHydrating.ts`                                                   | `createUniqueId`, `createGenerateId`, `primitives/create-register-id`, `isServer` guards                                           | Keep `createKeystoneId`, registered ID stores, guarded microtask scheduling, and browser-global access checks in the shared utility layer. Test SSR/hydration when IDs drive ARIA relationships.           |
| State data attributes         | `internals/getStateAttributesProps.ts`, per-part `*DataAttributes.ts` files                             | form-control datasets and per-part props                                                                                           | Centralize `data-scope`, `data-part`, boolean data attrs, and state string attrs. Keep public contracts stable and documented per primitive.                                                               |
| Collection registration       | `internals/composite/list`, Select/Combobox `CompositeList` use                                         | `primitives/create-collection`, `primitives/create-dom-collection`, `list/ListCollection`                                          | Build DOM-order registration with cleanup and optional controlled items. Select items should not mutate the registry on every render without unregistering.                                                |
| List navigation               | `floating-ui-react/hooks/useListNavigation.ts`, `internals/composite/root/useCompositeRoot.ts`          | `list/ListKeyboardDelegate`, `selection/SelectionManager`                                                                          | Start with one-dimensional list navigation for Select: disabled skip, Home/End, loop policy, RTL hooks, and public highlighted state. Defer grids until needed.                                            |
| Typeahead                     | `floating-ui-react/hooks/useTypeahead.ts`                                                               | `selection/create-type-select.ts`, `ListKeyboardDelegate.getKeyForSearch`                                                          | Shared typeahead with reset timeout, repeated-letter cycling, disabled/hidden skip, locale-aware matching when possible, and Space handling.                                                               |
| Selection                     | Select store, item equality helpers, `internals/itemEquality.ts`                                        | `selection/*`, `create-single-select-list-state`, `create-controllable-selection-signal`                                           | Keep first Core Select single-value. Shape internals so multiple selection can reuse collection and manager concepts later.                                                                                |
| Focus scope                   | `floating-ui-react/components/FloatingFocusManager.tsx`, Dialog/Popover popup tests                     | `primitives/create-focus-scope`                                                                                                    | Solid focus scope with initial focus, containment, restore, nested scope pause/resume, sentinels, and preventable mount/unmount autofocus events.                                                          |
| Dismissable layer and stack   | `floating-ui-react/hooks/useDismiss.ts`, Floating tree/store, popup tests                               | `dismissable-layer/DismissableLayer.tsx`, `dismissable-layer/layer-stack.tsx`, `create-interact-outside`, `create-escape-key-down` | Replace current Overlay stack with topmost-aware layers, nested branch registration, preventable pointer/focus outside events, Escape routing, and pointer-blocking body/layer cleanup.                    |
| Outside hiding/inert          | `FloatingFocusManager`, `utils/InternalBackdrop.tsx`, `utils/FocusGuard.tsx`, inert tests               | `primitives/create-hide-outside`                                                                                                   | Add modal-only outside hiding with ref counts and mutation observer. Evaluate native `inert` plus `aria-hidden` fallback, but keep live announcer/top-layer exceptions.                                    |
| Prevent scroll                | Dialog/Popover modal behavior, `utils/useAnchoredPopupScrollLock.ts`, Select positioner scroll lock     | Kobalte relies on modal/layer composition and related utilities                                                                    | Treat scroll lock as its own module. Needs body scroll prevention, scrollbar compensation, nested locks, and touch/select edge cases before Dialog stable.                                                 |
| Presence and force mount      | `internals/useTransitionStatus.ts`, `useOpenChangeComplete.tsx`, `DialogStore.preventUnmountingOnClose` | `primitives/create-transition`                                                                                                     | Shared presence state should expose mounted/hidden/transition status, support `forceMount`, and avoid unmounting before exit animation completes.                                                          |
| Floating adapter              | `utils/useAnchorPositioning.ts`, `utils/usePositioner.tsx`, Select/Popover positioners and CSS vars     | `popper/PopperRoot.tsx`, `popper/PopperPositioner.tsx`, `popper/utils.ts`                                                          | Wrap `@floating-ui/dom` for Solid. Expose Core CSS vars for anchor size, available size, transform origin, side, align, arrow offsets. Avoid browser access during SSR.                                    |
| Form control and field        | `field/*`, `form/Form.tsx`, `field-register-control/*`, labelable provider                              | `form-control/create-form-control.tsx`, `create-form-control-field.tsx`, `create-form-reset-listener`                              | Split low-level form-control ARIA wiring from field/form validation. Add label/description/error registration, reset listener, hidden input helpers, and form submission tests.                            |

## Call/Data Flow

### Overlay Flow

```txt
Dialog.Root
  -> createDialog(open state, ids, event details)
  -> Dialog.Content / Positioner / Backdrop
    -> presence(forceMount/open)
    -> dismissable layer(register, topmost, branches)
    -> focus scope(initial focus, trap, restore)
    -> modal effects(prevent scroll, hide outside/inert)
    -> public data attributes
```

Base UI reaches this through stores, Floating UI focus manager, internal backdrop, positioner, and transition status. Kobalte reaches it through Solid primitives: `createFocusScope`, `DismissableLayer`, `createInteractOutside`, `createEscapeKeyDown`, and `createHideOutside`. Core should combine the Solid shape with Base UI's behavioral completeness.

### Select Flow

```txt
Select.Root
  -> controllable open/value
  -> form-control/hidden input
  -> collection provider
    -> Item registers DOM ref, value, disabled, text value
  -> list navigation and typeahead update highlighted key
  -> selection commits value and closes popup
  -> floating adapter positions Content/Positioner
  -> public data attributes and CSS variables
```

Base UI's Select is deep because selection, composite list registration, positioning, scroll arrows, modal backdrop, and item equality all interact. Kobalte's Select shows the Solid decomposition: Select builds on listbox, selection state, hidden select, popper, and form-control. Core should start with single-select and one-dimensional listbox behavior before Combobox or grouped/multi Select.

### Form Flow

```txt
Field/FormControl.Root
  -> generate stable base id
  -> register label, control, description, error message
  -> derive aria-labelledby and aria-describedby
  -> expose disabled/invalid/required/readonly data attrs
  -> optional hidden input/form reset/submission wiring
```

Kobalte is the best near-term shape for Solid field primitives. Base UI adds more depth for validation, form context, touched/dirty/filled/focused state, and form-level submit coordination.

## Important Files

### Base UI

- `inspo/base-ui/packages/react/src/internals/useRenderElement.tsx`: render override, state attributes, class/style resolution, prop merging, ref merging.
- `inspo/base-ui/packages/react/src/internals/createBaseUIEventDetails.ts`: reason/event detail shape and cancellable behavior.
- `inspo/base-ui/packages/react/src/internals/getStateAttributesProps.ts`: generic mapping from state to data attributes.
- `inspo/base-ui/packages/react/src/internals/composite/*`: composite item registration and keyboard navigation.
- `inspo/base-ui/packages/react/src/floating-ui-react/components/FloatingFocusManager.tsx`: focus containment, return focus, inert/outside hiding behavior, modal and non-modal differences.
- `inspo/base-ui/packages/react/src/floating-ui-react/hooks/useListNavigation.ts`: comprehensive list navigation semantics.
- `inspo/base-ui/packages/react/src/floating-ui-react/hooks/useTypeahead.ts`: typeahead matching and session reset behavior.
- `inspo/base-ui/packages/react/src/utils/useAnchorPositioning.ts`: shared Floating UI adapter and collision behavior.
- `inspo/base-ui/packages/react/src/utils/usePositioner.tsx`: shared positioner rendering and state attributes.
- `inspo/base-ui/packages/react/src/select/positioner/SelectPositioner.tsx`: Select-specific interaction between positioning, modal backdrop, scroll lock, and collection changes.
- `inspo/base-ui/packages/react/src/field/root/FieldRoot.tsx`: field state and validation coordination.
- `inspo/base-ui/packages/react/src/internals/field-register-control/*`: form-level field control registration.

### Kobalte

- `inspo/kobalte/packages/core/src/primitives/create-controllable-signal/*`: Solid-native controllable signal semantics.
- `inspo/kobalte/packages/core/src/primitives/create-disclosure-state/*`: boolean open/close/toggle wrapper.
- `inspo/kobalte/packages/core/src/polymorphic/*`: Solid `as` polymorphism and prop typing.
- `inspo/kobalte/packages/core/src/dismissable-layer/*`: Solid dismissable layer, nested layers, pointer blocking, and layer stack.
- `inspo/kobalte/packages/core/src/primitives/create-interact-outside/*`: outside pointer/focus custom events with preventable dismissal.
- `inspo/kobalte/packages/core/src/primitives/create-escape-key-down/*`: document-level Escape listener guarded for SSR.
- `inspo/kobalte/packages/core/src/primitives/create-focus-scope/*`: Solid focus trap, restore, sentinels, and nested scope stack.
- `inspo/kobalte/packages/core/src/primitives/create-hide-outside/*`: aria-hidden outside with ref counts and mutation observer.
- `inspo/kobalte/packages/core/src/primitives/create-transition/*`: transition lifecycle and mounted state.
- `inspo/kobalte/packages/core/src/primitives/create-dom-collection/*`: DOM-order collection registration.
- `inspo/kobalte/packages/core/src/list/*`: list collection and keyboard delegate.
- `inspo/kobalte/packages/core/src/selection/*`: selection manager and type select.
- `inspo/kobalte/packages/core/src/popper/*`: Solid Floating UI wrapper and geometry CSS variables.
- `inspo/kobalte/packages/core/src/form-control/*`: Solid form control context, ID registration, ARIA relationships.
- `inspo/kobalte/packages/core/src/select/*` and `src/combobox/*`: Solid composition of form-control, listbox, popper, hidden select, and collection behavior.

## What To Ignore For Now

- Base UI React store mechanics and `React.cloneElement` render behavior.
- Kobalte color/date primitives, tailwindcss, vanilla-extract, and package-specific styling integrations.
- Radix internals unless Base UI/Kobalte behavior is ambiguous.
- Multi-select, grouped Select, Combobox filtering, grid navigation, virtualized collections, date/time fields, and touch-specific advanced Select alignment until single Select is refactored onto shared internals.
- Public subpath exports for private kernel modules until Dialog and Select prove the shapes.

## Next Inspection

1. Start foundations in Core internals: controllable signal, event details/reasons, state attributes, ID registration, and polymorphic rendering.
2. Build overlay internals next: focus scope, dismissable layer/layer stack, outside hiding, prevent scroll, and presence.
3. Refactor Dialog onto those overlay internals and add browser tests for focus entry, trap, restore, Escape, outside interaction, modal hiding, and nested dialogs.
4. Build collection internals: DOM-order registration, list navigation, typeahead, single selection, and form-control reset/submission helpers.
5. Refactor Select onto collection, floating, and form-control internals with tests for disabled/dynamic items, keyboard navigation, typeahead, form submission, reset, and public data attributes.

## Open Design Questions

- Should Keystone depend directly on `@floating-ui/dom`, or keep the first floating adapter internal until Popover/Select prove the dependency surface?
- Should modal outside suppression prefer native `inert` with `aria-hidden` fallback, or begin with `aria-hidden` only and add inert after cross-browser tests?
- Should event details expose Base UI style `cancel()`/`isCanceled`, or rely on DOM `event.preventDefault()` plus callback detail objects for the first milestone?
- Should form-control validation live in the first kernel pass, or should the initial pass stop at ARIA relationships, hidden inputs, and reset/submission behavior?
