# Keystone UI Repo Parity And API State Report

## Status

Draft

## Date

2026-05-04

## Scope

This report summarizes the current repo state, the parity state of Core primitives and Mason registry items, and the end-state API direction Keystone Core/UI should converge on.

It is intentionally more operational than [Primitive Research Notes](./primitives-notes.md). The research notes are a broad inspiration index. This report is a state and direction report.

## Authority Order

Use these documents in this order when there is a conflict:

1. [CONTEXT.md](../../CONTEXT.md): product boundaries and current repo state.
2. [ADR 0001](../adr/0001-keystone-core-ui-boundary.md): Keystone Core/UI ownership boundary.
3. [Core API RFC](../rfcs/core-api.md): public primitive API direction.
4. [Mason Registry RFC](../rfcs/mason-registry.md): registry schema, install semantics, and `meta.parity`.
5. [Core Internals Inspiration Parity PRD](../prd/core-internals-inspiration-parity.md): current kernel parity ledger.
6. [End-State Primitive And Component Inventory](../agents/end-state-primitive-component-inventory.md): target surface classification.
7. Vertical agent notes under [docs/agents](../agents/): slice-level implementation history and remaining gaps.
8. This report and [Primitive Research Notes](./primitives-notes.md): synthesis and research guidance.

## Verification Snapshot

Commands run on 2026-05-04:

| Command                                         | Result            | Notes                                                                                                           |
| ----------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `bun run check-types`                           | Pass              | Turbo typecheck, 3 package tasks cached and successful.                                                         |
| `bun run check`                                 | Pass              | `oxlint && oxfmt --write`, 0 warnings/errors. Formatting churn from this command was reverted for source files. |
| `bun run build`                                 | Pass              | Docs app Vite client and SSR builds passed.                                                                     |
| `bun --filter @keystone-ui/core test`           | Pass              | 38 files, 202 tests.                                                                                            |
| `bun --filter @keystone-ui/mason-registry test` | Pass              | 27 tests. Includes default registry parity metadata validation.                                                 |
| `bun --filter @keystone-ui/mason-cli test`      | Pass              | 20 tests. Includes generated app typecheck/build after add.                                                     |
| `bun run test`                                  | Not a repo script | Root `package.json` has no `test`; Bun attempted `/bin/test` and failed. Use package filters instead.           |

Working tree after cleanup:

- Existing user change: `README.md`.
- New docs from this workspace: `docs/research/primitives-notes.md` and this report.
- `inspo/` remains gitignored.

## Executive Summary

The repo is no longer a pure scaffold. Keystone has meaningful kernel depth across controllable state, event composition, polymorphism, metadata, portal, overlay layering, focus scope, dismissable layer, outside hiding, prevent scroll, presence, floating geometry, listbox interaction, form-control, selection controls, slider, menu family, date picker, toast, direction, locale, live announcer, and utility primitives.

The strategic risk has shifted. The original risk was shallow local primitive tracers. The current risk is inconsistent maturity: some areas are proven through behavior tests and shared kernels, while others are thin verticals that expose early public API and UI metadata before reaching Base UI/Kobalte depth.

UI is ahead in registry and install mechanics. It has a source-first registry, path safety, dependency resolution, lifecycle commands, installed metadata, parity metadata validation, and generated-app verification. UI item breadth is useful, but it must continue to avoid reimplementing Core behavior.

The optimal end state should not be "clone Radix for Solid" or "wrap Kobalte." Core should be a Solid-native primitive kernel with compound parts and low-level creators. UI should be a copy-paste source layer that styles Core primitives and uses TanStack for app-grade behavior.

## Domain Terms

- `Core`: headless accessible primitive runtime for Solid.
- `UI`: styled source registry, CLI, blocks, templates, and app-layer components.
- `kernel`: private reusable Core internals such as controllable state, focus scope, collection, floating, presence, and form-control.
- `part`: named primitive anatomy exposed through `data-part`.
- `scope`: primitive namespace exposed through `data-scope`.
- `meta.parity`: Mason registry notes describing what a component matches and which gaps remain.
- `runtime-depth parity`: behavioral comparison against Base UI, Kobalte, and more specific references.
- `source-first registry`: Mason installs readable source owned by the user project.

## Current Module Map

### Core Package

`packages/core` is private but has a realistic package shape:

- Public package entry: `@keystone-ui/core`.
- Public subpath exports exist for most current primitives, for example `./dialog`, `./select`, `./popover`, `./tabs`, `./toast`, `./popper`.
- Keystone depends only on `solid-js` and `@floating-ui/dom`.
- It does not depend on UI or TanStack app libraries.
- Internals are mostly private source modules, with public creator APIs exported through primitive subpaths.

Important source clusters:

- `src/utils`: controllable state, event composition, IDs, state data helpers, polymorphic rendering.
- `src/metadata`: docs-ready primitive part metadata and styling contract helpers.
- `src/overlay`: layer stack, focus scope, dismissable layer, outside hiding, prevent scroll, presence, floating adapter, arrow.
- `src/listbox`: collection registration, keyboard delegate, active descendant, typeahead, selection manager, interaction facade.
- `src/form`: form-control ARIA, hidden input helpers, field validity.
- Primitive folders: dialog, popover, hover-card, tooltip, sheet, select, combobox, menu, tabs, date-picker, slider, selection controls, toast, and utilities.

### UI Packages

`packages/mason-registry` owns schema and validation:

- Validates registry documents and item payloads.
- Validates path safety and target safety.
- Resolves registry dependencies deterministically.
- Requires real default registry items to carry non-empty `meta.parity`.

`packages/mason-cli` owns project workflows:

- Solid Vite project detection.
- `init`, `add`, dry-run, install planning, conflict detection, dependency planning.
- Installed metadata, diff, update, remove, doctor.
- Generated app typecheck/build verification in tests.

### Registry

`registry/default` currently contains 37 first-party items:

- Base components: button, badge, card, separator, input, label, textarea, cn.
- Core-backed primitives: dialog, sheet, popover, hover-card, tooltip, accordion, collapsible, tabs, checkbox, switch, radio-group, slider, select/combobox/autocomplete, menu family, date-picker, toast, field.
- UI app-layer components: data-table, data-table-tanstack-router, command-menu, text-field, select-field.
- Block: account-settings.

## Current Call/Data Flow

### Primitive Flow

```txt
Core compound component
  -> create* controller
    -> shared kernel modules
      -> part prop getters
        -> DOM roles, ARIA, data attributes, CSS variables
          -> UI wrapper styling or direct app usage
```

### Overlay Flow

```txt
Dialog/Popover/Menu/Tooltip/Sheet/etc.
  -> open controllable state
  -> Portal/presence
  -> layer stack + dismissable layer
  -> focus scope when modal or focus-managed
  -> outside hiding/inert + prevent scroll where modal
  -> Floating UI DOM adapter for positioned content
  -> stable part data attributes and geometry CSS variables
```

### Collection Flow

```txt
Select/Combobox/Menu/Listbox
  -> collection registration
  -> DOM-order lookup
  -> disabled/group metadata
  -> keyboard delegate
  -> typeahead
  -> active descendant or roving focus
  -> selection manager
  -> hidden input/form reset where form-associated
```

### UI Install Flow

```txt
registry item request
  -> resolve registryDependencies
  -> validate item schema and file targets
  -> plan dependency changes and file writes
  -> detect conflicts and target state
  -> apply writes
  -> record installed metadata
  -> diff/update/remove/doctor can reason about later state
```

## Parity Status Legend

- `Proven`: implemented through shared modules and covered by behavior/focused tests.
- `Strong vertical`: usable and tested, but not complete against Base UI/Kobalte depth.
- `Thin vertical`: initial public surface exists with tests/metadata, but significant parity gaps remain.
- `UI only`: styled source or app-layer component, not Core primitive scope.
- `Missing`: listed in end-state inventory but not implemented as a first-party surface yet.

## Core Kernel State

| Kernel surface                    | Current state                                                                                                                                                                     | Parity direction                                                                                            | End-state API direction                                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Controllable state                | Proven. Shared utility with controlled/uncontrolled state, explicit controlled `undefined`, updater setters, detail-aware callbacks.                                              | Base UI has mature stores; Kobalte has Solid controllable signals. Core should keep the Solid signal shape. | Public utility only if stable enough: `createControllableSignal({ value, defaultValue, onChange })`. Primitive creators hide most usage. |
| Event composition                 | Proven. User handler first, internal behavior skips when `defaultPrevented`.                                                                                                      | Aligns with RFC and Kobalte/Radix precedent.                                                                | Keep DOM `preventDefault()` as first cancellation contract. Add reason constants only when repeated strings become a problem.            |
| Polymorphic rendering             | Proven for callback-style Solid `as`, intrinsic elements, direct components, router-link-like components.                                                                         | Intentionally rejects React clone/Slot behavior from Base UI/Radix.                                         | `<Part as="button" />` and `<Part as={(props) => <A {...props} />}/>` should remain the optimal API.                                     |
| Stable IDs and SSR guards         | Proven through kernel and SSR tests.                                                                                                                                              | Kobalte-style Solid ID generation plus Base UI hydration awareness.                                         | Keep ID stores private. Expose IDs through creator APIs only when wrappers need ARIA relationships.                                      |
| State/data attributes             | Proven through metadata and primitive tests.                                                                                                                                      | Keystone-owned contract, with Base UI/Kobalte as coverage references.                                       | Every part exposes `data-scope` and `data-part`; state attrs are documented in `metadata`.                                               |
| Metadata                          | Proven for current primitive scopes and parts.                                                                                                                                    | UI and docs depend on this for styling contracts.                                                           | Expand into docs generation, API tables, and registry preview metadata.                                                                  |
| Portal                            | Proven. Has `present`, `forceMount`, custom target, cleanup.                                                                                                                      | Similar goal to Radix/Kobalte portal but Solid-native.                                                      | Keep simple. Portal owns placement in DOM, not focus/ARIA behavior.                                                                      |
| Presence                          | Proven for overlay close retention and `forceMount`.                                                                                                                              | Base UI transition status depth, Kobalte transition lifecycle.                                              | Keep private until multiple primitives settle animation APIs. Public data attrs should stay stable.                                      |
| Layer stack and dismissable layer | Proven. Topmost dismissal, branches, preventable outside/Escape, pointer blocking, hiding.                                                                                        | Base UI/Kobalte parity target for overlays.                                                                 | Keep kernel private. Public primitives expose preventable events and modal props, not stack APIs.                                        |
| Focus scope                       | Proven for Dialog and focused tests.                                                                                                                                              | Base UI/Kobalte focus containment and restore.                                                              | Keep private. Public APIs should expose `initialFocus`, `restoreFocus`, `onOpenAutoFocus`, `onCloseAutoFocus` where needed.              |
| Outside hiding/inert              | Proven. Handles dynamic outside DOM and restoration.                                                                                                                              | Base UI/Kobalte modal hiding parity.                                                                        | Keep modal-only. Ensure live announcer and top-layer exceptions stay explicit.                                                           |
| Prevent scroll                    | Strong vertical. Tests include scrollbar compensation and nested locks, but PRD still tracks touch/iOS and primitive-specific scroll nuances as remaining depth.                  | Base UI/Kobalte plus platform behavior.                                                                     | Private utility used by modal overlays. Avoid public scroll-lock package until edge cases are proven.                                    |
| Floating adapter                  | Proven. Wraps `@floating-ui/dom`, exposes geometry variables and arrow positioning.                                                                                               | Floating UI is first-class exception reference.                                                             | Keep direct Floating UI dependency private. Expose placement props and CSS variables on positioners.                                     |
| Listbox/collection                | Strong vertical. DOM order, groups, disabled skip, custom delegates, multiple selection, performance harnesses exist. Hidden item and virtualization support remain future depth. | Kobalte collection/listbox plus Base UI composite list plus React Aria selection details.                   | Keep `createListbox` private until Select/Combobox settle. Future public Listbox can expose Root/Option/Group plus `createListbox`.      |
| Typeahead                         | Strong vertical. Printable search, disabled skip, locale collator, Space during active search. Repeated-letter cycling and hidden-item awareness remain gaps.                     | Base UI/Floating typeahead and Kobalte type select.                                                         | One shared typeahead module used by Select, Combobox, Menu, Listbox.                                                                     |
| Form-control                      | Strong vertical. ARIA relationships, dynamic descriptions/errors, hidden input helpers, validity state. Full Field/Form primitive surface is not fully end-state.                 | Kobalte form-control for Solid shape, Base UI field/form for depth.                                         | Split low-level `FormControl` from UI/TanStack app forms. Core owns native semantics and ARIA.                                           |
| Direction provider                | Proven. Provider/controller, explicit overrides, consumer tests.                                                                                                                  | Kobalte-style direction context plus platform `dir`.                                                        | `Direction.Provider dir="rtl"` and `createDirection` are sufficient. Primitives should accept local override.                            |
| Locale/i18n provider              | Strong vertical. Locale, inferred direction, messages, DatePicker consumers.                                                                                                      | React Aria internationalization is deeper future reference.                                                 | `Locale.Provider locale messages dir` should feed primitive strings without app i18n lock-in.                                            |
| Live announcer                    | Proven as utility.                                                                                                                                                                | React Aria live announcer and Kobalte-style context.                                                        | `LiveAnnouncer.Provider`, `useLiveAnnouncer`, and `createLiveAnnouncer` are enough. Toast and async UI can consume it.                   |

## Core Primitive State

### Utilities And Providers

| Surface        | Current state                                                                                   | Parity and gaps                                                                                 | Optimal API direction                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| AccessibleIcon | Proven utility. Has root/label parts, required label behavior, SSR-safe contract, polymorphism. | Good enough for current scope. Future gap is mostly docs examples and icon-library conventions. | `AccessibleIcon.Root label="..."`, `AccessibleIcon.Label`, `createAccessibleIcon`. Keep it tiny.          |
| VisuallyHidden | Proven utility. Style contract, polymorphism, stable part.                                      | Good enough. Needs only docs and adoption in other primitives as needed.                        | `VisuallyHidden` as a simple component, no heavy namespace needed unless docs require `Root`.             |
| Direction      | Proven provider/controller.                                                                     | Good direction inheritance and local override coverage.                                         | `Direction.Provider`, `Direction.Root`, `createDirection`, `useDirection`.                                |
| Locale         | Strong vertical. Used by DatePicker for messages and direction inference.                       | Needs broader primitive adoption and message inventory before stable i18n promise.              | `Locale.Provider locale dir messages`, `createLocale`, `useLocale`, with primitive-specific message keys. |
| LiveAnnouncer  | Proven utility.                                                                                 | Should be wired into Toast/async primitives more deliberately later.                            | Provider plus controller. Keep caller-owned live region support.                                          |
| Portal         | Proven utility.                                                                                 | Standalone Portal intentionally owns no ARIA/focus.                                             | Public `Portal` should stay minimal: `present`, `forceMount`, `mount`.                                    |
| Popper         | Proven public positioning primitive.                                                            | Strong geometry behavior. Future gaps are more collision examples and nested overlay adoption.  | `Popper.Root`, `Popper.Anchor`, `Popper.Positioner`, `Popper.Arrow`, plus `createPopper`.                 |

### Overlay Primitives

| Surface        | Current state                                                                                                                                                                                   | Parity and gaps                                                                                                                                       | Optimal API direction                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dialog         | Proven baseline modal primitive. Covers open state, portal, backdrop, content, title/description, focus entry/trap/restore, preventable outside/Escape, inert outside, nested layers, presence. | Strongest Core primitive. Remaining depth: alert-dialog variant, richer scroll/touch edge cases, manual AT evidence, docs accessibility spec.         | Keep current anatomy: Root, Trigger, Portal, Backdrop, Positioner, Content, Title, Description, Close. Add `AlertDialog` as a stricter semantic layer, not a forked overlay system.                          |
| Sheet          | Strong vertical. Reuses Dialog-like modal overlay with side data.                                                                                                                               | Good modal behavior inheritance. Gaps: drawer gesture behavior, side-specific animation docs, scroll/touch depth.                                     | `Sheet.Root side`, Trigger, Portal, Backdrop, Positioner, Content, Title, Description, Close. Treat Drawer as later gesture-rich variant.                                                                    |
| Popover        | Strong vertical. Opens from trigger, floating geometry, outside dismissal, arrow.                                                                                                               | Needs deeper non-modal focus policy, nested mixed overlays, modal option decisions, collision docs.                                                   | `Popover.Root open/defaultOpen modal?`, Trigger, Portal, Positioner, Arrow, Content. Keep non-modal default.                                                                                                 |
| HoverCard      | Strong/thin vertical. Has open delay/close delay, hover/focus behavior, pointer grace area, floating parts.                                                                                     | Gaps: touch policy, nested hoverable content edge cases, richer preview-card semantics.                                                               | `HoverCard.Root openDelay closeDelay`, Trigger as anchor, Portal/Positioner/Arrow/Content. Keep it separate from Tooltip because content can be interactive.                                                 |
| Tooltip        | Strong vertical. Provider delay, skip-delay after close, hoverable content grace polygon, aria-describedby, Escape.                                                                             | Gaps: complete provider grouping docs, touch/long-press policy, disabled trigger guidance, manual AT evidence.                                        | `Tooltip.Provider delayDuration skipDelayDuration`, `Tooltip.Root`, Trigger, Portal, Positioner, Arrow, Content. Keep non-interactive semantics by default.                                                  |
| Menu           | Strong vertical. Keyboard navigation, typeahead, item roles, checkbox/radio items, groups, separators, submenus, Escape, floating.                                                              | Gaps: submenu pointer grace, scroll buttons, modal nuances, checked item APIs, touch behavior.                                                        | `Menu.Root`, Trigger, Portal, Positioner, Content, Group, GroupLabel, Separator, Item, ItemIndicator, CheckboxItem, RadioGroup, RadioItem, SubmenuRoot/SubmenuTrigger/SubmenuContent eventually.             |
| DropdownMenu   | Strong vertical as scoped Menu alias.                                                                                                                                                           | Shares Menu strengths and gaps. Needs docs to distinguish trigger-driven menu from generic Menu.                                                      | Re-export Menu namespace with dropdown scope and default trigger semantics.                                                                                                                                  |
| ContextMenu    | Strong vertical as scoped Menu alias with virtual anchor.                                                                                                                                       | Native `contextmenu` tested. Needs touch/long-press and collision/nested menu depth.                                                                  | `ContextMenu.Root`, Trigger, Portal/Content. Keep virtual anchor private.                                                                                                                                    |
| Menubar        | Strong vertical as scoped Menu alias with `menubar` root role.                                                                                                                                  | Needs deeper menubar-specific roving root, submenu intent, disabled focus policy.                                                                     | `Menubar.Root`, Menu-like item/submenu parts. Should share collection/list navigation but own root orientation semantics.                                                                                    |
| NavigationMenu | Thin to strong vertical. It reuses menu kernel and has navigation scope, routed link behavior, typeahead, items.                                                                                | Remaining gaps: viewport, popup-specific layout APIs, animation metadata, touch pointer intent, richer navigation content composition.                | Should not just be Menu forever. End-state needs Root/List/Item/Trigger/Content/Viewport/Indicator/Link plus overlay positioning where content is floating.                                                  |
| Toast          | Strong vertical. Manager/provider/store, viewport, root/title/description/action/close, duration, limit, update/dismiss, live regions, pause on interaction.                                    | Gaps: promise/loading transitions, swipe gestures, viewport hotkey, progress track, window blur pause, geometry/placement variants, manual SR checks. | `createToastManager`, `toaster`, `Toast.Provider`, `Toast.Viewport`, `Toast.Root`, Title, Description, Action, Close. Add `toast.promise` style helpers in UI or Core only after lifecycle semantics settle. |
| AlertDialog    | Missing.                                                                                                                                                                                        | Should build on Dialog but require title/description and initial least-destructive action semantics.                                                  | `AlertDialog.Root`, Trigger, Portal, Backdrop, Positioner, Content, Title, Description, Action, Cancel. Use Dialog kernel.                                                                                   |
| Drawer         | Missing as gesture-rich primitive.                                                                                                                                                              | Sheet covers side modal today. Drawer should add drag/swipe and responsive edge behavior later.                                                       | Either alias Sheet initially or introduce `Drawer.Root` only when pointer gesture engine exists.                                                                                                             |
| PreviewCard    | Missing.                                                                                                                                                                                        | Likely similar to HoverCard with richer preview semantics.                                                                                            | Defer until HoverCard and Popover are stable.                                                                                                                                                                |

### Collection And Choice Primitives

| Surface           | Current state                                                                                                                                                                                                 | Parity and gaps                                                                                                                                                                  | Optimal API direction                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select            | Strong vertical. Controlled/uncontrolled open/value, multiple values, hidden inputs, form reset/external owner/sync, readonly, groups, dynamic DOM order, keyboard navigation, typeahead, floating variables. | Gaps: scroll arrows, richer section APIs, hidden item awareness, virtualization hooks, item equality customization, more modal/non-modal popup policy, deeper focus restoration. | `Select.Root`, Trigger, Value, Portal, Positioner, Arrow, Content, Listbox, Group, GroupLabel, Item, ItemText, ItemIndicator, HiddenInput internal. Creator returns prop getters and list/form APIs.             |
| Combobox          | Strong vertical. Input open/highlight/select, hidden input and reset, clear button, Autocomplete scoped alias.                                                                                                | Gaps: async filtering helpers, inline completion, detached trigger policies, virtualized lists, multi-select/chips, grouped filtering, active descendant edge cases.             | `Combobox.Root inputValue/value`, Input, Trigger, Clear, Portal, Positioner, Arrow, Content, Listbox, Group, Item, ItemText, ItemIndicator. Filtering should be user-owned unless Core needs accessibility glue. |
| Autocomplete      | Strong vertical as Combobox-scoped alias.                                                                                                                                                                     | Needs product distinction from Combobox. If behavior is identical, UI may own styled naming.                                                                                     | Keep as `createAutocomplete` only if ARIA semantics or docs differ. Otherwise prefer Combobox with UI Autocomplete wrapper.                                                                                      |
| Listbox           | Internal strong vertical, metadata exists but no public subpath export.                                                                                                                                       | Gaps: hidden item awareness, virtualization, stable public API decision.                                                                                                         | Eventually public: `Listbox.Root`, Option, Group, GroupLabel; `createListbox`. It should be the base for Select/Combobox/Menu where roles align.                                                                 |
| Command primitive | Missing in Keystone; UI has command-menu using Combobox plus TanStack Store/Hotkeys.                                                                                                                          | Good boundary: app-level command orchestration belongs to UI.                                                                                                                    | Add Core Command only if Combobox/Listbox cannot express command accessibility. Otherwise UI CommandMenu should remain composed source.                                                                          |

### Forms And Fields

| Surface                            | Current state                                                                                                                  | Parity and gaps                                                                                              | Optimal API direction                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| FormControl                        | Strong vertical in `form` module. ARIA label/description/error relationships, hidden input props, state data, validity helper. | Gaps: full public compound anatomy, fieldset grouping, reset listener depth, full validation lifecycle docs. | Expose `FormControl.Root`, Label, Control, Description, ErrorMessage, HiddenInput only when API is stable. Keep validation native-first. |
| Field                              | UI item exists, Core form-control exists.                                                                                      | UI styled field is useful, but Core Field primitive needs clearer public package shape.                      | Core Field should be a semantic wrapper around FormControl, not TanStack Form. UI Form/TanStackField own app validation.                 |
| Label                              | UI base item exists. Keystone label behavior is part of form-control, not standalone yet.                                      | Standalone Keystone Label may be useful for native controls.                                                 | `Label.Root for` can exist as a tiny primitive if composition proves need.                                                               |
| TextField / TextArea / SearchField | UI items exist for input/textarea/text-field; Keystone TextField not implemented as separate primitive.                        | Core should avoid replacing native input unless it adds ARIA/form behavior.                                  | UI should provide styled source. Core should provide FormControl and maybe TextField only for cross-part relationships.                  |
| Fieldset                           | Missing.                                                                                                                       | Needed for grouped fields and radio/checkbox groups.                                                         | `Fieldset.Root`, Legend, Description, ErrorMessage with shared form-control state.                                                       |
| ErrorMessage / Description         | Present as form-control concepts.                                                                                              | Needs public component surface if Field becomes public.                                                      | Keep ID registration and `aria-describedby` composition in Keystone.                                                                     |

### Disclosure And Structure

| Surface     | Current state                                                                                                                          | Parity and gaps                                                                                       | Optimal API direction                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Collapsible | Thin to strong vertical. Controlled/uncontrolled, trigger/content, ARIA, hidden-until-found/beforematch, disabled, preventable events. | Gaps: measured CSS vars, transition lifecycle docs, broader browser-find tests.                       | `Collapsible.Root`, Trigger, Content, `forceMount`, `hiddenUntilFound`, `onOpenChange`.           |
| Accordion   | Thin to strong vertical. Single/multiple, item/header/trigger/content, orientation, keyboard trigger navigation.                       | Gaps: measured panel variables, transition lifecycle, RTL horizontal behavior, disabled focus policy. | `Accordion.Root type="single                                                                      | multiple" collapsible`, Item, Header, Trigger, Content. Use shared disclosure and roving focus. |
| Tabs        | Strong vertical. ARIA tablist, roving focus, manual/automatic activation, RTL horizontal arrows, controlled state, prevented events.   | Gaps: `forceMount`/keepMounted, measured indicator CSS vars, panel focus policy examples.             | `Tabs.Root value/defaultValue activationMode orientation dir`, List, Trigger, Indicator, Content. |

### Selection Controls And Inputs

| Surface              | Current state                                                                                                      | Parity and gaps                                                                                                    | Optimal API direction                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkbox             | Strong vertical. Indeterminate, controlled/uncontrolled, keyboard, hidden input, form reset/sync, data states.     | Gaps: cursor/touch press behavior, richer label composition, validation edge cases, hydration edge tests.          | `Checkbox.Root`, Control, Indicator, HiddenInput. Keep native form participation.                                                                  |
| Switch               | Strong vertical. Checked state, role, hidden input, reset, preventable toggle.                                     | Gaps similar to Checkbox, plus clearer switch vs checkbox semantics in docs.                                       | `Switch.Root`, Control, Thumb, HiddenInput.                                                                                                        |
| RadioGroup           | Strong vertical. Roving focus, keyboard selection, disabled skip, hidden inputs, external reset.                   | Gaps: RTL horizontal behavior, toolbar/nested coordination, richer label composition.                              | `RadioGroup.Root`, Item, ItemIndicator, HiddenInput. Consider `Radio` standalone only if needed.                                                   |
| Slider               | Strong vertical. Keyboard, pointer track, controlled/uncontrolled, hidden input, readonly, CSS vars.               | Gaps: advanced pointer/touch, min thumb distance, multi-thumb lifecycle, field/validation semantics, tick helpers. | `Slider.Root`, Track, Range, Thumb, HiddenInput. API should support `value: number[]`, min/max/step/orientation, `onValueChange`, `onValueCommit`. |
| Toolbar              | Strong vertical. Root role/orientation, roving focus, RTL arrows, disabled skip, pressed button state, separators. | Gaps: richer item registration, nested composite coordination, toggle groups.                                      | `Toolbar.Root`, Button, Link, Separator. Keep behavior primitive-level and styling UI-owned.                                                       |
| NumberField          | Missing.                                                                                                           | Needs spinbutton semantics, parser/formatter, locale, increment/decrement, form integration.                       | `NumberField.Root`, Label via FormControl, Input, IncrementTrigger, DecrementTrigger, ScrubArea later.                                             |
| Toggle / ToggleGroup | Missing.                                                                                                           | Can reuse selection-control and toolbar/list navigation kernels.                                                   | `Toggle.Root pressed/defaultPressed`; `ToggleGroup.Root type value`, Item.                                                                         |
| SegmentedControl     | Missing.                                                                                                           | Related to ToggleGroup/RadioGroup.                                                                                 | Likely UI styled component over RadioGroup or ToggleGroup unless unique behavior appears.                                                          |
| OTPField             | Missing.                                                                                                           | Needs focus management, paste handling, hidden value, form integration.                                            | `OTPField.Root`, Input slots, HiddenInput. Use proven library references before custom behavior.                                                   |
| FileField            | Missing.                                                                                                           | Native file input wrapper plus drag/drop later.                                                                    | Keep native input behavior. UI can style.                                                                                                          |
| RatingGroup          | Missing.                                                                                                           | Needs radio-like semantics and pointer/keyboard behavior.                                                          | Build over single selection and roving focus.                                                                                                      |

### Feedback And Display

| Surface                      | Current state                                                     | Parity and gaps                                                                               | Optimal API direction                                                                                   |
| ---------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Separator                    | UI item exists, Core metadata does not list standalone separator. | Simple enough for UI/native element unless Keystone direction/orientation contract is needed. | Core `Separator.Root orientation decorative?` can be tiny. UI should style it.                          |
| Progress / Meter             | Missing.                                                          | Native roles and value semantics.                                                             | `Progress.Root`, Track, Range, Label/ValueText maybe. `Meter` similar but semantic distinctions matter. |
| ScrollArea                   | Missing.                                                          | Needs strong accessibility and pointer behavior.                                              | Defer. Prefer native overflow unless custom scrollbars are necessary.                                   |
| Avatar / Image / AspectRatio | UI inventory, Keystone missing.                                   | Display utilities, not kernel priorities.                                                     | UI can own styled display. Core only if fallback/loading accessibility behavior is non-trivial.         |

### Complex Later Primitives

| Surface                                              | Current state                                                                                                                | Parity and gaps                                                                                            | Optimal API direction                                                                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Calendar                                             | Thin to strong vertical. Single/range selection, unavailable dates, month navigation, locale week starts, keyboard movement. | Gaps: alternate calendars, multi-month, richer focus management, validation/form semantics.                | `Calendar.Root`, Header, PrevTrigger, NextTrigger, Heading, Grid, Row, Cell, CellTrigger. Keep date values serializable.   |
| DatePicker                                           | Thin vertical over Calendar plus overlay.                                                                                    | Gaps: date field segment editing, focus restore depth, validation, multi-month/range UX, locale calendars. | `DatePicker.Root`, Trigger, Portal, Positioner/Content, Calendar. Later `DateField`/segments should be separate internals. |
| DateField / DateRangePicker / TimeField / TimePicker | Missing.                                                                                                                     | React Aria/Kobalte depth needed before implementation.                                                     | Build after calendar/date value/i18n internals stabilize. Use segment APIs, not freeform string parsing alone.             |
| Color primitives                                     | Missing.                                                                                                                     | Specialized and later.                                                                                     | Defer until core forms/overlays/collections are stable.                                                                    |

## Mason Registry State

### Registry Infrastructure

Mason registry infrastructure is comparatively mature for this stage:

- Real default registry items validate.
- First-party items must include `meta.parity`.
- Unsafe paths, symlink escapes, duplicate targets, missing dependencies, invalid dependency specifiers, and cycles are tested.
- CLI can install real default slices into generated Solid apps and typecheck/build them.
- Lifecycle commands exist: diff, update, remove, doctor.

Primary gap: docs and registry preview are ahead of package publication, but not yet a full public distribution story.

### UI Item Parity Table

| Item                                                                  | Kind                 | Current parity reference                           | State                                                                            |
| --------------------------------------------------------------------- | -------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `button`                                                              | base UI source       | Base UI, Kobalte                                   | UI only. Good starter source item, no Core behavior needed yet.                  |
| `badge`                                                               | display              | Base UI, Kobalte                                   | UI only. Parity is anatomy/styling, not runtime behavior.                        |
| `card`                                                                | layout               | Base UI, Kobalte                                   | UI only. Should stay styled source.                                              |
| `separator`                                                           | layout               | Base UI, Kobalte                                   | UI only or tiny Keystone later.                                                  |
| `input`, `textarea`, `label`                                          | base form            | Base UI, Kobalte                                   | UI native wrappers. Should compose Field/FormControl where needed.               |
| `field`                                                               | form composition     | Base UI, Kobalte                                   | UI styled wrapper over Core form-control concepts.                               |
| `dialog`, `sheet`, `popover`, `hover-card`, `tooltip`                 | overlay              | Base UI, Kobalte                                   | Good Core-backed direction. Must not reimplement focus/dismissal.                |
| `accordion`, `collapsible`, `tabs`                                    | structure/disclosure | Base UI, Kobalte                                   | Useful thin wrappers. Need deeper primitive parity before heavy block usage.     |
| `checkbox`, `switch`, `radio-group`, `slider`                         | input                | Base UI, Kobalte, TanStack Ranger for slider       | Good Core-backed wrappers. Need field integration and validation examples.       |
| `select-field`, `text-field`                                          | TanStack form fields | TanStack Form plus primitive references            | Correct UI app-layer ownership. Should stay generated source, not Keystone.      |
| `combobox`, `autocomplete`                                            | listbox/input        | Base UI, Kobalte                                   | Good wrapper direction. Filtering/app search helpers should be UI or user-owned. |
| `menu`, `dropdown-menu`, `context-menu`, `menubar`, `navigation-menu` | overlay/navigation   | Base UI, Kobalte                                   | Good coverage, but NavigationMenu needs its own richer anatomy later.            |
| `date-picker`                                                         | form/calendar        | Base UI, Kobalte                                   | Useful early wrapper. Needs deeper date field and validation before stable.      |
| `toast`                                                               | notification         | Base UI, Kobalte, Sonner                           | Good source item. Promise/swipe/progress behavior remains future.                |
| `toolbar`                                                             | actions/composite    | Base UI, Kobalte                                   | Good wrapper over Keystone toolbar.                                              |
| `command-menu`                                                        | app command surface  | Base UI, Kobalte, TanStack Store, TanStack Hotkeys | Correctly UI app-layer. Should remain source-owned by app.                       |
| `data-table`                                                          | app table            | TanStack Table, shadcn                             | Correct UI app-layer. No Keystone dependency expected.                           |
| `data-table-tanstack-router`                                          | table/router adapter | TanStack Router, TanStack Table                    | Correct as optional app integration item.                                        |
| `account-settings`                                                    | block                | UI, shadcn                                         | Good first block proving dependency composition.                                 |
| `cn`                                                                  | utility              | UI, shadcn                                         | Good registry primitive utility.                                                 |

## End-State API Principles

### 1. Compound UI Plus Creators

Every meaningful Core primitive should expose both:

```tsx
<Dialog.Root open={open()} onOpenChange={setOpen}>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
```

and:

```ts
const dialog = createDialog({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  modal: () => props.modal ?? true,
  onOpenChange: props.onOpenChange,
});
```

Compound components serve app authors and design-system wrappers. Creators serve custom composition and advanced wrappers. They must share behavior rather than duplicate logic.

### 2. Solid-Native Props

Use Solid values at component boundaries:

```tsx
<Select.Root value={value()} onValueChange={setValue} />
```

Use accessors in creators:

```ts
createSelect({
  value: () => props.value,
  open: () => props.open,
});
```

Do not port React `forwardRef`, `cloneElement`, `Slot`, or `asChild` as primary APIs.

### 3. Polymorphism

Basic:

```tsx
<Dialog.Trigger as="button">Open</Dialog.Trigger>
```

Advanced:

```tsx
<Dialog.Trigger
  as={(triggerProps) => (
    <A href="/settings" {...triggerProps}>
      Settings
    </A>
  )}
/>
```

This is the right Solid escape hatch because it makes prop merging explicit.

### 4. Event Detail Shape

Change handlers should accept the next value plus detail:

```ts
onOpenChange?: (open: boolean, detail: { event?: Event; reason: string }) => void;
onValueChange?: (value: string | undefined, detail: { event?: Event; reason: string }) => void;
```

Use DOM `preventDefault()` for preventable DOM-triggered behavior:

```tsx
<Dialog.Content onPointerDownOutside={(event) => event.preventDefault()} />
```

Add richer cancellable detail objects only when DOM events cannot represent the cancellation.

### 5. Stable Styling Contract

Every part:

```html
data-scope="select" data-part="item"
```

State:

```html
data-state="open" data-highlighted data-selected data-disabled
```

Geometry:

```css
--keystone-anchor-width
--keystone-anchor-height
--keystone-available-width
--keystone-available-height
--keystone-transform-origin
--keystone-arrow-x
--keystone-arrow-y
```

This contract is Keystone-owned. Inspiration libraries guide coverage, not naming.

### 6. UI Source Ownership

UI should generate readable source:

```tsx
import { Dialog as DialogPrimitive } from "@keystone-ui/core/dialog";
import { splitProps } from "solid-js";
import { cn } from "~/lib/cn";

export function DialogContent(props: DialogPrimitive.DialogContentProps) {
  const [, contentProps] = splitProps(props, ["class"]);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop class={cn("...", props.class)} />
      <DialogPrimitive.Positioner>
        <DialogPrimitive.Content {...contentProps} class={cn("...", props.class)} />
      </DialogPrimitive.Positioner>
    </DialogPrimitive.Portal>
  );
}
```

UI should not hide behavior in a UI runtime package when source ownership is the product promise.

### 7. TanStack Boundary

Keystone:

- No TanStack Form/Table/Store/Hotkeys.
- Owns intrinsic primitive behavior.

UI:

- Uses TanStack Form for app-grade form state.
- Uses TanStack Table for data tables.
- Uses TanStack Store/Hotkeys for command surfaces.
- Uses TanStack Router for route-aware templates and optional adapters.

## Recommended End-State APIs By Family

### Dialog / AlertDialog / Sheet

Target:

```tsx
<Dialog.Root
  open={open()}
  defaultOpen={false}
  modal
  onOpenChange={(open, detail) => {}}
  onOpenChangeComplete={(open, detail) => {}}
>
  <Dialog.Trigger />
  <Dialog.Portal forceMount>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content
        initialFocus={initialRef}
        restoreFocus
        onOpenAutoFocus={(event) => {}}
        onCloseAutoFocus={(event) => {}}
        onEscapeKeyDown={(event) => {}}
        onPointerDownOutside={(event) => {}}
        onFocusOutside={(event) => {}}
        onInteractOutside={(event) => {}}
      >
        <Dialog.Title />
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
```

Keep Sheet as side-aware Dialog. Add Drawer only for gesture behavior. Add AlertDialog as a stricter semantic wrapper.

### Popover / HoverCard / Tooltip

Target:

```tsx
<Popover.Root
  open={open()}
  onOpenChange={setOpen}
  modal={false}
  placement="bottom-start"
  sameWidth
  fitViewport
>
  <Popover.Trigger />
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Arrow />
      <Popover.Content />
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

Tooltip should have provider-level delay policy. HoverCard should allow interactive content and pointer grace. Popover should remain the generic disclosure overlay.

### Select

Target:

```tsx
<Select.Root
  name="project"
  value={value()}
  defaultValue="alpha"
  onValueChange={setValue}
  open={open()}
  onOpenChange={setOpen}
  disabled={disabled()}
  required
  invalid={hasError()}
  readOnly={readOnly()}
  placement="bottom-start"
  sameWidth
>
  <Select.Trigger>
    <Select.Value placeholder="Choose project" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Arrow />
      <Select.Content>
        <Select.Listbox>
          <Select.Group value="team" label="Team">
            <Select.GroupLabel />
            <Select.Item value="alpha" label="Alpha">
              <Select.ItemText />
              <Select.ItemIndicator />
            </Select.Item>
          </Select.Group>
        </Select.Listbox>
      </Select.Content>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

Before stable release, close gaps around virtualization, scroll buttons, hidden items, focus restoration, and item equality.

### Combobox / Autocomplete

Target:

```tsx
<Combobox.Root
  name="assignee"
  inputValue={input()}
  onInputValueChange={setInput}
  value={value()}
  onValueChange={setValue}
  onOpenChange={setOpen}
>
  <Combobox.Input />
  <Combobox.Trigger />
  <Combobox.Clear />
  <Combobox.Portal>
    <Combobox.Positioner>
      <Combobox.Content>
        <Combobox.Listbox>
          <Combobox.Item value="erik" label="Erik" />
        </Combobox.Listbox>
      </Combobox.Content>
    </Combobox.Positioner>
  </Combobox.Portal>
</Combobox.Root>
```

Filtering should remain user-owned by default. Core should own ARIA, focus, active descendant, listbox relationship, selection, and form serialization.

### Menu Family

Target:

```tsx
<DropdownMenu.Root open={open()} onOpenChange={setOpen}>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Positioner>
      <DropdownMenu.Content>
        <DropdownMenu.Item value="rename" label="Rename" />
        <DropdownMenu.CheckboxItem checked={enabled()} value="sync" label="Sync" />
        <DropdownMenu.RadioGroup value={density()} onValueChange={setDensity}>
          <DropdownMenu.RadioItem value="compact" label="Compact" />
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Positioner>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

Menu, DropdownMenu, ContextMenu, and Menubar can share the kernel. NavigationMenu needs a richer end-state anatomy with viewport and link/content layout.

### Field / FormControl

Target:

```tsx
<Field.Root name="email" required invalid={!!error()}>
  <Field.Label>Email</Field.Label>
  <Field.Control as="input" type="email" />
  <Field.Description>Use your work email.</Field.Description>
  <Field.ErrorMessage>{error()}</Field.ErrorMessage>
</Field.Root>
```

Core should own ARIA and native form semantics. UI should own styled field layout and TanStack Form integration:

```tsx
<TanStackField name="email">{(field) => <TextField field={field} label="Email" />}</TanStackField>
```

### Date Picker

Target:

```tsx
<DatePicker.Root value={date()} onValueChange={setDate} locale="sv-SE">
  <DatePicker.Trigger />
  <DatePicker.Portal>
    <DatePicker.Positioner>
      <DatePicker.Content>
        <DatePicker.Calendar>
          <Calendar.Header>
            <Calendar.PrevTrigger />
            <Calendar.Heading />
            <Calendar.NextTrigger />
          </Calendar.Header>
          <Calendar.Grid />
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Positioner>
  </DatePicker.Portal>
</DatePicker.Root>
```

Long term, DateField segment editing should be separate and reusable by DatePicker and DateRangePicker.

### Toast

Target:

```tsx
const toaster = createToastManager({ limit: 5, duration: 5000 });

<Toast.Provider manager={toaster}>
  <Toast.Viewport placement="bottom-end">
    {(toast) => (
      <Toast.Root toast={toast}>
        <Toast.Title />
        <Toast.Description />
        <Toast.Action />
        <Toast.Close />
      </Toast.Root>
    )}
  </Toast.Viewport>
</Toast.Provider>;
```

Future helpers can add:

```ts
toaster.promise(saveProject(), {
  loading: "Saving...",
  success: "Saved",
  error: "Could not save",
});
```

Only add this after lifecycle, update, dismiss, and live-region semantics are stable.

## Main Gaps To Close Next

1. Write stable accessibility specs for the strongest primitives: Dialog, Select, Popover, Tooltip, Menu, Combobox, Tabs, Field/FormControl.
2. Update older vertical docs whose "thin" language is stale compared to the current PRD ledger and tests.
3. Promote or explicitly keep private the internal Listbox API.
4. Deepen Select and Combobox: hidden items, virtualization strategy, scroll affordances, repeated-letter typeahead, focus restoration, async filtering examples.
5. Split NavigationMenu from generic Menu where viewport/content/link anatomy requires it.
6. Make Field/FormControl public shape clearer before building more UI field wrappers.
7. Decide AlertDialog API and implement it on Dialog internals.
8. Deepen date work only after deciding DateField segment APIs and calendar locale scope.
9. Add manual accessibility evidence process before any "stable" claim.
10. Keep Mason registry breadth subordinate to Core runtime depth.

## What To Avoid

- Treating `meta.parity` as compatibility with Base UI/Kobalte. It is a concise coverage and gap note.
- Adding UI wrappers that duplicate focus traps, typeahead, select, combobox, menu, dialog, or listbox behavior.
- Exporting private kernel modules as public API before two or more primitives prove the shape.
- Letting TanStack app-layer dependencies enter Keystone.
- Treating React Aria, Radix, Base UI, or Zag APIs as copy targets. They are reference systems.
- Broadly adding missing end-state components before Dialog, Select, Combobox, Menu, Field, and DatePicker have written specs and deeper parity closure.

## Bottom Line

The repo is in a credible early-alpha state. Keystone has enough shared kernel to justify continuing depth work rather than restarting architecture. UI has a solid registry/CLI foundation and enough first-party items to prove the distribution model.

The optimal solution is to keep converging on this shape:

```txt
Core private kernel
  -> Keystone Solid-native primitive creators
    -> Core compound parts with stable data/CSS contracts
      -> UI copy-paste styled source
        -> UI TanStack-backed app components and blocks
```

The next high-leverage work is not more catalog breadth. It is parity closure and specification for the primitives that already prove the architecture.
