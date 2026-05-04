# Keystone UI Status, Parity, And End-State Report

## Status

Generated 2026-05-04 from repo-local documentation, registry metadata, package manifests, and local verification.

This report reconciles:

- Product source of truth: `CONTEXT.md`, `CONTEXT-MAP.md`, `README.md`, `AGENTS.md`.
- PRDs: `docs/prd/keystone-foundation.md`, `docs/prd/core-internals-inspiration-parity.md`.
- ADRs, RFCs, roadmap, accessibility plan, research docs, agent verticals, and readiness audit.
- First-party UI item parity metadata in `registry/default/items/*.json`.
- Current package manifests and local release verification.

## Executive Summary

The repository is no longer just a scaffold. It is a private `0.1.0` preview workspace with a clear two-layer product model, a broad set of Core primitive surfaces, a working Mason registry/CLI tracer, docs metadata, and a passing release verification script.

The strategic posture is still preview, not public stable. Package names are private `0.0.0`, product names are provisional, and the public launch surface still needs naming/license/release polish. The important technical shift is that Keystone's internal kernel is now much deeper than the older planning docs imply: the internals parity PRD marks the core state, event, ID, polymorphic, overlay, collection, selection, floating, portal, presence, and form-control modules as `proven`.

That does not mean the full primitive catalog is stable. The maturity model keeps most user-facing primitives at `beta` or `experimental` because stable release requires docs specs, broader browser/manual accessibility evidence, SSR/hydration evidence where relevant, and known-gap documentation.

UI is comparatively strong on registry metadata, validation, dependency resolution, path safety, install planning, generated-app verification, and parity-note discipline. Its main remaining gap is lifecycle breadth and public distribution polish: default hosted registry, update/diff/remove/doctor maturity beyond tests, registry build/publish flow, docs previews, and richer generated app verification.

## Verification Snapshot

`bun run verify:release` passed locally on 2026-05-04.

Verification included:

- `bun run check`: oxlint and oxfmt passed.
- `bun run check-types`: Turbo check-types passed for Keystone, Mason CLI, and Mason Registry.
- `bun run test:core`: 39 files, 218 tests passed.
- `bun run test:docs`: 3 tests passed, including docs metadata coverage for every Core primitive metadata scope and every default Mason registry item.
- `bun run test:mason-cli`: 20 tests passed, including init/add planning, default registry install planning, generated Solid app typecheck/build, lifecycle commands, and path safety.
- `bun run test:mason-registry`: 30 tests passed, including real default item validation, parity metadata contract, dependency graph resolution, path safety, duplicate target checks, dependency specifier validation, and item type support.
- `bun run verify:example-app`: passed.
- `bun run build`: docs app built for client and SSR.

The working tree was clean before this report was added.

## Current Implementation Snapshot

This is the current source state, not only the documented target state.

Core currently exposes 31 package export entries: the root export plus 30 subpaths. The exported subpaths are:

- `accessible-icon`, `accordion`, `autocomplete`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `date-picker`, `dialog`, `direction`.
- `dropdown-menu`, `form`, `hover-card`, `live-announcer`, `locale`, `menu`, `menubar`, `navigation-menu`, `popover`, `popper`.
- `portal`, `radio-group`, `select`, `sheet`, `slider`, `switch`, `tabs`, `toast`, `toolbar`, `tooltip`, `visually-hidden`.

Core test coverage is broad for a private preview. The package has behavior and kernel tests for accessible icon, collections, form-control, field validity, direction, locale, live announcer, metadata, dismissable layer, floating, focus scope, layer stack, presence, prevent scroll, popover, popper, portal, select controller, selection controls, slider, tooltip, shared kernel utilities, visually hidden, accessibility harness, SSR accessibility, combobox, date picker, dialog, disclosure, menu, navigation menu, overlay verticals, select, tabs, toast, and toolbar. The latest verified Keystone run passed 39 test files and 218 tests.

UI currently has 37 first-party registry item metadata files. The default registry source includes 33 `registry/default/ui/*.tsx` component files plus supporting lib and block files. The registry item set is not just theoretical: CLI tests install and build generated source for base components, Core-backed dialog, DataTable, DataTable Router adapter, and the account settings block.

The report itself is currently the only untracked git change:

```txt
?? docs/reports/status-parity-end-state-report.md
```

## Current Product Shape

Core is the headless, accessible, unstyled primitive layer for Solid. It owns intrinsic behavior: state, focus, keyboard interaction, dismissal, layering, positioning, form semantics, accessibility relationships, SSR safety, and styling contracts.

UI is the copy-paste source registry and CLI layer. It owns styled wrappers, registry metadata, generated source, blocks, templates, CLI workflows, app-layer integrations, and data-dense workspace patterns.

The forbidden dependency direction remains:

```txt
Core -> UI
```

The intended dependency direction remains:

```txt
Core internals
  -> Core primitives
    -> UI items
      -> UI app components
        -> UI blocks
          -> UI templates
```

TanStack libraries belong in UI when they are app engines: Form, Table, Store, Hotkeys, Router, and similar systems. Core must remain independent from those app libraries.

## Package And App Status

Root workspace:

- Package manager: Bun `1.3.9`.
- Runner: Turborepo.
- Main quality gate: `bun run verify:release`.
- Packages remain private.

`packages/core`:

- Package: `@keystone-ui/core`, private `0.0.0`.
- Runtime deps: `solid-js`, `@floating-ui/dom`.
- Public subpath exports include primitives and small utilities such as `dialog`, `select`, `combobox`, `menu`, `popover`, `tooltip`, `sheet`, `tabs`, `toolbar`, `slider`, `date-picker`, `toast`, `form`, `direction`, `locale`, `portal`, `popper`, `live-announcer`, `visually-hidden`, and `accessible-icon`.
- Private internals such as broad `utils` and overlay kernel exports remain intentionally unexported for `0.1.0`.

`packages/mason-registry`:

- Package: `@keystone-ui/mason-registry`, private `0.0.0`.
- Owns schema validation, dependency resolution, file validation, path safety, package dependency validation, registry validation, and tests.

`packages/mason-cli`:

- Package: `@keystone-ui/mason-cli`, private `0.0.0`.
- Owns project detection, init/add, install planning, path resolution, write application, dependency planning, and lifecycle command tests.

`apps/docs`:

- Current docs/product surface.
- Solid + Vite + TanStack Router/Start + Tailwind.
- Tests validate Core primitive metadata and Mason registry contracts.

## Core Kernel Parity

The strongest current evidence is the parity ledger in `docs/prd/core-internals-inspiration-parity.md`. It marks the following internal modules as `proven`:

- Controllable state.
- Event composition and preventable internals.
- Solid polymorphic rendering.
- Stable IDs and SSR guards.
- State/data attribute helpers.
- Portal.
- Overlay controller.
- Dismissable layer and layer stack.
- Focus scope, trap, and restore.
- Outside hiding/inert behavior.
- Prevent scroll.
- Presence and force mount.
- Floating adapter and geometry variables.
- Collection registration and lookup.
- Active descendant, roving focus, and list navigation.
- Typeahead.
- Selection manager.
- Listbox interaction facade.
- Form-control ARIA and hidden input.
- Field validity.

The practical meaning: Core now has a credible private primitive kernel. Dialog and Select are the main proof surfaces, with additional proof through Combobox, Menu, overlay derivatives, form-control tests, and focused kernel tests.

The caution: private-kernel `proven` means reusable internals are tested and consumed; it does not automatically promote those internals to public APIs or make every primitive stable.

## Core Primitive Status

Conservative maturity labels from the maturity model:

- Stable: Direction, VisuallyHidden.
- Beta: AccessibleIcon, Locale, LiveAnnouncer, Portal, Popper, FormControl/Field, Dialog, Select, Accordion/Collapsible, Tabs, Checkbox, Switch, RadioGroup.
- Experimental: Combobox, Menu family, Popover, Tooltip, HoverCard, Sheet, Slider, DatePicker/Calendar, Toast, Toolbar.
- Internal: Listbox and overlay internals.

Docs and vertical notes show stronger implementation depth than some labels imply, especially for overlays, collections, form-control, menus, selection controls, slider, and date picker. The labels should remain conservative until stable-release evidence is complete.

Notable shipped or proven surfaces:

- Dialog is the primary modal baseline: controlled/uncontrolled state, focus entry/restore/trap, preventable dismissal, nested top-layer ordering, force-mount/presence, modal hiding/inert, scroll lock, and stable part metadata.
- Select is the primary collection/form baseline: keyboard navigation, typeahead, grouping, hidden input submission/reset, multi-value serialization, readonly blocking, external form owners, dynamic items, and floating geometry.
- Overlay derivatives use shared overlay/floating behavior: Popover, HoverCard, Tooltip, Sheet.
- Menu family uses collection/navigation/overlay kernels: Menu, DropdownMenu, ContextMenu, Menubar, NavigationMenu.
- Form/Field owns ARIA relationships, hidden inputs, native reset listeners, validity state, dirty/touched/filled/focused state, async latest-result behavior, and public compound anatomy.
- Selection controls cover hidden-input form semantics and state metadata for Checkbox, Switch, and RadioGroup.
- Slider covers multi-thumb range state, RTL-aware keyboard/pointer math, hidden inputs, form reset, and UI styling variables.
- DatePicker/Calendar covers calendar grid behavior, range selection, unavailable dates, locale week starts, keyboard movement, trigger metadata, and UI wrappers, but remains experimental because date-field depth is not yet there.

## Mason Registry Status

The default registry currently has 37 first-party items with parity metadata:

- Base/styled components and utilities: `button`, `badge`, `card`, `cn`, `field`, `input`, `label`, `separator`, `textarea`.
- Core-backed UI: `accordion`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `date-picker`, `dialog`, `dropdown-menu`, `hover-card`, `menu`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `sheet`, `slider`, `switch`, `tabs`, `toast`, `toolbar`, `tooltip`, `autocomplete`.
- TanStack-backed app components: `data-table`, `data-table-tanstack-router`, `select-field`, `text-field`, `command-menu`.
- Block: `account-settings`.

Every first-party item validates with non-empty parity metadata. The common parity references are:

- `baseUi` for runtime-depth comparison.
- `kobalte` for Solid-native primitive shape.
- `tanstackForm`, `tanstackTable`, `tanstackRouter`, `tanstackStore`, and `tanstackHotkeys` for app-layer UI items.
- `sonner` for toast ergonomics.
- `shadcn` and `components` for source-registry and utility/block conventions.

The registry has moved beyond the original `button` tracer. It now validates broad item metadata, dependency graphs, multi-file items, duplicate target rejection, unsafe path rejection, dependency specifier validation, and docs contract extraction.

## Mason CLI Status

The CLI test suite proves:

- Solid Vite TypeScript project detection.
- Deterministic `mason init`.
- `mason add` dry-run and write planning.
- Target state and hash recording before writes.
- Conflict detection for existing user-owned files.
- Default registry install planning for base components, Core-backed dialog, TanStack data-table, TanStack Router adapter, and blocks.
- Generated Solid app typecheck/build after add.
- Lifecycle command behavior for diff, update, remove, and doctor.
- Path safety rejection before writes.

The CLI is credible as a local/private preview. Public-preview gaps remain around hosted default registry behavior, broader SolidStart/TanStack Router/style detection, richer diff/update UX, registry namespace/URL support, registry build/publish workflow, and public docs.

## Parity Posture

Keystone parity policy:

- Base UI is the primary runtime-depth reference.
- Kobalte is the primary Solid-native reference.
- Radix is secondary precedent only.
- Floating UI is a direct domain reference for geometry.
- Platform/browser behavior wins over library mimicry where form submission, reset, focus, pointer, keyboard, SSR, or hydration behavior differs.

UI parity policy:

- shadcn is the primary registry/CLI/docs mental model reference.
- external UI reference is a later styling/component-inventory reference, not a runtime or schema authority.
- TanStack libraries are first-class references for app engines.
- Sonner is a first-class reference for toast ergonomics.
- Parity notes are explicit gap statements, not compatibility claims.

Overall parity status:

- Kernel internals: strong and mostly proven against Base UI/Kobalte-inspired architecture.
- Core public primitive APIs: credible but conservatively beta/experimental.
- Mason registry metadata: strong for `0.1.0`.
- UI generated source: good for local preview and verified tracer apps; needs more app matrices before public confidence.
- Accessibility parity: improving through tests and harness, but manual AT/browser matrix is the main stable-release gap.
- Data-dense parity: documented and partially started with DataTable/CommandMenu/TanStack Form items, but flagship workspace patterns remain post-0.1.

## Optimal End-State

The optimal end-state is not a giant clone catalog. It is a Solid-native ecosystem with depth first:

1. Core private kernels remain small-interface, deep-behavior modules.
2. Core exposes stable compound components and low-level creators only after enough primitives prove the API.
3. Every public primitive part exposes stable `data-scope`, `data-part`, state attributes, and CSS variables where measured geometry exists.
4. Stable primitives have written accessibility specs, automated behavior tests, SSR/hydration coverage, type coverage, and manual accessibility evidence.
5. Mason installs readable, user-owned source and delegates intrinsic behavior to Keystone.
6. Mason registry items carry parity metadata, file metadata, dependency metadata, install commands, docs notes, and verification evidence.
7. UI app components use TanStack app engines instead of custom table/form/store/hotkey systems.
8. UI grows into data-dense, keyboard-first workspace patterns: realtime tables, watchlists, metric components, command surfaces, resizable shells, chart interaction adapters, condition builders, event feeds, and operational templates.
9. Core stays domain-agnostic. Finance or analytics semantics live in UI blocks, examples, optional packs, or user code.

## Main Gaps

Public preview readiness:

- Final naming, npm scope, license file, domain/trademark positioning, and release notes remain unresolved.
- Packages are private `0.0.0`.
- Public docs still need more primitive pages, install guidance, preview examples, known gaps, and API references.

Stable primitive readiness:

- Manual accessibility evidence is not yet complete for stable claims.
- Written primitive accessibility specs need to catch up to implementation depth.
- SSR/hydration app-level verification, especially for portals and SolidStart, needs broader coverage.
- Maturity labels and known-gap docs need to be surfaced consistently in docs pages.

Core API discipline:

- Private kernels should remain private until an ADR/RFC promotes selected helpers.
- Creator APIs should stabilize only after compound APIs have enough real use.
- Public Listbox should remain deferred until Select/Combobox APIs settle.
- Advanced surfaces such as AlertDialog, DateField, DateRangePicker, NumberField, rich color/date controls, and virtualized collection adapters need deliberate scope gates.

Mason lifecycle:

- Hosted/default registry and registry build/publish flow remain future work.
- `diff`, `update`, `remove`, and `doctor` have tests but need product UX and docs maturity.
- Multi-file app components need broader generated-app verification across Vite Solid, SolidStart, TanStack Router, Tailwind/plain CSS, and monorepos.
- Blocks/templates are early; `account-settings` is only the first block proof.

Data-dense workspace:

- DataTable and CommandMenu are the first app-layer proofs, not the flagship end-state.
- Realtime tables, watchlists, workspace shells, chart inspection, condition builders, and event feeds are documented post-0.1 work.
- Numeric/financial formatting and chart dependency boundaries require maintainer decisions before implementation.

## Recommended Sequencing

For `0.1 Preview`:

1. Keep primitive breadth frozen unless the work hardens overlay, collection, form, state, or metadata kernels.
2. Finish docs-visible maturity labels, known gaps, and accessibility strategy.
3. Keep Core `utils`, overlay internals, Listbox internals, and other kernels private.
4. Promote only the strongest primitive surfaces in docs: Dialog, Select, Field/FormControl, Tabs, selection controls, Popper/Portal utilities, and selected overlay derivatives.
5. Make Mason registry lifecycle and docs pages clear enough for local preview use.
6. Preserve `bun run verify:release` as the release gate.

For `0.2 UI App Layer`:

1. Deepen DataTable on TanStack Table.
2. Deepen CommandMenu on Core Combobox plus TanStack Store/Hotkeys.
3. Build TanStack Form adapters for UI fields.
4. Add generated-app verification across more app shapes.
5. Improve registry namespace/URL/default-host behavior and lifecycle command UX.

For `0.3 Data-Dense Workspace`:

1. Build workspace-grade UI blocks only after registry/CLI confidence is higher.
2. Start with realtime table, command surface, resizable shell, watchlist, metric components, event feed, and condition builder.
3. Keep domain-specific examples out of Keystone.
4. Use app-engine references deliberately: TanStack Table/Form/Store/Hotkeys/Router, plus chosen charting and formatting boundaries.

## Next 10 PRs

This report should now drive execution, not more strategy generation. The next pull requests should stay narrow and avoid new primitive breadth:

1. Add primitive maturity labels to docs metadata and the docs app.
2. Add a Keystone Core/UI boundary docs page.
3. Add a `data-scope` / `data-part` styling contract docs page.
4. Add the Dialog accessibility/API spec.
5. Add the Select accessibility/API spec.
6. Add the Field/FormControl accessibility/API spec.
7. Add an overlay kernel boundary docs note to the user-facing docs surface.
8. Add a collection/typeahead/Listbox kernel boundary docs note to the user-facing docs surface.
9. Add Mason registry lifecycle docs for init/add/diff/update/remove/doctor and default registry behavior.
10. Add the 0.1 preview release checklist and release notes draft.

## Bottom Line

The repo is in a strong private-preview state by current source evidence, not just by roadmap intent. Core already exports a meaningful primitive surface and has substantial behavior/kernel test coverage. UI already validates and installs a real first-party registry with parity metadata and generated-app verification. The correct next move is not broad catalog expansion. It is public-preview discipline: maturity labels, accessibility evidence, docs, release naming/licensing, Mason lifecycle polish, and selective deepening of the strongest primitive and app-layer proof surfaces.
