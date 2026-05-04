# Primitive Research Notes

## Status

Draft

## Date

2026-05-04

## Purpose

This is a working notebook for inspiration repos cloned under `inspo/`. Use it to compare API shape, primitive internals, accessibility depth, registry architecture, and data-dense app patterns before changing Keystone or UI.

Do not copy source from these repos. Extract product and architecture lessons, then implement Solid-native Keystone Core/UI APIs that fit the decisions in:

- [CONTEXT.md](../../CONTEXT.md)
- [Core Internals Inspiration Map](../agents/core-internals-inspiration-map.md)
- [Mason Registry Inspiration Map](ui-shadcn-reference-registry-map.md)
- [ADR 0001: Keystone Core And UI Product Boundary](../adr/0001-keystone-core-ui-boundary.md)
- [ADR 0003: UI TanStack App Layer](../adr/0003-ui-tanstack-app-layer.md)

## Research Priorities

1. Solid-native API and composition: Kobalte, corvu, solid-primitives.
2. Runtime depth and state architecture: Base UI, Zag, Ark, Radix, React Aria, Ariakit.
3. Overlay kernel: Kobalte, Base UI, Floating UI, Radix, corvu.
4. Collection/select/combobox kernel: Kobalte, Base UI, React Aria/Stately, Ariakit, Zag.
5. Mason registry and generated source: shadcn registry-template and shadcn/ui.
6. UI app-layer components: TanStack Table, Virtual, Router, and Lightweight Charts.

## Kobalte

Reference paths:

- `inspo/kobalte/packages/core/src/primitives`
- `inspo/kobalte/packages/core/src/dismissable-layer`
- `inspo/kobalte/packages/core/src/form-control`
- `inspo/kobalte/packages/core/src/popper`
- `inspo/kobalte/packages/core/src/select`
- `inspo/kobalte/packages/core/src/combobox`

### What I Like

- Best Solid-native primitive reference in this set.
- Clear decomposition into low-level Solid primitives such as controllable signal, disclosure state, DOM collection, focus scope, hide outside, interact outside, and transition.
- Strong alignment with Keystone's target anatomy model: compound component parts, context-backed composition, form-control wiring, and stable DOM contracts.
- Overlay internals are close to Keystone's needed kernel: focus scope, dismissable layer, Escape handling, outside hiding, transitions, and popper.
- Select/Combobox show how to compose form-control, listbox, selection, collection, hidden select, and positioning in Solid.

### What I Dislike

- Broad component surface can hide which internals are essential for Keystone's first quality pass.
- Some public APIs should be treated as precedent, not destination. Core needs its own naming, event details, data attribute contract, and RFC-aligned `as` shape.
- Styling/package-specific choices are not Keystone concerns.

### API Ideas For Keystone

- Keep Solid accessors and setters at the API boundary: `<Dialog.Root open={open()} onOpenChange={setOpen} />` and `createDialog({ open: () => props.open })`.
- Model Core internals after Kobalte's small primitive modules, but keep private until Dialog, Select, and Form prove the contracts.
- Standardize `data-scope` and `data-part` at every part, with boolean/state attrs layered through a shared helper.
- Use Kobalte as the default Solid-native parity note for Mason registry items backed by Core primitives.

## corvu

Reference paths:

- `inspo/corvu/packages/dialog/src`
- `inspo/corvu/packages/popover/src`
- `inspo/corvu/packages/tooltip/src`
- `inspo/corvu/packages/solid-dismissible/src`
- `inspo/corvu/packages/solid-focus-trap/src`
- `inspo/corvu/packages/solid-presence/src`
- `inspo/corvu/packages/solid-prevent-scroll/src`
- `inspo/corvu/packages/utils/src`

### What I Like

- Modern Solid-specific package layout with small focused internals.
- Useful comparison point for making Core APIs feel lighter than older primitive libraries.
- Separate packages for dismissible behavior, focus trap, presence, prevent scroll, list behavior, persistence, and utilities are good kernel-boundary inspiration.
- Good reminder that SSR support and ergonomic composition should be designed into primitives early, not patched onto them.

### What I Dislike

- Smaller surface than Kobalte/Base UI/React Aria, so it is less useful as the final accessibility-depth reference.
- Some package granularity may be too fragmented for Keystone if Keystone publishes one public package with subpath exports.

### API Ideas For Keystone

- Keep internals small and individually testable even if they ship from one Core package.
- Compare corvu overlay ergonomics against Kobalte before committing to Dialog/Popover public props.
- Use corvu as a pressure test for whether Core compound APIs are too heavy.

## solid-primitives

Reference paths:

- `inspo/solid-primitives/packages/controlled-props`
- `inspo/solid-primitives/packages/event-listener`
- `inspo/solid-primitives/packages/event-props`
- `inspo/solid-primitives/packages/keyboard`
- `inspo/solid-primitives/packages/active-element`
- `inspo/solid-primitives/packages/autofocus`
- `inspo/solid-primitives/packages/bounds`
- `inspo/solid-primitives/packages/i18n`
- `inspo/solid-primitives/packages/list`

### What I Like

- Strong reference for small, focused Solid utility APIs.
- Test layout is useful for Core kernel modules that should be proven independently from visible components.
- Event, keyboard, active element, bounds, and controlled props utilities map directly to Core internals.
- Community package structure shows how to keep primitive utilities narrow without turning everything into a component.

### What I Dislike

- It is not a headless component library, so it will not answer full Dialog/Select/Combobox behavior questions alone.
- Utilities are intentionally generic; Keystone still needs stronger primitive-specific event reasons, data attributes, ARIA contracts, and form semantics.

### API Ideas For Keystone

- Use this as the style reference for low-level `create*` APIs: small input objects, Solid accessors, and testable return values.
- Prefer independent utility tests before wiring helpers into full primitives.
- Avoid building a broad generic utility package until repeated primitive needs justify it.

## Ark UI

Reference paths:

- `inspo/ark/packages/solid/src/components`
- `inspo/ark/packages/solid/src/providers`
- `inspo/ark/packages/solid/src/utils`
- `inspo/ark/packages/react/src/components`
- `inspo/ark/packages/vue/src/components`
- `inspo/ark/packages/svelte/src`

### What I Like

- Shows how one headless component vocabulary can be adapted across Solid, React, Vue, and Svelte.
- Useful for anatomy, parts, providers, and generated/adapter-style API parity.
- Solid package is a direct comparison for Keystone's public compound components.
- It proves which components benefit from machine-backed behavior without forcing every API to expose machine concepts.

### What I Dislike

- Cross-framework parity can bias APIs toward the lowest common denominator.
- Core should not inherit Ark's framework-neutral shape when a Solid-native shape is better.
- Machine adapters add conceptual overhead for simple primitives.

### API Ideas For Keystone

- Study component anatomy naming for components such as Dialog, Menu, Select, Tooltip, Tabs, Slider, and Date Picker.
- Use Ark as a parity reference when deciding whether Core public APIs should stay stable across future wrappers.
- Do not expose state machine internals publicly unless Keystone users gain clear value.

## Zag.js

Reference paths:

- `inspo/zag/packages/machines`
- `inspo/zag/packages/machines/select`
- `inspo/zag/packages/machines/combobox`
- `inspo/zag/packages/machines/dialog`
- `inspo/zag/packages/machines/menu`
- `inspo/zag/packages/machines/date-picker`
- `inspo/zag/packages/utilities`
- `inspo/zag/packages/frameworks/solid`

### What I Like

- Best reference for explicit finite-state behavior in accessible components.
- Machine folders make complex component state, events, guards, effects, and derived props easier to inspect.
- Utilities cover exactly the hard Keystone areas: collection, dismissable, focus trap, interact outside, popper, remove scroll, live region, i18n, hotkeys, and DOM query.
- Framework adapters show how behavior can be decoupled from rendering.

### What I Dislike

- State machine architecture can be too heavy for Keystone's smallest primitives.
- Public machine-centric APIs may feel alien to Solid users if applied everywhere.
- Core should not inherit Zag's abstraction layers wholesale before proving Dialog and Select.

### API Ideas For Keystone

- Use machines for design analysis first: identify states, events, guards, and effects for Select, Combobox, Menu, Dialog, Popover, Toast, Slider, and Date Picker.
- Consider internal statechart-style organization for complex primitives, but keep Keystone's public API Solid-native.
- Reuse the idea of connector functions that derive part props from state, but express the result through Solid components and `create*` primitives.

## Base UI

Reference paths:

- `inspo/base-ui/packages/react/src/internals`
- `inspo/base-ui/packages/react/src/floating-ui-react`
- `inspo/base-ui/packages/react/src/dialog`
- `inspo/base-ui/packages/react/src/field`
- `inspo/base-ui/packages/react/src/form`
- `inspo/base-ui/packages/react/src/select`
- `inspo/base-ui/packages/react/src/combobox`
- `inspo/base-ui/packages/react/src/menu`

### What I Like

- Strongest runtime-depth reference for modern headless primitives.
- Excellent coverage of fields/forms, overlays, floating positioners, collections, list navigation, typeahead, and event details.
- Internal files make it easier to identify shared kernel modules rather than solving the same behavior per primitive.
- Useful test strategy reference for tricky behavior around popups, focus, form state, and positioning.

### What I Dislike

- React rendering machinery does not translate directly to Solid.
- Stores, refs, render element helpers, and React event assumptions must not drive Core API shape.
- API sophistication can tempt overbuilding before Keystone has stable internals.

### API Ideas For Keystone

- Use Base UI as the default runtime-depth parity source, especially for UI `meta.parity`.
- Adapt event reasons/details where callbacks need structured context, while preserving the repo rule that user handlers run first and internal behavior skips on `event.defaultPrevented`.
- Build Core kernel modules around the recurring Base UI internals: render/polymorphism, data attributes, composite/list, field registration, floating, transition/presence, and overlay dismissal.

## Radix Primitives

Reference paths:

- `inspo/primitives/packages/react/dialog/src`
- `inspo/primitives/packages/react/dismissable-layer/src`
- `inspo/primitives/packages/react/focus-scope/src`
- `inspo/primitives/packages/react/collection/src`
- `inspo/primitives/packages/react/roving-focus/src`
- `inspo/primitives/packages/react/popper/src`
- `inspo/primitives/packages/react/select/src`
- `inspo/primitives/packages/react/toast/src`

### What I Like

- Durable precedent for compound component anatomy: Root, Trigger, Portal, Overlay, Content, Item, Indicator, and related parts.
- Data-state conventions and behavior-focused part APIs remain highly useful.
- Dismissable layer, focus scope, collection, roving focus, presence, and portal packages are still good conceptual references.
- Good example of a primitive library that became a wrapper ecosystem foundation.

### What I Dislike

- React-only patterns such as `asChild`, Slot, clone/merge behavior, and ref composition should not become Keystone defaults.
- Some APIs are now older than Base UI's current runtime choices.
- Directly imitating Radix could make Keystone feel like a React translation rather than a Solid primitive library.

### API Ideas For Keystone

- Keep the successful anatomy vocabulary where it improves familiarity, but implement `as` in a Solid-native way.
- Use `data-state` precedent only where it complements Keystone's required `data-scope` and `data-part` contracts.
- Treat Radix as a secondary reference when Base UI and Kobalte disagree.

## React Aria / React Spectrum

Reference paths:

- `inspo/react-spectrum/packages/@react-aria`
- `inspo/react-spectrum/packages/@react-stately`
- `inspo/react-spectrum/packages/@internationalized`
- `inspo/react-spectrum/packages/@react-aria/overlays`
- `inspo/react-spectrum/packages/@react-aria/focus`
- `inspo/react-spectrum/packages/@react-aria/selection`
- `inspo/react-spectrum/packages/@react-aria/listbox`
- `inspo/react-spectrum/packages/@react-aria/select`
- `inspo/react-spectrum/packages/@react-aria/combobox`
- `inspo/react-spectrum/packages/@react-aria/datepicker`

### What I Like

- Deepest accessibility, internationalization, collection, and interaction reference in the cloned set.
- The split between Aria behavior, Stately state, Types, and Internationalized utilities is useful for reasoning about Core internals.
- Strong source for keyboard interaction details in listbox, select, combobox, menu, table/grid, calendar, date picker, and overlays.
- Date, number, string, locale, and selection packages are valuable when Keystone moves beyond basic primitives.

### What I Dislike

- React hook and Stately APIs do not map cleanly to Solid component ergonomics.
- The ecosystem scale is larger than Keystone's near-term milestone.
- Spectrum styling and product-specific assumptions are not UI defaults.

### API Ideas For Keystone

- Use React Aria as the final accessibility cross-check before declaring components stable.
- For Select/Combobox/Date Picker, compare keyboard interaction and ARIA attributes against React Aria after implementing the Solid shape from Kobalte/Base UI.
- Keep i18n/date/selection as explicit future kernel concerns rather than ad hoc component-local logic.

## Ariakit

Reference paths:

- `inspo/ariakit/packages/ariakit-core/src`
- `inspo/ariakit/packages/ariakit-react-core/src/composite`
- `inspo/ariakit/packages/ariakit-react-core/src/dialog`
- `inspo/ariakit/packages/ariakit-react-core/src/menu`
- `inspo/ariakit/packages/ariakit-react-core/src/select`
- `inspo/ariakit/packages/ariakit-react-core/src/combobox`
- `inspo/ariakit/packages/ariakit-solid-core/src`

### What I Like

- Store and composite abstractions are useful for roving focus, collection-like behavior, menus, select, combobox, and toolbars.
- Core package separates behavior from React enough to support conceptual reuse.
- Solid package, though smaller, is worth checking for how Ariakit approaches cross-framework Solid support.
- Good accessibility-heavy comparison point for command/composite style widgets.

### What I Dislike

- Store-first public API may not be the right default for Keystone's ergonomic compound components.
- React package is much deeper than Solid package, so parity conclusions need care.
- Could pull Keystone toward app-level patterns that UI should own.

### API Ideas For Keystone

- Study Ariakit composite patterns before implementing menu, toolbar, navigation menu, and combobox internals.
- Keep optional low-level stores/creators available only where they help advanced users without complicating the normal compound API.
- Use it as a check against overfitting Select/Menu to only Radix-style anatomy.

## shadcn Registry Template

Reference paths:

- `inspo/registry-template/registry.json`
- `inspo/registry-template/public/r/registry.json`
- `inspo/registry-template/public/r/*.json`
- `inspo/registry-template/components.json`

### What I Like

- Minimal registry authoring and built output model.
- Shows static JSON distribution with file contents, dependencies, registry dependencies, and targets.
- Good third-party registry template precedent for UI once UI has a registry authoring story.

### What I Dislike

- Next.js and React defaults do not fit UI.
- Tailwind and v0 assumptions should be optional, not core UI contracts.

### API Ideas For UI

- Provide a Solid-first registry template later with `registry/default`, built JSON, preview app, and validation.
- Keep compatibility with shadcn-style item concepts, but normalize into UI types and Solid targets.
- Preserve explicit file targets and dependency metadata in Mason install transactions.

## shadcn/ui

Reference paths:

- `inspo/ui/packages/shadcn/src`
- `inspo/ui/apps/v4/registry`
- `inspo/ui/apps/v4/lib`
- `inspo/ui/apps/v4/components`
- `inspo/ui/templates`

### What I Like

- Best reference for source-first component distribution, CLI workflows, registry metadata, docs previews, examples, and templates.
- Shows how a registry can be both product surface and install backend.
- Template matrix is useful precedent for UI supporting Vite Solid, SolidStart, TanStack Router, and monorepos.

### What I Dislike

- React, Next, Radix, and Tailwind assumptions must not leak into UI as hard requirements.
- Registry scale can encourage broad catalogs before Core behavior is stable.

### API Ideas For UI

- Keep UI generated components readable and owned by the user project.
- Mason registry items should include `meta.parity`, compatibility metadata, file tree, dependencies, registry dependencies, docs, and preview info.
- CLI planning should stay deterministic: resolve transitive registry dependencies, detect target paths, report conflicts, and verify output.

## Floating UI

Reference paths:

- `inspo/floating-ui/packages/core/src`
- `inspo/floating-ui/packages/dom/src`
- `inspo/floating-ui/packages/react/src`
- `inspo/floating-ui/packages/react-dom/src`
- `inspo/floating-ui/packages/utils/src`

### What I Like

- Best positioning reference for popover, tooltip, menu, combobox, select, hover card, context menu, and floating arrows.
- Middleware model gives a clean vocabulary: offset, flip, shift, size, arrow, hide, auto update, side, align, collision boundaries.
- DOM package can support Keystone without bringing React into Keystone.

### What I Dislike

- React interaction helpers are useful conceptually but should not become Keystone dependencies.
- Positioning complexity can spill into public APIs if not wrapped behind a Keystone adapter.

### API Ideas For Keystone

- Build an internal Solid adapter around `@floating-ui/dom`.
- Expose documented CSS variables for anchor width/height, available width/height, transform origin, side, align, and arrow offsets.
- Keep browser-global access SSR-guarded and test hydration behavior.

## TanStack Table

Reference paths:

- `inspo/table/packages/table-core/src`
- `inspo/table/packages/solid-table/src`
- `inspo/table/packages/table-core/src/features`
- `inspo/table/packages/table-core/tests`

### What I Like

- Strong headless core plus framework adapter architecture.
- Feature modules make sorting, filtering, row models, column visibility, pagination, grouping, pinning, and selection inspectable.
- Solid adapter is directly relevant for UI data table components.

### What I Dislike

- This is UI app-layer inspiration, not Core primitive scope.
- Data-grid behavior can become a product of its own if UI tries to wrap too much too early.

### API Ideas For UI

- UI table components should compose `@tanstack/solid-table`, not custom table state.
- Registry examples should expose the table instance and column definitions plainly so user projects own the code.
- Treat table blocks as app components with parity notes pointing to TanStack Table.

## TanStack Virtual

Reference paths:

- `inspo/virtual/packages/virtual-core/src`
- `inspo/virtual/packages/solid-virtual/src`
- `inspo/virtual/packages/virtual-core/tests`

### What I Like

- Small core and Solid adapter are a good model for virtualization without framework lock-in.
- Useful for UI tables, command palettes, large lists, and eventual dense blocks.

### What I Dislike

- Virtualization should not be built into Core primitives by default.
- Virtual collections complicate accessibility and keyboard behavior if introduced before normal collections are stable.

### API Ideas For UI

- Use `@tanstack/solid-virtual` for UI virtualized table/list examples.
- Keep Core Select/Combobox collection APIs compatible with future virtualization, but do not implement virtualization in the first primitive kernel.

## TanStack Router

Reference paths:

- `inspo/router/packages/router-core/src`
- `inspo/router/packages/solid-router/src`
- `inspo/router/packages/solid-start/src`
- `inspo/router/packages/router-generator/src`
- `inspo/router/packages/router-plugin/src`
- `inspo/router/packages/solid-router/tests`

### What I Like

- Directly relevant for UI templates, page registry items, docs app routing, and generated app examples.
- File route generator and plugin packages are good references for route-aware Mason install targets.
- Solid package keeps UI aligned with a serious app-routing ecosystem.

### What I Dislike

- Router behavior belongs in UI templates/app components, not Keystone.
- Supporting every router target too early would slow down the registry CLI.

### API Ideas For UI

- Detect TanStack Router and SolidStart separately in `mason init` and `mason add`.
- Make page/template registry items framework-aware instead of assuming one route directory.
- Prefer TanStack Router for first-party UI app templates where useful.

## Lightweight Charts

Reference paths:

- `inspo/lightweight-charts/src/api`
- `inspo/lightweight-charts/src/model`
- `inspo/lightweight-charts/src/model/series`
- `inspo/lightweight-charts/src/views`
- `inspo/lightweight-charts/src/plugins`

### What I Like

- Useful for data-dense visual components: series abstraction, time scale, price scale, crosshair, pane layout, renderers, and plugin boundaries.
- Strong example of a focused public API over complex rendering internals.
- Good inspiration for future UI chart blocks where users need inspectable source and real app behavior.

### What I Dislike

- Chart rendering is not Core primitive scope.
- UI should not clone a charting library or ship large custom chart internals before basic app components are proven.

### API Ideas For UI

- For finance/trading-style blocks, wrap established chart libraries rather than building chart engines.
- Keep chart registry items honest about dependencies and ownership boundaries.
- Use chart APIs as inspiration for clean, narrow imperative handles when visual components need them.

## Cross-Repo Notes

### Core Kernel Modules To Prioritize

- Controllable state and event composition.
- ID registration and SSR-safe DOM access.
- State/data attribute helpers.
- Polymorphic `as` rendering and advanced callback composition.
- Presence and transition lifecycle.
- Focus scope, dismissable layer, layer stack, outside hiding, prevent scroll, and portal.
- Floating adapter around Floating UI DOM.
- Form-control ARIA relationships, hidden input helpers, form reset/submission hooks.
- Collection registration, list navigation, typeahead, and single selection.

### UI That Probably Need Explicit State Modeling

- Select.
- Combobox.
- Menu and Menubar.
- Dialog, Popover, Hover Card, Tooltip, and Context Menu.
- Toast.
- Slider.
- Date Picker and Calendar.
- Navigation Menu.

### UI Parity Defaults

- Core-backed primitive components: Base UI for runtime depth, Kobalte for Solid-native API shape.
- Registry and CLI: shadcn/ui and shadcn registry-template.
- Data table: TanStack Table.
- Virtualized lists/tables: TanStack Virtual.
- App routing/templates: TanStack Router and SolidStart.
- Charts: established chart libraries such as Lightweight Charts where the domain calls for it.

### Avoid

- React-shaped translations of `forwardRef`, `asChild`, Slot, cloneElement, React hooks, or synthetic event assumptions.
- TanStack dependencies inside Keystone.
- Broad UI item catalogs before Core overlay, field/form, collection, and select internals are stable.
- Copying source from inspiration repos.
- Treating registry metadata as optional for first-party UI items; `meta.parity` should be required.
