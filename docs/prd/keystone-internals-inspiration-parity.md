# PRD: Keystone Internals Inspiration Parity

## Problem Statement

Keystone has early primitive tracers, but the runtime depth is not yet comparable to the inspiration libraries. Dialog, Form, Overlay, and Select prove public direction, but much of their behavior is still local to each primitive. That makes the library fragile: future primitives will either duplicate hard behavior or ship shallow accessibility and interaction support.

Base UI demonstrates the level of architecture and runtime depth Keystone should aspire to: reusable systems for dialogs, fields, floating content, forms, menus, collections, and composite widgets. Kobalte demonstrates how similar ideas should be expressed in Solid, especially around polymorphism, controllable state, collections, focus, form controls, poppers, and listbox/select composition. Radix remains useful precedent, but its React-specific API shapes should not drive Keystone design.

The immediate problem is not that Keystone lacks more components. The immediate problem is that Keystone lacks a deep internal kernel. Without that kernel, adding more primitives will increase surface area faster than reliability.

## Solution

Build a Keystone internal kernel that reaches parity with the relevant architectural lessons from Base UI and Kobalte before expanding the primitive catalog.

The work should proceed through independently testable internal modules, each proven by a narrow primitive or demo path:

- Controllable state and event composition.
- Solid-native polymorphic rendering.
- Hydration-safe IDs and environment guards.
- Collection registration and lookup.
- Typeahead and list navigation.
- Focus scope and focus restore.
- Dismissable layer and layer stack.
- Prevent scroll and outside hiding/inert behavior.
- Presence and force-mount lifecycle.
- Floating adapter and geometry CSS variables.
- Form-control registration and field state.

Existing Dialog, Overlay, Form, and Select tracers should be refactored onto these internals instead of growing more local behavior. Each module should be small at the public interface and deep in behavior, with browser-visible tests and docs/spec notes where user-facing contracts are affected.

## User Stories

1. As a Keystone maintainer, I want internal systems before broad primitive work, so that primitives share reliable behavior instead of duplicating logic.
2. As a Keystone maintainer, I want Base UI treated as the primary runtime-depth reference, so that Keystone is measured against serious primitive architecture.
3. As a Keystone maintainer, I want Kobalte treated as the primary Solid-native reference, so that Keystone APIs fit Solid rather than React.
4. As a Keystone maintainer, I want Radix treated as secondary precedent, so that useful concepts are considered without copying React-specific APIs.
5. As a primitive implementer, I want a robust controllable state utility, so that controlled and uncontrolled primitive state behaves consistently.
6. As a primitive implementer, I want event composition standardized, so that user handlers can prevent internal behavior predictably.
7. As a primitive implementer, I want a Solid-native polymorphic renderer, so that primitive parts can render native elements and router links without losing props, refs, or accessibility attributes.
8. As a primitive implementer, I want hydration-safe IDs, so that labels, descriptions, triggers, and content relationships survive SSR and hydration.
9. As a primitive implementer, I want collection registration, so that item-based primitives can reason about order, disabled items, labels, and dynamic children.
10. As a primitive implementer, I want typeahead behavior, so that Select, Combobox, Menu, and Listbox interactions are consistent.
11. As a primitive implementer, I want list navigation behavior, so that arrow keys, Home, End, looping, disabled items, and RTL rules are centralized.
12. As a primitive implementer, I want focus scope behavior, so that modal primitives can trap, restore, and direct focus reliably.
13. As a primitive implementer, I want dismissable layer behavior, so that outside pointer, outside focus, Escape, nested layers, and preventable dismissal are consistent.
14. As a primitive implementer, I want a layer stack, so that only the topmost relevant overlay responds to global dismissal.
15. As a primitive implementer, I want prevent-scroll behavior, so that modal overlays can block page scroll without layout bugs.
16. As a primitive implementer, I want outside hiding or inert behavior, so that modal overlays are not announced with unrelated page content.
17. As a primitive implementer, I want presence and force-mount behavior, so that animations and SSR-sensitive rendering have a shared lifecycle.
18. As a primitive implementer, I want a floating adapter, so that Popover, Select, Tooltip, Menu, and Combobox share positioning behavior.
19. As a primitive implementer, I want geometry CSS variables, so that Mason and design-system wrappers can animate and size floating content.
20. As a primitive implementer, I want form-control registration, so that fields, labels, descriptions, errors, invalid state, required state, and disabled state are consistent.
21. As a Dialog user, I want focus to move into a modal dialog on open, so that keyboard use starts in the expected place.
22. As a Dialog user, I want focus to restore on close, so that I return to the control that opened the dialog.
23. As a Dialog user, I want nested dialogs and overlays to dismiss in the correct order, so that complex UI does not close the wrong layer.
24. As a Dialog user, I want outside interactions to be preventable, so that product-specific confirmation or validation flows can intercept dismissal.
25. As a Select user, I want keyboard navigation and typeahead to work across disabled and dynamic items, so that list interactions feel complete.
26. As a Select user, I want selected and highlighted state exposed through stable attributes, so that styling remains independent from behavior.
27. As a Select user, I want form submission to include the selected value, so that Select can replace native controls in real forms.
28. As a Mason component author, I want Keystone internals to expose stable data and CSS contracts, so that Mason wrappers can stay simple.
29. As a design-system author, I want low-level internals to remain testable through public primitive behavior, so that wrappers do not depend on private structures.
30. As a contributor, I want each internal system to have clear inspiration notes, so that Base UI/Kobalte comparisons guide implementation without cargo-culting.
31. As a contributor, I want tests to assert public behavior, so that internal refactors remain possible.
32. As a future primitive author, I want Dialog and Select refactored onto the kernel, so that new overlay and collection primitives have proven examples.

## Implementation Decisions

- Base UI is the first-priority reference for runtime depth, internal architecture, and behavior completeness.
- Kobalte is the first-priority reference for Solid-native API design, polymorphism, composition, and reactive constraints.
- Radix is secondary precedent and should not override Solid-native choices.
- Keystone should not add broad new primitives until Dialog and Select are refactored onto shared internals.
- Internal modules should be designed as deep modules: small stable interfaces, substantial encapsulated behavior, and focused tests.
- Public primitive behavior should be the verification surface for internals whenever possible.
- Private internals should not become public subpath exports until a deliberate API decision is made.
- Existing utility and primitive files may be reorganized when it reduces duplication and improves testability.
- Kernel modules must remain Keystone-only and must not depend on Mason.
- Data attributes and CSS variables remain public styling contracts and should be documented when internals affect them.

## Testing Decisions

- Good tests assert user-observable behavior: DOM attributes, focus movement, emitted change details, keyboard outcomes, form data, and hydration safety.
- Avoid tests that lock private signal names, private file layout, or incidental helper structure.
- Controllable state and event composition should have unit tests.
- Polymorphism should have type tests and runtime tests for native elements and router-link-like callbacks.
- ID utilities should have SSR/hydration tests or equivalent server/client rendering checks.
- Collection, typeahead, and list navigation should have unit tests and Select-driven browser tests.
- Focus scope, dismissable layer, layer stack, prevent scroll, and outside hiding should have Dialog-driven browser tests.
- Floating adapter behavior should be tested through geometry attributes/styles and a positioned primitive path.
- Form-control behavior should be tested through form submission and accessible relationship output.
- Existing Mason registry and CLI tests are useful prior art for deterministic behavior and path-safety testing, but Keystone needs browser/component tests beyond current package typechecks.

## Parity Tracking Ledger

This ledger is the current module-by-module locality map for Keystone internals. Status means:

- `proven`: implemented in a shared Keystone kernel and covered by a Dialog, Select, or focused kernel test.
- `partial`: implemented enough for current Dialog/Select behavior, but still short of the Base UI/Kobalte parity target.
- `missing`: not yet implemented as a shared Keystone kernel module.

Dialog and Select behavior tests are the preferred proof for user-facing kernel readiness. Focused kernel tests may prove lower-level mechanics, but a module that only has kernel proof should remain `partial` unless it is not supposed to surface through Dialog or Select.

| Kernel module                               | Status  | Current Keystone module                                                                                                      | Proof surface                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Parity gap / next deepening                                                                                                                                             |
| ------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controllable state                          | proven  | `packages/keystone/src/utils/index.ts`                                                                                       | `packages/keystone/src/utils/kernel.test.tsx` proves controlled/uncontrolled setters, explicit controlled `undefined` values, typed change details, unchanged-value skips, `createDialog`, and `createSelect`; Dialog and Select behavior tests prove open/value changes through public parts.                                                                                                                                                                      | Add richer wrappers only when a primitive needs them, for example set-valued state or disclosure helpers.                                                               |
| Event composition and preventable internals | proven  | `packages/keystone/src/utils/index.ts`, `packages/keystone/src/overlay/dismissal-policy.ts`                                  | `kernel.test.tsx` proves user handlers run first; `packages/keystone/test/dialog.behavior.test.tsx` proves prevented outside interaction and prevented Escape; `packages/keystone/test/select.behavior.test.tsx` proves read-only blocks value changes.                                                                                                                                                                                                             | Keep DOM `preventDefault()` as the first cancellation contract. Add shared reason constants only when duplicated reason strings become a maintenance cost.              |
| Solid polymorphic rendering                 | proven  | `packages/keystone/src/utils/index.ts`, Dialog/Select trigger props                                                          | `kernel.test.tsx` proves callback-style `renderPolymorphic`, intrinsic element names, direct Solid components, and router-link-like trigger rendering; `polymorphic.types.tsx` keeps utility, Dialog trigger, Select trigger, and direct Solid component type coverage under `check-types`; `docs/agents/solid-polymorphic-as-rendering.md` records the end-state contract and intentional exceptions.                                                              | Base UI render-prop/clone behavior remains intentionally out of scope; callback-style composition is the Keystone escape hatch for explicit final-element prop merging. |
| Stable IDs and SSR guards                   | proven  | `packages/keystone/src/utils/index.ts`, overlay/form/select/dialog creators                                                  | `kernel.test.tsx` proves `createKeystoneId`, the `createStableId` compatibility alias, reactive caller-provided IDs, fallback stability, registered dynamic ARIA IDs, and guarded microtask scheduling; `packages/keystone/test/accessibility-ssr.test.tsx` proves generated Dialog/FormControl ID relationships without `window` or `document`; Dialog behavior proves ARIA title/description relationships; Select behavior proves trigger/listbox relationships. | Keep generated IDs and registered ID stores in the shared utility layer as new primitives add dynamic title, description, and error slots.                              |
| State/data attribute contracts              | proven  | `packages/keystone/src/utils/index.ts`, `packages/keystone/src/metadata/index.ts`, form/listbox/overlay/select/dialog        | `kernel.test.tsx` proves boolean, open/closed, checked/unchecked, and tri-state selection helpers; `packages/keystone/src/listbox/listbox.test.tsx`, Dialog behavior tests, and Select behavior tests assert `data-scope`, `data-part`, `data-state`, selected/highlighted, readonly, invalid, required, and transition data; `docs/agents/state-data-attribute-helpers.md` records the end-state contract.                                                         | Continue documenting new public state attrs when primitives add them.                                                                                                   |
| Portal                                      | proven  | `packages/keystone/src/portal/index.tsx`, overlay `*.Portal` parts                                                           | `packages/keystone/src/portal/portal.test.tsx` proves `present`, `forceMount`, custom mount targets, and cleanup; Dialog/Popover/Tooltip/Sheet/Select/Combobox/Menu behavior tests prove the public overlay Portal parts consume the shared helper.                                                                                                                                                                                                                 | Standalone Portal intentionally owns no ARIA, focus, keyboard, pointer, form, data-attribute, or CSS-variable contract; those remain owned by the portalled content.    |
| Overlay controller                          | proven  | `packages/keystone/src/overlay/controller.ts`                                                                                | `createDialog` in `kernel.test.tsx`; Dialog behavior tests for trigger open, close button, Escape, outside dismissal, presence, focus, and nested dialogs.                                                                                                                                                                                                                                                                                                          | Keep private until more overlay primitives prove the same API.                                                                                                          |
| Dismissable layer and layer stack           | proven  | `packages/keystone/src/overlay/layer-kernel.tsx`, `packages/keystone/src/overlay/dismissable-layer.tsx`                      | `packages/keystone/src/overlay/layer-kernel.test.tsx` proves layer order, top-layer-only dismissal, pointer blocking, scroll lock, and outside hiding restoration; `packages/keystone/src/overlay/dismissable-layer.test.tsx` proves outside pointer/focus dismissal, Escape dismissal, preventable handlers, reactive `enabled`, and portalled branch elements; Dialog behavior proves nested dialogs dismiss in top-layer order.                                  | Keep validating branch behavior through portal-heavy primitives such as Menu, Combobox, HoverCard, and nested mixed overlay flows as they adopt the shared layer path.  |
| Focus scope, trap, and restore              | proven  | `packages/keystone/src/overlay/focus-scope.tsx`, consumed by `packages/keystone/src/overlay/layer-kernel.tsx`                | Dialog behavior proves initial focus, preventable mount/unmount autofocus, restore focus, non-modal outside focus behavior, Tab wrapping in modal content, top-layer-aware trapping, and last-focused restore when modal focus leaves programmatically. `packages/keystone/src/overlay/focus-scope.test.tsx` proves focus guards, fallback focus, keyboard wrapping, and cleanup.                                                                                   | Keep extending browser-level coverage as portal-heavy primitives such as Menu, Combobox, HoverCard, and nested mixed overlays adopt the shared layer path.              |
| Outside hiding / inert behavior             | proven  | `packages/keystone/src/overlay/hide-outside.ts`, `packages/keystone/src/overlay/layer-kernel.tsx`                            | `layer-kernel.test.tsx` proves `aria-hidden`/native `inert` restoration, dynamically inserted outside DOM, ref-counted cleanup, and top-layer exceptions; Dialog behavior tests prove modal outside content is hidden/inert through the public primitive path.                                                                                                                                                                                                      | Keep validating portal-heavy mixed overlay flows and live-announcer exceptions as Menu, Combobox, HoverCard, and nested primitives adopt the shared layer path.         |
| Prevent scroll                              | proven  | `packages/keystone/src/overlay/prevent-scroll.ts`, `packages/keystone/src/overlay/layer-kernel.tsx`                          | `packages/keystone/src/overlay/prevent-scroll.test.ts` proves body scroll locking, scrollbar compensation, nested lock ref counts, prior inline-style restoration, and iOS touch edge blocking; `packages/keystone/src/overlay/layer-kernel.test.tsx` proves modal layers acquire and release the shared lock through the public stack path.                                                                                                                        | Select/popover-specific scroll behavior should be validated as those primitives adopt modal or scroll-contained variants.                                               |
| Presence and force mount                    | proven  | `packages/keystone/src/overlay/presence.ts`, `packages/keystone/src/overlay/controller.ts`, overlay `*.Portal` parts         | `packages/keystone/src/overlay/presence.test.ts` proves mounted, hidden, transition, close retention, `forceMount`, and `onOpenChangeComplete` retention details; Dialog behavior proves lazy mount, `forceMount` through the public Portal part, close transition retention, `data-transition-status`, and `onOpenChangeComplete`.                                                                                                                                 | Keep the shared Presence contract private until additional overlay primitives stabilize their public animation APIs.                                                    |
| Floating adapter and geometry variables     | proven  | `packages/keystone/src/overlay/floating.ts`, Select controller                                                               | `packages/keystone/src/overlay/floating.test.tsx` proves placement, flip, shift, scroll strategy, sizing, arrow offsets, and CSS variables; Select behavior proves geometry variables on `Select.Positioner`.                                                                                                                                                                                                                                                       | Direct Floating UI dependency surface remains private. Deepen collision boundaries and auto-update behavior as Popover/Menu/Combobox adopt it.                          |
| Collection registration and lookup          | partial | `packages/keystone/src/listbox/collection-registry.ts`, `collection-manager.ts`, `interaction-kernel.ts`, `listbox/index.ts` | `kernel.test.tsx` and `packages/keystone/src/listbox/listbox.test.tsx` prove ordered registration, duplicate replacement, stale cleanup safety, cleanup on root disposal, grouped options, and lookup; Select behavior proves item groups plus dynamic option mount/unmount order through public parts.                                                                                                                                                             | DOM-order refs are now wired through the listbox option path. Still needs virtualization-friendly hooks and hidden-item awareness before promotion to `proven`.         |
| Active descendant and list navigation       | proven  | `packages/keystone/src/listbox/active-descendant.ts`, `keyboard-delegate.ts`, `interaction-kernel.ts`                        | `listbox.test.tsx` proves `aria-activedescendant`, Arrow navigation, disabled skip, custom keyboard delegates, grouped options, and multiple selection contracts; Select behavior proves enabled-item keyboard navigation.                                                                                                                                                                                                                                          | RTL and grid navigation are deferred until primitives require them.                                                                                                     |
| Typeahead                                   | partial | `packages/keystone/src/listbox/typeahead.ts`                                                                                 | `kernel.test.tsx`, `listbox.test.tsx`, and Select behavior prove printable-key search, disabled skip, Space during active search, and locale-aware custom collator.                                                                                                                                                                                                                                                                                                 | Repeated-letter cycling and hidden-item awareness are not yet proven.                                                                                                   |
| Selection manager                           | proven  | `packages/keystone/src/listbox/selection-manager.ts`, Select controller                                                      | `kernel.test.tsx` proves disabled selects are ignored; `listbox.test.tsx` proves single and multiple selection; Select behavior proves keyboard/item selection and repeated hidden inputs for multi-select.                                                                                                                                                                                                                                                         | Item equality customization can wait until object-valued or virtualized collections exist.                                                                              |
| Listbox interaction facade                  | proven  | `packages/keystone/src/listbox/index.ts`                                                                                     | `listbox.test.tsx` proves listbox, option, group, active-descendant, keyboard, typeahead, and selection contracts together; Select behavior proves public Select consumes it.                                                                                                                                                                                                                                                                                       | Keep private until Listbox/Select/Combobox APIs settle.                                                                                                                 |
| Form-control ARIA and hidden input          | proven  | `packages/keystone/src/form/index.tsx`, Select controller                                                                    | `kernel.test.tsx` proves label/description/error relationships and hidden input props; Select behavior proves form submission, reset, external form owners, input sync, readonly state, and multi-value serialization.                                                                                                                                                                                                                                              | Form-control context and public field anatomy still need primitive-level docs/tests.                                                                                    |
| Field validity                              | partial | `packages/keystone/src/form/index.tsx`                                                                                       | `packages/keystone/src/form/field-validity.test.tsx` proves focus/touch/dirty/filled tracking, native/custom validity, async latest-result behavior, and form-control consumption.                                                                                                                                                                                                                                                                                  | Not yet proven through Dialog or Select, and not yet wired into a full Field/Form primitive surface.                                                                    |

Dialog proof currently lives in `packages/keystone/test/dialog.behavior.test.tsx`:

- `renders closed content lazily, opens from trigger, and closes on Escape`
- `dismisses from outside pointer interactions with a preventable event`
- `does not dismiss when outside interaction is prevented`
- `excludes the trigger from outside dismissal while open`
- `keeps modal dialogs open for context-menu pointer outside`
- `does not dismiss when Escape is prevented`
- `keeps closed content mounted until exit transition completes`
- `dismisses nested dialogs in top-layer order`
- `moves focus into modal content and restores focus to the trigger`
- `does not restore non-modal focus after outside interaction dismissal`
- `restores non-modal focus to the trigger when closed from inside`
- `traps Tab focus within modal content`
- `allows mount autofocus to be prevented`
- `allows unmount autofocus to be prevented`
- `restores the last focused element when modal focus leaves programmatically`

Select proof currently lives in `packages/keystone/test/select.behavior.test.tsx`:

- `navigates enabled items, supports typeahead, and selects from the keyboard`
- `submits and resets through the form-control kernel hidden input`
- `serializes multiple selected values as repeated hidden inputs`
- `resets through an external form owner`
- `syncs value changes dispatched from the hidden input`
- `read-only select exposes state and blocks value changes`
- `supports grouped options without changing single-selection behavior`
- `exposes floating geometry variables on the positioner`

## First-Class Exceptions

Base UI remains the primary reference for runtime depth and Kobalte remains the primary Solid-native reference, but parity is not a blanket copying rule. These exceptions should be tracked as deliberate first-class choices, not undocumented drift:

- Solid API shape: when Base UI's React store, clone/render-prop, or hook mechanics conflict with Solid accessors, lifecycle, or JSX composition, Keystone follows Kobalte/Solid-native patterns.
- Platform behavior: native form submission, reset, constraint validation, focus, `PointerEvent`, and `KeyboardEvent` behavior should be verified against browser-visible tests even when Base UI/Kobalte use different abstractions.
- Floating geometry: Keystone may compare directly against Floating UI concepts for positioning, collision, transform-origin, and CSS geometry variables because both Base UI and Kobalte ultimately wrap that domain.
- Keystone public contracts: stable `data-scope`, `data-part`, state attributes, and CSS variables are Keystone-owned styling contracts. Inspiration libraries guide coverage, but Keystone names and lifecycle semantics must stay internally consistent.
- Mason and TanStack integrations: TanStack Form/Table/Store/Hotkeys are first-class Mason app-layer references, not Keystone kernel dependencies.
- Sonner-style toast behavior, shadcn-style registry conventions, and Mason source-generation ergonomics are first-class Mason exceptions and should not be used to justify Keystone primitive internals.
- Radix precedent is secondary. Use it only when Base UI/Kobalte behavior is ambiguous or when a broader web-platform convention needs a third comparison point.

## Out of Scope

- New broad primitive catalog expansion.
- Mason blocks and templates.
- Final naming, package scope clearance, or commercial packaging.
- Full Combobox, Menu, Popover, Tooltip, or Date Picker implementation unless needed as a small proving harness.
- Copying Base UI, Kobalte, or Radix code wholesale.
- Publicly committing to private kernel export names before they are proven.

## Further Notes

This PRD supersedes a component-count mindset for Keystone. The expected result is fewer primitives with much deeper runtime quality.

The first implementation sequence should be:

1. Map Base UI/Kobalte internals for each kernel module.
2. Build state, event, ID, and polymorphic foundations.
3. Build focus, dismissal, layer, presence, and scroll systems.
4. Refactor Dialog onto those systems.
5. Build collection, typeahead, navigation, form-control, and floating systems.
6. Refactor Select onto those systems.
7. Use the refactored Dialog and Select as the baseline for future primitives.
